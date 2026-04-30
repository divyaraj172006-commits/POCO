import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { accountsAPI } from "../../api/client";
import PlatformIcon, { platformConfig } from "../../components/common/PlatformIcon";
import { HiOutlinePlus, HiOutlineX } from "react-icons/hi";

const PLATFORMS = ["linkedin", "facebook", "instagram", "x"];

export default function ConnectedAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const { data } = await accountsAPI.list(); setAccounts(data); } catch { setAccounts([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const connect = async (platform) => {
    try { await accountsAPI.connect(platform); toast.success(`${platform} connected!`); load(); } catch { toast.error("Connection failed"); }
  };

  const disconnect = async (id) => {
    try { await accountsAPI.disconnect(id); toast.success("Disconnected"); load(); } catch { toast.error("Failed to disconnect"); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-white">Connected Accounts</h1><p className="text-dark-400 mt-1">Manage your social media connections</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLATFORMS.map((platform, i) => {
          const account = accounts.find(a => a.platform === platform && a.is_connected);
          const config = platformConfig[platform];
          return (
            <motion.div key={platform} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <PlatformIcon platform={platform} size="lg" />
                  <div>
                    <h3 className="text-base font-semibold text-white">{config?.label || platform}</h3>
                    {account ? (
                      <p className="text-sm text-emerald-400 mt-0.5">Connected • {account.profile_name}</p>
                    ) : (
                      <p className="text-sm text-dark-400 mt-0.5">Not connected</p>
                    )}
                  </div>
                </div>
                {account ? (
                  <button onClick={() => disconnect(account.id)} className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all">
                    <HiOutlineX className="w-5 h-5" />
                  </button>
                ) : (
                  <button onClick={() => connect(platform)} className="btn-primary text-sm flex items-center gap-1.5">
                    <HiOutlinePlus className="w-4 h-4" /> Connect
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
