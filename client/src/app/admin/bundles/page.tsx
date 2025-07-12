"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useGetAllBundlesQuery, useDeleteBundleMutation } from "@/redux/features/bundle/bundleApi";
import { Package, Plus, Edit, Trash2, Eye, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function BundlesPage() {
  const { user } = useAuth();
  const [deleteBundle] = useDeleteBundleMutation();
  const { data: bundlesData, isLoading, refetch } = useGetAllBundlesQuery({});

  if (!user) {
    return null;
  }

  const handleDeleteBundle = async (bundleId: string) => {
    try {
      await deleteBundle(bundleId).unwrap();
      toast.success("Bundle deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete bundle");
    }
  };

  const bundles = bundlesData?.bundles || [];

    return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <Link href="/admin" className="hover:text-gray-700 hover:underline">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Bundles</span>
      </nav>

      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Furniture Bundles</h1>
            <p className="text-gray-600">
              Manage furniture bundles and package deals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/admin/bundles">
              <Button variant="outline" size="sm">
                <Package className="h-4 w-4 mr-2" />
                All Bundles
              </Button>
            </Link>
            <Link href="/admin/bundles/create">
              <Button className="bg-[#1980E5] hover:bg-[#1980E5]/90">
                <Plus className="mr-2 h-4 w-4" />
                Create Bundle
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : bundles.length > 0 ? (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Bundles</p>
                      <p className="text-2xl font-bold text-gray-900">{bundles.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Featured</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {bundles.filter((b: any) => b.isFeatured).length}
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-sm font-bold">★</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Items</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {bundles.reduce((sum: number, b: any) => sum + (b.bundleItems?.length || 0), 0)}
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-bold">📦</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900">
                        रु {bundles.reduce((sum: number, b: any) => sum + b.price, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm font-bold">₹</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle: any) => (
              <Card key={bundle.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {bundle.imageUrl ? (
                    <img
                      src={bundle.imageUrl}
                      alt={bundle.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {bundle.isFeatured && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{bundle.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {bundle.description || "No description available"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-bold text-lg text-[#1980E5]">
                        रु {bundle.price}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Items:</span>
                      <span className="font-medium">
                        {bundle.bundleItems?.length || 0} items
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex gap-2">
                        <Link href={`/admin/bundles/${bundle.id}`}>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/admin/bundles/edit/${bundle.id}`}>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteBundle(bundle.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                      {/* Quick Links */}
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Created: {new Date(bundle.createdAt).toLocaleDateString()}</span>
                          <Link 
                            href={`/admin/bundles/${bundle.id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bundles found</h3>
              <p className="text-gray-600 mb-4">
                Create your first furniture bundle to get started.
              </p>
              <Link href="/admin/bundles/create">
                <Button className="bg-[#1980E5] hover:bg-[#1980E5]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Bundle
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions Footer */}
        {bundles.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {bundles.length} bundle{bundles.length !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-3">
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <Link href="/admin/bundles">
                  <Button variant="ghost" size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    All Bundles
                  </Button>
                </Link>
                <Link href="/admin/bundles/create">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Bundle
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
  );
} 