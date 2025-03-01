import React from "react";
import { useParams } from "react-router-dom";
import { useLazyGetProductByIdQuery } from "../Redux/Service";

const SingleProduct = () => {
    const { id } = useParams(); // Get product ID from URL
    const { data, isLoading, isError } = useLazyGetProductByIdQuery(id);

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error fetching product</p>;

    const product = data?.product; // Extract product details
    if (!product) return <p>No product found</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
            {/* Product Image */}
            {product.images?.length > 0 && (
                <img
                    src={product.images[0].imageUrl}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                />
            )}

            {/* Product Details */}
            <h1 className="text-3xl font-bold text-[#1980E5]">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>

            {/* Price and Availability */}
            <p className="text-lg font-semibold mt-2">
                <span className="text-[#0D141C]">${product.pricePerDay}</span> / day
            </p>
            <p className={`text-sm font-medium mt-1 ${product.isAvailable ? "text-green-600" : "text-red-600"}`}>
                {product.isAvailable ? "Available" : "Not Available"}
            </p>

            {/* Category */}
            <p className="mt-2 text-gray-700">
                <strong>Category:</strong> {product.category?.name} - {product.category?.description}
            </p>

            {/* Additional Details */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p><strong>Condition:</strong> {product.condition}</p>
                <p><strong>Dimensions:</strong> {product.dimensions}</p>
                <p><strong>Material:</strong> {product.material}</p>
            </div>

            {/* Created/Updated Info */}
            <p className="text-xs text-gray-500 mt-3">
                Last updated: {new Date(product.updatedAt).toLocaleDateString()}
            </p>
        </div>
    );
};

export default SingleProduct;
