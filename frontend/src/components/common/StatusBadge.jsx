export default function StatusBadge({ status }) {
  const styles = {
    draft: "bg-dark-600/50 text-dark-200",
    pending_approval: "bg-amber-500/20 text-amber-300",
    pending: "bg-amber-500/20 text-amber-300",
    approved: "bg-emerald-500/20 text-emerald-300",
    scheduled: "bg-blue-500/20 text-blue-300",
    processing: "bg-cyan-500/20 text-cyan-300",
    published: "bg-emerald-500/20 text-emerald-300",
    failed: "bg-rose-500/20 text-rose-300",
    rejected: "bg-rose-500/20 text-rose-300",
    connected: "bg-emerald-500/20 text-emerald-300",
    disconnected: "bg-dark-600/50 text-dark-300",
  };

  const label = status?.replace(/_/g, " ") || "unknown";

  return (
    <span className={`status-badge ${styles[status] || styles.draft}`}>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  );
}
