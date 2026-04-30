import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { HiOutlineHeart, HiOutlineShare, HiOutlineChatAlt, HiOutlineEye, HiOutlineCursorClick, HiOutlineTrendingUp } from "react-icons/hi";
import StatCard from "../../components/common/StatCard";
import { SkeletonPage } from "../../components/common/Skeleton";
import { analyticsAPI } from "../../api/client";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [engagement, setEngagement] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [e, g, p] = await Promise.all([analyticsAPI.engagement(), analyticsAPI.monthlyGrowth(), analyticsAPI.platformPerformance()]);
        setEngagement(e.data); setGrowth(g.data); setPlatforms(p.data);
      } catch {
        setEngagement([{ day: "Mon", likes: 320, shares: 45, comments: 89 }, { day: "Tue", likes: 450, shares: 67, comments: 120 }, { day: "Wed", likes: 280, shares: 34, comments: 76 }, { day: "Thu", likes: 520, shares: 89, comments: 145 }, { day: "Fri", likes: 390, shares: 56, comments: 98 }]);
        setGrowth([{ month: "Jan", followers: 2400, reach: 12000 }, { month: "Feb", followers: 3100, reach: 15000 }, { month: "Mar", followers: 4200, reach: 21000 }, { month: "Apr", followers: 5800, reach: 28000 }]);
        setPlatforms([{ platform: "LinkedIn", posts: 45, engagement: 2340, reach: 12000, clicks: 560 }, { platform: "Facebook", posts: 38, engagement: 1890, reach: 9500, clicks: 340 }, { platform: "Instagram", posts: 52, engagement: 3400, reach: 18000, clicks: 780 }, { platform: "X", posts: 21, engagement: 980, reach: 5200, clicks: 190 }]);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <SkeletonPage />;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) return (
      <div className="glass-card p-3 shadow-xl !bg-dark-800/95">
        <p className="text-sm font-semibold text-white mb-1">{label}</p>
        {payload.map((p, i) => <p key={i} className="text-xs" style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>)}
      </div>
    );
    return null;
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-white">Analytics</h1><p className="text-dark-400 mt-1">Track your social media performance</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={HiOutlineHeart} label="Total Likes" value="12.4K" trend={18} color="rose" delay={0} />
        <StatCard icon={HiOutlineShare} label="Shares" value="3.2K" trend={12} color="blue" delay={0.05} />
        <StatCard icon={HiOutlineChatAlt} label="Comments" value="1.8K" trend={9} color="violet" delay={0.1} />
        <StatCard icon={HiOutlineEye} label="Reach" value="89K" trend={24} color="cyan" delay={0.15} />
        <StatCard icon={HiOutlineCursorClick} label="Clicks" value="5.6K" trend={15} color="amber" delay={0.2} />
        <StatCard icon={HiOutlineTrendingUp} label="CTR" value="6.3%" trend={4} color="emerald" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Engagement Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagement}>
              <defs>
                <linearGradient id="likeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient>
                <linearGradient id="commentGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="likes" stroke="#f43f5e" fill="url(#likeGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="comments" stroke="#8b5cf6" fill="url(#commentGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Reach</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="reach" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              <Bar dataKey="followers" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Platform Comparison Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Platform Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/10">
              {["Platform", "Posts", "Engagement", "Reach", "Clicks"].map((h) => <th key={h} className="text-left text-xs font-semibold text-dark-400 uppercase pb-3 px-4">{h}</th>)}
            </tr></thead>
            <tbody>
              {platforms.map((p) => (
                <tr key={p.platform} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-white">{p.platform}</td>
                  <td className="py-3 px-4 text-sm text-dark-300">{p.posts}</td>
                  <td className="py-3 px-4 text-sm text-dark-300">{p.engagement.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-dark-300">{p.reach.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-dark-300">{p.clicks.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
