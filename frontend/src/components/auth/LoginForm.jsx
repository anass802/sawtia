import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm({ onSwitchToRegister }) {
  const navigate=useNavigate()
  const { login, loading, error, clearError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);

  const set = (k) => (e) => { clearError(); setForm(f => ({ ...f, [k]: e.target.value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res=await login(form.email, form.password);
    if(res.success){
        navigate('/comingsoon')
    }
  };

  return (
    <form  onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Email address
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
          placeholder="you@company.com"
          className="w-full px-4 py-2.5 rounded-xl bg-[#1e2535] border border-[#2e3650] text-white placeholder-gray-500
                     focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition text-sm"
        />
      </div>

      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-300">Password</label>
          <button type="button" className="text-xs text-violet-400 hover:text-violet-300 transition">
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            required
            autoComplete="current-password"
            value={form.password}
            onChange={set("password")}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 pr-11 rounded-xl bg-[#1e2535] border border-[#2e3650] text-white placeholder-gray-500
                       focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
          >
            {showPw ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a10.05 10.05 0 011.875.175M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-3.364A9.956 9.956 0 0121 12c0 3-4 7-9 7" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-xl">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed
                   text-white font-semibold text-sm transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Signing in…
          </>
        ) : "Sign in"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <button type="button" onClick={onSwitchToRegister} className="text-violet-400 hover:text-violet-300 font-medium transition">
          Create one
        </button>
      </p>
    </form>
  );
}