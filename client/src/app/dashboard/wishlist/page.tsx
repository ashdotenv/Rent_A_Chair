"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { removeFromWishlist } from "@/redux/features/wishlist/wishlistSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useGetAllFurnitureQuery } from "@/redux/features/public/publicApi";

export default function WishlistPage() {
  const wishlistIds = useAppSelector((state) => state.wishlist.ids);
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetAllFurnitureQuery();
  const allFurniture = data?.furniture || [];

  const wishlistedItems = useMemo(() => {
    return allFurniture.filter((item: any) => wishlistIds.includes(item.id));
  }, [allFurniture, wishlistIds]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="rounded-xl shadow-md">
                  <Skeleton className="h-48 w-full rounded-t-xl" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))
            : wishlistedItems.length > 0 ? (
                wishlistedItems.map((item: any) => (
                  <div key={item.id} className="relative group">
                    <button
                      className={`absolute top-3 right-3 z-10 p-1 rounded-full bg-white shadow transition-colors text-red-500`}
                      aria-label="Remove from wishlist"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(removeFromWishlist(item.id));
                      }}
                    >
                      <Heart fill="#ef4444" className="h-6 w-6" />
                    </button>
                    <Link href={`/furniture/${item.id}`} className="group">
                      <Card className="rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 border-0 bg-white">
                        <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                          <img
                            src={item.images?.[0]?.url || "/placeholder.jpg"}
                            alt={item.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                          />
                          {item.isFeatured && (
                            <Badge className="absolute top-2 left-2 bg-[#1980E5] text-white">Featured</Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h2 className="font-semibold text-lg mb-1 truncate">{item.title}</h2>
                          <p className="text-gray-500 text-sm mb-2 truncate">{item.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xl font-bold text-[#1980E5]">₹{item.dailyRate}/day</span>
                            <span className="text-xs text-gray-400">{item.category.replace("_", " ")}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-16 text-lg">No items in your wishlist.</div>
              )}
        </div>
      </div>
    </DashboardLayout>
  );
} 