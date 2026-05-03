





"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useTheme } from "next-themes";

import {
  Home,
  Target,
  Archive,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const { theme, setTheme } = useTheme();

  const dark = theme === "dark";

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [user, loading, router]);

  if (loading) return null;

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out");
      router.replace("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const NavItem = ({
    icon: Icon,
    label,
    path,
  }: {
    icon: any;
    label: string;
    path: string;
  }) => {
    const active = pathname === path;

    return (
      <button
        onClick={() => router.push(path)}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer
          ${
            active
              ? "bg-primary text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen  text-foreground flex flex-col">
    {/* <div className="min-h-screen bg-background text-foreground flex flex-col"> */}

      {/* ================= HEADER ================= */}
      <header className="flex items-center  justify-between px-4 md:px-6 py-3 ">
      {/* <header className="flex items-center  justify-between px-4 md:px-6 py-3 bg-background/70 backdrop-blur-md"> */}

        {/* BRAND */}
        <div className="text-xs tracking-[0.35em] text-muted-foreground font-semibold">
          PARTH
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-2 bg-muted/40 p-1 rounded-full border shadow-sm">
          <NavItem icon={Home} label="Habit" path="/habit" />
          <NavItem icon={Home} label="Today" path="/today" />
          <NavItem icon={Target} label="Goal" path="/goal" />
          <NavItem icon={Archive} label="Archive" path="/archive" />
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2">

          {/* THEME TOGGLE */}
          <div className="flex bg-muted rounded-lg p-1 border">

            <button
              onClick={() => setTheme("light")}
              className={`p-2 rounded-md cursor-pointer transition ${
                theme === "light" ? "bg-primary text-white" : ""
              }`}
            >
              <Sun size={16} />
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`p-2 rounded-md cursor-pointer transition ${
                theme === "dark" ? "bg-primary text-white" : ""
              }`}
            >
              <Moon size={16} />
            </button>

          </div>

          {/* LOGOUT */}
          <Button
            variant="destructive"
            size="sm"
            onClick={logout}
            className="p-5 hidden md:flex gap-2 font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>

        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* ================= MOBILE NAV ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background grid grid-cols-4 py-2">

        <button
          onClick={() => router.push("/today")}
          className={`flex flex-col items-center text-xs gap-1 font-medium cursor-pointer ${
            pathname === "/today"
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Home className="w-4 h-4" />
          Today
        </button>

        <button
          onClick={() => router.push("/goal")}
          className={`flex flex-col items-center text-xs gap-1 font-medium cursor-pointer ${
            pathname === "/goal"
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Target className="w-4 h-4" />
          Goal
        </button>

        <button
          onClick={() => router.push("/archive")}
          className={`flex flex-col items-center text-xs gap-1 font-medium cursor-pointer ${
            pathname === "/archive"
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Archive className="w-4 h-4" />
          Archive
        </button>

        <button
          onClick={logout}
          className="flex flex-col items-center text-xs gap-1 text-red-500 font-medium cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

      </nav>
    </div>
  );
}