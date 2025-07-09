import React, { useState, useEffect } from 'react';
import { useGetAllOrdersQuery, useUpdateOrderMutation } from '../Redux/Service';

const Orders = () => {
    const { data, error, isLoading, refetch } = useGetAllOrdersQuery();
    const [updateOrder, updateOrderData] = useUpdateOrderMutation();

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [status, setStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleUpdateOrder = async () => {
        if (selectedOrder && (status || paymentStatus)) {
            const updatedOrderData = {
                status: status || selectedOrder.status,
                paymentStatus: paymentStatus || selectedOrder.paymentStatus,
            };

            await updateOrder({
                OrderId: selectedOrder.orderId,
                body: updatedOrderData,
            });

            // Refetch orders after the update to reflect the changes
            refetch();

            setIsPopupOpen(false); // Close popup after update
        }
    };

    const closePopup = (e) => {
        if (e.target.id === 'popup-overlay') {
            setIsPopupOpen(false);
        }
    };

    useEffect(() => {
        if (selectedOrder) {
            setStatus(selectedOrder.status);
            setPaymentStatus(selectedOrder.paymentStatus);
        }
    }, [selectedOrder]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500">
            Error loading orders.
        </div>;
    }

    return (
        <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-semibold text-center mb-4 md:mb-6 text-gray-800">Orders</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="py-2 md:py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">Order ID</th>
                            <th className="py-2 md:py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">User</th>
                            <th className="py-2 md:py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">Total Price</th>
                            <th className="py-2 md:py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">Status</th>
                            <th className="py-2 md:py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">Payment Status</th>
                            <th className="py-2 md:py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">Order Items</th>
                            <th className="py-2 md:py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">Ordered Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.orders?.map((order) => (
                            <tr
                                key={order.orderId}
                                className="border-b hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                onClick={() => {
                                    setSelectedOrder(order);
                                    setIsPopupOpen(true);
                                }}
                            >
                                <td className="py-2 md:py-3 px-4 md:px-6 text-xs md:text-sm">{order.orderId}</td>
                                <td className="py-2 md:py-3 px-4 md:px-6 text-xs md:text-sm">{order.user.fullName}</td>
                                <td className="py-2 md:py-3 px-4 md:px-6 text-xs md:text-sm">{`$${order.totalPrice}`}</td>
                                <td className="py-2 md:py-3 px-4 md:px-6 text-xs md:text-sm">{order.status}</td>
                                <td className="py-2 md:py-3 px-4 md:px-6 text-xs md:text-sm">{order.paymentStatus}</td>
                                <td className="py-2 md:py-3 px-4 md:px-6 text-xs md:text-sm">
                                    {order.orderItems.map((item) => (
                                        <div key={item.orderItemId} className="mb-1 md:mb-2">
                                            <strong className="font-medium text-xs md:text-sm">{item.furniture.name}</strong> - {item.subTotal} USD
                                        </div>
                                    ))}
                                </td>
                                <td className="py-2 md:py-3 px-4 md:px-6 text-xs md:text-sm">
                                    {new Date(order.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Popup for updating selected order */}
            {isPopupOpen && selectedOrder && (
                <div
                    id="popup-overlay"
                    onClick={closePopup}
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                >
                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-semibold mb-3 md:mb-4 text-gray-800">Update Order: {selectedOrder.orderId}</h2>

                        <div className="mb-3 md:mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                            <select
                                className="w-full px-4 py-2 border rounded-md"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Canceled">Canceled</option>
                            </select>
                        </div>

                        <div className="mb-4 md:mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Status</label>
                            <select
                                className="w-full px-4 py-2 border rounded-md"
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Failed">Failed</option>
                                <option value="Refunded">Refunded</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleUpdateOrder}
                                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 px-4 py-2 rounded-md font-semibold text-sm"
                            >
                                Update Order
                            </button>
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 px-4 py-2 rounded-md font-semibold text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
