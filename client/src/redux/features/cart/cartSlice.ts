import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  title: string;
  image: string;
  dailyRate: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const loadCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('cart');
    if (stored) return JSON.parse(stored);
  }
  return [];
};

const saveCart = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items));
  }
};

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 