import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { draftsAPI } from "../../api/client";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonRow } from "../../components/common/Skeleton";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineDuplicate, HiOutlineSwitchHorizontal, HiOutlineDocumentText } from "react-icons/hi";

export default function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await draftsAPI.list();
      setDrafts(data);
    } catch {
      setDrafts([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      await draftsAPI.delete(id);
      toast.success("Draft deleted");
      load();
    } catch { toast.error("Failed to delete"); }
  };

  const handleDuplicate = async (id) => {
    try {
      await draftsAPI.duplicate(id);
      toast.success("Draft duplicated");
      load();
    } catch { toast.error("Failed to duplicate"); }
  };

  const handleConvert = async (id) => {
    try {
      await draftsAPI.convert(id);
      toast.success("Converted to post!");
      load();
    } catch { toast.error("Failed to convert"); }
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="skeleton h-8 w-32"></div>
      {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Drafts</h1>
          <p className="text-dark-400 mt-1">{drafts.length} saved drafts</p>
        </div>
      </div>

      {drafts.length === 0 ? (
        <EmptyState icon={HiOutlineDocumentText} title="No drafts yet" description="Save a draft from the Create Post page to see it here." />
      ) : (
        <div className="space-y-3">
          {drafts.map((draft, i) => (
            <motion.div key={draft.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card-hover p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white truncate">{draft.title || "Untitled Draft"}</h3>
                  <p className="text-sm text-dark-400 mt-1 line-clamp-2">{draft.caption || "No content"}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <StatusBadge status="draft" />
                    <span className="text-xs text-dark-500">{new Date(draft.updated_at).toLocaleDateString()}</span>
                    {draft.platforms?.length > 0 && (
                      <span className="text-xs text-dark-400">{draft.platforms.join(", ")}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/10 transition-all"><HiOutlinePencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDuplicate(draft.id)} className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/10 transition-all"><HiOutlineDuplicate className="w-4 h-4" /></button>
                  <button onClick={() => handleConvert(draft.id)} className="p-2 rounded-lg text-dark-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"><HiOutlineSwitchHorizontal className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(draft.id)} className="p-2 rounded-lg text-dark-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"><HiOutlineTrash className="w-4 h-4" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
