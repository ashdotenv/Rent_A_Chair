"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useCreateBundleMutation } from "@/redux/features/bundle/bundleApi";
import { useGetAllFurnitureQuery } from "@/redux/features/public/publicApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface BundleItem {
  furnitureId: string;
  quantity: number;
}

export default function CreateBundlePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [createBundle] = useCreateBundleMutation();
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

  if (!user) {
    return null;
  }

  const furniture = furnitureData?.furniture || [];

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

      await createBundle(formDataToSend).unwrap();
      toast.success("Bundle created successfully");
      router.push("/admin/bundles");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create bundle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/bundles">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bundles
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Bundle</h1>
            <p className="text-gray-600">
              Create a new furniture bundle with multiple items.
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
                  Enter the basic details for your bundle.
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
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
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
            <Link href="/admin/bundles">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Bundle"}
            </Button>
          </div>
        </form>
      </div>
  );
} 