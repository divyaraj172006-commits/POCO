import { motion } from "framer-motion";

const colorMap = {
  indigo: "from-indigo-500 to-indigo-600",
  violet: "from-violet-500 to-violet-600",
  emerald: "from-emerald-500 to-emerald-600",
  rose: "from-rose-500 to-rose-600",
  amber: "from-amber-500 to-amber-600",
  cyan: "from-cyan-500 to-cyan-600",
  blue: "from-blue-500 to-blue-600",
  pink: "from-pink-500 to-pink-600",
};

const shadowMap = {
  indigo: "shadow-indigo-500/20",
  violet: "shadow-violet-500/20",
  emerald: "shadow-emerald-500/20",
  rose: "shadow-rose-500/20",
  amber: "shadow-amber-500/20",
  cyan: "shadow-cyan-500/20",
  blue: "shadow-blue-500/20",
  pink: "shadow-pink-500/20",
};

export default function StatCard({ icon: Icon, label, value, trend, color = "indigo", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card p-5 group cursor-pointer hover:shadow-glow transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend > 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg ${shadowMap[color]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
