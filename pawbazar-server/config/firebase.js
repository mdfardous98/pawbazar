import admin from "firebase-admin";

let firebaseApp = null;

export const initializeFirebase = () => {
  try {
    if (firebaseApp) {
      console.log("🔥 Using existing Firebase connection");
      return firebaseApp;
    }

    // Check if required environment variables exist
    const requiredEnvVars = [
      "FIREBASE_PROJECT_ID",
      "FIREBASE_PRIVATE_KEY",
      "FIREBASE_CLIENT_EMAIL",
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing Firebase environment variables: ${missingVars.join(", ")}`
      );
    }

    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri:
        process.env.FIREBASE_AUTH_URI ||
        "https://accounts.google.com/o/oauth2/auth",
      token_uri:
        process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
    };

    console.log("🔥 Initializing Firebase Admin SDK...");

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    console.log("✅ Firebase Admin SDK initialized successfully");
    console.log(`🆔 Project ID: ${process.env.FIREBASE_PROJECT_ID}`);

    return firebaseApp;
  } catch (error) {
    console.error("❌ Firebase initialization error:", error.message);

    // In development, we might want to continue without Firebase
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️  Running in development mode without Firebase");
      return null;
    }

    process.exit(1);
  }
};

export const verifyFirebaseToken = async (token) => {
  try {
    if (!firebaseApp) {
      throw new Error("Firebase not initialized");
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    return {
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email,
        picture: decodedToken.picture,
        emailVerified: decodedToken.email_verified,
      },
    };
  } catch (error) {
    console.error("❌ Token verification error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getFirebaseApp = () => {
  return firebaseApp;
};
