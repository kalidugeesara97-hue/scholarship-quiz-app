import type { Metadata, Viewport } from "next";
import { Noto_Sans_Sinhala } from "next/font/google";
import "./globals.css";
import AiAssistant from "./components/AiAssistant";

const sinhalaFont = Noto_Sans_Sinhala({
  subsets: ["sinhala", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sinhala",
});

export const metadata: Metadata = {
  title: "සුමිත් සර්ගේ ශිෂ්‍යත්ව ප්‍රශ්නාවලිය",
  description: "5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගයට සූදානම් වීමට දෛනික MCQ ප්‍රශ්නාවලිය",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="si" className={sinhalaFont.variable}>
      <body className="font-sans min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {children}
        <AiAssistant />
      </body>
    </html>
  );
}
