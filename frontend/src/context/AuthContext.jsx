import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Firebase user
  const [mongoUser, setMongoUser] = useState(null); // Database synced user
  const [loading, setLoading] = useState(true);
  const [demoRole, setDemoRole] = useState(null); // For local dev/demo role preview

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
        setDemoRole(null);
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
        // If not in demo mode, clear token
        if (!demoRole) {
          authService.removeToken();
          setMongoUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncWithBackend, demoRole]);

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

  // Quick Demo Login for rapid testing
  const loginDemo = async (role = 'student') => {
    setDemoRole(role);
    const mockToken = `mock-${role}-token`;
    authService.setToken(mockToken);
    try {
      const synced = await syncWithBackend({
        role
      });
      return synced;
    } catch (e) {
      console.warn('Demo sync fallback:', e);
    }
  };

  // Sign out
  const logout = async () => {
    setDemoRole(null);
    await authService.logout();
    setCurrentUser(null);
    setMongoUser(null);
  };

  const activeRole = mongoUser?.role || demoRole || 'student';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        mongoUser,
        activeRole,
        demoRole,
        loading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        loginDemo,
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
