import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/navbar/navbar";
import Footer from "@/component/footer/footer";
import WhatsAppButton from "@/component/whatsappButton/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nayab clothes",
  description: "Discover premium fabrics, fashion, and custom-stitched clothing at Nayab Fashion.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
