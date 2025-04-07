import { Inter } from "next/font/google";
import "./globals.css";
import { metadata } from "./metadata";
import { Providers } from "./providers";
import { ConditionalLayout } from "./conditional-layout";

const inter = Inter({ subsets: ["latin"] });

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

