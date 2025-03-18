import React from 'react'
import { useGetMyOrdersQuery } from '../Redux/Service'

const MyOrders = () => {
  const { data } = useGetMyOrdersQuery()

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">My Orders</h2>
      {data.orders && data.orders.length > 0 ? (
        data.orders.map((order) => (
          <div key={order.orderId} className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Order #{order.orderId}</h3>
              <div className="text-sm text-gray-600">
                <p>Status: <span className={`font-semibold ${order.status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>{order.status}</span></p>
                <p>Payment Status: <span className={`font-semibold ${order.paymentStatus === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>{order.paymentStatus}</span></p>
              </div>
            </div>
            <div className="mb-4 text-gray-600">
              <p>Total Price: <span className="font-semibold text-blue-600">${order.totalPrice}</span></p>
              <p className="text-sm">Created At: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-800">Order Items</h4>
              {order.orderItems.map((item) => (
                <div key={item.orderItemId} className="flex justify-between items-center border-b py-3">
                  <div className="flex items-center space-x-4">
                    <img src={item.furniture.images[0].imageUrl} alt={item.furniture.name} className="w-20 h-20 object-cover rounded-md" />
                    <div>
                      <h5 className="font-semibold text-gray-800">{item.furniture.name}</h5>
                      <p className="text-sm text-gray-500">Condition: {item.furniture.condition}</p>
                      <p className="text-sm text-gray-500">Price/Day: ${item.furniture.pricePerDay}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Days: {item.noOfDays}</p>
                    <p className="font-semibold text-gray-800">Subtotal: ${item.subTotal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  )
}

export default MyOrders
