import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const isInWishlist = (productId) => wishlist.some((item) => item.product === productId);

  const toggleWishlist = async (product) => {
    try {
      const { data } = await api.post(`/wishlist/${product._id}`);
      setWishlist(data.items);
      return data.inWishlist;
    } catch {
      return null;
    }
  };

  const value = useMemo(() => ({ wishlist, isInWishlist, toggleWishlist, fetchWishlist }), [wishlist, user]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
