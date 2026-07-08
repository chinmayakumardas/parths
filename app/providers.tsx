"use client";

import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import DotPattern from "@/components/ui/dot-pattern";
import Particles from "@/components/ui/particles";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

function BackgroundPattern() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isLightTheme = resolvedTheme === "light";

  return (
    <>
      <DotPattern
        className={cn(
          "mask-[radial-gradient(ellipse,rgba(0,0,0,0.3)_30%,black_50%)]",
          "dark:fill-slate-700"
        )}
        cr={1}
        cx={1}
        cy={1}
        height={20}
        width={20}
      />

      <Particles
        className="absolute inset-0 pointer-events-none"
        color={isLightTheme ? "#000000" : "#ffffff"}
        ease={80}
        quantity={100}
        refresh
      />
    </>
  );
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      <AuthProvider>
        <div className="fixed inset-0 -z-10">
          <BackgroundPattern />
        </div>

        <div className="relative z-10">
          <Toaster position="top-right" richColors />
          {children}
        </div>
      </AuthProvider>
   
  );
}