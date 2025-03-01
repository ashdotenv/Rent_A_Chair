import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromFavorites } from '../Redux/slice';
import { FaHeart } from 'react-icons/fa'; // Filled heart icon for favorites

const Favorites = () => {
    const dispatch = useDispatch();
    const favoriteItems = useSelector((state) => state.service.favoriteItems); // Access the favorite items from Redux store

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    const handleRemoveFromFavorites = (product) => {
        dispatch(removeFromFavorites(product)); // This will remove the product from favorites in Redux and update the UI
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {favoriteItems.length === 0 ? (
                <div className="col-span-full text-center text-xl font-semibold text-gray-500">
                    No Favorites Yet
                </div>
            ) : (
                favoriteItems.map((product) => (
                    <div key={product.FurnitureId} className="border rounded-lg p-4">
                        <img
                            src={product.images[0]?.imageUrl}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-md"
                        />
                        <h3 className="text-xl font-semibold mt-4">{product.name}</h3>
                        <p className="text-gray-600">{product.description}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-lg font-semibold">${product.pricePerDay}/day</span>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => handleRemoveFromFavorites(product)}
                                    className="text-2xl text-red-500"
                                >
                                    <FaHeart />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Favorites;
