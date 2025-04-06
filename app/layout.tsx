import { Metadata } from "next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Inter } from "next/font/google";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "OpenSoft",
    template: "%s - OpenSoft"
  },
  description: "OpenSoft",
  twitter: {
    card: "summary_large_image",
    site: "@opensoft",
    creator: "@opensoft",
    title: "OpenSoft",
    description: "OpenSoft",
    images: ["/opengraph-image.png"]
  },
  openGraph: {
    title: "OpenSoft",
    description: "OpenSoft ",
    url: "https://OpenSofte.com",
    siteName: "OpenSoft",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "OpenSoft"
      }
    ]
  }
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={` ${inter.className}`}>
        {/* <Header /> */}
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}

