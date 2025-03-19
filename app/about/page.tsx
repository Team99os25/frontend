"use client";

export default function About() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          About Vibemeter AI
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Vibemeter AI is a smart conversation bot designed to enhance employee experience by analyzing sentiment, 
          gathering insights, and providing actionable feedback. It connects with employees, understands their concerns, 
          and delivers meaningful reports to improve workplace well-being.
        </p>
        <p className="mt-4 text-gray-700 text-lg leading-relaxed">
          Using AI-driven analytics, our system detects employee engagement levels, correlates them with key business metrics, 
          and ensures timely interventions to foster a positive and productive work culture.
        </p>
      </div>
    </section>
  );
}
