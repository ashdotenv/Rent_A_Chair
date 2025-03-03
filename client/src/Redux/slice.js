import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
const favoriteItems = JSON.parse(localStorage.getItem("favorites")) || [];
const orderSummaryItems =
  JSON.parse(localStorage.getItem("order_summary")) || [];
const getLoggedInStatus = JSON.parse(localStorage.getItem("loggedIn")) || false;

export const serviceSlice = createSlice({
  initialState: {
    myInfo: null,
    loggedInStatus: getLoggedInStatus, // Correctly parsing the boolean from localStorage
    userId: null,
    searchedProducts: null,
    filteredProducts: null,
    cartItems: cartProducts,
    favoriteItems: favoriteItems,
    totalOrderValue: 0,
    orderSummary: orderSummaryItems,
  },
  name: "service",
  reducers: {
    addMyInfo: (state, action) => {
      state.myInfo = action.payload;
      state.userId = action.payload.userId;
    },
    toggleLoginStatus: (state, action) => {
      // Toggle loggedInStatus correctly and persist in localStorage
      console.log(action.payload);
      state.loggedInStatus = action.payload;
      localStorage.setItem("loggedIn", JSON.stringify(action.payload)); // Save the login status to localStorage
    },
    addToCart: (state, action) => {
      const product = action.payload;

      // Check if the product is already in the cart based on FurnitureId
      const existingProduct = state.cartItems.find(
        (item) => item.FurnitureId === product.FurnitureId
      );

      if (existingProduct) {
        // If product is already in the cart, increment quantity
        existingProduct.quantity += 1;
      } else {
        // If product is not in the cart, add it with initial quantity 1
        state.cartItems.push({ ...product, quantity: 1 });
      }

      // Store the updated cart in localStorage
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
      toast.success(`Added To Cart`);
    },
    removeFromCart: (state, action) => {
      const furnitureId = action.payload.FurnitureId;
      state.cartItems = state.cartItems.filter(
        (item) => item.FurnitureId !== furnitureId
      );
      // Store the updated cart in localStorage
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      // Clear the cart
      state.cartItems = [];

      // Remove cart from localStorage
      localStorage.removeItem("cart");
    },
    calculateOrderValue: (state, action) => {
      state.totalOrderValue = action.payload;
    },
    addToFavorites: (state, action) => {
      const product = action.payload;

      // Check if the product is already in the favorites
      const existingFavorite = state.favoriteItems.find(
        (item) => item.FurnitureId === product.FurnitureId
      );

      if (!existingFavorite) {
        // If not already in favorites, add it
        state.favoriteItems.push(product);
        // Update localStorage
        localStorage.setItem("favorites", JSON.stringify(state.favoriteItems));
        toast.success("Added To Favorites");
      } else {
        toast.error("This item is already in your favorites");
      }
    },
    removeFromFavorites: (state, action) => {
      const furnitureId = action.payload.FurnitureId;
      state.favoriteItems = state.favoriteItems.filter(
        (item) => item.FurnitureId !== furnitureId
      );
      // Update localStorage
      localStorage.setItem("favorites", JSON.stringify(state.favoriteItems));
      toast.success("Removed From Favorites");
    },
  },
});

export const {
  addMyInfo,
  toggleLoginStatus,
  addToCart,
  removeFromCart,
  clearCart,
  calculateOrderValue,
  addToFavorites,
  removeFromFavorites,
} = serviceSlice.actions;

export default serviceSlice.reducer;
