
import { createSlice } from "@reduxjs/toolkit";

// Save status to localStorage
const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

// Get status from localStorage
const loadFromLocalStorage = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : { products: [] };
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return { products: [] };
  }
};

// Load status from localStorage to create initialState
const initialState = loadFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, img, title, price, size, quantity = 1 } = action.payload; // Thêm size
      const existingProduct = state.products.find(
        (product) => product.id === id
      );

      if (existingProduct) {
        // If product exists, increase quantity
        existingProduct.quantity += quantity;
      } else {
        // If product is new, add to cart with selected quantity
        state.products.push({
          id,
          img,
          title,
          price,
          size,
          quantity,
        });
      }

      saveToLocalStorage(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((product) => product.id === id);

      if (product && quantity > 0) {
        product.quantity = quantity;
      }

      saveToLocalStorage(state); 
    },
    removeFromCart: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload.id
      );
      saveToLocalStorage(state);
    },
    clearCart: (state) => {
      state.products = [];
      saveToLocalStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
