# Spendo - Claude Development Context

## 🎯 Project Overview
**Spendo** is a mobile-first expense tracker web application built with Next.js, Firebase, and Tailwind CSS featuring a clean black and white monochrome design.

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework**: Next.js 14 with App Router and TypeScript
- **Styling**: Tailwind CSS with custom black/white color palette
- **UI Components**: Shadcn/ui for consistent design system
- **Icons**: Lucide React (no emojis, clean professional icons)
- **State Management**: React Context API + useState/useReducer

### Backend
- **Authentication**: Firebase Auth (email/password)
- **Database**: Firebase Firestore
- **Real-time Updates**: Firestore real-time listeners
- **File Storage**: Firebase Storage (if needed for future features)

### Development
- **Language**: TypeScript for type safety
- **Linting**: ESLint with Next.js configuration
- **Package Manager**: npm
- **Deployment**: Optimized for Vercel

## 📁 Project Structure

```
spendo/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication routes (grouped)
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Registration page
│   │   ├── dashboard/         # Main dashboard
│   │   ├── transactions/      # Transactions list and management
│   │   ├── categories/        # Category management
│   │   ├── add/              # Add transaction page
│   │   ├── reports/          # Analytics and reports
│   │   ├── layout.tsx        # Root layout with AuthProvider
│   │   └── page.tsx          # Home page with auth redirect
│   ├── components/
│   │   ├── ui/               # Shadcn/ui components
│   │   ├── layout/           # Layout components (BottomNavigation)
│   │   └── forms/            # Form components (TransactionForm, CategoryForm)
│   ├── contexts/
│   │   └── AuthContext.tsx   # Firebase Auth context provider
│   ├── lib/
│   │   ├── firebase.ts       # Firebase configuration
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── utils.ts          # Utility functions (formatCurrency, formatDate)
│   │   ├── categoryService.ts # Category CRUD operations
│   │   └── transactionService.ts # Transaction CRUD operations
│   └── hooks/                # Custom React hooks (if needed)
├── public/
│   ├── manifest.json         # PWA manifest
│   └── icons/               # App icons for PWA
├── .env.local               # Firebase environment variables
├── .env.example             # Environment variables template
└── README.md                # Project documentation
```

## 🔥 Firebase Configuration

### Collections Structure

#### users
```typescript
{
  uid: string;           // Firebase Auth UID
  email: string;         // User email
  displayName?: string;  // User display name
  createdAt: Date;       // Account creation date
}
```

#### categories
```typescript
{
  id: string;           // Firestore document ID
  name: string;         // Category name (e.g., "Food & Dining")
  type: 'income' | 'expense'; // Category type
  icon: string;         // Lucide icon name (e.g., "Utensils")
  userId: string;       // Associated user ID
  createdAt: Date;      // Creation timestamp
}
```

#### transactions
```typescript
{
  id: string;           // Firestore document ID
  amount: number;       // Transaction amount
  type: 'income' | 'expense'; // Transaction type
  categoryId: string;   // Reference to category
  description: string;  // Transaction description
  date: Date;          // Transaction date
  userId: string;      // Associated user ID
  createdAt: Date;     // Creation timestamp
}
```

### Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🎨 Design System

### Color Palette
- **Primary**: Black (#000000) for main text and primary actions
- **Background**: White (#ffffff) for main background
- **Secondary**: Light gray (#f8f9fa) for secondary backgrounds
- **Muted**: Gray (#6c757d) for muted text
- **Border**: Light gray (#e9ecef) for borders
- **Success/Income**: Green (#10B981) for positive amounts
- **Error/Expense**: Red (#EF4444) for negative amounts

### Typography
- **Primary Font**: Geist Sans (system font)
- **Monospace Font**: Geist Mono for code/numbers
- **Sizes**: Responsive typography with mobile-first approach

### Icons
- **Library**: Lucide React
- **Style**: Monochrome, consistent 24px/16px sizes
- **Categories**: Utensils, Car, Home, ShoppingBag, etc.
- **Actions**: Plus, Edit, Trash2, Search, Filter
- **Navigation**: Home, List, BarChart3, User

## 📱 Mobile-First Features

### Responsive Design
- **Breakpoints**: Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- **Navigation**: Bottom navigation for mobile, sidebar for desktop
- **Touch Targets**: Minimum 44px touch targets for mobile
- **Typography**: Scalable font sizes for different screen sizes

### PWA Capabilities
- **Manifest**: App manifest for mobile installation
- **Icons**: High-res icons for different devices
- **Offline**: Basic offline functionality with service worker
- **Theme**: Black theme color for status bar

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Firebase Setup (Manual)
1. Create Firebase project
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Copy config to .env.local
```

## 🚀 Key Features Implemented

### Authentication
- [x] User registration with email/password
- [x] User login with form validation
- [x] Password visibility toggle
- [x] Logout functionality
- [x] Protected routes with auth context
- [x] User session persistence

### Category Management
- [x] Create categories with custom icons
- [x] Edit existing categories
- [x] Delete categories with confirmation
- [x] Default categories for new users
- [x] Income/Expense category separation
- [x] Icon picker with Lucide icons

### Transaction Management
- [x] Add transactions with category selection
- [x] Edit existing transactions
- [x] Delete transactions with confirmation
- [x] Search transactions by description/category
- [x] Filter by date range
- [x] Real-time transaction updates

### Dashboard
- [x] Monthly balance summary
- [x] Income/Expense totals
- [x] Recent transactions widget
- [x] Quick action floating button
- [x] Real-time data updates

### Reports & Analytics
- [x] Monthly spending breakdown
- [x] Category-wise expense analysis
- [x] Income source tracking
- [x] Visual progress bars
- [x] Period selection (month/year)

### Mobile Experience
- [x] Bottom navigation
- [x] Touch-friendly interface
- [x] Swipe actions for edit/delete
- [x] Responsive grid layouts
- [x] Mobile-optimized forms

## 🎯 Future Enhancements

### Potential Features
- [ ] Export data to CSV/PDF
- [ ] Budget planning and tracking
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Data visualization charts
- [ ] Expense photo attachments
- [ ] Social sharing features
- [ ] Dark mode toggle

### Technical Improvements
- [ ] Offline-first architecture
- [ ] Push notifications
- [ ] Advanced filtering options
- [ ] Data backup/restore
- [ ] Performance optimizations
- [ ] Accessibility improvements

## 🔒 Security Considerations

### Authentication
- Firebase Auth handles password security
- Email verification (can be enabled)
- Password reset functionality
- Session management with tokens

### Data Security
- Firestore security rules (implement per requirements)
- User data isolation by userId
- Input validation and sanitization
- Environment variable protection

## 📊 Performance Metrics

### Build Output
- **Total Bundle Size**: ~416KB (largest page)
- **Shared Chunks**: 102KB optimized
- **Static Generation**: All pages pre-rendered
- **Core Web Vitals**: Optimized for mobile performance

### Optimization Features
- Code splitting by route
- Image optimization (Next.js built-in)
- Font optimization with next/font
- Tree shaking for unused code
- Minification and compression

## 🐛 Known Issues & Solutions

### Development
- SWC warnings on M1 Macs (doesn't affect functionality)
- ESLint strict mode (configured to ignore during builds)
- TypeScript strict mode (configured appropriately)

### Production
- Firebase configuration required for deployment
- Environment variables needed for build
- Firestore security rules to be configured

---

**Last Updated**: September 11, 2025
**Status**: Production Ready
**Version**: 1.0.0