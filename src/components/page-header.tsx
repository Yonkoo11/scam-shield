import { type LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  badge?: string;
}

export function PageHeader({ icon: Icon, title, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#facc15] border-4 border-[#0a0a0a] mb-4 animate-scale-in">
        <Icon className="w-8 h-8 text-[#0a0a0a]" />
      </div>
      <h1 className="font-display text-5xl md:text-6xl text-[#0a0a0a] tracking-tight mb-2 animate-slide-in-left">
        {title}
      </h1>
      <p className="text-lg text-[#525252] max-w-md mx-auto animate-slide-in-left stagger-1">
        {subtitle}
      </p>
      {badge && (
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-[#ef4444] text-white text-xs font-bold uppercase tracking-widest animate-scale-in stagger-2">
          {badge}
        </div>
      )}
    </div>
  );
}
