"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-white text-black px-6 py-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        
        <div className="text-center md:text-left max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Revolutionizing Employee Well-Being with  
            <span className="text-black border-b-4 border-gray-900"> Emolyzer</span>
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            AI-driven insights to track moods, enhance engagement, and build a thriving work culture.
          </p>
          <div className="mt-6 flex justify-center md:justify-start">
            <Link 
              href="/signin" 
              className="rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        <div className="mt-10 md:mt-0 w-full flex justify-center md:justify-end">
          <div className="relative w-full">
            <Image
              src="/images/Hero/intro.jpg"
              alt="Vibemeter AI Bot"
              layout="intrinsic"
              width={1400}  
              height={900}   
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}