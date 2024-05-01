import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./(site)/components/Navbar";
import Provider from "@/components/providers/Provider";
import logo from "@/public/images/bhaLogo.png"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mediwise-Sms",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F9FAFC] dark:bg-slate-900`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
