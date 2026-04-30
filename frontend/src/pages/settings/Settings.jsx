import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { settingsAPI } from "../../api/client";
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineBell, HiOutlineColorSwatch, HiOutlineMoon, HiOutlineSun } from "react-icons/hi";

const tabs = [
  { id: "profile", label: "Profile", icon: HiOutlineUser },
  { id: "password", label: "Password", icon: HiOutlineLockClosed },
  { id: "notifications", label: "Notifications", icon: HiOutlineBell },
  { id: "brand", label: "Brand Kit", icon: HiOutlineColorSwatch },
];

export default function Settings() {
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({ full_name: user?.full_name || "", avatar_url: user?.avatar_url || "" });
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const [brandForm, setBrandForm] = useState({ primary_color: "#6366f1", secondary_color: "#8b5cf6", font_family: "Inter" });
  const [notifPrefs, setNotifPrefs] = useState({ post_published: true, approval_pending: true, token_expired: true, failed_post: true });

  useEffect(() => {
    settingsAPI.getBrand().then(({ data }) => setBrandForm(data)).catch(() => {});
  }, []);

  const saveProfile = async () => {
    try { const { data } = await settingsAPI.updateProfile(profileForm); setUser(data); toast.success("Profile updated"); } catch { toast.error("Failed to update"); }
  };

  const changePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm) { toast.error("Passwords don't match"); return; }
    try { await settingsAPI.changePassword({ current_password: passwordForm.current_password, new_password: passwordForm.new_password }); toast.success("Password changed"); setPasswordForm({ current_password: "", new_password: "", confirm: "" }); } catch (e) { toast.error(e.response?.data?.detail || "Failed"); }
  };

  const saveBrand = async () => {
    try { await settingsAPI.updateBrand(brandForm); toast.success("Brand settings saved"); } catch { toast.error("Failed to save"); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-white">Settings</h1><p className="text-dark-400 mt-1">Manage your account and preferences</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="glass-card p-3 h-fit space-y-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? "bg-primary-500/20 text-primary-400 border border-primary-500/30" : "text-dark-400 hover:text-white hover:bg-white/5"}`}>
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
          <div className="border-t border-white/5 mt-2 pt-2">
            <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-dark-400 hover:text-white hover:bg-white/5 transition-all">
              {theme === "dark" ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            {activeTab === "profile" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-3xl font-bold text-white">{user?.full_name?.[0] || "U"}</div>
                  <div><p className="text-sm text-dark-400">Profile Photo</p><button className="text-sm text-primary-400 hover:text-primary-300 mt-1">Change avatar</button></div>
                </div>
                <div><label className="text-sm font-medium text-dark-300 mb-1.5 block">Full Name</label><input value={profileForm.full_name} onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} className="input-field" /></div>
                <div><label className="text-sm font-medium text-dark-300 mb-1.5 block">Email</label><input value={user?.email || ""} disabled className="input-field opacity-50" /></div>
                <div><label className="text-sm font-medium text-dark-300 mb-1.5 block">Role</label><input value={user?.role || ""} disabled className="input-field opacity-50 uppercase" /></div>
                <button onClick={saveProfile} className="btn-primary">Save Changes</button>
              </div>
            )}

            {activeTab === "password" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white">Change Password</h3>
                <div><label className="text-sm font-medium text-dark-300 mb-1.5 block">Current Password</label><input type="password" value={passwordForm.current_password} onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })} className="input-field" /></div>
                <div><label className="text-sm font-medium text-dark-300 mb-1.5 block">New Password</label><input type="password" value={passwordForm.new_password} onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })} className="input-field" /></div>
                <div><label className="text-sm font-medium text-dark-300 mb-1.5 block">Confirm New Password</label><input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="input-field" /></div>
                <button onClick={changePassword} className="btn-primary">Update Password</button>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                {Object.entries(notifPrefs).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <span className="text-sm text-dark-200 capitalize">{key.replace(/_/g, " ")}</span>
                    <button onClick={() => setNotifPrefs({ ...notifPrefs, [key]: !val })} className={`w-12 h-6 rounded-full transition-all ${val ? "bg-primary-500" : "bg-dark-600"} relative`}>
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${val ? "left-6" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
                <button onClick={() => toast.success("Preferences saved")} className="btn-primary">Save Preferences</button>
              </div>
            )}

            {activeTab === "brand" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white">Brand Kit</h3>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center text-dark-400 cursor-pointer hover:border-primary-500 transition-colors"><span className="text-xs text-center">Upload Logo</span></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-dark-300 mb-1.5 block">Primary Color</label><div className="flex gap-2"><input type="color" value={brandForm.primary_color} onChange={(e) => setBrandForm({ ...brandForm, primary_color: e.target.value })} className="w-12 h-10 rounded-lg cursor-pointer bg-transparent" /><input value={brandForm.primary_color} onChange={(e) => setBrandForm({ ...brandForm, primary_color: e.target.value })} className="input-field flex-1" /></div></div>
                  <div><label className="text-sm font-medium text-dark-300 mb-1.5 block">Secondary Color</label><div className="flex gap-2"><input type="color" value={brandForm.secondary_color} onChange={(e) => setBrandForm({ ...brandForm, secondary_color: e.target.value })} className="w-12 h-10 rounded-lg cursor-pointer bg-transparent" /><input value={brandForm.secondary_color} onChange={(e) => setBrandForm({ ...brandForm, secondary_color: e.target.value })} className="input-field flex-1" /></div></div>
                </div>
                <div><label className="text-sm font-medium text-dark-300 mb-1.5 block">Font Family</label><select value={brandForm.font_family} onChange={(e) => setBrandForm({ ...brandForm, font_family: e.target.value })} className="input-field"><option>Inter</option><option>Roboto</option><option>Poppins</option><option>Outfit</option><option>Plus Jakarta Sans</option></select></div>
                <button onClick={saveBrand} className="btn-primary">Save Brand Kit</button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
