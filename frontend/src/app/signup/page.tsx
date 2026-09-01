"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const router = useRouter();

  // User input states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP state
  const [otpCode, setOtpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Status/Loading states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);

  // Handle Initial Registration Submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      setSuccessMsg("Registration successful! An OTP code has been sent to your email.");
      setIsVerifying(true);
    } catch (error: unknown) {
      console.error("Sign up failed:", error);
      const msg = error instanceof Error ? error.message : "Registration failed. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Token Verification
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode.trim(),
        type: "signup",
      });

      if (error) {
        throw error;
      }

      setSuccessMsg("Account successfully verified! Redirecting to dashboard...");
      
      // Delay navigation slightly so user sees the success message
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (error: unknown) {
      console.error("Verification failed:", error);
      const msg = error instanceof Error ? error.message : "Invalid or expired OTP code. Please check and try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      });
      if (error) throw error;
      setSuccessMsg("A new OTP code has been sent to your email.");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to resend code. Please try again.";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="flex w-full min-h-screen relative overflow-hidden bg-background">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] pointer-events-none bg-gradient-to-r from-primary-container/20 to-transparent"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full blur-[100px] pointer-events-none bg-gradient-to-r from-secondary-container/10 to-transparent"></div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>

      <main className="w-full h-screen flex flex-col md:flex-row z-10">
        {/* Left Panel: Brand Showcase (Hidden on Mobile) */}
        <section className="hidden md:flex flex-col w-1/2 p-container-padding-desktop justify-between relative overflow-hidden bg-surface-container-lowest/80 backdrop-blur-sm border-r border-white/5">
          <div className="z-10 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container text-display-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              analytics
            </span>
            <h1 className="font-display text-headline-lg text-primary font-bold tracking-tight">AnalytixAI</h1>
          </div>
          <div className="z-10 flex flex-col gap-stack-lg max-w-lg">
            <div>
              <h2 className="font-display text-headline-lg text-on-surface mb-stack-sm">
                Enterprise-grade AI analytics.
              </h2>
              <p className="font-body text-body-lg text-on-surface-variant">
                Harness the power of predictive models and real-time data streaming to transform raw data into actionable intelligence.
              </p>
            </div>
            {/* Bento Grid Style Stats */}
            <div className="grid grid-cols-2 gap-stack-md">
              <div className="glass-panel p-stack-md rounded-xl flex flex-col gap-stack-sm">
                <div className="flex items-center gap-stack-sm text-secondary">
                  <span className="material-symbols-outlined">speed</span>
                  <span className="font-label text-label-md uppercase tracking-wider">Processing</span>
                </div>
                <div className="font-display text-headline-md text-on-surface">
                  1.2<span className="text-secondary font-label text-label-md ml-1">PB/s</span>
                </div>
                <p className="font-label text-label-sm text-on-surface-variant">Real-time throughput</p>
              </div>
              <div className="glass-panel p-stack-md rounded-xl flex flex-col gap-stack-sm">
                <div className="flex items-center gap-stack-sm text-tertiary">
                  <span className="material-symbols-outlined">model_training</span>
                  <span className="font-label text-label-md uppercase tracking-wider">Accuracy</span>
                </div>
                <div className="font-display text-headline-md text-on-surface">
                  99.9<span className="text-tertiary font-label text-label-md ml-1">%</span>
                </div>
                <p className="font-label text-label-sm text-on-surface-variant">Predictive confidence</p>
              </div>
            </div>
          </div>
          <div className="z-10 flex gap-stack-md text-on-surface-variant font-label text-label-sm">
            <span>© 2026 AnalytixAI</span>
            <a className="hover:text-primary transition-colors" href="#">
              Privacy
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Terms
            </a>
          </div>
          {/* Abstract Data Graphic Background Placeholder */}
          <div
            className="absolute inset-0 z-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDV1YZMUFrQPnGVfnTdMXuEU7muvNu0hc5BuPSUYx_jcwRZWu8AYTn0VSfVkJdMLMZVVc2za8Yj5tYXl78zFmeOrZBsPYdvjfKg4q5B5Dl_nq3OWbJe_dnkJupKAb5u5BbBUmeqk6ptAonV0whR6rETEPaJtrOIH9VepCEjlP7WN6VM64ErL__DjKGeijn0v_HNNOik63WvOlHESbNQcFjoiGyizCo2BW0WNjD1bHpJD7FbHAli0p7mtQ')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </section>

        {/* Right Panel: Form Area */}
        <section className="w-full md:w-1/2 flex items-center justify-center p-container-padding-mobile md:p-container-padding-desktop bg-surface/50 backdrop-blur-xl">
          <div className="w-full max-w-md glass-panel rounded-xl p-stack-lg shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            
            {/* Mobile Logo */}
            <div className="flex md:hidden items-center justify-center gap-stack-sm mb-stack-lg">
              <span className="material-symbols-outlined text-primary-container text-headline-lg-mobile" style={{ fontVariationSettings: "'FILL' 1" }}>
                analytics
              </span>
              <h1 className="font-display text-headline-lg-mobile text-primary font-bold tracking-tight">AnalytixAI</h1>
            </div>

            {/* Error/Success Alert Boxes */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-lg bg-error-container/20 border border-error/30 text-error flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] mt-0.5">error</span>
                <div className="font-body text-label-md">{errorMsg}</div>
              </div>
            )}
            {successMsg && (
              <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] mt-0.5">check_circle</span>
                <div className="font-body text-label-md">{successMsg}</div>
              </div>
            )}

            {!isVerifying ? (
              /* Signup Credentials Form */
              <>
                <div className="mb-stack-lg text-center md:text-left">
                  <h2 className="font-display text-headline-lg text-on-surface mb-unit">Create Account</h2>
                  <p className="font-body text-body-md text-on-surface-variant">Join the enterprise tier and start analyzing.</p>
                </div>
                <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-stack-md">
                  <div className="flex flex-col gap-unit">
                    <label className="font-label text-label-md text-on-surface-variant" htmlFor="fullName">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                        person
                      </span>
                      <input
                        className="input-cyber w-full rounded-lg py-2 pl-10 pr-4 font-body text-body-md focus:ring-0"
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-unit">
                    <label className="font-label text-label-md text-on-surface-variant" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                        mail
                      </span>
                      <input
                        className="input-cyber w-full rounded-lg py-2 pl-10 pr-4 font-body text-body-md focus:ring-0"
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-unit">
                    <label className="font-label text-label-md text-on-surface-variant" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                        lock
                      </span>
                      <input
                        className="input-cyber w-full rounded-lg py-2 pl-10 pr-10 font-body text-body-md focus:ring-0"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? "visibility" : "visibility_off"}
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-unit">
                    <label className="font-label text-label-md text-on-surface-variant" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                        lock_reset
                      </span>
                      <input
                        className="input-cyber w-full rounded-lg py-2 pl-10 pr-4 font-body text-body-md focus:ring-0"
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    className="glow-button w-full rounded-lg py-3 font-label text-label-md uppercase tracking-wider mt-stack-sm flex justify-center items-center gap-2 active:scale-[0.99] disabled:opacity-50 text-white font-semibold"
                    type="submit"
                    disabled={loading}
                  >
                    <span>{loading ? "Creating..." : "Create Account"}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </form>
                <div className="mt-stack-lg text-center">
                  <p className="font-body text-body-md text-on-surface-variant">
                    Already have an account?{" "}
                    <Link className="text-secondary hover:text-secondary-fixed transition-colors font-semibold" href="/">
                      Sign in instead
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              /* OTP Verification Form */
              <>
                <div className="mb-stack-lg text-center md:text-left">
                  <h2 className="font-display text-headline-lg text-on-surface mb-unit">Verify Email</h2>
                  <p className="font-body text-body-md text-on-surface-variant">
                    Please enter the 6-digit confirmation code sent to <strong className="text-secondary">{email}</strong>.
                  </p>
                </div>
                <form onSubmit={handleVerifyOtpSubmit} className="flex flex-col gap-stack-md">
                  <div className="flex flex-col gap-unit">
                    <label className="font-label text-label-md text-on-surface-variant" htmlFor="otpCode">
                      Verification Code (OTP)
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                        key
                      </span>
                      <input
                        className="input-cyber w-full rounded-lg py-2 pl-10 pr-4 font-body text-body-md text-center tracking-[0.5em] font-bold focus:ring-0"
                        id="otpCode"
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    className="glow-button w-full rounded-lg py-3 font-label text-label-md uppercase tracking-wider mt-stack-sm flex justify-center items-center gap-2 active:scale-[0.99] disabled:opacity-50 text-white font-semibold"
                    type="submit"
                    disabled={loading}
                  >
                    <span>{loading ? "Verifying..." : "Verify Code"}</span>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </button>
                  
                  <div className="flex justify-between items-center mt-4">
                    <button
                      className="font-label text-label-md text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
                      type="button"
                      onClick={() => setIsVerifying(false)}
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      <span>Edit Email</span>
                    </button>
                    <button
                      className="font-label text-label-md text-primary hover:text-secondary-fixed transition-colors"
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
