"use client";

import { useUserStore } from "@/stores/user-store";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeButton() {
  const { theme, toggleTheme } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark-theme";

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-16 h-8 p-1 bg-background border-2 border-primary rounded-full cursor-pointer transition-all"
      aria-label="Toggle theme"
    >
      <span className="text-sm">{isDark ? "🌙" : "☀️"}</span>
      <span className="text-sm">{isDark ? "☀️" : "🌙"}</span>
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-foreground rounded-full transition-transform duration-300 ${
          isDark ? "translate-x-8" : "translate-x-0"
        }`}
      />
    </button>
  );
}
