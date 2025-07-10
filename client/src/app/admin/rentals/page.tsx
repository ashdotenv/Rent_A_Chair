"use client";
import { useGetAllRentalsQuery } from "@/redux/features/admin/adminApi";

export default function AdminRentalsPage() {
  const { data, isLoading, isError } = useGetAllRentalsQuery();
  const rentals = data?.rentals || [];

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
              {rentals.map((rental: any) => (
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
                    <span className={
                      rental.status === "ACTIVE"
                        ? "text-green-600 font-semibold"
                        : rental.status === "PENDING"
                          ? "text-yellow-600 font-semibold"
                          : rental.status === "COMPLETED"
                            ? "text-blue-600 font-semibold"
                            : "text-gray-600 font-semibold"
                    }>
                      {rental.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">{rental.paymentMethod}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={
                      rental.paymentStatus === "SUCCESS"
                        ? "text-green-600 font-semibold"
                        : rental.paymentStatus === "PENDING"
                          ? "text-yellow-600 font-semibold"
                          : rental.paymentStatus === "FAILED"
                            ? "text-red-600 font-semibold"
                            : "text-gray-600 font-semibold"
                    }>
                      {rental.paymentStatus}
                    </span>
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
                    <span className={
                      rental.deliveryStatus === "DELIVERED"
                        ? "text-green-600 font-semibold"
                        : rental.deliveryStatus === "PENDING"
                          ? "text-yellow-600 font-semibold"
                          : rental.deliveryStatus === "FAILED"
                            ? "text-red-600 font-semibold"
                            : "text-gray-600 font-semibold"
                    }>
                      {rental.deliveryStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 