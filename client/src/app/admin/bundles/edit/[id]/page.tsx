"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useGetBundleByIdQuery, useUpdateBundleMutation } from "@/redux/features/bundle/bundleApi";
import { useGetAllFurnitureQuery } from "@/redux/features/public/publicApi";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface BundleItem {
  furnitureId: string;
  quantity: number;
}

export default function EditBundlePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bundleId = params.id as string;
  const [updateBundle] = useUpdateBundleMutation();
  const { data: bundleData, isLoading: bundleLoading } = useGetBundleByIdQuery(bundleId);
  const { data: furnitureData, isLoading: furnitureLoading } = useGetAllFurnitureQuery({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    isFeatured: false,
  });

  const [bundleItems, setBundleItems] = useState<BundleItem[]>([
    { furnitureId: "", quantity: 1 }
  ]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const furniture = furnitureData?.furniture || [];
  const bundle = bundleData?.bundle;

  // Load bundle data when it's available
  useEffect(() => {
    if (bundle) {
      setFormData({
        name: bundle.name || "",
        description: bundle.description || "",
        price: bundle.price?.toString() || "",
        isFeatured: bundle.isFeatured || false,
      });

      if (bundle.bundleItems && bundle.bundleItems.length > 0) {
        setBundleItems(bundle.bundleItems.map((item: any) => ({
          furnitureId: item.furnitureId || "",
          quantity: item.quantity || 1
        })));
      } else {
        setBundleItems([{ furnitureId: "", quantity: 1 }]);
      }

      setCurrentImageUrl(bundle.imageUrl);
    }
  }, [bundle]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addBundleItem = () => {
    setBundleItems(prev => [...prev, { furnitureId: "", quantity: 1 }]);
  };

  const removeBundleItem = (index: number) => {
    if (bundleItems.length > 1) {
      setBundleItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateBundleItem = (index: number, field: keyof BundleItem, value: string | number) => {
    setBundleItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || bundleItems.some(item => !item.furnitureId)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("isFeatured", formData.isFeatured.toString());
      formDataToSend.append("bundleItems", JSON.stringify(bundleItems));

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      await updateBundle({ id: bundleId, body: formDataToSend }).unwrap();
      toast.success("Bundle updated successfully");
      router.push(`/admin/bundles/${bundleId}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update bundle");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bundleLoading) {
    return (
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

  if (!bundle) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bundle not found</h3>
            <p className="text-gray-600 mb-4">
              The bundle you're trying to edit doesn't exist or has been removed.
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

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/admin/bundles/${bundleId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bundle
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Bundle</h1>
            <p className="text-gray-600">
              Update bundle information and items.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the basic details for your bundle.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Bundle Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Living Room Starter Pack"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("description", e.target.value)}
                    placeholder="Describe what's included in this bundle..."
                    rows={3}
                    className="w-full border rounded-md px-3 py-2 resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Bundle Price (रु) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image">Bundle Image</Label>
                  {currentImageUrl && (
                    <div className="mb-2">
                      <img
                        src={currentImageUrl}
                        alt="Current bundle image"
                        className="w-32 h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep the current image
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleInputChange("isFeatured", checked as boolean)}
                  />
                  <Label htmlFor="isFeatured">Mark as Featured</Label>
                </div>
              </CardContent>
            </Card>

            {/* Bundle Items */}
            <Card>
              <CardHeader>
                <CardTitle>Bundle Items</CardTitle>
                <CardDescription>
                  Select furniture items to include in this bundle.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bundleItems.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {bundleItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBundleItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div>
                      <Label>Furniture *</Label>
                      <select
                        value={item.furnitureId}
                        onChange={(e) => updateBundleItem(index, "furnitureId", e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select furniture...</option>
                        {furniture.map((f: any) => (
                          <option key={f.id} value={f.id}>
                            {f.title} - रु {f.dailyRate}/day
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateBundleItem(index, "quantity", parseInt(e.target.value))}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addBundleItem}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Link href={`/admin/bundles/${bundleId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Bundle
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
  );
} 