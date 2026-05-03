



"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Sun, Moon, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();

  const [dark, setDark] = useState(false);
  const [mode, setMode] = useState<"signup" | "signin">("signup");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // redirect if logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/today");
    });
    return () => unsub();
  }, [router]);

  // animation
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 18, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const setTheme = (m: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", m === "dark");
    setDark(m === "dark");
  };

  const emailClean = email.trim().toLowerCase();
  const passClean = password.trim();

  // validation rules
  const emailValid = /^\S+@\S+\.\S+$/.test(emailClean);

  const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  const isValid = emailValid && strongPassword.test(passClean);

  // password strength
  const getStrength = (pass: string) => {
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[a-z]/.test(pass)) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/\d/.test(pass)) s++;
    if (/[^A-Za-z\d]/.test(pass)) s++;

    if (s <= 2) return "Weak";
    if (s <= 4) return "Medium";
    return "Strong";
  };

  const strength = getStrength(passClean);

  // email auth
  const handleEmail = async () => {
    if (!isValid) {
      toast.error("Invalid email or password");
      return;
    }

    setLoadingEmail(true);

    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, emailClean, passClean);
        toast.success("Account created");
      } else {
        await signInWithEmailAndPassword(auth, emailClean, passClean);
        toast.success("Welcome back");
      }

      router.push("/today");
    } catch {
      toast.error("Authentication failed");
    } finally {
      setLoadingEmail(false);
    }
  };

  // google auth
  const handleGoogle = async () => {
    setLoadingGoogle(true);

    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google");
      router.push("/today");
    } catch {
      toast.error("Google sign-in failed");
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <main className="min-h-screen  text-foreground flex flex-col">
    {/* <main className="min-h-screen bg-background text-foreground flex flex-col"> */}

      {/* TOP BAR */}
      <header className="flex justify-between items-center px-6 py-4">
        <span className="text-xs tracking-[0.3em] text-muted-foreground">
          PARTH
        </span>

        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setTheme("light")}
            className={`p-2 rounded-md cursor-pointer ${
              !dark && "bg-primary text-white"
            }`}
          >
            <Sun size={16} />
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`p-2 rounded-md cursor-pointer ${
              dark && "bg-primary text-white"
            }`}
          >
            <Moon size={16} />
          </button>
        </div>
      </header>

      {/* CENTER */}
      <section className="flex-1 grid place-items-center px-4">

        <div
          ref={containerRef}
          className="w-full max-w-sm space-y-6"
        >

          {/* TITLE */}
          <div className="text-center space-y-1">
            <h1 className="text-4xl font-semibold">Win your day.</h1>
            <p className="text-sm text-muted-foreground">
              One goal. One execution.
            </p>
          </div>

          {/* EMAIL */}
          <Input
            className="h-11"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="relative">
            <Input
              className="h-11 pr-10"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-2.5 cursor-pointer text-muted-foreground"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* PASSWORD STRENGTH */}
          {password.length > 0 && (
            <p
              className={`text-xs ${
                strength === "Weak"
                  ? "text-red-500"
                  : strength === "Medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              Password strength: {strength}
            </p>
          )}

          {/* EMAIL BUTTON */}
          <Button
            onClick={handleEmail}
            disabled={!isValid || loadingEmail}
            className="w-full h-11 cursor-pointer disabled:cursor-not-allowed disabled:opacity-100"
          >
            {loadingEmail
              ? "Please wait..."
              : mode === "signup"
              ? "Create Account"
              : "Sign In"}
          </Button>

          {/* DIVIDER */}
          <div className="text-center text-xs text-muted-foreground">
            or continue with
          </div>

          {/* GOOGLE */}
          <Button
            variant="outline"
            onClick={handleGoogle}
            disabled={loadingGoogle}
            className="w-full h-11 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loadingGoogle ? (
              "Please wait..."
            ) : (
              <>
                {/* Google Icon */}
                <svg width="16" height="16" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.36 1.53 7.83 2.82l5.77-5.77C34.64 3.36 29.73 1.5 24 1.5 14.82 1.5 6.95 6.98 3.69 14.44l6.91 5.37C12.38 13.09 17.7 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.5 24c0-1.56-.14-3.06-.4-4.5H24v9h12.7c-.55 2.97-2.24 5.48-4.77 7.16l7.32 5.68C43.9 37.02 46.5 31.06 46.5 24z"/>
                  <path fill="#FBBC05" d="M10.6 28.81A14.5 14.5 0 0 1 9.5 24c0-1.67.29-3.28.8-4.79l-6.91-5.37A22.45 22.45 0 0 0 1.5 24c0 3.6.86 7 2.39 10l6.71-5.19z"/>
                  <path fill="#34A853" d="M24 46.5c5.73 0 10.54-1.9 14.05-5.17l-7.32-5.68c-2.02 1.36-4.6 2.17-6.73 2.17-6.3 0-11.62-3.59-13.4-8.81l-6.71 5.19C6.95 41.02 14.82 46.5 24 46.5z"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          {/* MODE SWITCH (YOUR REQUESTED STYLE) */}
          <div className="text-center text-sm text-muted-foreground space-y-2">

            {mode === "signup" ? (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="text-primary font-medium cursor-pointer hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Don’t have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-primary font-medium cursor-pointer hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}

          </div>

        </div>
      </section>
    </main>
  );
}