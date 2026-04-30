import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { authAPI } from "../../api/client";
import { HiOutlineMail } from "react-icons/hi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success("Reset link sent!");
    } catch { toast.error("Something went wrong"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
            <HiOutlineMail className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">Forgot Password?</h2>
          <p className="text-dark-400 text-center text-sm mb-6">Enter your email and we&apos;ll send you a reset link</p>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✉️</span>
              </div>
              <p className="text-white font-medium">Check your inbox</p>
              <p className="text-dark-400 text-sm mt-2">We sent a password reset link to {email}</p>
              <Link to="/login" className="btn-primary inline-block mt-6">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-dark-300 mb-1.5 block">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-center">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <Link to="/login" className="block text-center text-sm text-dark-400 hover:text-white">← Back to login</Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
