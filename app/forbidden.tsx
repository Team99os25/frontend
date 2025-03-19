import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forbidden Access | OpenSoft",
  description: "You do not have the necessary permissions to view this page.",
};

const ForbiddenPage = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen  px-6">
      <div className="max-w-md text-center">
        <h3 className="mb-4 text-3xl font-bold  sm:text-4xl">
          403 - Forbidden
        </h3>
        <p className="mb-8 text-base font-medium  sm:text-lg">
          You don’t have the necessary permissions to view this page.
        </p>
        <Link href="/" className="inline-block px-6 py-3 text-lg font-semibold rounded-md shadow-lg transition border border-primary">
          Back to Homepage
        </Link>
      </div>
    </section>
  );
};

export default ForbiddenPage;
