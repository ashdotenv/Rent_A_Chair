"use client";

import { useParams } from 'next/navigation';
import { useGetFurnitureByCategoryQuery } from '../../../redux/features/public/publicApi';
import Link from 'next/link';
export default function CategoryPage() {
  const params = useParams();
  const category = params?.categoryname as string;
  category.toUpperCase()

  const { data, isLoading, isError } = useGetFurnitureByCategoryQuery(category);

  const furnitures = data?.furniture || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1565C0] mb-8 capitalize">
        {category} Furnitures
      </h1>

      {isLoading ? (
        <div className="text-center text-[#1565C0] py-16">Loading...</div>
      ) : isError ? (
        <div className="text-center text-red-500 py-16">
          Failed to load furniture for this category.
        </div>
      ) : furnitures.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          No furniture found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {furnitures.map((item) => {
            const firstImageUrl =
              Array.isArray(item.images) && item.images.length > 0
                ? item.images[0].url
                : '/no-image.png';

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center border border-[#e3eaf6] group relative"
              >
                <Link
                  href={`/furniture/${item.id}`}
                  className="w-24 h-24 mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-[#f5faff] border border-[#e3eaf6]"
                >
                  <img
                    src={firstImageUrl}
                    alt={item.title || 'Furniture Image'}
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="text-[#1565C0] font-semibold text-sm text-center line-clamp-2 mb-1">
                  {item.title}
                </div>
                <div className="text-[#1565C0] font-bold mt-1">
                  Rs. {item.dailyRate}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
