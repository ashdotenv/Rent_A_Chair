"use client";
import { useGetAllRentalsQuery, useUpdateRentalStatusMutation } from "@/redux/features/admin/adminApi";
import { useState } from "react";

const RENTAL_STATUS_OPTIONS = [
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
  "RENT_TO_OWN_PENDING",
  "RENT_TO_OWN_ACTIVE",
  "RENT_TO_OWN_COMPLETED",
];
const PAYMENT_STATUS_OPTIONS = [
  "SUCCESS",
  "FAILED",
  "PENDING",
  "REFUNDED",
];
const DELIVERY_STATUS_OPTIONS = [
  "PENDING",
  "SHIPPED",
  "IN_TRANSIT",
  "DELIVERED",
  "RETURNED",
  "CANCELLED",
];

export default function AdminRentalsPage() {
  const { data, isLoading, isError } = useGetAllRentalsQuery("");
  const [updateRentalStatus, { isLoading: isUpdating }] = useUpdateRentalStatusMutation();
  const rentals = data?.rentals || [];
  const [editState, setEditState] = useState<Record<string, {status?: string; paymentStatus?: string; deliveryStatus?: string}>>({});

  const handleChange = (id: string, field: "status"|"paymentStatus"|"deliveryStatus", value: string) => {
    setEditState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id: string) => {
    const { status, paymentStatus, deliveryStatus } = editState[id] || {};
    await updateRentalStatus({ id, status, paymentStatus, deliveryStatus });
    setEditState((prev) => ({ ...prev, [id]: undefined }));
  };

  return (
    <div className="py-8 w-full">
      <h1 className="text-2xl font-bold mb-6 text-[#1565C0]">All Rentals</h1>
      {isLoading ? (
        <div className="text-[#1565C0]">Loading rentals...</div>
      ) : isError ? (
        <div className="text-red-500">Failed to load rentals.</div>
      ) : rentals.length === 0 ? (
        <div className="text-gray-500">No rentals found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow bg-white w-full">
          <table className="min-w-full w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-[#1565C0] text-sm">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-white uppercase tracking-wider">User</th>
                <th className="px-4 py-2 text-left font-medium text-white uppercase tracking-wider">Furniture</th>
                <th className="px-4 py-2 text-left font-medium text-white uppercase tracking-wider">Rental Type</th>
                <th className="px-4 py-2 text-left font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left font-medium text-white uppercase tracking-wider">Payment Method</th>
                <th className="px-4 py-2 text-left font-medium text-white uppercase tracking-wider">Payment Status</th>
                <th className="px-4 py-2 text-left font-medium text-white uppercase tracking-wider">Start Date</th>
                <th className="px-4 py-2 text-left font-medium text-white uppercase tracking-wider">End Date</th>
                <th className="px-4 py-2 text-left font-medium text-white uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2 text-left font-medium text-white uppercase tracking-wider">Delivery Address</th>
                <th className="px-4 py-2 text-left font-medium text-white uppercase tracking-wider">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm">
              {rentals.map((rental: any) => {
                const isEdited = editState[rental.id] && (
                  editState[rental.id].status !== undefined ||
                  editState[rental.id].paymentStatus !== undefined ||
                  editState[rental.id].deliveryStatus !== undefined
                );
                return (
                  <tr key={rental.id}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{rental.user?.fullName || "-"}</div>
                      <div className="text-xs text-gray-500">{rental.user?.email || "-"}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{rental.furniture?.title || "-"}</div>
                      <div className="text-xs text-gray-500">{rental.furniture?.category || "-"}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">{rental.rentalType}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <select
                        className="border rounded px-2 py-1"
                        value={editState[rental.id]?.status ?? rental.status}
                        onChange={e => handleChange(rental.id, "status", e.target.value)}
                      >
                        {RENTAL_STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      {rental.paymentMethod}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <select
                        className="border rounded px-2 py-1"
                        value={editState[rental.id]?.paymentStatus ?? rental.paymentStatus}
                        onChange={e => handleChange(rental.id, "paymentStatus", e.target.value)}
                      >
                        {PAYMENT_STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">{rental.startDate ? new Date(rental.startDate).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">{rental.endDate ? new Date(rental.endDate).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">Rs. {rental.totalAmount}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      <div>
                        <div>{rental.deliveryStreet}</div>
                        <div>{rental.deliveryCity}</div>
                        <div>{rental.deliveryState}</div>
                        <div>{rental.deliveryPostalCode}</div>
                        <div>{rental.deliveryCountry}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <select
                        className="border rounded px-2 py-1"
                        value={editState[rental.id]?.deliveryStatus ?? rental.deliveryStatus}
                        onChange={e => handleChange(rental.id, "deliveryStatus", e.target.value)}
                      >
                        {DELIVERY_STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    {isEdited && (
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                          onClick={() => handleSave(rental.id)}
                          disabled={isUpdating}
                        >
                          Save
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 