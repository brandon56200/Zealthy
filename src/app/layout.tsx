import type { Metadata } from "next";
import { Noto_Sans, Kantumruy_Pro } from "next/font/google";
import "./globals.css";
import Navigation from "./components/layout/Navigation";
import { AuthProvider } from '@/lib/auth-context';
import FluidSim from "./components/ui/FluidSim";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

const kantumruyPro = Kantumruy_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kantumruy-pro",
});

console.log('Font variables:', {
  notoSans: notoSans.variable,
  kantumruyPro: kantumruyPro.variable
});

export const metadata: Metadata = {
  title: "Zealthy Onboard",
  description: "Onboarding platform for Zealthy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${kantumruyPro.variable}`}>
        <FluidSim />
        <AuthProvider>
          <Navigation />
          <div className="pt-24">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
