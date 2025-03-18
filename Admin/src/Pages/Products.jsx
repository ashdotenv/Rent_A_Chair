import React, { useState } from "react";
import {
    useAddProductMutation,
    useGetAllProductsQuery,
    useUpdateProductMutation,
    useGetAllCategoriesQuery,
    useDeleteProductMutation, 
} from "../Redux/Service";

const conditionOptions = ["New", "Good", "Fair", "Poor"];

const Products = () => {
    const { data: productsData, isLoading: productsLoading, refetch } = useGetAllProductsQuery();
    const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
    const [editingProduct, setEditingProduct] = useState(null);
    const [editedValues, setEditedValues] = useState({});
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation(); 
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        categoryId: "",
        pricePerDay: "",
        description: "",
        isAvailable: true,
        dimensions: "",
        material: "",
        condition: "New",
        images: [],
    });
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false); // State to manage delete popup
    const [productToDelete, setProductToDelete] = useState(null); // State for the product to delete

    if (productsLoading || categoriesLoading) return <div className="text-center text-gray-500">Loading...</div>;

    const handleEdit = (product) => {
        setEditingProduct(product);
        setEditedValues(product); // Set product values for editing
    };

    const handleCancelEdit = () => setEditingProduct(null);

    const handleInputChange = (field, value) => {
        setEditedValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdateProduct = async () => {
        try {
            await updateProduct({
                productId: editingProduct.FurnitureId,
                data: editedValues, // Pass edited values for update
            }).unwrap();
            setEditingProduct(null);
            refetch(); // Refetch the product list after updating
        } catch (error) {
            console.error("Failed to update product:", error);
        }
    };

    const handleAddInputChange = (field, value) => {
        setNewProduct((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddImage = (event) => {
        const files = event.target.files;
        if (!files) return;
        setNewProduct((prev) => ({
            ...prev,
            images: [...prev.images, ...Array.from(files)], // Add images to product
        }));
    };

    const handleRemoveImage = (index) => {
        setNewProduct((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index), // Remove image by index
        }));
    };

    const handleAddProduct = async () => {
        try {
            const formData = new FormData();
            Object.entries(newProduct).forEach(([key, value]) => {
                if (key === "images") {
                    value.forEach((file) => formData.append("images", file)); // Append images as binary
                } else {
                    formData.append(key, value);
                }
            });

            await addProduct(formData).unwrap();
            setIsAddPopupOpen(false);
            setNewProduct({
                name: "",
                categoryId: "",
                pricePerDay: "",
                description: "",
                isAvailable: true,
                dimensions: "",
                material: "",
                condition: "New",
                images: [],
            });
            refetch(); // Refetch after adding product
        } catch (error) {
            console.error("Failed to add product:", error);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await deleteProduct(productToDelete).unwrap();
            setIsDeletePopupOpen(false);
            refetch(); // Refetch the product list after deleting
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Product List</h1>

            <button className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={() => setIsAddPopupOpen(true)}>
                + Add Product
            </button>

            <div className="w-full">
                <table className="w-full bg-gray-100 text-gray-900 rounded-lg shadow-lg">
                    <thead>
                        <tr className="border-b bg-gray-200">
                            <th className="p-4 text-left">Image</th>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Category</th>
                            <th className="p-4 text-left">Condition</th>
                            <th className="p-4 text-left">Price/Day</th>
                            <th className="p-4 text-left">Availability</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsData?.products?.map((product) => (
                            <tr key={product.FurnitureId} className="border-b hover:bg-gray-200">
                                <td className="p-4">
                                    <img
                                        src={product.images[0]?.imageUrl}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="p-4">{product.name}</td>
                                <td className="p-4">{product.category.name}</td>
                                <td className="p-4">{product.condition}</td>
                                <td className="p-4">${product.pricePerDay}</td>
                                <td className="p-4">{product.isAvailable ? "Available" : "Unavailable"}</td>
                                <td className="p-4">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                        onClick={() => handleEdit(product)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                        onClick={() => {
                                            setProductToDelete(product.FurnitureId);
                                            setIsDeletePopupOpen(true);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Product Popup */}
            {editingProduct && (
                <div
                    className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center"
                    onClick={() => setEditingProduct(null)}
                >
                    <div className="bg-white p-6 rounded shadow-lg w-1/3" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
                        <input
                            type="text"
                            value={editedValues.name}
                            placeholder="Name"
                            className="border p-2 w-full mb-2"
                            onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                        <select
                            className="border p-2 w-full mb-2"
                            value={editedValues.categoryId}
                            onChange={(e) => handleInputChange("categoryId", e.target.value)}
                        >
                            <option value="">Select Category</option>
                            <option value="1">Sofas</option>
                            <option value="2">Beds</option>
                            <option value="3">Dining Tables</option>
                            <option value="4">Chairs</option>
                            <option value="5">Wardrobes</option>
                        </select>
                        <input
                            type="number"
                            value={editedValues.pricePerDay}
                            placeholder="Price Per Day"
                            className="border p-2 w-full mb-2"
                            onChange={(e) => handleInputChange("pricePerDay", e.target.value)}
                        />
                        <textarea
                            value={editedValues.description}
                            placeholder="Description"
                            className="border p-2 w-full mb-2"
                            onChange={(e) => handleInputChange("description", e.target.value)}
                        ></textarea>
                        <input
                            type="text"
                            value={editedValues.dimensions}
                            placeholder="Dimensions"
                            className="border p-2 w-full mb-2"
                            onChange={(e) => handleInputChange("dimensions", e.target.value)}
                        />
                        <input
                            type="text"
                            value={editedValues.material}
                            placeholder="Material"
                            className="border p-2 w-full mb-2"
                            onChange={(e) => handleInputChange("material", e.target.value)}
                        />
                        <select
                            className="border p-2 w-full mb-2"
                            value={editedValues.condition}
                            onChange={(e) => handleInputChange("condition", e.target.value)}
                        >
                            {conditionOptions.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                        <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={handleUpdateProduct}>
                            {isUpdating ? "Updating..." : "Update Product"}
                        </button>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2" onClick={handleCancelEdit}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Add Product Popup */}
            {isAddPopupOpen && (
                <div
                    className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center"
                    onClick={() => setIsAddPopupOpen(false)}
                >
                    <div className="bg-white p-6 rounded shadow-lg w-1/3" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
                        <input
                            type="text"
                            value={newProduct.name}
                            placeholder="Name"
                            className="border p-2 w-full mb-2"
                            onChange={(e) => handleAddInputChange("name", e.target.value)}
                        />
                        <select
                            className="border p-2 w-full mb-2"
                            value={newProduct.categoryId}
                            onChange={(e) => handleAddInputChange("categoryId", e.target.value)}
                        >
                            <option value="">Select Category</option>
                            <option value="1">Sofas</option>
                            <option value="2">Beds</option>
                            <option value="3">Dining Tables</option>
                            <option value="4">Chairs</option>
                            <option value="5">Wardrobes</option>
                        </select>
                        <input
                            type="number"
                            value={newProduct.pricePerDay}
                            placeholder="Price Per Day"
                            className="border p-2 w-full mb-2"
                            onChange={(e) => handleAddInputChange("pricePerDay", e.target.value)}
                        />
                        <textarea
                            value={newProduct.description}
                            placeholder="Description"
                            className="border p-2 w-full mb-2"
                            onChange={(e) => handleAddInputChange("description", e.target.value)}
                        ></textarea>
                        <input
                            type="text"
                            value={newProduct.dimensions}
                            placeholder="Dimensions"
                            className="border p-2 w-full mb-2"
                            onChange={(e) => handleAddInputChange("dimensions", e.target.value)}
                        />
                        <input
                            type="text"
                            value={newProduct.material}
                            placeholder="Material"
                            className="border p-2 w-full mb-2"
                            onChange={(e) => handleAddInputChange("material", e.target.value)}
                        />
                        <select
                            className="border p-2 w-full mb-2"
                            value={newProduct.condition}
                            onChange={(e) => handleAddInputChange("condition", e.target.value)}
                        >
                            {conditionOptions.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                        <div>
                            <input
                                type="file"
                                multiple
                                onChange={handleAddImage}
                                className="border p-2 w-full mb-2"
                            />
                            <div>
                                {newProduct.images.map((image, index) => (
                                    <div key={index} className="inline-block relative mr-2">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Product Image ${index}`}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <button
                                            className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                            onClick={handleAddProduct}
                        >
                            {isAdding ? "Adding..." : "Add Product"}
                        </button>
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
                            onClick={() => setIsAddPopupOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Popup */}
            {isDeletePopupOpen && (
                <div
                    className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center"
                    onClick={() => setIsDeletePopupOpen(false)}
                >
                    <div className="bg-white p-6 rounded shadow-lg w-1/3" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this product?</h2>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                onClick={handleDeleteProduct}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setIsDeletePopupOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
