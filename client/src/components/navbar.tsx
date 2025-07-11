"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  User,
  LogOut,
  Settings,
  Home,
  Calendar,
  MapPin,
  Menu,
  X,
  ShoppingCart
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { logout, selectUser, selectIsAuthenticated } from "@/redux/features/auth/authSlice"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { updateQuantity, removeFromCart } from "@/redux/features/cart/cartSlice";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const cart = useAppSelector((state) => state.cart.items);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.dailyRate, 0);

  const handleLogout = () => {
    dispatch(logout())
    setIsPopoverOpen(false)
    toast.success("Logged out successfully")
    router.push('/')
  }

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Browse Furniture", href: "/furnitures", icon: Calendar },
    { name: "About", href: "/about", icon: User },
    { name: "Contact", href: "/contact", icon: User },
  ];

  // Extra links for authenticated users


  // Admin link
  const isAdmin = user?.role === "ADMIN";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#1980E5] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RC</span>
              </div>
              <span className="text-xl font-bold text-black">Rent A Chair</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-[#1980E5] transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-[#1980E5] transition-colors duration-200 font-medium"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons + Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative p-2 rounded hover:bg-gray-100 transition">
                  <ShoppingCart className="h-6 w-6 text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{cartCount}</span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle>Cart</SheetTitle>
                <div className="flex flex-col gap-4 mt-4 h-full">
                  {cart.length === 0 ? (
                    <div className="text-gray-500 text-center mt-8">Your cart is empty.</div>
                  ) : (
                    <>
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
                      <div className="mt-4 border-t pt-4">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>₹ {cartTotal}</span>
                        </div>
                        <Link href="/checkout" className="block w-full mt-4">
                          <span className="w-full inline-block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition">Go to Checkout</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-[#1980E5]">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#1980E5] hover:bg-[#1565C0] text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#1980E5]"
                  >
                    <div className="w-8 h-8 bg-[#1980E5] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.fullName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden lg:block">{user?.fullName}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="end">
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#1980E5] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user?.fullName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="p-2">
                    <Link href="/dashboard">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={() => setIsPopoverOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link href="/admin">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm"
                          onClick={() => setIsPopoverOpen(false)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={() => setIsPopoverOpen(false)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                  <Separator />
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-[#1980E5] transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:text-[#1980E5] transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 text-gray-700 hover:text-[#1980E5] transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <Separator className="my-2" />

              {!isAuthenticated ? (
                <div className="space-y-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:text-[#1980E5]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      className="w-full bg-[#1980E5] hover:bg-[#1565C0] text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Separator />
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-red-600 hover:text-red-700"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 