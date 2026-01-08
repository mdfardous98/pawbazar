import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase.js";
import toast from "react-hot-toast";

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

  // Check if we're in development mode without proper Firebase
  const isDemoMode = !auth || !auth.app;

  // Listen for authentication state changes
  useEffect(() => {
    if (isDemoMode) {
      // Mock authentication for development
      setLoading(false);
      return;
    }

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
            metadata: firebaseUser.metadata,
            token: token,
            getIdToken: () => firebaseUser.getIdToken(),
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
        toast.error("Authentication error occurred");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  // Mock sign up for demo mode
  const mockSignUp = async (email, password, displayName) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    const mockUser = {
      uid: `mock-${Date.now()}`,
      email,
      displayName: displayName || email.split("@")[0],
      photoURL: null,
      emailVerified: false,
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
      },
      token: `mock-token-${Date.now()}`,
      getIdToken: async () => `mock-token-${Date.now()}`,
    };

    setUser(mockUser);
    localStorage.setItem("authToken", mockUser.token);
    toast.success("Account created successfully! (Demo Mode)");

    return { user: mockUser };
  };

  // Mock sign in for demo mode
  const mockSignIn = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    const mockUser = {
      uid: `mock-${email.replace("@", "-").replace(".", "-")}`,
      email,
      displayName: email.split("@")[0],
      photoURL: null,
      emailVerified: true,
      metadata: {
        creationTime: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days ago
        lastSignInTime: new Date().toISOString(),
      },
      token: `mock-token-${Date.now()}`,
      getIdToken: async () => `mock-token-${Date.now()}`,
    };

    setUser(mockUser);
    localStorage.setItem("authToken", mockUser.token);
    toast.success("Signed in successfully! (Demo Mode)");

    return { user: mockUser };
  };

  // Mock Google sign in for demo mode
  const mockGoogleSignIn = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    const mockUser = {
      uid: `mock-google-${Date.now()}`,
      email: "demo@gmail.com",
      displayName: "Demo User",
      photoURL:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      emailVerified: true,
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
      },
      token: `mock-google-token-${Date.now()}`,
      getIdToken: async () => `mock-google-token-${Date.now()}`,
    };

    setUser(mockUser);
    localStorage.setItem("authToken", mockUser.token);
    toast.success("Signed in with Google successfully! (Demo Mode)");

    return { user: mockUser };
  };

  // Sign up with email and password
  const signUp = async (email, password, displayName) => {
    if (isDemoMode) {
      return mockSignUp(email, password, displayName);
    }

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
        await updateProfile(result.user, { displayName });
      }

      toast.success("Account created successfully!");
      return result;
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage = getFirebaseErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    if (isDemoMode) {
      return mockSignIn(email, password);
    }

    try {
      setError(null);
      setLoading(true);

      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully!");
      return result;
    } catch (error) {
      console.error("Sign in error:", error);
      const errorMessage = getFirebaseErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (isDemoMode || !googleProvider) {
      return mockGoogleSignIn();
    }

    try {
      setError(null);
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google successfully!");
      return result;
    } catch (error) {
      console.error("Google sign in error:", error);
      const errorMessage = getFirebaseErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);

      if (!isDemoMode) {
        await signOut(auth);
      }

      setUser(null);
      localStorage.removeItem("authToken");
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Sign out error:", error);
      const errorMessage = getFirebaseErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (isDemoMode) {
      setUser((prev) => ({ ...prev, ...profileData }));
      toast.success("Profile updated successfully! (Demo Mode)");
      return;
    }

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, profileData);
        setUser((prev) => ({ ...prev, ...profileData }));
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage = getFirebaseErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Get fresh token (for API requests)
  const getToken = async () => {
    if (isDemoMode) {
      return user?.token || null;
    }

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
    updateProfile: updateUserProfile,
    getToken,
    isAuthenticated: !!user,
    isDemoMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper function to get user-friendly error messages
const getFirebaseErrorMessage = (error) => {
  switch (error.code) {
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by your browser.";
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return error.message || "An error occurred during authentication.";
  }
};
