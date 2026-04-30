import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { approvalsAPI } from "../../api/client";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonRow } from "../../components/common/Skeleton";
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClipboardCheck } from "react-icons/hi";

export default function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectComment, setRejectComment] = useState("");
  const [rejectId, setRejectId] = useState(null);

  const load = async () => {
    try { const { data } = await approvalsAPI.list(); setApprovals(data); } catch { setApprovals([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try { await approvalsAPI.approve(id); toast.success("Post approved!"); load(); } catch { toast.error("Failed to approve"); }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    try { await approvalsAPI.reject(rejectId, { comment: rejectComment }); toast.success("Post rejected"); setRejectId(null); setRejectComment(""); load(); } catch { toast.error("Failed to reject"); }
  };

  if (loading) return <div className="space-y-4"><div className="skeleton h-8 w-32"></div>{[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Approvals</h1>
        <p className="text-dark-400 mt-1">Review and manage post approvals</p>
      </div>

      {approvals.length === 0 ? (
        <EmptyState icon={HiOutlineClipboardCheck} title="No pending approvals" description="Posts sent for approval will appear here." />
      ) : (
        <div className="space-y-3">
          {approvals.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-400">Post ID: {String(a.post_id).slice(0, 8)}...</p>
                  <div className="flex items-center gap-3 mt-2">
                    <StatusBadge status={a.status} />
                    <span className="text-xs text-dark-500">{new Date(a.created_at).toLocaleDateString()}</span>
                  </div>
                  {a.comment && <p className="text-sm text-dark-300 mt-2 italic">"{a.comment}"</p>}
                </div>
                {a.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleApprove(a.id)} className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all">
                      <HiOutlineCheckCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => setRejectId(a.id)} className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all">
                      <HiOutlineXCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Reject Post</h3>
            <textarea value={rejectComment} onChange={(e) => setRejectComment(e.target.value)} className="input-field min-h-[100px]" placeholder="Reason for rejection..." />
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setRejectId(null); setRejectComment(""); }} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleReject} className="bg-rose-500 text-white font-semibold px-6 py-2.5 rounded-xl flex-1 hover:bg-rose-600 transition-colors">Reject</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
