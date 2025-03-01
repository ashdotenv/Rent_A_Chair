import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa'; // Importing plus and minus icons
import { calculateOrderValue, removeFromCart } from '../Redux/slice';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cartItems } = useSelector(state => state.service);
    const dispatch = useDispatch();

    const removeItem = (product) => {
        dispatch(removeFromCart(product));
    }

    // To store the local total days and quantity for each cart item
    const [daysAndQuantity, setDaysAndQuantity] = useState(cartItems.map(item => ({
        id: item.FurnitureId, 
        days: 1, 
        quantity: 1 // Initial quantity is set to 1
    })));

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

    // Calculate the total order value locally
    const calculateTotalValue = () => {
        return cartItems.reduce((total, item) => {
            const { days, quantity } = daysAndQuantity.find(d => d.id === item.FurnitureId) || { days: 1, quantity: 1 };
            return total + (days * quantity * item.pricePerDay);
        }, 0);
    };

    useEffect(() => {
        // Recalculate the total order value when cart items, days, or quantity change
        const totalValue = calculateTotalValue();
        dispatch(calculateOrderValue(totalValue));
    }, [cartItems, daysAndQuantity, dispatch]);

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
                <div className="mt-6 flex gap-2 items-center justify-end">
                    <div className="text-xl font-semibold">
                        <p>Total Order Value: <span className="text-blue-600">${calculateTotalValue()}</span></p>
                    </div>
                    <Link to={"/checkout"} className="border-2 p-4 bg-blue-700 text-white rounded-xl">
                        Checkout
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Cart;
