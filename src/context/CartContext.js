import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { cartAPI } from "../services/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [lastAdded, setLastAdded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem('token');

  // Load cart from backend if authenticated, otherwise from localStorage
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const response = await cartAPI.getCart();
          if (response.data && response.data.cart) {
            // Transform backend cart format to frontend format
            const items = response.data.cart.items.map(item => ({
              id: item.product._id,
              name: item.product.name,
              brand: item.product.brand,
              image: item.product.image,
              discountedPrice: item.product.discountedPrice,
              qty: item.quantity,
              inStock: item.product.inStock
            }));
            setCartItems(items);
          }
        } catch (err) {
          console.error('Failed to load cart:', err);
          // Fallback to localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Load from localStorage for guests
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    };

    loadCart();
  }, [isAuthenticated]);

  // Save cart to localStorage whenever it changes (for guests)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = useCallback(async (product) => {
    try {
      if (isAuthenticated) {
        // Add to backend cart
        await cartAPI.addToCart(product.id || product._id, 1);
        // Refresh cart from backend
        const response = await cartAPI.getCart();
        if (response.data && response.data.cart) {
          const items = response.data.cart.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            brand: item.product.brand,
            image: item.product.image,
            discountedPrice: item.product.discountedPrice,
            qty: item.quantity,
            inStock: item.product.inStock
          }));
          setCartItems(items);
        }
      } else {
        // Add to local cart
        setCartItems((prev) => {
          const existing = prev.find((item) => item.id === product.id);
          if (existing) {
            return prev.map((item) =>
              item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            );
          }
          return [...prev, { ...product, qty: 1 }];
        });
      }
      setLastAdded(product.id);
      setTimeout(() => setLastAdded(null), 1800);
    } catch (err) {
      setError(err.message);
      console.error('Failed to add to cart:', err);
    }
  }, [isAuthenticated]);

  const removeFromCart = useCallback(async (id) => {
    try {
      if (isAuthenticated) {
        await cartAPI.removeFromCart(id);
        // Refresh cart
        const response = await cartAPI.getCart();
        if (response.data && response.data.cart) {
          const items = response.data.cart.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            brand: item.product.brand,
            image: item.product.image,
            discountedPrice: item.product.discountedPrice,
            qty: item.quantity,
            inStock: item.product.inStock
          }));
          setCartItems(items);
        }
      } else {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to remove from cart:', err);
    }
  }, [isAuthenticated]);

  const updateQty = useCallback(async (id, delta) => {
    try {
      const item = cartItems.find(item => item.id === id);
      if (!item) return;

      const newQty = Math.max(1, item.qty + delta);
      
      if (isAuthenticated) {
        await cartAPI.updateCartItem(id, newQty);
        // Refresh cart
        const response = await cartAPI.getCart();
        if (response.data && response.data.cart) {
          const items = response.data.cart.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            brand: item.product.brand,
            image: item.product.image,
            discountedPrice: item.product.discountedPrice,
            qty: item.quantity,
            inStock: item.product.inStock
          }));
          setCartItems(items);
        }
      } else {
        setCartItems((prev) =>
          prev
            .map((item) =>
              item.id === id ? { ...item, qty: newQty } : item
            )
            .filter((item) => item.qty > 0)
        );
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to update quantity:', err);
    }
  }, [cartItems, isAuthenticated]);

  const clearCart = useCallback(async () => {
    try {
      if (isAuthenticated) {
        await cartAPI.clearCart();
      }
      setCartItems([]);
      localStorage.removeItem('cart');
    } catch (err) {
      setError(err.message);
      console.error('Failed to clear cart:', err);
    }
  }, [isAuthenticated]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.discountedPrice * item.qty,
    0
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQty, 
        clearCart, 
        total, 
        itemCount, 
        lastAdded,
        loading,
        error,
        isAuthenticated 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}