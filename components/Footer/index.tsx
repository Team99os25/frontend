import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 order-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        
        

        <div className="p-3 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Vibemeter AI - All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
