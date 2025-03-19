"use client";

const LoadingPage = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6">
      <div className="max-w-md text-center">
        <h3 className="mb-4 text-2xl font-semibold sm:text-3xl">
          Loading...
        </h3>
        <p className="mb-8 text-base  sm:text-lg">
          Please wait while we load the content for you.
        </p>
        <div className="w-12 h-12 border-4 border-[#103233]   border-t-transparent rounded-full animate-spin"></div>
      </div>
    </section>
  );
};

export default LoadingPage;
