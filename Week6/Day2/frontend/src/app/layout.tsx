import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import PromoBar from "@/components/PromoBar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecommerce Store - Loyalty Points & Real-time Notifications",
  description:
    "A fully functional ecommerce website with loyalty points system, real-time notifications, and Socket.IO integration.",
  keywords:
    "ecommerce, loyalty points, real-time notifications, socket.io, next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <PromoBar />
          <Navbar />

          {/* Removed container restriction here */}
          <main>{children}</main>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
