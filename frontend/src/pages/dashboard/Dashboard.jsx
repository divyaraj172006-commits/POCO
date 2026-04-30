import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlinePencil, HiOutlineClipboardCheck } from "react-icons/hi";
import StatCard from "../../components/common/StatCard";
import { SkeletonPage } from "../../components/common/Skeleton";
import { analyticsAPI } from "../../api/client";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b"];

const mockActivities = [
  { id: 1, type: "published", message: "Post published to LinkedIn", time: "2 min ago", icon: "🚀" },
  { id: 2, type: "approved", message: "Post approved by Admin", time: "1 hour ago", icon: "✅" },
  { id: 3, type: "failed", message: "Failed to publish to Instagram", time: "3 hours ago", icon: "❌" },
  { id: 4, type: "draft", message: "New draft saved", time: "5 hours ago", icon: "📝" },
  { id: 5, type: "scheduled", message: "Post scheduled for tomorrow", time: "6 hours ago", icon: "📅" },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [engagement, setEngagement] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, e, g, p] = await Promise.all([
          analyticsAPI.overview(),
          analyticsAPI.engagement(),
          analyticsAPI.monthlyGrowth(),
          analyticsAPI.platformPerformance(),
        ]);
        setStats(s.data);
        setEngagement(e.data);
        setGrowth(g.data);
        setPlatforms(p.data);
      } catch {
        // Use mock data if API unavailable
        setStats({ total_posts: 156, scheduled_posts: 23, published_posts: 120, failed_posts: 3, draft_posts: 10, pending_approval: 5 });
        setEngagement([
          { day: "Mon", likes: 320, shares: 45, comments: 89 },
          { day: "Tue", likes: 450, shares: 67, comments: 120 },
          { day: "Wed", likes: 280, shares: 34, comments: 76 },
          { day: "Thu", likes: 520, shares: 89, comments: 145 },
          { day: "Fri", likes: 390, shares: 56, comments: 98 },
          { day: "Sat", likes: 210, shares: 23, comments: 56 },
          { day: "Sun", likes: 180, shares: 18, comments: 42 },
        ]);
        setGrowth([
          { month: "Jan", followers: 2400, reach: 12000 },
          { month: "Feb", followers: 3100, reach: 15000 },
          { month: "Mar", followers: 4200, reach: 21000 },
          { month: "Apr", followers: 5800, reach: 28000 },
          { month: "May", followers: 6500, reach: 32000 },
          { month: "Jun", followers: 7900, reach: 39000 },
        ]);
        setPlatforms([
          { platform: "LinkedIn", posts: 45, engagement: 2340 },
          { platform: "Facebook", posts: 38, engagement: 1890 },
          { platform: "Instagram", posts: 52, engagement: 3400 },
          { platform: "X", posts: 21, engagement: 980 },
        ]);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <SkeletonPage />;

  const statCards = [
    { icon: HiOutlineDocumentText, label: "Total Posts", value: stats?.total_posts || 0, trend: 12, color: "indigo" },
    { icon: HiOutlineClock, label: "Scheduled", value: stats?.scheduled_posts || 0, trend: 8, color: "blue" },
    { icon: HiOutlineCheckCircle, label: "Published", value: stats?.published_posts || 0, trend: 15, color: "emerald" },
    { icon: HiOutlineExclamationCircle, label: "Failed", value: stats?.failed_posts || 0, trend: -5, color: "rose" },
    { icon: HiOutlinePencil, label: "Drafts", value: stats?.draft_posts || 0, trend: 3, color: "amber" },
    { icon: HiOutlineClipboardCheck, label: "Pending Approval", value: stats?.pending_approval || 0, trend: 2, color: "violet" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card p-3 shadow-xl !bg-dark-800/95">
          <p className="text-sm font-semibold text-white mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-xs" style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-dark-400 mt-1">Welcome back! Here&apos;s your social media overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} delay={i * 0.1} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Engagement */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Engagement</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={engagement}>
              <defs>
                <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="likes" stroke="#6366f1" fillOpacity={1} fill="url(#colorLikes)" strokeWidth={2} />
              <Area type="monotone" dataKey="comments" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorComments)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Growth */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Growth</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="followers" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="reach" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Performance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={platforms} dataKey="engagement" nameKey="platform" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} strokeWidth={0}>
                {platforms.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activity.message}</p>
                  <p className="text-xs text-dark-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
