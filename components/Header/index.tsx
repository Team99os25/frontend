"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userDetails = localStorage.getItem('UserDetails');
    setIsAuthenticated(!!userDetails);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-gray-800">
        Emolyzer
        </Link>

        <nav className="hidden md:flex space-x-6 text-gray-700">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/sessions" className="hover:text-blue-600">Sessions</Link>
        </nav>

        <div className="hidden md:flex space-x-4">
          {!isAuthenticated && (
            <Link href="/signin" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Login
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4 space-y-4">
          <Link href="/" className="block text-gray-700 hover:text-blue-600">Home</Link>
          <Link href="/sessions" className="hover:text-blue-600">Sessions</Link>
          {!isAuthenticated && (
            <Link href="/signin" className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
