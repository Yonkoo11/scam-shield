"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center border-2 border-[#0a0a0a] dark:border-[#facc15] bg-white dark:bg-[#0a0a0a] transition-colors hover:bg-[#facc15] dark:hover:bg-[#1a1a1a]"
      aria-label="Toggle dark mode"
    >
      {dark ? (
        <Sun className="w-4 h-4 text-[#facc15]" />
      ) : (
        <Moon className="w-4 h-4 text-[#0a0a0a]" />
      )}
    </button>
  );
}
