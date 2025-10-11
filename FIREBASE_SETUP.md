# Firebase Firestore Security Rules Setup

## Problem
You're encountering the error: **"FirebaseError: Missing or insufficient permissions"**

This happens because Firestore defaults to locked mode, denying all read/write access. You need to configure security rules to allow authenticated users to access their data.

## Solution Overview
I've created Firestore security rules that allow authenticated users to access only their own data. Now you need to deploy these rules to Firebase.

## Files Created
- `firestore.rules` - Security rules defining access permissions
- `firebase.json` - Firebase CLI configuration
- `.firebaserc` - Firebase project configuration
- `firestore.indexes.json` - Firestore indexes configuration

---

## Option 1: Deploy Using Firebase CLI (Recommended)

### Step 1: Authenticate with Firebase
```bash
/opt/homebrew/Cellar/node/23.7.0/bin/firebase login
```

This will open a browser window for you to authenticate with your Google account.

### Step 2: Deploy Security Rules
```bash
/opt/homebrew/Cellar/node/23.7.0/bin/firebase deploy --only firestore:rules
```

This will deploy the security rules to your Firebase project.

### Step 3: Verify Deployment
Visit your Firebase Console:
https://console.firebase.google.com/project/sepndo-5f354/firestore/rules

You should see the deployed rules.

---

## Option 2: Manual Setup via Firebase Console (Quick Alternative)

If you prefer not to use the CLI, follow these steps:

### Step 1: Open Firebase Console
1. Go to https://console.firebase.google.com/
2. Select your project: **sepndo-5f354**
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab

### Step 2: Copy and Paste the Rules
Replace the existing rules with the following:
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // This rule allows anyone with your Firestore database reference to view, edit,
    // and delete all data in your Firestore database. It is useful for getting
    // started, but it is configured to expire after 30 days because it
    // leaves your app open to attackers. At that time, all client
    // requests to your Firestore database will be denied.
    //
    // Make sure to write security rules for your app before that time, or else
    // all client requests to your Firestore database will be denied until you Update
    // your rules
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 10, 11);
    }
  }
}
```

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection - users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }

    // Categories collection - users can only access their own categories
    match /categories/{categoryId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }

    // Transactions collection - users can only access their own transactions
    match /transactions/{transactionId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Step 3: Publish the Rules
Click the **"Publish"** button in the top right corner.

---

## Security Rules Explanation

The rules I've created provide the following security:

### Authentication Check
- All operations require user authentication (`request.auth != null`)
- Unauthenticated users cannot access any data

### User Isolation
- Users can only access documents where `userId` matches their `request.auth.uid`
- This prevents users from viewing or modifying other users' data

### Collection-Specific Rules

#### Users Collection (`/users/{userId}`)
- Users can only read and write their own user document
- Document ID must match the authenticated user's UID

#### Categories Collection (`/categories/{categoryId}`)
- Read: Users can only read categories where `userId` equals their UID
- Create: New categories must have the creator's `userId`
- Update/Delete: Users can only modify their own categories

#### Transactions Collection (`/transactions/{transactionId}`)
- Read: Users can only read transactions where `userId` equals their UID
- Create: New transactions must have the creator's `userId`
- Update/Delete: Users can only modify their own transactions

---

## Testing After Deployment

1. **Restart Your Development Server**
   ```bash
   npm run dev
   ```

2. **Clear Browser Cache** (if needed)
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

3. **Test the Application**
   - Try logging in
   - Add a transaction
   - View the dashboard
   - The permissions error should be resolved

---

## Troubleshooting

### Error: "Failed to authenticate"
Run: `/opt/homebrew/Cellar/node/23.7.0/bin/firebase login`

### Error: "User does not have permission to access project"
Make sure you're logged in with the Google account that owns the Firebase project.

### Rules Published but Still Getting Errors
- Wait 1-2 minutes for rules to propagate
- Clear browser cache and refresh
- Check browser console for different error messages

### Firebase CLI Command Not Found
Add to your PATH or use the full path:
```bash
export PATH="/opt/homebrew/Cellar/node/23.7.0/bin:$PATH"
```

Or create an alias in your `~/.zshrc`:
```bash
alias firebase="/opt/homebrew/Cellar/node/23.7.0/bin/firebase"
```

---

## Next Steps

After deploying the rules:

1. Test all CRUD operations (Create, Read, Update, Delete)
2. Verify users cannot access other users' data
3. Consider adding more specific validation rules as your app grows
4. Set up Firebase indexes for better query performance (if needed)

---

## Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Security Rules Testing](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
