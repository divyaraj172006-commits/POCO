import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { HiOutlineBell, HiOutlineSearch, HiOutlineMoon, HiOutlineSun, HiOutlineLogout, HiOutlineUser } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState("");
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const mockNotifs = [
    { id: 1, title: "Post Published", message: "Your post was published to LinkedIn", time: "2m ago", type: "success" },
    { id: 2, title: "Approval Pending", message: "New post awaiting review", time: "1h ago", type: "warning" },
    { id: 3, title: "Draft Saved", message: "Your draft has been saved", time: "3h ago", type: "info" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-dark-950/60 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Search */}
        <div className="relative w-80">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts, drafts, templates..." className="input-field pl-10 py-2.5 text-sm" />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-white/5 text-dark-300 hover:text-white hover:bg-white/10 transition-all">
            {theme === "dark" ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button onClick={() => setShowNotifs(!showNotifs)} className="p-2.5 rounded-xl bg-white/5 text-dark-300 hover:text-white hover:bg-white/10 transition-all relative">
              <HiOutlineBell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
            </button>
            <AnimatePresence>
              {showNotifs && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-2 w-80 glass-card p-2 shadow-2xl">
                  <h3 className="text-sm font-semibold px-3 py-2 text-dark-200">Notifications</h3>
                  {mockNotifs.map((n) => (
                    <div key={n.id} className="px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="text-xs text-dark-400 mt-0.5">{n.message}</p>
                      <p className="text-xs text-dark-500 mt-1">{n.time}</p>
                    </div>
                  ))}
                  <button className="w-full text-center text-xs text-primary-400 hover:text-primary-300 py-2 mt-1 border-t border-white/5">View All</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold">
                {user?.full_name?.[0] || "U"}
              </div>
              <span className="text-sm font-medium text-dark-200 hidden sm:block">{user?.full_name || "User"}</span>
            </button>
            <AnimatePresence>
              {showProfile && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-2 w-56 glass-card p-2 shadow-2xl">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-sm font-semibold">{user?.full_name}</p>
                    <p className="text-xs text-dark-400">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded-full text-[10px] font-semibold uppercase">{user?.role}</span>
                  </div>
                  <button onClick={() => { navigate("/settings"); setShowProfile(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-colors">
                    <HiOutlineUser className="w-4 h-4" /> Profile & Settings
                  </button>
                  <button onClick={() => { logout(); navigate("/login"); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                    <HiOutlineLogout className="w-4 h-4" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
