import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection, onSnapshot, doc,
  updateDoc, deleteDoc,
  query, orderBy, where,
} from 'firebase/firestore';
import { db } from '../../services/firebase/firebase';
import { useAuth } from './AuthProvider';


const OrdersContext = createContext(null);


export const OrdersProvider = ({ children }) => {
  const { currentUser } = useAuth(); 
  const [orders, setOrders]               = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);


  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    const q = currentUser.isAdmin
      ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );

  const unsub = onSnapshot(q, (snap) => {
  // Ми поставили id: d.id в кінець!
  setOrders(snap.docs.map((d) => ({ ...d.data(), id: d.id }))); 
  setOrdersLoading(false);
});
    return () => unsub();
  }, [currentUser]);


  const addOrder = useCallback((data) => {
    setOrders((prev) => [data, ...prev]);
  }, []);

  const cancelOrder = useCallback((orderId) =>
    updateDoc(doc(db, 'orders', orderId), { status: 'cancelled' }), []);

  const updateOrderStatus = useCallback((orderId, status) =>
    updateDoc(doc(db, 'orders', orderId), { status }), []);

  const removeOrder = useCallback((orderId) =>
    deleteDoc(doc(db, 'orders', orderId)), []);

  const getOrdersByUser = useCallback((email) =>
    orders.filter((o) => o.email === email), [orders]);


  return (
    <OrdersContext.Provider value={{
      orders, ordersLoading,
      addOrder, cancelOrder,
      updateOrderStatus, removeOrder,
      getOrdersByUser,
    }}>
      {children}
    </OrdersContext.Provider>
  );
};


export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
};