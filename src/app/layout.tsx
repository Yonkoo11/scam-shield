import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Scam Shield - Instant Scam Detection",
  description: "Paste anything suspicious. Know instantly if it's a scam. Powered by Gemini AI.",
  keywords: ["scam detection", "fraud prevention", "phishing", "scam checker"],
  openGraph: {
    title: "Scam Shield - Instant Scam Detection",
    description: "Paste anything suspicious. Know instantly if it's a scam.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${bebasNeue.variable} font-sans`}>
        <main className="min-h-screen bg-mesh noise-overlay dot-pattern relative">
          {/* Animated warning stripes header */}
          <div className="warning-stripes-animated h-3 sticky top-0 z-50" />

          {/* Navigation */}
          <Navigation />

          {/* Floating accent shapes */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-20 -left-20 w-64 h-64 bg-[#facc15] opacity-10 rotate-12 animate-float" />
            <div className="absolute top-1/2 -right-32 w-96 h-96 bg-[#ef4444] opacity-5 -rotate-12 animate-float stagger-2" />
            <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-[#0a0a0a] opacity-5 rotate-45 animate-float stagger-3" />
          </div>

          {/* Page content */}
          <div className="relative z-10">
            {children}
          </div>

          {/* Footer */}
          <Footer />

          {/* Warning stripes footer */}
          <div className="warning-stripes h-3" />
        </main>
      </body>
    </html>
  );
}
