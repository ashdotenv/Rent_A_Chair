"use client"
import Link from "next/link";
import { useGetFeaturedProductsQuery } from "../redux/features/public/publicApi";
import Image from "next/image";
import Logo from "../../public/Logo.png"
export default function HomePage() {
  const { data, isLoading, isError } = useGetFeaturedProductsQuery(1);
  const featured = data?.furniture || [];

  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Blob Animation */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] z-0 animate-blob">
        <div className="w-full h-full bg-[#1565C0] opacity-20 rounded-full blur-3xl mix-blend-multiply" />
      </div>
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] z-0 animate-blob2">
        <div className="w-full h-full bg-[#1565C0] opacity-10 rounded-full blur-2xl mix-blend-multiply" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-[#1565C0] mb-4 drop-shadow-lg">Rent A Chair</h1>

          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Find the perfect chair for your event. We offer a wide selection of comfortable and stylish Furnitures for rent.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/services"
              className="bg-[#1565C0] hover:bg-[#104a8c] text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 shadow"
            >
              Browse Services
            </Link>
            <Link
              href="/locations"
              className="border border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 shadow"
            >
              View Locations
            </Link>
          </div>
        </div>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1565C0]">Featured Products</h2>
        </div>
        {isLoading ? (
          <div className="text-center text-[#1565C0] py-16">Loading featured products...</div>
        ) : isError ? (
          <div className="text-center text-red-500 py-16">Failed to load featured products.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {featured.slice(0, 16).map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center border border-[#e3eaf6] group relative"
              >
                <div className="w-24 h-24 mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-[#f5faff] border border-[#e3eaf6]">
                  {item.images && item.images.length > 0 ? (
                    <Link href={`/furniture/${item.id}`}>
                      <img
                        src={item.images[0].url}
                        alt={item.title}
                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  ) : (
                    <span className="text-gray-300 text-3xl">?</span>
                  )}
                </div>
                <div className="text-[#1565C0] font-semibold text-sm text-center line-clamp-2 mb-1">{item.title}</div>
                <div className="text-gray-700 text-xs">{item.category}</div>
                <div className="text-[#1565C0] font-bold mt-1">Rs. {item.dailyRate}</div>
              </div>
            ))}
          </div>
        )}
        {/* Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#1565C0] mb-6 text-center">Our Wide Range of Varieties</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {/* SOFA */}
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center border border-[#e3eaf6] group">
              <div className="w-24 h-24 mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-[#f5faff] border border-[#e3eaf6]">
                <img src="https://m.media-amazon.com/images/I/51kPly+Jm7L._AC_US750_.jpg" alt="Sofa" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="text-[#1565C0] font-semibold text-sm text-center">Sofa</div>
            </div>
            {/* BED */}
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center border border-[#e3eaf6] group">
              <div className="w-24 h-24 mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-[#f5faff] border border-[#e3eaf6]">
                <img src="https://images-cdn.ubuy.co.in/6366357bc8e6f5565479065a-queen-size-storage-bed-btmway-modern.jpg" alt="Bed" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="text-[#1565C0] font-semibold text-sm text-center">Bed</div>
            </div>
            {/* TABLE */}
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center border border-[#e3eaf6] group">
              <div className="w-24 h-24 mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-[#f5faff] border border-[#e3eaf6]">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDgLG7rQoAI5IDWnm9Wb0LMbl_D7_Lwx5CJA&s" alt="Table" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="text-[#1565C0] font-semibold text-sm text-center">Table</div>
            </div>
            {/* CHAIR */}
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center border border-[#e3eaf6] group">
              <div className="w-24 h-24 mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-[#f5faff] border border-[#e3eaf6]">
                <img src="https://kursinepal.com/wp-content/uploads/2022/08/IMG_0871.jpg" alt="Chair" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="text-[#1565C0] font-semibold text-sm text-center">Chair</div>
            </div>
            {/* WARDROBE */}
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center border border-[#e3eaf6] group">
              <div className="w-24 h-24 mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-[#f5faff] border border-[#e3eaf6]">
                <img src="https://i5.walmartimages.com/seo/KULAGAGA-Large-Wardrobe-Closet-4-Door-Armoire-Storage-Cabinet-with-Hanging-Rods-and-Shelves-for-Bedroom-White_a100a7a7-694b-41c4-b477-53fa4544584e.5eb4d39736fedb655128e2974e86e35c.jpeg" alt="Wardrobe" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="text-[#1565C0] font-semibold text-sm text-center">Wardrobe</div>
            </div>
            {/* DESK */}
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center border border-[#e3eaf6] group">
              <div className="w-24 h-24 mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-[#f5faff] border border-[#e3eaf6]">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5ps0t-ecjLXYZcBnuYG4ws507jil1HwBWtw&s" alt="Desk" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="text-[#1565C0] font-semibold text-sm text-center">Desk</div>
            </div>
            {/* BOOKSHELF */}
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center border border-[#e3eaf6] group">
              <div className="w-24 h-24 mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-[#f5faff] border border-[#e3eaf6]">
                <img src="https://www.krovelmade.com/cdn/shop/files/floating-bookshelf-in-white-oak-bookshelves-krovel-38471450263712.jpg?v=1730271546" alt="Bookshelf" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="text-[#1565C0] font-semibold text-sm text-center">Bookshelf</div>
            </div>
            {/* DRESSER */}
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center border border-[#e3eaf6] group">
              <div className="w-24 h-24 mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-[#f5faff] border border-[#e3eaf6]">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMD3QHi1fCgRJJax7SFxGM64S3UJjQOyFYVg&s" alt="Dresser" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="text-[#1565C0] font-semibold text-sm text-center">Dresser</div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="relative z-10 bg-[#1565C0] text-white mt-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Rent A Chair</h3>
            <p className="text-sm text-blue-100 max-w-xs">
              Making your events comfortable and stylish. Rent premium chairs and furniture for any occasion.
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
      {/* Blob Animation Keyframes */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1, 0.9) translate(30px, -20px); }
          66% { transform: scale(0.9, 1.1) translate(-20px, 30px); }
        }
        .animate-blob { animation: blob 12s infinite linear alternate; }
        .animate-blob2 { animation: blob 14s infinite linear alternate-reverse; }
      `}</style>
    </div>
  );
}