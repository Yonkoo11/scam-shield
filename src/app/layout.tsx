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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){d.classList.add('dark')}}catch(e){}})()` }} />
      </head>
      <body className={`${dmSans.variable} ${bebasNeue.variable} font-sans`}>
        <main className="min-h-screen bg-mesh relative">
          {/* Animated warning stripes header */}
          <div className="warning-stripes-animated h-3 sticky top-0 z-50" />

          {/* Navigation */}
          <Navigation />

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
