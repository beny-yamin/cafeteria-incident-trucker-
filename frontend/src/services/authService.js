import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from './api';

let inFlightSyncPromise = null;

export const authService = {
  setToken(token) {
    if (token) {
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

  async logout() {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout warning:', e);
    }
    this.removeToken();
  },

  async syncUser(payload = {}) {
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
