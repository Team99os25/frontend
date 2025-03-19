"use client";

import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Something Went Wrong | OpenSoft",
  description: "An unexpected error occurred. Please try again later or return to the homepage.",
  openGraph: {
    title: "Something Went Wrong | OpenSoft",
    description: "An unexpected error occurred. Please try again later or return to the homepage.",
    url: "https://opensoft.com/error",
    siteName: "OpenSoft",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "OpenSoft",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@OpenSoft",
    creator: "@OpenSoft",
    title: "Something Went Wrong | OpenSoft",
    description: "An unexpected error occurred. Please try again later or return to the homepage.",
    images: ["/opengraph-image.png"],
  },
};

const ErrorPage = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6">
      <div className="max-w-md text-center">
        <h3 className="mb-4 text-3xl font-bold sm:text-4xl">
          Oops! Something Went Wrong
        </h3>
        <p className="mb-8 text-base font-medium sm:text-lg">
          We encountered an issue. Please try again later.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-lg font-semibold rounded-md shadow-lg transition border border-primary"
          aria-label="Go back to homepage"
        >
          Back to Homepage
        </Link>
      </div>
    </section>
  );
};

export default ErrorPage;
