"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { useUpdateFurnitureMutation } from "@/redux/features/admin/adminApi";
import { useGetAllFurnitureQuery } from "@/redux/features/public/publicApi";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const FURNITURE_CATEGORIES = [
  "SOFA", "BED", "TABLE", "CHAIR", "WARDROBE", "DESK", "BOOKSHELF", "DRESSER", "NIGHTSTAND", "CABINET", "OTTOMAN", "RECLINER", "BENCH", "HUTCH", "TV_STAND", "DINING_SET", "ENTRYWAY", "STORAGE", "KITCHEN_ISLAND", "VANITY", "SECTIONAL", "LOVESEAT", "FILING_CABINET", "OTHER"
];
const DEFAULT_CATEGORY = FURNITURE_CATEGORIES[0];

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  category: yup.string().oneOf(FURNITURE_CATEGORIES, "Invalid category").required("Category is required"),
  material: yup.string().required("Material is required"),
  color: yup.string().required("Color is required"),
  dimensions: yup.string().required("Dimensions are required"),
  availableQuantity: yup.number().typeError("Available Quantity must be a number").min(1).required("Available Quantity is required"),
  dailyRate: yup.number().typeError("Daily Rate must be a number").min(0).required("Daily Rate is required"),
  weeklyRate: yup.number().typeError("Weekly Rate must be a number").min(0).required("Weekly Rate is required"),
  monthlyRate: yup.number().typeError("Monthly Rate must be a number").min(0).required("Monthly Rate is required"),
  valuationPrice: yup.number().typeError("Valuation Price must be a number").min(0).required("Valuation Price is required"),
  originalPrice: yup.number().typeError("Original Price must be a number").min(0).required("Original Price is required"),
  purchaseDate: yup.string().required("Purchase Date is required"),
  conditionScore: yup.number().typeError("Condition Score must be a number").min(0).max(10).required("Condition Score is required"),
  wearLevel: yup.number().typeError("Wear Level must be a number").min(0).required("Wear Level is required"),
  tags: yup.string(),
  isFeatured: yup.boolean(),
  isArchived: yup.boolean(),
});

function getErrorMessage(error: any) {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  if (error.data && typeof error.data === "string") return error.data;
  if (error.message) return error.message;
  if (error.error) return error.error;
  return JSON.stringify(error);
}

export default function EditFurniturePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data, isLoading: isLoadingAll } = useGetAllFurnitureQuery(undefined);
  const [updateFurniture, { isLoading: isUpdating, isError: isUpdateError, error: updateError, isSuccess: isUpdateSuccess }] = useUpdateFurnitureMutation();
  const [formError, setFormError] = useState("");

  const furniture = data?.furniture?.find((f: any) => f.id === id);

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      category: DEFAULT_CATEGORY,
      material: "",
      color: "",
      dimensions: "",
      availableQuantity: 1,
      dailyRate: 0,
      weeklyRate: 0,
      monthlyRate: 0,
      valuationPrice: 0,
      originalPrice: 0,
      purchaseDate: "",
      conditionScore: 10,
      wearLevel: 0,
      tags: "",
      isFeatured: false,
      isArchived: false,
    },
  });

  useEffect(() => {
    if (furniture) {
      reset({
        ...furniture,
        purchaseDate: furniture.purchaseDate ? furniture.purchaseDate.split("T")[0] : "",
      });
    }
  }, [furniture, reset]);

  const onSubmit = async (data: any) => {
    setFormError("");
    try {
      await updateFurniture({ id, body: data }).unwrap();
      router.push("/admin/furniture");
    } catch (e) {
      setFormError(getErrorMessage(e));
    }
  };

  if (isLoadingAll || !furniture) {
    return <Loader />;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Furniture</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label>Title*</label>
          <input {...register("title") } className="border rounded px-2 py-1" />
          {errors.title && <span className="text-red-600 text-xs">{errors.title.message as string}</span>}
          <label>Description*</label>
          <textarea {...register("description") } className="border rounded px-2 py-1" />
          {errors.description && <span className="text-red-600 text-xs">{errors.description.message as string}</span>}
          <label>Category*</label>
          <select {...register("category")} className="border rounded px-2 py-1" required>
            {FURNITURE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="text-red-600 text-xs">{errors.category.message as string}</span>}
          <label>Material*</label>
          <input {...register("material") } className="border rounded px-2 py-1" />
          {errors.material && <span className="text-red-600 text-xs">{errors.material.message as string}</span>}
          <label>Color*</label>
          <input {...register("color") } className="border rounded px-2 py-1" />
          {errors.color && <span className="text-red-600 text-xs">{errors.color.message as string}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label>Dimensions*</label>
          <input {...register("dimensions") } className="border rounded px-2 py-1" />
          {errors.dimensions && <span className="text-red-600 text-xs">{errors.dimensions.message as string}</span>}
          <label>Available Quantity*</label>
          <input type="number" {...register("availableQuantity") } className="border rounded px-2 py-1" />
          {errors.availableQuantity && <span className="text-red-600 text-xs">{errors.availableQuantity.message as string}</span>}
          <label>Tags</label>
          <input {...register("tags") } className="border rounded px-2 py-1" />
          <label>Daily Rate*</label>
          <input type="number" {...register("dailyRate") } className="border rounded px-2 py-1" />
          {errors.dailyRate && <span className="text-red-600 text-xs">{errors.dailyRate.message as string}</span>}
          <label>Weekly Rate*</label>
          <input type="number" {...register("weeklyRate") } className="border rounded px-2 py-1" />
          {errors.weeklyRate && <span className="text-red-600 text-xs">{errors.weeklyRate.message as string}</span>}
          <label>Monthly Rate*</label>
          <input type="number" {...register("monthlyRate") } className="border rounded px-2 py-1" />
          {errors.monthlyRate && <span className="text-red-600 text-xs">{errors.monthlyRate.message as string}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label>Valuation Price*</label>
          <input type="number" {...register("valuationPrice") } className="border rounded px-2 py-1" />
          {errors.valuationPrice && <span className="text-red-600 text-xs">{errors.valuationPrice.message as string}</span>}
          <label>Original Price*</label>
          <input type="number" {...register("originalPrice") } className="border rounded px-2 py-1" />
          {errors.originalPrice && <span className="text-red-600 text-xs">{errors.originalPrice.message as string}</span>}
          <label>Purchase Date*</label>
          <input type="date" {...register("purchaseDate") } className="border rounded px-2 py-1" />
          {errors.purchaseDate && <span className="text-red-600 text-xs">{errors.purchaseDate.message as string}</span>}
          <label>Condition Score*</label>
          <input type="number" {...register("conditionScore") } className="border rounded px-2 py-1" />
          {errors.conditionScore && <span className="text-red-600 text-xs">{errors.conditionScore.message as string}</span>}
          <label>Wear Level*</label>
          <input type="number" {...register("wearLevel") } className="border rounded px-2 py-1" />
          {errors.wearLevel && <span className="text-red-600 text-xs">{errors.wearLevel.message as string}</span>}
        </div>
        <div className="col-span-3 flex flex-col gap-2">
          {formError && <div className="text-red-600 text-center">{formError}</div>}
          {isUpdateError && <div className="text-red-600 text-center">{getErrorMessage(updateError)}</div>}
          {isUpdateSuccess && <div className="text-green-600 text-center">Furniture updated successfully!</div>}
        </div>
        <div className="col-span-3 flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200"
            onClick={() => router.push("/admin/furniture")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={isUpdating}
          >
            {isUpdating ? <Loader size={20} /> : "Update Furniture"}
          </button>
        </div>
      </form>
    </div>
  );
} 