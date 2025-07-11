"use client";
import { useParams } from "next/navigation";
import { useGetFurnitureByIdQuery } from "@/redux/features/public/publicApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart, updateQuantity, removeFromCart } from "@/redux/features/cart/cartSlice";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useRef, useState } from "react";
import Link from "next/link";


export default function FurnitureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetFurnitureByIdQuery(id);
  const furniture = data?.furniture;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useAppSelector((state) => state.cart.items);
  const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.dailyRate, 0);

  // Mock discount logic
  const originalPrice = furniture?.originalPrice || furniture?.dailyRate * 1.3 || 0;
  const price = furniture?.dailyRate || 0;
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (!furniture) return;
    dispatch(addToCart({
      id: furniture.id,
      title: furniture.title,
      image: furniture.images?.[0]?.url || "",
      dailyRate: furniture.dailyRate,
      quantity,
    }));
    setCartOpen(true);
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError || !furniture) return <div className="p-8 text-red-500">Furniture not found.</div>;
  
  
  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Image Gallery */}
      <div>
        <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4">
          {furniture.images && furniture.images.length > 0 ? (
            <img
              src={furniture.images[selectedImage]?.url}
              alt={furniture.title}
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="text-gray-400 text-4xl">No Image</div>
          )}
        </div>
        {furniture.images && furniture.images.length > 1 && (
          <div className="flex gap-2 mt-2">
            {furniture.images.map((img: any, idx: number) => (
              <button
                key={img.id}
                className={`w-16 h-16 rounded border ${selectedImage === idx ? "border-blue-500" : "border-gray-200"} overflow-hidden focus:outline-none`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img.url} alt="thumb" className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Product Info */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{furniture.title}</h1>
        <div className="flex items-center gap-3 mb-2">
        
       
          <span className="text-2xl font-bold text-gray-900"> ₹ {furniture.dailyRate}per day</span>
          {discount > 0 && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">{discount}% off</span>
          )}
        </div>
        <div className="text-gray-500 text-sm mb-4">Shipping is calculated at checkout</div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-2 mb-6">
          <button
            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-xl"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
          >-</button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-xl"
            onClick={() => setQuantity(q => q + 1)}
          >+</button>
        </div>
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetTrigger asChild>
            <button
              className="w-full bg-gray-500 hover:bg-gray-700 text-white font-semibold py-3 rounded text-lg transition mb-6"
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle>Cart</SheetTitle>
            <div className="flex flex-col gap-4 mt-4 h-full">
              {cart.length === 0 ? (
                <div className="text-gray-500 text-center mt-8">Your cart is empty.</div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 border-b py-3">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.title}</div>
                        <div className="text-gray-600 text-sm">₹ {item.dailyRate} per day</div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-lg"
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                          >-</button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-lg"
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          >+</button>
                          <button
                            className="ml-2 text-red-500 hover:underline text-xs"
                            onClick={() => dispatch(removeFromCart(item.id))}
                          >Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹ {cartTotal}</span>
                </div>
                <button className="w-full mt-4 bg-[#1980E5] hover:bg-[#1565C0] text-white font-semibold py-2 rounded transition" >
                <Link href={"/checkout"} >Checkout</Link>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {/* Description */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-semibold">Description</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Color: {furniture.color}</li>
            <li>Color: {furniture.valuationPrice}</li>
            <li>Style: {furniture.category}</li>
            <li>Type: {furniture.material}</li>
            <li>Pattern Type: Plain</li>
            <li>Details: {furniture.dimensions}</li>
            <li>Available Quantity: {furniture.availableQuantity}</li>
            <li>Weekly Rate: ₹ {furniture.weeklyRate}</li>
            <li>Monthly Rate: ₹ {furniture.monthlyRate}</li>
            <li>Description: {furniture.description}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 