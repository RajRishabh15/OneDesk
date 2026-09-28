import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword as fbUpdatePassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

// Recognized genuine email domains (Gmail, Outlook, Microsoft, Yahoo, Apple, Proton, Zoho, AOL, etc.)
export const GENUINE_EMAIL_DOMAINS = new Set([
  // Google
  'gmail.com',
  'googlemail.com',

  // Microsoft / Outlook / Hotmail / Live
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'passport.com',

  // Yahoo
  'yahoo.com',
  'ymail.com',
  'rocketmail.com',
  'yahoo.co.in',
  'yahoo.co.uk',
  'yahoo.fr',
  'yahoo.de',
  'yahoo.es',
  'yahoo.it',
  'yahoo.com.br',

  // Apple
  'icloud.com',
  'me.com',
  'mac.com',

  // Proton
  'proton.me',
  'protonmail.com',
  'pm.me',

  // Zoho
  'zoho.com',
  'zoho.in',

  // AOL / Mail / GMX / Fastmail / Tuta
  'aol.com',
  'mail.com',
  'gmx.com',
  'gmx.net',
  'gmx.de',
  'fastmail.com',
  'tuta.com',
  'tutanota.com',
  'rediffmail.com',
  'yandex.com',
]);

// Known disposable and temporary email domains to explicitly reject
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'getairmail.com',
  'dispostable.com',
  'fakemail.net',
  'throwawaymail.com',
  'fakeinbox.com',
  'burnermail.io',
  'crazymailing.com',
  'nada.ltd',
  'tempail.com',
  'mohmal.com',
  'generator.email',
  'dropmail.me',
  'maildrop.cc',
  'inboxkitten.com',
]);

/**
 * Validates whether an email address is properly formatted and belongs to a genuine provider or institution.
 */
export function validateGenuineEmail(rawEmail) {
  const email = (rawEmail || '').trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email || !emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  const domain = parts[1].toLowerCase();

  // Reject disposable / temp email providers
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: 'Temporary/disposable emails are not allowed. Please use a genuine email (e.g., @gmail.com or @outlook.com).',
    };
  }

  // Allow recognized genuine domains
  if (GENUINE_EMAIL_DOMAINS.has(domain)) {
    return { valid: true, email };
  }

  // Allow recognized institutional, educational (.edu, .ac.*), or government domains
  const isInstitutional =
    domain.endsWith('.edu') ||
    domain.includes('.edu.') ||
    domain.endsWith('.ac.in') ||
    domain.endsWith('.ac.uk') ||
    domain.includes('.ac.') ||
    domain.endsWith('.gov') ||
    domain.includes('.gov.') ||
    domain.endsWith('.org');

  if (isInstitutional) {
    return { valid: true, email };
  }

  // Otherwise, reject non-genuine / unverified domains
  return {
    valid: false,
    error: 'Only genuine emails (such as @gmail.com, @outlook.com, @yahoo.com, @icloud.com, @proton.me, or institutional mail) are allowed.',
  };
}

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
        const cachedName = localStorage.getItem(`onedesk_user_name_${firebaseUser.uid}`);
        const cachedPhoto = localStorage.getItem(`onedesk_user_photo_${firebaseUser.uid}`);
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || cachedName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || cachedPhoto || '',
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
    const validation = validateGenuineEmail(email);
    if (!validation.valid) {
      setAuthError(validation.error);
      return false;
    }

    try {
      const trimmedName = (name || '').trim();
      const cleanEmail = validation.email;
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      // Store the display name in Firebase Auth profile
      await fbUpdateProfile(cred.user, { displayName: trimmedName });

      // Cache locally so any subsequent reloads or listeners immediately resolve the real name
      if (trimmedName) {
        localStorage.setItem(`onedesk_user_name_${cred.user.uid}`, trimmedName);
      }

      // Immediately set the React user state with their real name so dashboard gets it directly!
      setUser({
        id: cred.user.uid,
        name: trimmedName || cred.user.email.split('@')[0],
        email: cred.user.email,
      });

      return true;
    } catch (err) {
      setAuthError(friendlyError(err.code));
      return false;
    }
  }

  async function login({ email, password }) {
    setAuthError('');
    const validation = validateGenuineEmail(email);
    if (!validation.valid) {
      setAuthError(validation.error);
      return false;
    }

    try {
      const cleanEmail = validation.email;
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      return true;
    } catch (err) {
      setAuthError(friendlyError(err.code));
      return false;
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  async function updateProfile({ name, photoURL }) {
    if (!auth.currentUser) return false;
    try {
      const updates = {};
      let trimmedName = undefined;
      if (name !== undefined) {
        trimmedName = (name || '').trim();
        updates.displayName = trimmedName;
      }
      if (photoURL !== undefined) {
        if (photoURL && photoURL.startsWith('http')) {
          updates.photoURL = photoURL;
        } else if (!photoURL) {
          updates.photoURL = '';
        }
      }

      if (Object.keys(updates).length > 0) {
        try {
          await fbUpdateProfile(auth.currentUser, updates);
        } catch (e) {
          console.warn('Firebase profile update warning:', e);
        }
      }

      if (trimmedName !== undefined && trimmedName) {
        localStorage.setItem(`onedesk_user_name_${auth.currentUser.uid}`, trimmedName);
      }
      if (photoURL !== undefined) {
        if (photoURL) {
          localStorage.setItem(`onedesk_user_photo_${auth.currentUser.uid}`, photoURL);
        } else {
          localStorage.removeItem(`onedesk_user_photo_${auth.currentUser.uid}`);
        }
      }

      setUser((prev) =>
        prev
          ? {
              ...prev,
              ...(trimmedName !== undefined ? { name: trimmedName } : {}),
              ...(photoURL !== undefined ? { photoURL } : {}),
            }
          : prev
      );
      return true;
    } catch (err) {
      console.error('Update profile error:', err);
      return false;
    }
  }

  async function deleteAccount(password = '') {
    setAuthError('');
    if (!auth.currentUser) return { success: false, error: 'No user signed in' };

    const currentUser = auth.currentUser;
    const uid = currentUser.uid;

    try {
      if (password) {
        try {
          const credential = EmailAuthProvider.credential(currentUser.email, password);
          await reauthenticateWithCredential(currentUser, credential);
        } catch (reauthErr) {
          return {
            success: false,
            requiresPassword: true,
            error: friendlyError(reauthErr.code),
          };
        }
      }

      await deleteUser(currentUser);
      localStorage.removeItem(`onedesk_user_name_${uid}`);
      localStorage.removeItem(`onedesk_user_photo_${uid}`);
      setUser(null);
      return { success: true };
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        return {
          success: false,
          requiresPassword: true,
          error: 'For security, please enter your password to confirm account deletion.',
        };
      }
      return { success: false, error: friendlyError(err.code) };
    }
  }

  async function changePassword({ currentPassword, newPassword }) {
    setAuthError('');
    if (!auth.currentUser) return { success: false, error: 'No user signed in.' };

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await fbUpdatePassword(auth.currentUser, newPassword);
      return { success: true };
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        return { success: false, error: 'Current password is incorrect.' };
      }
      if (err.code === 'auth/weak-password') {
        return { success: false, error: 'New password must be at least 6 characters.' };
      }
      return { success: false, error: friendlyError(err.code) };
    }
  }

  async function resetPassword(email) {
    setAuthError('');
    const validation = validateGenuineEmail(email);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    try {
      const cleanEmail = validation.email;
      await sendPasswordResetEmail(auth, cleanEmail);
      return { success: true };
    } catch (err) {
      const msg = friendlyError(err.code);
      return { success: false, error: msg };
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, signup, logout, updateProfile, deleteAccount, changePassword, resetPassword }}>
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
      return 'No account found with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect.';
    case 'auth/requires-recent-login':
      return 'For security, please confirm your password to proceed.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
