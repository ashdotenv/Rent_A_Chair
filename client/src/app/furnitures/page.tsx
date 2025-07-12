"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useGetAllFurnitureQuery } from "@/redux/features/public/publicApi";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToWishlist, removeFromWishlist } from "@/redux/features/wishlist/wishlistSlice";

const categories = [
  "ALL", "CHAIR", "DINING_SET", "SOFA", "BED", "TABLE", "CABINET", "DESK", "BOOKSHELF"
];

export default function FurnituresPage() {
  const { data, isLoading } = useGetAllFurnitureQuery();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((state) => state.wishlist.ids);

  const furniture = data?.furniture || [];
  // Extract unique colors and materials for filter options
  const colorOptions = Array.from(new Set(furniture.map((f: any) => f.color).filter(Boolean))) as string[];
  const materialOptions = Array.from(new Set(furniture.map((f: any) => f.material).filter(Boolean))) as string[];

  const filtered = useMemo(() => {
    if (!Array.isArray(furniture)) return [];
    return furniture.filter((item: any) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "ALL" || item.category === category;
      const matchesColor = !color || item.color === color;
      const matchesMaterial = !material || item.material === material;
      return matchesSearch && matchesCategory && matchesColor && matchesMaterial;
    });
  }, [furniture, search, category, color, material]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Browse Furniture</h1>
      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full max-w-xs hidden lg:block bg-white rounded-xl shadow p-6 h-fit sticky top-24">
          <div className="mb-6">
            <Input
              placeholder="Search furniture..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mb-2"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              className="w-full border rounded px-3 py-2 text-gray-700 bg-white"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Color</label>
            <select
              className="w-full border rounded px-3 py-2 text-gray-700 bg-white"
              value={color}
              onChange={e => setColor(e.target.value)}
            >
              <option value="">All</option>
              {colorOptions.map((c: string) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Material</label>
            <select
              className="w-full border rounded px-3 py-2 text-gray-700 bg-white"
              value={material}
              onChange={e => setMaterial(e.target.value)}
            >
              <option value="">All</option>
              {materialOptions.map((m: string) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <button
            className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded transition"
            onClick={() => {
              setSearch("");
              setCategory("ALL");
              setColor("");
              setMaterial("");
            }}
          >
            Clear Filters
          </button>
        </aside>
        {/* Furniture Grid */}
        <div className="flex-1">
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
              : filtered.map((item: any) => {
                  const isWishlisted = wishlistIds.includes(item.id);
                  return (
                    <div key={item.id} className="relative group">
                      <button
                        className={`absolute top-3 right-3 z-10 p-1 rounded-full bg-white shadow transition-colors ${isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (isWishlisted) {
                            dispatch(removeFromWishlist(item.id));
                          } else {
                            dispatch(addToWishlist(item.id));
                          }
                        }}
                      >
                        <Heart fill={isWishlisted ? "#ef4444" : "none"} className="h-6 w-6" />
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
                              <span className="text-xl font-bold text-[#1980E5]">रु{item.dailyRate}/day</span>
                              <span className="text-xs text-gray-400">{item.category.replace("_", " ")}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  );
                })}
          </div>
          {!isLoading && filtered.length === 0 && (
            <div className="text-center text-gray-500 mt-16 text-lg">No furniture found.</div>
          )}
        </div>
      </div>
    </div>
  );
} 