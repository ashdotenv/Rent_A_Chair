"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return null; // or redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:pt-16 lg:h-screen lg:fixed lg:inset-y-0 lg:z-50">
        <Sidebar user={user} />
      </div>

      {/* Main content */}
      {/* Mobile header (only menu button for sidebar) */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="-m-2.5 p-2.5">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar user={user} onClose={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Page content */}
      <main className="flex-1 py-6 lg:ml-64">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 