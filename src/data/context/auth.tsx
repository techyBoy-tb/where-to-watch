import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '@data/config';
import { info, err, log, success } from '@utils/trace';
import React, { useCallback, useEffect, useState } from 'react';
import { auth } from '@data/firebase/config';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  reload,
  updateCurrentUser,
  updateProfile
} from 'firebase/auth';
import * as Application from 'expo-application';
import { initializeUserDocument, updateUserNameInFriendships } from '@data/firebase/friends';

interface User {
  uid: string;
  email: string;
  name?: string;
  isVerified: boolean;
}

interface AuthContext {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  // Auth methods
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<boolean>;
}

export const authContext = React.createContext<AuthContext>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  login: () => Promise.resolve(false),
  register: () => Promise.resolve(false),
  logout: () => Promise.resolve(),
  sendVerificationEmail: () => Promise.resolve(),
  refreshUserData: () => Promise.resolve(),
  updateDisplayName: () => Promise.resolve(false),
});

const { Provider } = authContext;

interface Props {
  children?: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [databaseUser, setDatabaseUser] = useState<FirebaseUser>();

  useEffect(() => {
    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Map Firebase user to our User interface
        const mappedUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || undefined,
          isVerified: firebaseUser.emailVerified
        };

        if (!firebaseUser.emailVerified) {
          const now = Date.now();
          const oneMinuteAgo = now - 60_000;
          const date = new Date(firebaseUser.metadata.creationTime ?? "")

          if (date.getTime() >= oneMinuteAgo && date.getTime() <= now) {
            await sendEmailVerification(firebaseUser, {
              iOS: {
                bundleId: Application.applicationId ?? 'com.cliffordgareth9519.where2watch',
              },
              android: {
                packageName: Application.applicationId ?? 'com.cliffordgareth9519.where2watch',
              },
              url: 'https://where-to-watch-a4321.web.app'
            });
          }
        }

        setDatabaseUser(firebaseUser)
        setUser(mappedUser);
        info('[auth]', 'User authenticated:', firebaseUser.email);
      } else {
        setUser(null);
        info('[auth]', 'User signed out');
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      info('[auth]', 'Login successful');
      return true;
    } catch (e: any) {
      err('[auth]', 'Login failed:', e.message);
      log(e);
      return false;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Set display name if provided
      if (displayName && displayName.trim()) {
        await updateProfile(userCredential.user, {
          displayName: displayName.trim()
        });
      }

      // Initialize user document in Firestore
      await initializeUserDocument(userCredential.user.uid, email, displayName?.trim());

      info('[auth]', 'Registration successful');
      return true;
    } catch (e: any) {
      err('[auth]', 'Registration failed:', e.message);
      log(e);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      // Clear any stored data
      await AsyncStorage.removeItem(config.tokenKey);
      await AsyncStorage.removeItem(config.refreshTokenKey);
      info('[auth]', 'Logout successful');
    } catch (e: any) {
      err('[auth]', 'Logout failed:', e.message);
      log(e);
    }
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    if (!databaseUser) {
      err('[authContext]', 'No user', user)
      return;
    }

    await sendEmailVerification(databaseUser, {
      iOS: {
        bundleId: Application.applicationId ?? 'com.cliffordgareth9519.where2watch',
      },
      android: {
        packageName: Application.applicationId ?? 'com.cliffordgareth9519.where2watch',
      },
      url: 'https://where-to-watch-a4321.web.app'
    });
  }, [user, databaseUser]);

  const refreshUserData = useCallback(async () => {
    success('[auth] -> refreshUserData');
    if (!databaseUser) {
      err('[authContext]', 'No user to refresh');
      return;
    }
    await reload(databaseUser);
    if (auth.currentUser?.emailVerified) {
      setUser({ isVerified: true, email: auth.currentUser?.email ?? '', uid: auth.currentUser?.uid ?? '', name: auth.currentUser?.displayName ?? '' });
    }

  }, [databaseUser]);

  const updateDisplayName = useCallback(async (displayName: string): Promise<boolean> => {
    if (!databaseUser || !user?.uid) {
      err('[authContext]', 'No user to update');
      return false;
    }

    try {
      const trimmedName = displayName.trim();

      // Update Firebase Auth profile
      await updateProfile(databaseUser, {
        displayName: trimmedName
      });

      // Update Firestore user document
      await initializeUserDocument(user.uid, user.email, trimmedName);

      // Update user's name in all friend relationships so friends see the new name
      await updateUserNameInFriendships(user.uid, trimmedName);

      // Update local user state
      setUser(prev => prev ? { ...prev, name: trimmedName } : null);

      success('[auth]', 'Display name updated successfully');
      return true;
    } catch (e: any) {
      err('[auth]', 'Failed to update display name:', e.message);
      log(e);
      return false;
    }
  }, [databaseUser, user]);

  return (
    <Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        sendVerificationEmail,
        refreshUserData,
        updateDisplayName
      }}
    >
      {children}
    </Provider>
  );
};
