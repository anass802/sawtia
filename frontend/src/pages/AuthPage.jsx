import { useState } from "react";
import LoginForm    from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"

  return (
    <div className="min-h-screen bg-[#0f1422] flex items-center justify-center px-4 py-10">

      {/* Glow blobs — purely decorative */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-700/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
            </svg>
          </div>
          <span className="text-white text-xl font-bold tracking-tight">Sawtia</span>
        </div>

        {/* Card */}
        <div className="bg-[#161d2e] border border-[#1f2a40] rounded-2xl p-8 shadow-2xl">

          {/* Tab toggle */}
          <div className="flex bg-[#0f1422] rounded-xl p-1 mb-7">
            {["login", "register"].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition
                  ${mode === m
                    ? "bg-violet-600 text-white shadow"
                    : "text-gray-500 hover:text-gray-300"}`}
              >
                {m === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-white text-xl font-semibold">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {mode === "login"
                ? "Enter your credentials to access your dashboard."
                : "Start automating your customer conversations today."}
            </p>
          </div>

          {/* Form — swapped by mode */}
          {mode === "login"
            ? <LoginForm    onSwitchToRegister={() => setMode("register")} />
            : <RegisterForm onSwitchToLogin={() => setMode("login")} />}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          © {new Date().getFullYear()} Sawtia AI · All rights reserved
        </p>
      </div>
    </div>
  );
}