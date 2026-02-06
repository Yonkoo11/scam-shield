import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
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
      <body className={`${dmSans.variable} ${bebasNeue.variable} font-sans`}>{children}</body>
    </html>
  );
}
