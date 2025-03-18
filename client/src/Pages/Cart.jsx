import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { removeFromCart } from '../Redux/slice';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cartItems } = useSelector(state => state.service);
    const dispatch = useDispatch();

    const removeItem = (product) => {
        dispatch(removeFromCart(product));
    };

    const [daysAndQuantity, setDaysAndQuantity] = useState(cartItems.map(item => ({
        id: item.FurnitureId,
        days: 1,
        quantity: 1
    })));

    const [totalOrderValue, setTotalOrderValue] = useState(0);
    const [bundle, setBundle] = useState(null);

    const handleChangeDays = (id, operation) => {
        setDaysAndQuantity(prevState => prevState.map(item =>
            item.id === id
                ? { ...item, days: operation === 'increment' ? item.days + 1 : Math.max(1, item.days - 1) }
                : item
        ));
    };

    const handleChangeQuantity = (id, operation) => {
        setDaysAndQuantity(prevState => prevState.map(item =>
            item.id === id
                ? { ...item, quantity: operation === 'increment' ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
                : item
        ));
    };

    const storeOrderSummary = () => {
        const orderSummary = cartItems.map(item => {
            const { days, quantity } = daysAndQuantity.find(d => d.id === item.FurnitureId) || { days: 1, quantity: 1 };
            return {
                productId: item.FurnitureId,
                totalDays: days,
                quantity: quantity,
                pricePerDay: item.pricePerDay, // Include product price
                totalPrice: item.pricePerDay * days * quantity, // Calculate total price for the item
                picture: item.images[0]?.imageUrl
                , name: item.name
            };
        });

        localStorage.setItem('order_summary', JSON.stringify(orderSummary));
    };


    useEffect(() => {
        const totalValue = cartItems.reduce((total, item) => {
            const { days, quantity } = daysAndQuantity.find(d => d.id === item.FurnitureId) || { days: 1, quantity: 1 };
            return total + (item.pricePerDay * days * quantity);
        }, 0);
        setTotalOrderValue(totalValue);

        // Store order summary in local storage
        storeOrderSummary();
    }, [cartItems, daysAndQuantity]);

    const createBundle = () => {
        if (cartItems.length >= 2) {
            setBundle({
                name: "Furniture Bundle",
                discount: 0.1,
                totalValue: totalOrderValue * 0.9,
                items: cartItems
            });
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
            <div className="space-y-4">
                {cartItems.length === 0 ? (
                    <p className="text-center text-gray-500">Your cart is empty</p>
                ) : (
                    cartItems.map((item) => {
                        const { days, quantity } = daysAndQuantity.find(d => d.id === item.FurnitureId) || { days: 1, quantity: 1 };
                        return (
                            <div key={item.FurnitureId} className="flex items-center justify-between p-4 border rounded-lg shadow-lg">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={item.images[0]?.imageUrl}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <div>
                                        <h3 className="text-lg font-medium">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.category.name}</p>
                                        <p className="text-sm">{item.condition}</p>
                                        <p className="text-sm text-gray-600">{item.material}</p>
                                        <p className="text-sm text-gray-600">Dimensions: {item.dimensions}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            className="text-xl text-gray-500 hover:text-gray-700"
                                            onClick={() => handleChangeDays(item.FurnitureId, 'decrement')}
                                        >
                                            <FaMinus />
                                        </button>
                                        <span className="font-medium text-lg">{days} days</span>
                                        <button
                                            className="text-xl text-gray-500 hover:text-gray-700"
                                            onClick={() => handleChangeDays(item.FurnitureId, 'increment')}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            className="text-xl text-gray-500 hover:text-gray-700"
                                            onClick={() => handleChangeQuantity(item.FurnitureId, 'decrement')}
                                        >
                                            <FaMinus />
                                        </button>
                                        <span className="font-medium text-lg">{quantity} units</span>
                                        <button
                                            className="text-xl text-gray-500 hover:text-gray-700"
                                            onClick={() => handleChangeQuantity(item.FurnitureId, 'increment')}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <span className="font-medium text-lg">${item.pricePerDay}/day</span>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => removeItem(item)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="mt-6 flex flex-col gap-4 items-end">
                    <div className="text-xl font-semibold">
                        <p>Total Order Value: <span className="text-blue-600">${totalOrderValue.toFixed(2)}</span></p>
                    </div>
                    {cartItems.length >= 2 && (
                        <button onClick={createBundle} className="bg-green-600 text-white px-4 py-2 rounded-md">Create Bundle</button>
                    )}
                    {bundle && (
                        <div className="p-4 border rounded-md shadow-md bg-gray-100">
                            <h3 className="font-semibold">{bundle.name}</h3>
                            <p>Discount Applied: 10%</p>
                            <p>New Total: ${bundle.totalValue.toFixed(2)}</p>
                        </div>
                    )}
                    <Link to="/checkout" className="border-2 p-4 bg-blue-700 text-white rounded-xl">
                        Checkout
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Cart;
