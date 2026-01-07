import { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "pawbazar-e4373.firebaseapp.com",
  projectId: "pawbazar-e4373",
  storageBucket: "pawbazar-e4373.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get the ID token for API requests
          const token = await firebaseUser.getIdToken();

          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            token: token,
          };

          setUser(userData);

          // Store token in localStorage for API requests
          localStorage.setItem("authToken", token);
        } else {
          setUser(null);
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Error processing auth state change:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name if provided
      if (displayName && result.user) {
        await result.user.updateProfile({ displayName });
      }

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      localStorage.removeItem("authToken");
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get fresh token (for API requests)
  const getToken = async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken(true);
    }
    return null;
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    getToken,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
