import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [count, setCount] = useState(0);

  const refreshCount = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCount(0);
      return;
    }
    try {
      const response = await api.get('/cart');
      const total = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCount(total);
    } catch (err) {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return (
    <CartContext.Provider value={{ count, refreshCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}