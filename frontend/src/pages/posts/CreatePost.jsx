import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { postsAPI, draftsAPI, aiAPI } from "../../api/client";
import { HiOutlinePhotograph, HiOutlineSparkles, HiOutlineHashtag, HiOutlineRefresh, HiOutlineEmojiHappy } from "react-icons/hi";
import PlatformIcon from "../../components/common/PlatformIcon";

const PLATFORMS = ["linkedin", "facebook", "instagram", "x"];
const CTA_OPTIONS = ["Learn More", "Shop Now", "Sign Up", "Contact Us", "Download", "Book Now", "Get Started", "Read More"];

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", caption: "", image_url: "", platforms: [], hashtags: [], cta: "" });
  const [aiLoading, setAiLoading] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const emojis = ["😀", "🚀", "🔥", "💡", "📊", "✨", "💪", "🎯", "📈", "🌟", "💼", "👏", "❤️", "🎉", "⚡", "👉", "🏆", "💰", "📢", "🤝"];

  const togglePlatform = (p) => {
    setForm({ ...form, platforms: form.platforms.includes(p) ? form.platforms.filter(x => x !== p) : [...form.platforms, p] });
  };

  const generateCaption = async (tone) => {
    if (!form.title) { toast.error("Enter a title first"); return; }
    setAiLoading("caption");
    try {
      const { data } = await aiAPI.generateCaption({ topic: form.title, tone });
      setForm({ ...form, caption: data.caption });
      toast.success(`${tone} caption generated!`);
    } catch { toast.error("Failed to generate caption"); }
    setAiLoading("");
  };

  const generateHashtags = async () => {
    if (!form.caption) { toast.error("Write a caption first"); return; }
    setAiLoading("hashtags");
    try {
      const { data } = await aiAPI.generateHashtags({ content: form.caption, count: 10 });
      setForm({ ...form, hashtags: data.hashtags });
      toast.success("Hashtags generated!");
    } catch { toast.error("Failed to generate hashtags"); }
    setAiLoading("");
  };

  const rewriteContent = async (style) => {
    if (!form.caption) { toast.error("Write a caption first"); return; }
    setAiLoading("rewrite");
    try {
      const { data } = await aiAPI.rewriteContent({ content: form.caption, style });
      setForm({ ...form, caption: data.rewritten });
      toast.success(`Content rewritten (${style})`);
    } catch { toast.error("Failed to rewrite"); }
    setAiLoading("");
  };

  const handleAction = async (action) => {
    if (!form.caption) { toast.error("Caption is required"); return; }
    try {
      if (action === "draft") {
        await draftsAPI.save(form);
        toast.success("Draft saved!");
      } else {
        const { data: post } = await postsAPI.create(form);
        if (action === "publish") {
          await postsAPI.publish(post.id);
          toast.success("Post published!");
        } else if (action === "schedule") {
          if (!scheduleDate || !scheduleTime) { toast.error("Select date and time"); return; }
          await postsAPI.schedule(post.id, { scheduled_at: `${scheduleDate}T${scheduleTime}:00Z` });
          toast.success("Post scheduled!");
        } else if (action === "approval") {
          await postsAPI.sendForApproval(post.id);
          toast.success("Sent for approval!");
        }
      }
      setForm({ title: "", caption: "", image_url: "", platforms: [], hashtags: [], cta: "" });
    } catch (err) { toast.error(err.response?.data?.detail || "Action failed"); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Create Post</h1>
        <p className="text-dark-400 mt-1">Compose and publish to multiple platforms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-dark-300 mb-1.5 block">Post Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="What's this post about?" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-dark-300">Caption</label>
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowEmoji(!showEmoji)} className="p-1.5 rounded-lg hover:bg-white/10 text-dark-400 hover:text-white transition-all">
                    <HiOutlineEmojiHappy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <textarea value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="input-field min-h-[160px] resize-none" placeholder="Write your post caption..." />
              {showEmoji && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-1 mt-2 p-2 glass-card">
                  {emojis.map((e) => (
                    <button key={e} onClick={() => setForm({ ...form, caption: form.caption + e })} className="p-1.5 hover:bg-white/10 rounded text-lg">{e}</button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* AI Buttons */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-dark-300">AI Content Tools</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => generateCaption("professional")} disabled={!!aiLoading} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
                  <HiOutlineSparkles className="w-3.5 h-3.5" /> Professional
                </button>
                <button onClick={() => generateCaption("marketing")} disabled={!!aiLoading} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
                  <HiOutlineSparkles className="w-3.5 h-3.5" /> Marketing
                </button>
                <button onClick={() => generateCaption("motivational")} disabled={!!aiLoading} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
                  <HiOutlineSparkles className="w-3.5 h-3.5" /> Motivational
                </button>
                <button onClick={generateHashtags} disabled={!!aiLoading} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
                  <HiOutlineHashtag className="w-3.5 h-3.5" /> Hashtags
                </button>
                <button onClick={() => rewriteContent("shorter")} disabled={!!aiLoading} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
                  <HiOutlineRefresh className="w-3.5 h-3.5" /> Shorter
                </button>
                <button onClick={() => rewriteContent("strong_cta")} disabled={!!aiLoading} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
                  <HiOutlineRefresh className="w-3.5 h-3.5" /> Strong CTA
                </button>
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="text-sm font-medium text-dark-300 mb-1.5 block">Image</label>
              <div className="flex gap-2">
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field flex-1" placeholder="Image URL or upload" />
                <button className="btn-secondary flex items-center gap-1.5">
                  <HiOutlinePhotograph className="w-4 h-4" /> Upload
                </button>
              </div>
            </div>

            {/* Hashtags display */}
            {form.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.hashtags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-primary-500/20 text-primary-300 rounded-lg text-xs font-medium">{tag}</span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Platforms */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Platforms</h3>
            <div className="space-y-2">
              {PLATFORMS.map((p) => (
                <button key={p} onClick={() => togglePlatform(p)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${form.platforms.includes(p) ? "bg-primary-500/20 border border-primary-500/40" : "bg-white/5 border border-transparent hover:bg-white/10"}`}>
                  <PlatformIcon platform={p} size="sm" />
                  <span className="text-sm font-medium capitalize">{p === "x" ? "X (Twitter)" : p}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Call to Action</h3>
            <select value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} className="input-field text-sm">
              <option value="">Select CTA</option>
              {CTA_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </motion.div>

          {/* Schedule */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Schedule</h3>
            <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="input-field text-sm mb-2" />
            <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="input-field text-sm" />
          </motion.div>

          {/* Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-2">
            <button onClick={() => handleAction("publish")} className="btn-primary w-full py-3">🚀 Publish Now</button>
            <button onClick={() => handleAction("schedule")} className="btn-secondary w-full py-3">📅 Schedule Post</button>
            <button onClick={() => handleAction("draft")} className="btn-ghost w-full py-2.5 bg-white/5 border border-white/10 rounded-xl">💾 Save Draft</button>
            <button onClick={() => handleAction("approval")} className="btn-ghost w-full py-2.5 bg-white/5 border border-white/10 rounded-xl">📋 Send for Approval</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
