import React from 'react';
import { useGetAllProductsQuery } from '../Redux/Service';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToFavorites, removeFromFavorites } from '../Redux/slice';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const SearchProducts = () => {
    const { data, isLoading } = useGetAllProductsQuery();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const favoriteItems = useSelector((state) => state.service.favoriteItems);

    if (isLoading) {
        return <>Loading ... </>;
    }

    const filteredProducts = data?.products.filter((product) => {
        if (!query) return true;
        const regex = new RegExp(query, 'i');
        return regex.test(product.name);
    });

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    const handleToggleFavorite = (product) => {
        const isFavorite = favoriteItems.some((item) => item.FurnitureId === product.FurnitureId);
        if (isFavorite) {
            dispatch(removeFromFavorites(product));
        } else {
            dispatch(addToFavorites(product));
        }
    };

    const highlightText = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, `<span class="bg-yellow-300">$1</span>`);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts?.length === 0 ? (
                <div className="col-span-full text-center text-3xl font-semibold text-gray-500">
                    No products found
                </div>
            ) : (
                filteredProducts.map((product) => {
                    const isFavorite = favoriteItems.some((item) => item.FurnitureId === product.FurnitureId);
                    return (
                        <div key={product.FurnitureId} className="border rounded-lg p-4">
                            <img
                                src={product.images[0]?.imageUrl}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-md cursor-pointer"
                                onClick={() => navigate(`/singleProduct/${product.FurnitureId}`)}
                            />
                            <h3 className="text-xl font-semibold mt-4"
                                dangerouslySetInnerHTML={{ __html: highlightText(product.name, query) }} />
                            <p className="text-gray-600">{product.description}</p>

                            {/* Clickable Hashtag for Category */}
                            <p
                                className="text-blue-500 hover:underline cursor-pointer mt-2"
                                onClick={() => navigate(`/category/${product.category.name}`)}
                            >
                                #{product.category.name}
                            </p>

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
                                        onClick={() => handleToggleFavorite(product)}
                                        className={`text-2xl ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                                    >
                                        {isFavorite ? <FaHeart /> : <FaRegHeart />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );

};

export default SearchProducts;