# 🐝 BeeWise - The Next-Gen Financial Literacy App

A comprehensive financial education platform built with Next.js, Firebase, and Tailwind CSS. BeeWise helps users develop smart financial habits through intuitive expense tracking, educational games, and loan calculators, aligned with the Central Bank of Sri Lanka's financial literacy initiative.

![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Powered by SLIIT Kandy Campus**

## 🎯 Mission

BeeWise is designed to promote financial literacy among Sri Lankan citizens, aligning with the Central Bank of Sri Lanka's financial literacy roadmap. Like bees that work diligently to build their hive, BeeWise helps users build their financial future through:

- **Smart Budgeting**: Track income and expenses with ease
- **Financial Education**: Interactive games and calculators
- **Informed Decisions**: Data-driven insights and analytics
- **Accessible Learning**: Multi-language support (English & Tamil)

## ✨ Features

### 🐝 BeeWise Unique Features
- **Animated Bee Loading**: Professional bee-themed interface with hexagon patterns
- **Financial Literacy Games**: Interactive scenarios for learning money management
- **Loan Calculator**: Calculate EMI for various loan types with Sri Lankan interest rates
- **Bilingual Support**: Full English and Tamil language support
- **Mobile-First Design**: Optimized for smartphones with PWA capabilities

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
- Interest rates aligned with Sri Lankan banking standards
- Educational content tailored for Sri Lankan financial landscape

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

## 🎨 Design Philosophy

### The Bee Theme
- **Bees** symbolize hard work, savings, community, and financial wisdom
- **Hexagons** represent the honeycomb structure - efficiency and organization
- **Golden Colors** (#FFCD3F) convey warmth, prosperity, and optimism

### Visual Elements
- Clean black & white base with strategic golden accents
- Hexagon background patterns for professional aesthetic
- Animated bee loading screens
- Mobile-optimized touch targets (44px+)

## 🔧 Setup Instructions

1. **Clone and Install**:
   ```bash
   cd beewise
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

## 🏆 About SLIIT Kandy Campus

BeeWise is developed and powered by **Sri Lanka Institute of Information Technology (SLIIT) Kandy Campus**, committed to advancing financial literacy through innovative technology solutions.

## 🤝 Contributing

We welcome contributions to improve BeeWise! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License.

---

**BeeWise** - Building Financial Wisdom, One Decision at a Time 🐝

Powered by SLIIT Kandy Campus | Aligned with Central Bank of Sri Lanka's Financial Literacy Initiative
