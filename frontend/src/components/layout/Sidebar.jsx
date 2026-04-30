import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  HiOutlineHome, HiOutlinePencilAlt, HiOutlineDocumentText, HiOutlineClock,
  HiOutlineCalendar, HiOutlineCheckCircle, HiOutlineChartBar, HiOutlineLink,
  HiOutlineCog, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineSparkles,
} from "react-icons/hi";

const navItems = [
  { path: "/", icon: HiOutlineHome, label: "Dashboard" },
  { path: "/create-post", icon: HiOutlinePencilAlt, label: "Create Post" },
  { path: "/drafts", icon: HiOutlineDocumentText, label: "Drafts" },
  { path: "/scheduled", icon: HiOutlineClock, label: "Scheduled" },
  { path: "/calendar", icon: HiOutlineCalendar, label: "Calendar" },
  { path: "/approvals", icon: HiOutlineCheckCircle, label: "Approvals" },
  { path: "/analytics", icon: HiOutlineChartBar, label: "Analytics" },
  { path: "/ai-images", icon: HiOutlineSparkles, label: "AI Images" },
  { path: "/accounts", icon: HiOutlineLink, label: "Accounts" },
  { path: "/settings", icon: HiOutlineCog, label: "Settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-dark-950/80 backdrop-blur-xl border-r border-white/5 z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold gradient-text">POCO</span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-lg">P</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary-400" : ""}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="text-sm font-medium whitespace-nowrap overflow-hidden">
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-4 border-t border-white/5 flex items-center justify-center text-dark-400 hover:text-white transition-colors"
      >
        {collapsed ? <HiOutlineChevronRight className="w-5 h-5" /> : <HiOutlineChevronLeft className="w-5 h-5" />}
      </button>
    </motion.aside>
  );
}

export function useSidebarWidth() {
  return 260; // default width for layout calculations
}
