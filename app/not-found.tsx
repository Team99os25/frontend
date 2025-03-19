import { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Page Not Found",
  description: "Oops! The page you are looking for does not exist.",
  openGraph: {
    title: "Page Not Found ",
    description: "Oops! The page you are looking for does not exist.",
    url: "https://opensoft.com/404",
    siteName: "",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "OpenSoft" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@opensoft",
    creator: "@opensoft",
    title: "Page Not Found | ",
    description: "Oops! The page you are looking for does not exist.",
    images: ["/opengraph-image.png"],
  },
};

const NotFoundPage = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100  px-6">
      <div className="max-w-md text-center">
        <h3 className="mb-4 text-3xl font-bold text-black  sm:text-4xl">
          404 - Page Not Found
        </h3>
        <p className="mb-8 text-base font-medium text-body-color  sm:text-lg">
          The page you were looking for may have been moved, deleted, or doesn’t exist.
        </p>
        <Link href="/" className="inline-block px-6 py-3 text-lg font-semibold rounded-md shadow-lg transition border border-primary">
          Back to Homepage
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
