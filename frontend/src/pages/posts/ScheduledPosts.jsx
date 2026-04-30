import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { postsAPI } from "../../api/client";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonRow } from "../../components/common/Skeleton";
import PlatformIcon from "../../components/common/PlatformIcon";
import { HiOutlineClock } from "react-icons/hi";

export default function ScheduledPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await postsAPI.list({ status_filter: "scheduled" });
        setPosts(data);
      } catch { setPosts([]); }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="space-y-4"><div className="skeleton h-8 w-40"></div>{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Scheduled Posts</h1>
        <p className="text-dark-400 mt-1">{posts.length} posts in queue</p>
      </div>

      {posts.length === 0 ? (
        <EmptyState icon={HiOutlineClock} title="No scheduled posts" description="Schedule a post from the Create Post page." />
      ) : (
        <div className="space-y-3">
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card-hover p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white truncate">{post.title || "Untitled"}</h3>
                  <p className="text-sm text-dark-400 mt-1 line-clamp-1">{post.caption}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <StatusBadge status={post.status} />
                    <div className="flex gap-1">{post.platforms?.map((p) => <PlatformIcon key={p} platform={p} size="sm" />)}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
