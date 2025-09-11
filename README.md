# 💰 Spendo - Personal Expense Tracker

A modern, mobile-first expense tracker built with Next.js, Firebase, and Tailwind CSS. Track your income and expenses with beautiful, intuitive interface designed for Sri Lankan users.

![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🔐 Authentication
- Secure email/password authentication
- User registration and login
- Protected routes and session management
- Persistent user sessions

### 💳 Transaction Management  
- Add income and expense transactions
- Edit and delete existing transactions
- Real-time transaction updates
- Search and filter transactions by description/category
- Category-based organization

### 🏷️ Category Management
- Create custom income and expense categories
- Edit and delete categories with confirmation
- Icon-based category identification using Lucide icons
- Default categories auto-created for new users
- Separate income and expense category tabs

### 📊 Reports & Analytics
- Monthly spending breakdown by category
- Income vs expense comparison
- Visual progress bars showing spending distribution
- Flexible month/year period selection
- Category-wise expense analysis

### 📱 Mobile-First Design
- Responsive design optimized for all devices
- Modern 4-icon bottom navigation
- Touch-friendly interface with 44px+ touch targets
- Clean black & white monochrome theme
- Progressive Web App (PWA) capabilities

### 💴 Sri Lankan Localization
- Currency formatted in Sri Lankan Rupees (LKR)
- Proper number formatting with LKR symbols

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom black/white theme
- **Components**: Shadcn/ui component library
- **Icons**: Lucide React (professional, consistent icons)

### Backend & Services
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore with real-time updates
- **Hosting**: Optimized for Vercel deployment

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js configuration
- **Type Checking**: TypeScript strict mode

## 📱 App Structure

- **Dashboard**: Overview with balance, income, expenses, and recent transactions
- **Add Transaction**: Quick transaction entry with category selection
- **Transactions**: List all transactions with search and edit capabilities
- **Categories**: Manage income and expense categories
- **Reports**: Monthly statistics and category breakdowns

## 🔧 Setup Instructions

1. **Clone and Install**:
   ```bash
   cd spendo
   npm install
   ```

2. **Firebase Configuration**:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase config to `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Open http://localhost:3000** in your browser

## 📊 Firebase Collections

- **users**: User profiles and metadata
- **categories**: Income and expense categories with icons
- **transactions**: All financial transactions linked to users and categories

## 🎨 Design Features

- **Black & White Theme**: Clean monochrome design for excellent readability
- **Mobile-First**: Optimized for mobile devices with touch-friendly interactions
- **Bottom Navigation**: Easy access to main features
- **Floating Action Button**: Quick transaction entry
- **Card-Based Layout**: Clean separation of information
- **Lucide Icons**: Professional iconography throughout

## 🔒 Security

- Firebase Authentication for secure user management
- Firestore security rules (implement based on your needs)
- Client-side form validation
- Protected routes with authentication checks

## 📱 PWA Features

- Offline-ready manifest file
- Optimized for mobile installation
- App-like experience on mobile devices

## 🚀 Deployment

Ready for deployment on Vercel:

```bash
npm run build
```

The app is optimized for production and ready to deploy!

---

Built with ❤️ using Next.js, Firebase, and Tailwind CSS
