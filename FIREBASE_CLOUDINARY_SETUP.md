# Firebase + Cloudinary Integration Guide

## ✅ Completed Setup

### 1. Firebase Project Setup
- **Project Name**: KhudSakht
- **Plan**: Spark Plan (Free Tier)
- **Location**: asia-south1 (Mumbai)
- **Features Enabled**:
  - ✅ Firebase Authentication (Email/Password)
  - ✅ Cloud Firestore Database (Test Mode)

### 2. Cloudinary Account Setup
- **Cloud Name**: dmqcpclos
- **Upload Preset**: khudsakht_preset (unsigned mode)
- **Folder**: khudsakht
- **Free Tier Limits**: 25GB storage, 25GB bandwidth/month

### 3. Environment Configuration
Created `.env` file with:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=khudsakht.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=khudsakht
VITE_FIREBASE_STORAGE_BUCKET=khudsakht.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=dmqcpclos
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=khudsakht_preset
```

### 4. Firebase Config Files
Created `src/config/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

Created `src/config/cloudinary.ts`:
```typescript
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  folder: 'khudsakht',
};
```

### 5. Packages Installed
```bash
npm install firebase cloudinary-react
```

## ✅ Components Updated

### 1. AuthPage.tsx
- **Status**: Fully integrated with Firebase Authentication
- **Features**:
  - Sign up with email/password using `createUserWithEmailAndPassword`
  - Login with email/password using `signInWithEmailAndPassword`
  - Logout using `signOut`
  - Real authentication instead of mock

### 2. App.tsx
- **Status**: Firestore integration complete
- **Features**:
  - Auth state sync with `onAuthStateChanged`
  - User state management (currentUser, userId)
  - Orders fetched from Firestore on login
  - Orders saved to Firestore on checkout
  - Async handlePlaceOrder function

### 3. CheckoutPage.tsx
- **Status**: Updated to handle async order placement
- **Changes**:
  - `onPlaceOrder` prop type changed to `Promise<void>`
  - `handlePlaceOrder` made async with `await`

## 📊 Firestore Database Structure

### Collections

#### `users` (for future use)
```typescript
{
  userId: string;
  email: string;
  name: string;
  createdAt: Date;
  // Future: addresses, preferences, etc.
}
```

#### `orders`
```typescript
{
  orderId: string;        // KS-xxxx format
  userId: string;         // Firebase Auth UID
  userEmail: string;      // User email
  date: string;           // ISO timestamp
  status: string;         // "Processing" | "In Transit" | "Delivered"
  total: number;          // Total amount in PKR
  items: CartItem[];      // Array of cart items
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal: string;
  };
  paymentMethod: string;  // "COD" | "JazzCash" | "EasyPaisa" | "Card"
  createdAt: Date;        // Firestore timestamp
}
```

## 🔐 Security Rules (To Update Before Production)

Current: Test Mode (expires in 30 days)

**Recommended Production Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /orders/{orderId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if false; // Orders can't be modified
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎨 Cloudinary Integration (Pending)

### Next Steps for Image Management

#### 1. Upload Design Images to Cloudinary
```typescript
import { cloudinaryConfig } from '../config/cloudinary';

const uploadToCloudinary = async (file: File, folder: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('folder', `${cloudinaryConfig.folder}/${folder}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  return response.json();
};
```

#### 2. Update DesignPicker to Use Cloudinary URLs
- Replace local file URLs with Cloudinary URLs
- Use Cloudinary transformations for optimization:
  - `w_200,h_200,c_fill` for thumbnails
  - `q_auto,f_auto` for automatic quality/format

#### 3. Store Cloudinary URLs in Firestore
```typescript
// When uploading design
const result = await uploadToCloudinary(file, 'designs/bazo');
// Save result.secure_url to Firestore
```

## 🚀 Deployment Steps (After All Integration)

### 1. Remove Express Server
- Delete `server.js`
- Remove Express dependencies
- Update `package.json` scripts

### 2. Configure Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

**Firebase hosting config**:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 3. Build and Deploy
```bash
npm run build
firebase deploy --only hosting
```

## 📝 Free Tier Limits

### Firebase Spark Plan
- **Authentication**: Unlimited users
- **Firestore**:
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
  - 1 GB storage
- **Hosting**: 10 GB/month transfer

### Cloudinary Free Tier
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Images/Videos**: Unlimited

## ⚠️ Important Notes

1. **Firestore Test Mode**: Current security rules allow all reads/writes. Update before production launch.

2. **Environment Variables**: Never commit `.env` file to Git. Already added to `.gitignore`.

3. **Cloudinary Unsigned Preset**: Allows client-side uploads but limit transformations for security.

4. **Firebase Auth**: Users are authenticated but email verification is not enabled. Consider enabling for production.

5. **Order IDs**: Currently generated client-side. Consider using Firestore auto-IDs or server timestamp.

## 🔄 Migration from Express Server

### What Changed
- ❌ Removed: Node.js/Express server (`server.js`)
- ❌ Removed: Local state management
- ❌ Removed: Mock authentication
- ✅ Added: Firebase Authentication (real users)
- ✅ Added: Cloud Firestore (persistent orders)
- ✅ Added: Cloudinary (image hosting)

### Benefits
- 🚀 Serverless architecture (no server maintenance)
- 💰 Free tier sufficient for small-medium traffic
- 🌐 CDN delivery (faster global access)
- 🔒 Built-in security rules
- 📈 Auto-scaling
- 🔄 Real-time sync capabilities

## 📞 Next Implementation Tasks

1. **Cloudinary Image Upload**:
   - Create upload component
   - Integrate with CustomizationCanvas
   - Store URLs in Firestore

2. **User Profile**:
   - Create user document on signup
   - Store user preferences
   - Saved addresses

3. **Real-time Order Tracking**:
   - Use Firestore snapshots for real-time updates
   - Notify users of status changes

4. **Admin Panel** (Future):
   - Separate admin authentication
   - Order management
   - Design library management

---

**Status**: Core Firebase + Firestore integration complete. Cloudinary integration pending.
