"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw error;
      }

      // Successful login
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const msg = error instanceof Error ? error.message : "Invalid login credentials. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen relative overflow-hidden bg-background" suppressHydrationWarning>
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] pointer-events-none bg-gradient-to-r from-primary-container/20 to-transparent"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full blur-[100px] pointer-events-none bg-gradient-to-r from-secondary-container/10 to-transparent"></div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>

      {/* Main Content Area */}
      <div className="flex w-full min-h-screen z-10">
        {/* Left Panel: Brand Showcase (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 border-r border-white/5 bg-surface-container-lowest/30">
          {/* Header */}
          <div className="z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center accent-glow">
              <span className="material-symbols-outlined text-on-primary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                analytics
              </span>
            </div>
            <h1 className="font-display text-headline-lg text-primary font-bold tracking-tight">AnalytixAI</h1>
          </div>

          {/* Center Content: Stats */}
          <div className="z-10 flex flex-col gap-stack-lg max-w-lg mt-16">
            <div>
              <h2 className="font-display text-headline-lg text-on-surface mb-4">
                Enterprise Intelligence,<br />Unleashed.
              </h2>
              <p className="font-body text-body-lg text-on-surface-variant">
                Access cutting-edge predictive models and real-time data streaming designed for professional analysts.
              </p>
            </div>
            <div className="flex flex-col gap-stack-md mt-8">
              {/* Stat Card 1 */}
              <div className="glass-card rounded-xl p-6 flex items-start gap-4 transform transition-transform hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-white/10 text-tertiary shadow-[0_0_15px_rgba(78,222,163,0.1)]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    monitoring
                  </span>
                </div>
                <div>
                  <div className="font-display text-headline-md text-on-surface">10k+ Analysts</div>
                  <div className="font-body text-body-md text-on-surface-variant">Powering data teams globally</div>
                </div>
              </div>
              {/* Stat Card 2 */}
              <div className="glass-card rounded-xl p-6 flex items-start gap-4 transform transition-transform hover:-translate-y-1 duration-300 delay-100">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-white/10 text-secondary shadow-[0_0_15px_rgba(76,215,246,0.1)]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    smart_toy
                  </span>
                </div>
                <div>
                  <div className="font-display text-headline-md text-on-surface">12 AI Agents</div>
                  <div className="font-body text-body-md text-on-surface-variant">Working concurrently on complex EDA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer graphic placeholder */}
          <div className="z-10 mt-auto pt-12">
            <div
              className="h-32 w-full rounded-xl overflow-hidden relative border border-white/5 bg-surface-container-lowest/50"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBVP-Sr2Pe42nxtKe7okFr22zQIwXV3vsTLmKQPdwqUWZ11-DFD_qhKwtywHNEa7fC_jz-A5tUAPoaFpIq5Dt-XOp9ttB_QLMJGdA08disocOhON0kGOki12KvJpNk_B6fzgyHWXLWZNcgUG3cfYAGsaHqKVPrFHFNzzg7eE91tuHwqNga8MJgA5B2DSIFcdT56CxA5LHVSvMMKYYeF-D4WKjTEoaMnAnsZV-8FHLt5TQEHxw6teJ_ZXg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Right Panel: Authentication Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-container-padding-mobile lg:p-container-padding-desktop relative">
          {/* Mobile Brand Header */}
          <div className="absolute top-6 left-6 lg:hidden flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                analytics
              </span>
            </div>
            <h1 className="font-display text-headline-md text-primary font-bold">AnalytixAI</h1>
          </div>

          {/* Form Container */}
          <div className="w-full max-w-md">
            <div className="mb-stack-lg text-center lg:text-left">
              <h2 className="font-display text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-2">Welcome Back</h2>
              <p className="font-body text-body-md text-on-surface-variant">Sign in to access your secure dashboard.</p>
            </div>

            {/* Error Alert Box */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-lg bg-error-container/20 border border-error/30 text-error flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] mt-0.5">error</span>
                <div className="font-body text-label-md">{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-stack-md" suppressHydrationWarning>
              {/* Email Field */}
              <div>
                <label className="block font-label text-label-md text-on-surface-variant mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant pointer-events-none">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </span>
                  <input
                    suppressHydrationWarning
                    className="input-field w-full rounded-lg h-12 pl-12 pr-4 text-on-surface font-body placeholder:text-on-surface-variant/50"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="analyst@enterprise.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-label text-label-md text-on-surface-variant" htmlFor="password">
                    Password
                  </label>
                  <a className="font-label text-label-md text-primary hover:text-secondary-fixed transition-colors" href="#">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant pointer-events-none">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </span>
                  <input
                    suppressHydrationWarning
                    className="input-field w-full rounded-lg h-12 pl-12 pr-12 text-on-surface font-body placeholder:text-on-surface-variant/50"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {/* Toggle Visibility */}
                  <button
                    suppressHydrationWarning
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-on-surface-variant hover:text-on-surface transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]" id="visibility-icon">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3 mt-2">
                <input
                  suppressHydrationWarning
                  className="w-4 h-4 rounded border-outline-variant bg-surface-container text-primary-container focus:ring-primary-container focus:ring-offset-background cursor-pointer"
                  id="remember"
                  type="checkbox"
                />
                <label className="font-label text-label-md text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* CTA */}
              <button
                suppressHydrationWarning
                className="glow-button w-full h-12 rounded-lg font-label text-label-md text-white font-semibold mt-4 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Signing In..." : "Sign In"}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-white/5"></div>
              <div className="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">Or</div>
              <div className="flex-1 h-px bg-white/5"></div>
            </div>

            {/* SSO Options */}
            <div className="flex flex-col gap-3">
              <button
                suppressHydrationWarning
                className="glass-card w-full h-12 rounded-lg flex items-center justify-center gap-3 hover:bg-surface-container-high transition-colors text-on-surface font-label text-label-md"
                type="button"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span>Continue with Google Workspace</span>
              </button>
              <button
                suppressHydrationWarning
                className="glass-card w-full h-12 rounded-lg flex items-center justify-center gap-3 hover:bg-surface-container-high transition-colors text-on-surface font-label text-label-md"
                type="button"
              >
                <span className="material-symbols-outlined">api</span>
                <span>Sign in with Enterprise SSO</span>
              </button>
            </div>

            {/* Create Account Link */}
            <div className="mt-8 text-center">
              <p className="font-body text-body-md text-on-surface-variant">
                Don&apos;t have access?{" "}
                <Link className="text-secondary hover:text-secondary-fixed transition-colors font-semibold" href="/signup">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
