# Firebase Authentication Setup

## Current Status
✅ Email/Password authentication - ENABLED and WORKING
✅ Google Sign-In - CODE IMPLEMENTED (needs Firebase Console setup)
✅ Facebook Sign-In - CODE IMPLEMENTED (needs Firebase Console setup)

## Features Implemented
1. **Email/Password Authentication**
   - Login functionality
   - Signup with user data
   - All users saved to Firestore `users` collection

2. **Google Authentication**
   - Sign in with Google popup
   - Automatic Firestore user creation
   - Provider tracking

3. **Facebook Authentication**
   - Sign in with Facebook popup
   - Automatic Firestore user creation
   - Provider tracking

## Firestore User Schema
All authenticated users (Email, Google, Facebook) are saved with:
```javascript
{
  uid: string,           // Firebase Auth UID
  name: string,          // Display name
  email: string,         // User email
  photoURL: string|null, // Profile picture (from Google/Facebook)
  provider: string,      // 'email', 'google', or 'facebook'
  createdAt: Date,       // Account creation time
  updatedAt: Date        // Last login time
}
```

## Firebase Console Setup Required

### 1. Enable Google Sign-In
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: **khudsakht**
3. Go to **Authentication** → **Sign-in method**
4. Click on **Google**
5. Toggle **Enable**
6. Add your project support email
7. Click **Save**

### 2. Enable Facebook Sign-In
1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click on **Facebook**
3. Toggle **Enable**

#### Create Facebook App:
4. Go to https://developers.facebook.com/
5. Click **My Apps** → **Create App**
6. Select **Consumer** → **Next**
7. Enter app name: **KhudSakht**
8. Click **Create App**

#### Configure Facebook App:
9. In Facebook App Dashboard, go to **Settings** → **Basic**
10. Copy **App ID** and **App Secret**
11. Paste in Firebase Console (Facebook sign-in settings)
12. Copy the **OAuth redirect URI** from Firebase
13. In Facebook App, go to **Facebook Login** → **Settings**
14. Paste OAuth redirect URI in **Valid OAuth Redirect URIs**
15. Make app **Live** (not in Development mode)

### 3. Add Authorized Domains
1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (already added)
   - Your production domain when deployed

## Testing Instructions

### Test Email/Password (Already Working):
1. Go to signup page
2. Create account with email and password
3. Check Firestore → `users` collection for new user

### Test Google Sign-In:
1. After enabling in Firebase Console
2. Click "Continue with Google" button
3. Select Google account
4. Check Firestore → `users` collection for new user with `provider: 'google'`

### Test Facebook Sign-In:
1. After Facebook app setup complete
2. Click "Continue with Facebook" button
3. Login with Facebook
4. Check Firestore → `users` collection for new user with `provider: 'facebook'`

## Firestore Security Rules (Current)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 2, 8);
    }
  }
}
```

⚠️ **WARNING**: Test mode expires on February 8, 2025. Update rules before expiry!

## Production Security Rules (Recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders - users can read/write their own orders
    match /orders/{orderId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Public read for products (if you add them)
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Only admins through backend
    }
  }
}
```

## Code Changes Made

### AuthPage.tsx Updates:
1. ✅ Added `GoogleAuthProvider` and `FacebookAuthProvider` imports
2. ✅ Created `saveUserToFirestore()` helper function
3. ✅ Added `handleGoogleLogin()` function
4. ✅ Added `handleFacebookLogin()` function
5. ✅ Updated login/signup to save users to Firestore
6. ✅ Made Google and Facebook buttons functional
7. ✅ Added proper error handling for all auth methods

## What Works Now:
- ✅ Email/Password signup saves to Firestore
- ✅ Email/Password login updates user in Firestore
- ✅ Google login will work after Firebase Console setup
- ✅ Facebook login will work after Facebook App + Firebase setup
- ✅ All authentication methods save users with provider tracking
- ✅ Existing users are updated on login
- ✅ New users are created with complete profile data

## Next Steps:
1. Enable Google Sign-In in Firebase Console (2 minutes)
2. Create Facebook App and enable Facebook Sign-In (10-15 minutes)
3. Test all authentication methods
4. Update Firestore security rules before test mode expires
