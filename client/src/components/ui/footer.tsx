import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#1565C0] text-white mt-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold mb-2">Rent A Chair</h3>
          <p className="text-sm text-blue-100 max-w-xs">
            Making your life comfortable and stylish. Rent premium furniture for any usage.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
          <div>
            <h4 className="font-semibold mb-1">Quick Links</h4>
            <ul className="space-y-1 text-blue-100 text-sm">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              <li><Link href="/services" className="hover:underline">Services</Link></li>
              <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Follow Us</h4>
            <ul className="space-y-1 text-blue-100 text-sm">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-blue-800 text-center py-4 text-blue-100 text-xs bg-[#1452a0]">
        &copy; {new Date().getFullYear()} Rent A Chair. All rights reserved.
      </div>
    </footer>
  );
} 