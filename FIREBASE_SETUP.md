# Firebase Setup Instructions

## 🔥 Firebase Admin SDK Setup

To complete the Firebase integration, you need to set up the Firebase Admin SDK:

### Step 1: Generate Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **gujarat-estate-agency-aa5ac**
3. Click the gear icon ⚙️ > **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate new private key**
6. Download the JSON file (keep it secure!)

### Step 2: Update Backend Environment Variables

Open the downloaded JSON file and update your `backend/.env` file with these values:

```env
FIREBASE_PROJECT_ID=gujarat-estate-agency-aa5ac
FIREBASE_PRIVATE_KEY_ID=your_private_key_id_from_json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_from_json\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@gujarat-estate-agency-aa5ac.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id_from_json
```

### Step 3: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click **Done**

### Step 4: Configure Firestore Rules (Optional)

For production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to properties for all users
    match /properties/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

## ✅ What's Already Configured

- **Frontend**: Firebase SDK initialized with your project credentials
- **Backend**: Firebase Admin SDK ready (just needs service account key)
- **Cloudinary**: Image storage fully configured
- **Database Structure**: Property service ready for Firestore

## 🚀 After Setup

Once you complete the service account setup:

1. Restart your backend server
2. Create properties through the admin panel
3. Properties will be stored in Firestore
4. Images will be stored in Cloudinary
5. Everything will work seamlessly!

## 📊 Database Structure

Properties will be stored in Firestore with this structure:

```javascript
{
  id: "auto-generated-id",
  title: "Property Title",
  description: "Property Description",
  price: 1000000,
  location: "City, State",
  beds: 3,
  baths: 2,
  area: 1200,
  type: "Sale",
  propertyType: "apartment",
  status: "active",
  amenities: ["Pool", "Gym"],
  features: ["Balcony", "Parking"],
  images: ["cloudinary-url-1", "cloudinary-url-2"],
  agent: {
    name: "Agent Name",
    phone: "+91 1234567890",
    email: "agent@example.com"
  },
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```