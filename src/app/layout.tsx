import type { Metadata } from "next";
import { Unbounded, Sunflower } from "next/font/google";
import "./globals.css";

const fontUnbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

const fontSunflower = Sunflower({
  weight: ["300", "500", "700"],
  variable: "--font-sunflower",
});

export const metadata: Metadata = {
  title: "FinAI - Minimalist Expense Logging",
  description: "Natural language AI-powered expense tracking and management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontUnbounded.variable} ${fontSunflower.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sunflower">{children}</body>
    </html>
  );
}
