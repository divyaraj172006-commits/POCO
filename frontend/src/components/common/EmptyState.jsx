import { HiOutlineInbox } from "react-icons/hi";
import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon = HiOutlineInbox, title = "Nothing here yet", description = "Get started by creating something new.", action, actionLabel = "Get Started" }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-dark-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-dark-400 text-sm max-w-md">{description}</p>
      {action && (
        <button onClick={action} className="btn-primary mt-6">{actionLabel}</button>
      )}
    </motion.div>
  );
}
