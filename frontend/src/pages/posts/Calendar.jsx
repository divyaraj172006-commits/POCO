import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const mockEvents = [
  { day: 5, title: "LinkedIn Post", status: "published", color: "bg-emerald-500" },
  { day: 8, title: "Instagram Story", status: "scheduled", color: "bg-blue-500" },
  { day: 12, title: "Facebook Ad", status: "draft", color: "bg-dark-500" },
  { day: 15, title: "X Thread", status: "scheduled", color: "bg-blue-500" },
  { day: 18, title: "Product Launch", status: "pending", color: "bg-amber-500" },
  { day: 22, title: "Weekly Recap", status: "scheduled", color: "bg-blue-500" },
  { day: 25, title: "Holiday Greeting", status: "draft", color: "bg-dark-500" },
  { day: 28, title: "Month Review", status: "scheduled", color: "bg-blue-500" },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState("all");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  const filteredEvents = filter === "all" ? mockEvents : mockEvents.filter(e => e.status === filter);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Calendar</h1>
          <p className="text-dark-400 mt-1">Plan and manage your content schedule</p>
        </div>
        <div className="flex items-center gap-2">
          {["all", "published", "scheduled", "draft"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-primary-500 text-white" : "bg-white/5 text-dark-400 hover:text-white"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prev} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-dark-300 hover:text-white transition-all"><HiOutlineChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-xl font-bold text-white">{MONTHS[month]} {year}</h2>
          <button onClick={next} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-dark-300 hover:text-white transition-all"><HiOutlineChevronRight className="w-5 h-5" /></button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => <div key={d} className="text-center text-xs font-semibold text-dark-400 py-2">{d}</div>)}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const events = day ? filteredEvents.filter(e => e.day === day) : [];
            return (
              <div key={i} className={`min-h-[100px] p-2 rounded-xl transition-all ${day ? "bg-white/[0.02] hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10" : ""} ${isToday ? "!border-primary-500/50 bg-primary-500/5" : ""}`}>
                {day && (
                  <>
                    <span className={`text-sm font-medium ${isToday ? "text-primary-400" : "text-dark-300"}`}>{day}</span>
                    <div className="mt-1 space-y-1">
                      {events.map((event, j) => (
                        <div key={j} className={`${event.color} rounded px-1.5 py-0.5 text-[10px] font-medium text-white truncate`}>
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
