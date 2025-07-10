"use client";
import React, { useState } from "react";
import Loader from "@/components/Loader";
import { useGetAllFurnitureQuery } from "@/redux/features/public/publicApi";
import { useAddFurnitureMutation } from "@/redux/features/admin/adminApi";
import { useDeleteFurnitureMutation } from "@/redux/features/admin/adminApi";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useRouter } from "next/navigation";

function getErrorMessage(error: any) {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  if (error.data && typeof error.data === "string") return error.data;
  if (error.message) return error.message;
  if (error.error) return error.error;
  return JSON.stringify(error);
}

const initialForm = {
  title: "",
  description: "",
  category: "",
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
  images: [] as File[],
};

export default function AdminFurniturePage() {
  const { data, isLoading, isError, error, refetch } = useGetAllFurnitureQuery(undefined);
  const [addFurniture, { isLoading: isAdding, isError: isAddError, error: addError, isSuccess: isAddSuccess }] = useAddFurnitureMutation();
  const [deleteFurniture] = useDeleteFurnitureMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm((prev) => ({ ...prev, images: Array.from(e.target.files!) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const required = [
      "title", "description", "category", "material", "color", "dimensions", "availableQuantity", "dailyRate", "weeklyRate", "monthlyRate", "valuationPrice", "originalPrice", "purchaseDate", "conditionScore", "wearLevel"
    ];
    for (const key of required) {
      if (!form[key as keyof typeof form] && form[key as keyof typeof form] !== 0) {
        setFormError("Please fill all required fields.");
        return;
      }
    }
    if (!form.images.length) {
      setFormError("Please upload at least one image.");
      return;
    }
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "images") {
        (value as File[]).forEach((file) => formData.append("images", file));
      } else {
        formData.append(key, value as any);
      }
    });
    try {
      await addFurniture(formData).unwrap();
      setShowModal(false);
      setForm(initialForm);
      setTimeout(() => refetch(), 500);
    } catch (e) {
      setFormError(getErrorMessage(e));
    }
  };

  const handleDelete = async (id: string) => {
    setPendingDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (pendingDelete) {
      await deleteFurniture(pendingDelete);
      setShowDeleteModal(false);
      setPendingDelete(null);
      refetch();
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPendingDelete(null);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/furniture/edit/${id}`);
  };

  const furniture = data?.furniture || [];

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (_: any, row: any) =>
        row.images && row.images.length > 0 ? (
          <img src={row.images[0].url} alt={row.title} className="h-16 w-24 object-cover rounded" />
        ) : (
          <span className="text-gray-400">No image</span>
        ),
    },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "material", label: "Material" },
    { key: "color", label: "Color" },
    { key: "availableQuantity", label: "Available Qty" },
    { key: "dailyRate", label: "Daily Rate" },
    { key: "monthlyRate", label: "Monthly Rate" },
    {
      key: "isFeatured",
      label: "Featured",
      render: (value: boolean) => (
        <span className={value ? "text-green-600 font-bold" : "text-gray-400"}>{value ? "Yes" : "No"}</span>
      ),
    },
    {
      key: "isArchived",
      label: "Archived",
      render: (value: boolean) => (
        <span className={value ? "text-red-600 font-bold" : "text-gray-400"}>{value ? "Yes" : "No"}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button
            className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </button>
          <button
            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Furniture</h1>
        <Link href="/admin/furniture/add">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Product
          </button>
        </Link>
      </div>
      <div className="overflow-x-auto max-h-[calc(100vh-100px)] overflow-y-auto">
        <DataTable
          title=""
          description="Manage all furniture in the system."
          columns={columns}
          data={furniture}
          searchable
        />
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4">Delete Furniture</h2>
            <p className="mb-6">Are you sure you want to delete this furniture?</p>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={cancelDelete}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
