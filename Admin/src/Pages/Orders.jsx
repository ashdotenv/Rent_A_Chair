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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading orders.</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-semibold text-center mb-6">Orders</h1>

            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="py-3 px-6 text-left">Order ID</th>
                        <th className="py-3 px-6 text-left">User</th>
                        <th className="py-3 px-6 text-left">Total Price</th>
                        <th className="py-3 px-6 text-left">Status</th>
                        <th className="py-3 px-6 text-left">Payment Status</th>
                        <th className="py-3 px-6 text-left">Order Items</th>
                        <th className="py-3 px-6 text-left">Ordered Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.orders.map((order) => (
                        <tr
                            key={order.orderId}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                                setSelectedOrder(order);
                                setIsPopupOpen(true);
                            }}
                        >
                            <td className="py-3 px-6">{order.orderId}</td>
                            <td className="py-3 px-6">{order.user.fullName}</td>
                            <td className="py-3 px-6">{`$${order.totalPrice}`}</td>
                            <td className="py-3 px-6">{order.status}</td>
                            <td className="py-3 px-6">{order.paymentStatus}</td>
                            <td className="py-3 px-6">
                                {order.orderItems.map((item) => (
                                    <div key={item.orderItemId} className="mb-2">
                                        <strong>{item.furniture.name}</strong> - {item.subTotal} USD
                                    </div>
                                ))}
                            </td>
                            <td className="py-3 px-6">{new Date(order.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Popup for updating selected order */}
            {isPopupOpen && selectedOrder && (
                <div
                    id="popup-overlay"
                    onClick={closePopup}
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                >
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-semibold mb-4">Update Order: {selectedOrder.orderId}</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold">Status</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg"
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

                        <div className="mb-4">
                            <label className="block text-sm font-semibold">Payment Status</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg"
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Failed">Failed</option>
                                <option value="Refunded">Refunded</option>
                            </select>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={handleUpdateOrder}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Update Order
                            </button>
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg"
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
