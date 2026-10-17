import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Firebase user
  const [mongoUser, setMongoUser] = useState(null); // Database synced user
  const [loading, setLoading] = useState(true);

  // Sync user with backend
  const syncWithBackend = useCallback(async (extraPayload = {}) => {
    try {
      const user = await authService.syncUser(extraPayload);
      setMongoUser(user);
      return user;
    } catch (error) {
      console.error('Failed to sync user with backend:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    // Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);

      if (user) {
        try {
          const token = await user.getIdToken();
          authService.setToken(token);
          await syncWithBackend({
            fullName: user.displayName || user.email?.split('@')[0],
            email: user.email
          });
        } catch (error) {
          console.error('Error handling Firebase Auth state change:', error);
        }
      } else {
        authService.removeToken();
        setMongoUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncWithBackend]);

  // Sign In with Email & Password
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const user = await authService.loginWithEmail(email, password);
      await syncWithBackend({
        email: user.email,
        fullName: user.displayName || user.email?.split('@')[0]
      });
      return user;
    } finally {
      setLoading(false);
    }
  };

  // Sign Up with Email & Password + role
  const signupWithEmail = async (email, password, fullName, role = 'student') => {
    setLoading(true);
    try {
      const result = await authService.registerWithEmail(email, password, fullName, role);
      await syncWithBackend({
        fullName,
        email,
        role
      });
      return result.user;
    } finally {
      setLoading(false);
    }
  };

  // Sign In with Google
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const user = await authService.loginWithGoogle();
      await syncWithBackend({
        fullName: user.displayName,
        email: user.email
      });
      return user;
    } finally {
      setLoading(false);
    }
  };

  // Change Password for currently signed-in user
  const changePassword = async (newPassword, currentPassword = null) => {
    return await authService.changePassword(newPassword, currentPassword);
  };

  // Send Password Reset email
  const resetPassword = async (email) => {
    return await authService.resetPassword(email);
  };

  // Sign out
  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setMongoUser(null);
  };

  const activeRole = mongoUser?.role || 'student';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        mongoUser,
        activeRole,
        loading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        changePassword,
        resetPassword,
        logout,
        syncWithBackend
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
