import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // null = unknown (loading), false = logged out, object = logged in
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Persist session across page refreshes and devices via Firebase's built-in
  // session management — no localStorage needed.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      // Force global logout on cloud system for all existing sessions
      const LOGOUT_EPOCH = 'onedesk_cloud_logout_epoch_v1';
      if (localStorage.getItem(LOGOUT_EPOCH) !== 'done') {
        signOut(auth).finally(() => {
          localStorage.setItem(LOGOUT_EPOCH, 'done');
          setUser(null);
          setLoading(false);
        });
        return;
      }

      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signup({ name, email, password }) {
    setAuthError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Store the display name in Firebase Auth profile
      await fbUpdateProfile(cred.user, { displayName: name });
      // onAuthStateChanged will fire and update state automatically
      return true;
    } catch (err) {
      setAuthError(friendlyError(err.code));
      return false;
    }
  }

  async function login({ email, password }) {
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      setAuthError(friendlyError(err.code));
      return false;
    }
  }

  async function logout() {
    await signOut(auth);
  }

  async function updateProfile({ name }) {
    if (!auth.currentUser) return;
    try {
      await fbUpdateProfile(auth.currentUser, { displayName: name });
      setUser((prev) => prev ? { ...prev, name } : prev);
    } catch {
      // silently fail on profile update
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Turn Firebase error codes into human-friendly messages
function friendlyError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'That email address is not valid.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
