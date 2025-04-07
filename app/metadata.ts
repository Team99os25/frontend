import { Metadata } from "next";

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