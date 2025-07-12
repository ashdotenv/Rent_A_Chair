"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useGetBundleByIdQuery, useDeleteBundleMutation } from "@/redux/features/bundle/bundleApi";
import { Package, Edit, Trash2, ArrowLeft, Calendar, DollarSign, Tag } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function BundleViewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bundleId = params.id as string;
  const [deleteBundle] = useDeleteBundleMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: bundleData, isLoading, error } = useGetBundleByIdQuery(bundleId);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !bundleData?.bundle) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bundle not found</h3>
            <p className="text-gray-600 mb-4">
              The bundle you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/admin/bundles">
              <Button className="bg-[#1980E5] hover:bg-[#1980E5]/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Bundles
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const bundle = bundleData.bundle;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBundle(bundleId).unwrap();
      toast.success("Bundle deleted successfully");
      router.push("/admin/bundles");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete bundle");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/bundles">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bundles
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{bundle.name}</h1>
              <p className="text-gray-600">
                Bundle details and management
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/bundles/edit/${bundle.id}`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Bundle
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Bundle"}
            </Button>
          </div>
        </div>

        {/* Bundle Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image and Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Bundle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {bundle.imageUrl ? (
                  <img
                    src={bundle.imageUrl}
                    alt={bundle.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Price:</span>
                  <span className="font-bold text-xl text-[#1980E5]">
                    रु {bundle.price}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <Badge variant={bundle.isFeatured ? "default" : "secondary"}>
                    {bundle.isFeatured ? "Featured" : "Regular"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Items:</span>
                  <span className="font-medium">
                    {bundle.bundleItems?.length || 0} items
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Created:</span>
                  <span className="text-sm text-gray-500">
                    {formatDate(bundle.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Updated:</span>
                  <span className="text-sm text-gray-500">
                    {formatDate(bundle.updatedAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description and Items */}
          <div className="space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {bundle.description || "No description available for this bundle."}
                </p>
              </CardContent>
            </Card>

            {/* Bundle Items */}
            <Card>
              <CardHeader>
                <CardTitle>Bundle Items</CardTitle>
                <CardDescription>
                  Furniture items included in this bundle
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bundle.bundleItems && bundle.bundleItems.length > 0 ? (
                  <div className="space-y-4">
                    {bundle.bundleItems.map((item: any, index: number) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.furniture?.images?.[0]?.url ? (
                            <img
                              src={item.furniture.images[0].url}
                              alt={item.furniture.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.furniture?.title || "Unknown Furniture"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.furniture?.category?.replace("_", " ") || "Unknown Category"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            Qty: {item.quantity}
                          </div>
                          <div className="text-sm text-gray-500">
                            रु {item.furniture?.dailyRate || 0}/day
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No items in this bundle</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Bundle</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>"{bundle.name}"</strong>? 
                This will permanently remove the bundle and all its associated data.
              </p>
              
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Bundle"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 