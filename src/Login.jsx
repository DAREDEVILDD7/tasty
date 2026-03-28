import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setError(false);

    try {
      // Check Owner table first
      const { data: ownerData, error: ownerError } = await supabase
        .from("Owner")
        .select("id, username, password, name, main_rest")
        .eq("username", username.trim())
        .single();

      if (!ownerError && ownerData && ownerData.password === password) {
        // Owner matched
        onLogin({
          role: "owner",
          id: ownerData.id,
          name: ownerData.name,
          main_rest: ownerData.main_rest,
        });
        setLoading(false);
        return;
      }

      // Check Staff table
      const { data: staffData, error: staffError } = await supabase
        .from("Staff")
        .select("id, username, password, name, rest_id")
        .eq("username", username.trim())
        .single();

      if (!staffError && staffData && staffData.password === password) {
        // Staff matched
        onLogin({
          role: "staff",
          id: staffData.id,
          name: staffData.name,
          rest_id: staffData.rest_id,
        });
        setLoading(false);
        return;
      }

      // Neither matched
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } catch (err) {
      console.error("Login error:", err);
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-[#0f0e0c] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#f4a127] opacity-10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] bg-[#e05c2a] opacity-10 rounded-full blur-[100px] pointer-events-none" />

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-md bg-[#161512] border border-[#2a2620] rounded-3xl shadow-2xl px-10 py-12 transition-all duration-300 ${
          shake ? "animate-shake" : ""
        }`}
        style={{
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px #2a2620",
        }}
      >
        {/* Logo / Brand */}
        <div className="mb-10 text-center">
          <span
            className="text-5xl font-black tracking-tighter text-[#f4a127]"
            style={{
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "-2px",
            }}
          >
            FeastRush
          </span>
          <p
            className="text-[#6b6457] text-sm mt-1 tracking-widest uppercase"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Welcome back
          </p>
        </div>

        {/* Username */}
        <div className="mb-5">
          <label
            className="block text-xs uppercase tracking-widest text-[#6b6457] mb-2"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="your handle"
            className="w-full bg-[#1e1c18] border border-[#2e2b24] text-[#f0ead8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f4a127] focus:ring-1 focus:ring-[#f4a127] transition-all placeholder-[#3d3a32]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label
            className="block text-xs uppercase tracking-widest text-[#6b6457] mb-2"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Password
          </label>
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            className="w-full bg-[#1e1c18] border border-[#2e2b24] text-[#f0ead8] rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-[#f4a127] focus:ring-1 focus:ring-[#f4a127] transition-all placeholder-[#3d3a32]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          />
          <button
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-[38px] text-[#6b6457] hover:text-[#f4a127] transition-colors text-xs"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {showPass ? "hide" : "show"}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 bg-[#2a1a10] border border-[#6b2d0d] rounded-xl px-4 py-3 text-center">
            <p
              className="text-[#f4a127] text-sm"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              🙈 Oops! Looks like you got something wrong there.
            </p>
            <p
              className="text-[#6b6457] text-xs mt-1"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Double-check and try again, chef.
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#f4a127] hover:bg-[#e8911a] active:scale-95 text-[#0f0e0c] font-bold rounded-xl py-3 transition-all duration-200 text-sm tracking-widest uppercase disabled:opacity-60"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {loading ? "Checking..." : "Sign In →"}
        </button>

        <p
          className="text-center text-[#3d3a32] text-xs mt-8"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          © {new Date().getFullYear()} FeastRush. All rights reserved.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=DM+Mono:wght@400;500&display=swap');

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.6s ease; }
      `}</style>
    </div>
  );
}
