"use client";

import { useState } from "react";
import Head from "next/head";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }
    if (!validateEmail(email)) {
      setMessage("Invalid email format");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, type: "coming-soon" }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Added successfully!");
        setEmail("");
      } else {
        setMessage(data.error || "Adding to notification failed.");
      }
    } catch (error) {
      setMessage(`An error occurred. Please try again. ERROR: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 px-6 py-28">
      <Head>
        <title>Coming Soon</title>
        <meta name="description" content="Something amazing is coming soon!" />
      </Head>

      <div className="relative text-center z-10 sm:px-6 md:px-10 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-800">
          Coming Soon
        </h1>

        <p className="text-xl md:text-2xl mb-8 sm:mb-12 px-8 sm:px-12 py-4 text-gray-600 font-semibold">
          Something amazing is on its way. Stay tuned!
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 w-64 focus:ring-2 focus:ring-[#103233] focus:border-[#103233]"
          />
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#103233] text-white rounded-lg font-semibold transition-all duration-300 ease-out hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Notify Me"}
          </button>
        </div>

        {message && (
          <p className="mt-4 text-sm text-[#103233] font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
}
