import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return { items: [] };
    }

    const { data } = await api.get('/cart');
    setCart(data);
    return data;
  }, [user]);

  useEffect(() => {
    fetchCart().catch(() => setCart({ items: [] }));
  }, [fetchCart]);

  const addToCart = async (payload) => {
    const { data } = await api.post('/cart', payload);
    setCart(data);
    return data;
  };

  const updateItem = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/${itemId}`, { quantity });
    setCart(data);
    return data;
  };

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/cart/${itemId}`);
    setCart(data);
    return data;
  };

  const clearCart = async () => {
    const { data } = await api.delete('/cart');
    setCart(data);
    return data;
  };

  const cartCount = cart.items.reduce((count, item) => count + item.quantity, 0);
  const cartSubtotal = cart.items.reduce((sum, item) => {
    const netPrice = item.price - (item.price * item.discount) / 100;
    return sum + netPrice * item.quantity;
  }, 0);

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      cartSubtotal,
      fetchCart,
      addToCart,
      updateItem,
      removeItem,
      clearCart
    }),
    [cart, cartCount, cartSubtotal, fetchCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
