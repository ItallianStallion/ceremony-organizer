import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToAuthChanges } from '../../services/firebase/authService';
import { db } from '../../services/firebase/firebase'; 
import { doc, getDoc } from 'firebase/firestore';     

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [authLoading, setAuthLoading]  = useState(true);
  const [isAdmin, setIsAdmin]          = useState(false);

  const reloadUser = async () => {
    if (!currentUser?.uid) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const freshData = userSnap.data();
        setCurrentUser(prev => ({ ...prev, ...freshData }));
        setIsAdmin(freshData.isAdmin === true);
      }
    } catch (error) {
      console.error("Помилка оновлення профілю:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setIsAdmin(user?.isAdmin === true);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    // Додаємо reloadUser у Context
    <AuthContext.Provider value={{ currentUser, authLoading, isAdmin, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};