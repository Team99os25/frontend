import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unauthorized Access",
  description: "You don’t have permission to access this page. Please log in first.",
};

const UnauthorizedPage = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6">
      <div className="max-w-md text-center">
        <h3 className="mb-4 text-3xl font-bold text-black sm:text-4xl">
          401 - Unauthorized Access
        </h3>
        <p className="mb-8 text-base font-medium  sm:text-lg">
          You don’t have permission to access this page. Please log in first.
        </p>
        <Link href="/login" className="inline-block px-6 py-3 text-lg font-semibold rounded-md shadow-lg transition border border-primary">
          Go to Login
        </Link>
      </div>
    </section>
  );
};

export default UnauthorizedPage;
