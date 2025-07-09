import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCreateKhaltiPaymentMutation, useGetKhaltiPaymentDetailsQuery, useGetProductByIdQuery, usePlaceOrderMutation, useVerifyKhaltiPaymentMutation } from '../Redux/Service'
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
const Checkout = () => {
    const [totalOrderValue, setTotalOrderValue] = useState(0)
    const { myInfo } = useSelector(state => state.service)
    const dispatch = useDispatch()
    const [paymentMethod, setPaymentMethod] = useState('stripe')
    const [placeOrder, placeOrderData] = usePlaceOrderMutation()
    const navigate = useNavigate()
    const [createKhaltiPayment, { data: khaltiCreateData, isLoading: isKhaltiCreating }] = useCreateKhaltiPaymentMutation()
    const [verifyKhaltiPayment, { data: khaltiVerifyData, isLoading: isKhaltiVerifying }] = useVerifyKhaltiPaymentMutation()
    const [khaltiPaymentId, setKhaltiPaymentId] = useState(null)
    useGetKhaltiPaymentDetailsQuery()
    // Calculate the total order value from order_summary in localStorage
    useEffect(() => {
        const orderSummary = JSON.parse(localStorage.getItem('order_summary')) || []
        const total = orderSummary.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
        setTotalOrderValue(total)
    }, [])
    // Handler to submit the updated info (e.g., dispatching the update to the store)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the order summary exists
        const orderData = JSON.parse(localStorage.getItem("order_summary"));
        if (!orderData || orderData.length === 0) {
            console.error("Order summary is empty!");
            return;
        }

        // Get form data
        const formData = new FormData(e.target);
        const obj = Object.fromEntries(formData.entries());
        // Check if obj contains the expected values (user info)
        const data = { userData: obj, orderData: orderData, }
        // Dispatch placeOrder action with the obj and orderData
        try {
            const order = await placeOrder(data).unwrap();  // .unwrap() gives us access to the response or error
            navigate("/profile/myOrders")
        } catch (error) {
            console.error("Failed to place order:", error);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-black">
            <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>

                {/* Product Summary Section */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Your Order Summary</h2>
                    {JSON.parse(localStorage.getItem('order_summary'))?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                            <div className="flex items-center">
                                <img src={item.picture} alt={item.name} className="w-20 h-20 object-cover rounded-lg mr-4" />
                                <div>
                                    <p className="font-semibold text-lg">{item.name}</p>
                                    <p className="text-gray-600">Qty: {item.quantity}</p>
                                    <p className="text-gray-600">Price per day: ${item.pricePerDay}</p>
                                </div>
                            </div>
                            <p className="font-semibold text-lg">${item.totalPrice}</p>
                        </div>
                    ))}
                </div>

                {/* Editable Form */}
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-4">
                        <div className="w-full">
                            <h2 className="text-xl mb-4">Billing Information</h2>

                            {/* Full Name Input */}
                            <div className="mb-6">
                                <label htmlFor="fullName" className="block text-lg">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    className="w-full p-2 rounded-lg mt-2 border border-gray-300"
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-lg">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full p-2 rounded-lg mt-2 border border-gray-300"
                                    required
                                />
                            </div>

                            {/* Phone Input */}
                            <div className="mb-6">
                                <label htmlFor="phone" className="block text-lg">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="w-full p-2 rounded-lg mt-2 border border-gray-300"
                                />
                            </div>
                            {/* Phone Input */}
                            <div className="mb-6">
                                <label htmlFor="address" className="block text-lg">Address</label>
                                <input
                                    name="address"
                                    className="w-full p-2 rounded-lg mt-2 border border-gray-300"
                                />
                            </div>
                        </div>

                        <div className="text-right w-1/3">
                            <h2 className="text-xl">Total Order Value</h2>
                            <p className="text-2xl font-semibold">${totalOrderValue}</p>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="mb-6">
                        <h2 className="text-xl mb-4">Payment Method</h2>
                        <div className="flex items-center mb-4">
                            <input
                                type="radio"
                                id="stripe"
                                name="paymentMethod"
                                value="stripe"
                                checked={paymentMethod === 'stripe'}
                                onChange={() => setPaymentMethod('stripe')}
                                className="mr-2"
                            />
                            <label htmlFor="stripe" className="text-lg">Stripe</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="khalti"
                                name="paymentMethod"
                                value="khalti"
                                checked={paymentMethod === 'khalti'}
                                onChange={() => setPaymentMethod('khalti')}
                                className="mr-2"
                            />
                            <label htmlFor="khalti" className="text-lg">Khalti</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="card"
                                name="paymentMethod"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                                className="mr-2"
                            />
                            <label htmlFor="card" className="text-lg">Credit Card</label>
                        </div>
                        <div className="flex items-center mt-4">
                            <input
                                type="radio"
                                id="cashOnDelivery"
                                name="paymentMethod"
                                value="cashOnDelivery"
                                checked={paymentMethod === 'cashOnDelivery'}
                                onChange={() => setPaymentMethod('cashOnDelivery')}
                                className="mr-2"
                            />
                            <label htmlFor="cashOnDelivery" className="text-lg">Cash On Delivery</label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-between">
                        <button
                            type="submit"
                            className="w-1/2 bg-[#1980E5] text-white font-semibold py-2 rounded-lg hover:bg-[#156fa3] transition duration-300"
                        >
                            Place Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Checkout
