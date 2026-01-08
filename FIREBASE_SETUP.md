# Firebase Setup Guide for PawBazar

This guide will help you set up Firebase authentication for the PawBazar application.

## Prerequisites

- A Google account
- Node.js and npm installed
- PawBazar project cloned and dependencies installed

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `pawbazar` (or your preferred name)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click on the "Get started" button
3. Go to the "Sign-in method" tab
4. Enable the following sign-in providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and add your project's support email

## Step 3: Add a Web App

1. In the Firebase project overview, click the web icon (`</>`) to add a web app
2. Enter app nickname: `pawbazar-client`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object (you'll need this in the next step)

## Step 4: Configure Environment Variables

1. In your project root, navigate to `pawbazar-client/`
2. Copy  to `.env`:
   ```bash
   cp  .env
   ```
3. Open `.env` and replace the Firebase configuration values with your actual values:
   ```env
   # Replace these with your actual Firebase config values
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to Authentication > Settings > Authorized domains
2. Add your development domain: `localhost`
3. Add your production domain when you deploy (e.g., `your-app.netlify.app`)

## Step 6: Test Authentication

1. Start your development server:
   ```bash
   cd pawbazar-client
   npm run dev
   ```
2. Navigate to `http://localhost:5174`
3. Try registering a new account or signing in with Google
4. Check the Firebase Console > Authentication > Users to see registered users

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/configuration-not-found)"**

   - Make sure all environment variables are set correctly
   - Restart your development server after changing `.env`

2. **"Firebase: Error (auth/unauthorized-domain)"**

   - Add your domain to Authorized domains in Firebase Console
   - For development, make sure `localhost` is added

3. **Google Sign-in popup blocked**

   - Allow popups in your browser
   - Try using a different browser or incognito mode

4. **"Firebase: Error (auth/popup-closed-by-user)"**
   - This happens when users close the Google sign-in popup
   - The error is handled gracefully in the app



## Security Notes

- Never commit your `.env` file to version control
- Use different Firebase projects for development and production
- Regularly rotate your API keys
- Set up Firebase Security Rules for production

## Production Deployment

When deploying to production:

1. Create a separate Firebase project for production
2. Update your environment variables in your hosting platform
3. Add your production domain to Firebase authorized domains
4. Set up Firebase Security Rules
5. Consider enabling Firebase App Check for additional security

## Support

If you encounter issues:

1. Check the [Firebase Documentation](https://firebase.google.com/docs/auth)
2. Review the browser console for error messages
3. Check the Firebase Console for any configuration issues
4. Ensure all required APIs are enabled in Google Cloud Console

## Example Firebase Config

Your Firebase config should look something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Your actual API key
  authDomain: "pawbazar-12345.firebaseapp.com",
  projectId: "pawbazar-12345",
  storageBucket: "pawbazar-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
};
```

Replace the placeholder values in your `.env` file with these actual values.
