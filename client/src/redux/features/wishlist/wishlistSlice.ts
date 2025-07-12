import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const WISHLIST_KEY = 'wishlist';

function loadWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveWishlist(ids: string[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  }
}

interface WishlistState {
  ids: string[];
}

const initialState: WishlistState = {
  ids: typeof window !== 'undefined' ? loadWishlist() : [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<string>) {
      if (!state.ids.includes(action.payload)) {
        state.ids.push(action.payload);
        saveWishlist(state.ids);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter(id => id !== action.payload);
      saveWishlist(state.ids);
    },
    clearWishlist(state) {
      state.ids = [];
      saveWishlist(state.ids);
    },
    hydrateWishlist(state) {
      state.ids = loadWishlist();
    }
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, hydrateWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer; 