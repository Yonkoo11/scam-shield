"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Home, Brain, TrendingUp, Info } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: Brain },
  { href: "/trends", label: "Trends", icon: TrendingUp },
  { href: "/about", label: "About", icon: Info },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-3 z-40 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm border-b-4 border-[#0a0a0a] dark:border-[#facc15]">
      <div className="container max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#0a0a0a] dark:bg-[#facc15] flex items-center justify-center group-hover:bg-[#ef4444] transition-colors">
            <Shield className="w-5 h-5 text-[#facc15] dark:text-[#0a0a0a]" />
          </div>
          <span className="font-display text-xl tracking-wider text-[#0a0a0a] dark:text-[#fafafa] hidden sm:block">
            SCAM SHIELD
          </span>
        </Link>

        {/* Nav Links + Theme Toggle */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 transition-all duration-150 ${
                  isActive
                    ? "bg-[#0a0a0a] dark:bg-[#facc15] text-white dark:text-[#0a0a0a] border-[#0a0a0a] dark:border-[#facc15]"
                    : "bg-white dark:bg-transparent text-[#525252] dark:text-[#a3a3a3] border-transparent hover:border-[#0a0a0a] dark:hover:border-[#facc15] hover:text-[#0a0a0a] dark:hover:text-[#facc15]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
