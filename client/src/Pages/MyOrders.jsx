import React from 'react';
import { useGetMyOrdersQuery } from '../Redux/Service'; // Assuming this is your API query hook

const MyOrders = () => {
    const { data, isLoading, isError, error } = useGetMyOrdersQuery();

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 md:p-6">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4 md:mb-6">My Orders</h2>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg p-4 animate-pulse">
                            <div className="flex justify-between items-center mb-4">
                                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                                <div className="flex gap-2">
                                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h4>
                                <div className="space-y-4">
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-20 w-20 bg-gray-300 rounded-md"></div>
                                                <div>
                                                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
                                                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-1"></div>
                                                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div>
                                                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto p-4 md:p-6">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4 md:mb-6">My Orders</h2>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error?.message || 'Failed to fetch orders.'}</span>
                </div>
            </div>
        );
    }

    if (!data || !data.orders || data.orders.length === 0) {
        return (
            <div className="container mx-auto p-4 md:p-6">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4 md:mb-6">My Orders</h2>
                <div className="text-gray-600">No orders found.</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h2 className="text-3xl font-semibold text-blue-700 mb-6 bg-gradient-to-r from-blue-100 to-transparent">My Orders</h2>
            <div className="space-y-6">
                {data.orders.map((order) => (
                    <div key={order.orderId} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200">
                        <div className="p-4">
                            <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center gap-2 mb-4">
                                <span className="text-xl font-bold text-gray-800 order-id">
                                    Order #<span className="text-blue-600">{order.orderId}</span>
                                </span>
                                <div className="flex gap-2 flex-wrap items-center justify-end">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'
                                            }`}
                                    >
                                        Status: {order.status}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'
                                            }`}
                                    >
                                        Payment: {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm mb-4">
                                Created At: {new Date(order.createdAt).toLocaleString()}
                            </p>

                            <div className="mb-4 text-gray-600">
                                <p className="text-lg font-semibold text-blue-700">Total Price: ${order.totalPrice}</p>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h4>
                                <div className="w-full">
                                    <div className="grid grid-cols-5 gap-4 py-2 border-b border-gray-200">
                                        <div className="col-span-1 font-semibold">Image</div>
                                        <div className="col-span-2 font-semibold">Product</div>
                                        <div className="col-span-1 font-semibold text-right">Price/Day</div>
                                        <div className="col-span-1 font-semibold text-right">Subtotal</div>
                                    </div>
                                    {order.orderItems.map((item) => (
                                        <div key={item.orderItemId} className="grid grid-cols-5 gap-4 py-2 hover:bg-gray-50/50 transition-colors">
                                            <div className="col-span-1">
                                                {item.furniture?.images && item.furniture.images[0]?.imageUrl ? (
                                                    <img
                                                        src={item.furniture.images[0].imageUrl}
                                                        alt={item.furniture.name}
                                                        className="w-20 h-20 object-cover rounded-md shadow-sm border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 rounded-md flex items-center justify-center bg-gray-100 border border-gray-200">
                                                        <Image className="w-10 h-10 text-gray-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-2">
                                                <div className="font-medium text-gray-800">{item.furniture?.name || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">Condition: {item.furniture?.condition || 'N/A'}</div>
                                            </div>
                                            <div className="col-span-1 text-right">${item.furniture?.pricePerDay?.toFixed(2) || '0.00'}</div>
                                            <div className="col-span-1 text-right font-semibold">${item.subTotal.toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
