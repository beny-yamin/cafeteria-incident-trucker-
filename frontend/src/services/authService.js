import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from './api';

let inFlightSyncPromise = null;

// Purge legacy mock/dev tokens from localStorage on startup
try {
  const existingToken = localStorage.getItem('token');
  if (existingToken && (existingToken.startsWith('mock-') || existingToken.startsWith('dev-') || existingToken.startsWith('test-'))) {
    localStorage.removeItem('token');
  }
} catch (e) {
  // Ignore localStorage access issues
}

export const authService = {
  setToken(token) {
    if (token && typeof token === 'string' && !token.startsWith('mock-') && !token.startsWith('dev-') && !token.startsWith('test-')) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  removeToken() {
    localStorage.removeItem('token');
  },

  async getIdToken(forceRefresh = false) {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken(forceRefresh);
    }
    return this.getToken();
  },

  async loginWithEmail(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdToken();
    this.setToken(token);
    return credential.user;
  },

  async registerWithEmail(email, password, fullName, role = 'student') {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (fullName) {
      await updateProfile(credential.user, { displayName: fullName });
    }
    const token = await credential.user.getIdToken();
    this.setToken(token);
    return { user: credential.user, role };
  },

  async loginWithGoogle() {
    const credential = await signInWithPopup(auth, googleProvider);
    const token = await credential.user.getIdToken();
    this.setToken(token);
    return credential.user;
  },

  async changePassword(newPassword, currentPassword = null) {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in.');
    }
    // If current password is provided, re-authenticate first to prevent requires-recent-login errors
    if (currentPassword && auth.currentUser.email) {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
    }
    await updatePassword(auth.currentUser, newPassword);
    // Refresh token after password change
    const newToken = await auth.currentUser.getIdToken(true);
    this.setToken(newToken);
    return true;
  },

  async resetPassword(email) {
    if (!email) {
      throw new Error('Please provide an email address.');
    }
    await sendPasswordResetEmail(auth, email);
    return true;
  },

  async logout() {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout warning:', e);
    }
    this.removeToken();
  },

  async syncUser(payload = {}) {
    // If not authenticated with Firebase or holding a mock token, do not attempt backend sync
    const currentToken = this.getToken();
    if (!auth.currentUser && (!currentToken || currentToken.startsWith('mock-') || currentToken.startsWith('dev-') || currentToken.startsWith('test-'))) {
      if (currentToken) this.removeToken();
      return null;
    }

    if (inFlightSyncPromise) {
      return inFlightSyncPromise;
    }
    inFlightSyncPromise = api
      .post('/auth/sync', payload)
      .then((res) => res.data)
      .finally(() => {
        inFlightSyncPromise = null;
      });
    return inFlightSyncPromise;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export default authService;
