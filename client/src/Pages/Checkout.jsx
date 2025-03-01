import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const Checkout = () => {
    const { totalOrderValue, myInfo } = useSelector(state => state.service)
    const dispatch = useDispatch()

    // State to hold the editable information
    const [editableInfo, setEditableInfo] = useState({
        fullName: myInfo?.fullName || '',
        email: myInfo?.email || '',
        phone: myInfo?.phone || '',
    })

    // State to hold the selected payment method
    const [paymentMethod, setPaymentMethod] = useState('stripe')

    // Handler to update state when input changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setEditableInfo(prevInfo => ({
            ...prevInfo,
            [name]: value,
        }))
    }

    // Handler to submit the updated info (e.g., dispatching the update to the store)
    const handleSubmit = (e) => {
        e.preventDefault()
        // You can dispatch an action to update the user info in the store or API
        dispatch(updateUserInfo(editableInfo))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-black">
            <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>

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
                                    value={editableInfo.fullName}
                                    onChange={handleChange}
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
                                    value={editableInfo.email}
                                    onChange={handleChange}
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
                                    value={editableInfo.phone}
                                    onChange={handleChange}
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
                                value="card"
                                checked={paymentMethod === 'cashOnDelivery'}
                                onChange={() => setPaymentMethod('cashOnDelivery')}
                                className="mr-2"
                            />
                            <label htmlFor="card" className="text-lg">Cash On Delivery</label>
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
