import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { aiAPI } from "../../api/client";
import { HiOutlineSparkles, HiOutlineDownload, HiOutlinePhotograph } from "react-icons/hi";

const TEMPLATES = [
  { label: "Hiring Banner", prompt: "Professional hiring banner for tech company" },
  { label: "Product Launch", prompt: "Modern product launch announcement poster" },
  { label: "Festival Greetings", prompt: "Elegant festival greetings card design" },
  { label: "Offer Banner", prompt: "Eye-catching sale offer banner with discount" },
  { label: "Quote Card", prompt: "Minimal motivational quote card design" },
  { label: "Event Invite", prompt: "Professional event invitation design" },
];

export default function AIImages() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("modern");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [history, setHistory] = useState([]);

  const generate = async () => {
    if (!prompt) { toast.error("Enter a prompt"); return; }
    setLoading(true);
    try {
      const { data } = await aiAPI.generateImage({ prompt, style });
      setGeneratedImage(data);
      setHistory([data, ...history].slice(0, 8));
      toast.success("Image generated!");
    } catch { toast.error("Generation failed"); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-white">AI Image Generator</h1><p className="text-dark-400 mt-1">Create stunning visuals with AI</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <label className="text-sm font-medium text-dark-300 mb-1.5 block">Describe your image</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="input-field min-h-[120px] resize-none" placeholder="E.g., Modern tech startup hiring banner with gradient background..." />
            <div className="flex items-center gap-3 mt-4">
              <select value={style} onChange={(e) => setStyle(e.target.value)} className="input-field w-40">
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
                <option value="vibrant">Vibrant</option>
              </select>
              <button onClick={generate} disabled={loading} className="btn-primary flex items-center gap-2">
                <HiOutlineSparkles className="w-4 h-4" /> {loading ? "Generating..." : "Generate Image"}
              </button>
            </div>
          </motion.div>

          {/* Preview */}
          {generatedImage && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Generated Image</h3>
                <div className="flex gap-2">
                  <a href={generatedImage.image_url} download className="btn-secondary text-sm flex items-center gap-1.5">
                    <HiOutlineDownload className="w-4 h-4" /> Download
                  </a>
                  <button className="btn-primary text-sm flex items-center gap-1.5">
                    <HiOutlinePhotograph className="w-4 h-4" /> Use in Post
                  </button>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden bg-dark-800 flex items-center justify-center min-h-[300px]">
                <img src={generatedImage.image_url} alt="Generated" className="max-w-full max-h-[400px] object-contain" />
              </div>
              <p className="text-xs text-dark-500 mt-2">Prompt: {generatedImage.prompt}</p>
            </motion.div>
          )}
        </div>

        {/* Templates */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Templates</h3>
            <div className="space-y-2">
              {TEMPLATES.map((t) => (
                <button key={t.label} onClick={() => setPrompt(t.prompt)} className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-dark-300 hover:text-white transition-all border border-transparent hover:border-white/10">
                  {t.label}
                </button>
              ))}
            </div>
          </motion.div>

          {history.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Recent Generations</h3>
              <div className="grid grid-cols-2 gap-2">
                {history.map((img, i) => (
                  <div key={i} className="rounded-lg overflow-hidden bg-dark-800 cursor-pointer hover:ring-2 ring-primary-500 transition-all" onClick={() => setGeneratedImage(img)}>
                    <img src={img.image_url} alt="" className="w-full h-20 object-cover" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
