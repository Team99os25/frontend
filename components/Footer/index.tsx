import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 text-left">
          
          <div className="flex flex-col items-start">
            <h3 className="text-2xl font-bold text-gray-800">Vibemeter AI</h3>
            <p className="mt-2 text-gray-600 max-w-xs">
              AI-powered insights to enhance employee well-being and engagement.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <h4 className="text-lg font-semibold text-gray-800">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-gray-600">
              <li><Link href="/" className="hover:text-black transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-black transition">About</Link></li>
            </ul>
          </div>


        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Vibemeter AI - All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
