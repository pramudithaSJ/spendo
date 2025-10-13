# BeeWise - Full Application Context Documentation

> **Last Updated**: October 13, 2025
> **Version**: 1.0.0
> **Status**: Production Ready
> **Powered by**: SLIIT Kandy Campus

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Mission & Vision](#mission--vision)
3. [Application Architecture](#application-architecture)
4. [Core Features](#core-features)
5. [Technical Stack](#technical-stack)
6. [File Structure](#file-structure)
7. [Key Components](#key-components)
8. [Design System](#design-system)
9. [Special Features](#special-features)
10. [Data Models](#data-models)
11. [User Journey](#user-journey)
12. [Deployment & Performance](#deployment--performance)

---

## Executive Summary

**BeeWise** is a next-generation financial literacy application built with Next.js 15, Firebase, and TypeScript, designed to promote financial education among Sri Lankan citizens. The application features a professional gold (#FFCD3F) and black (#232323) themed UI with hexagonal patterns, inspired by honeybee efficiency and community.

### Key Statistics
- **Total Pages**: 16+ pages
- **Components**: 30+ custom components
- **Supported Languages**: English & Tamil
- **Theme**: Gold (#FFCD3F) & Black with hexagon patterns
- **Target**: Mobile-first progressive web app
- **Alignment**: Central Bank of Sri Lanka's Financial Literacy Initiative

---

## Mission & Vision

### Mission
To empower Sri Lankan citizens with financial literacy tools that make expense tracking, budgeting, and financial decision-making accessible, engaging, and educational.

### Vision
Like bees building a thriving hive, BeeWise helps users build their financial future through:
- Smart budgeting and tracking
- Interactive educational games
- Loan calculators and planning tools
- Data-driven insights and analytics
- Multi-language accessibility (English & Tamil)

### The Bee Metaphor
- **Bees**: Symbolize hard work, savings, community, and wisdom
- **Hexagons**: Represent efficiency, organization, and structured financial planning
- **Golden Colors**: Convey warmth, prosperity, and optimism

---

## Application Architecture

### Technology Stack

#### Frontend
```typescript
Framework: Next.js 15.5 (App Router)
Language: TypeScript 5.0
Styling: Tailwind CSS 4.0
Components: Shadcn/ui + Custom Components
Icons: Lucide React
Animations: Custom CSS animations + tw-animate-css
```

#### Backend & Services
```typescript
Authentication: Firebase Auth (Email/Password)
Database: Firebase Firestore (Real-time)
AI Integration: OpenAI GPT-3.5-turbo (Ask AI Feature)
Hosting: Vercel-optimized
```

#### Development Tools
```bash
Package Manager: npm
Type Checking: TypeScript strict mode
Linting: ESLint with Next.js config
Build: Next.js production build
```

---

## Core Features

### 1. Authentication System
**Location**: `src/app/(auth)/`

- Email/password authentication via Firebase
- User registration with display name
- Secure login with password visibility toggle
- Session persistence across browser sessions
- Protected routes with AuthContext
- Auto-redirect for authenticated users

**Key Files**:
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/app/(auth)/login/page.tsx` - Login page
- `src/app/(auth)/register/page.tsx` - Registration page

### 2. Dashboard
**Location**: `src/app/dashboard/page.tsx`

- Monthly balance summary (Income - Expenses)
- Three stat cards: Balance, Income, Expenses
- Recent transactions widget (latest 5)
- Quick action floating button
- Real-time data updates
- Responsive grid layout

**Features**:
- Color-coded amounts (Blue for income, Gold for expenses)
- Relative date display ("Today", "Yesterday", "N days ago")
- Empty state with "Add First Transaction" CTA
- Logo branding in header

### 3. Transaction Management
**Location**: `src/app/transactions/page.tsx`, `src/app/add/page.tsx`

**Add Transactions**:
- Amount input with currency formatting
- Type selection (Income/Expense)
- Category selection with icons
- Description field
- Date picker (default: today)
- Real-time validation

**View/Edit Transactions**:
- Search by description/category
- Filter by date range
- Edit existing transactions
- Delete with confirmation
- Swipe actions for mobile

**Key Service**: `src/lib/transactionService.ts`

### 4. Category Management
**Location**: `src/app/categories/page.tsx`

- Create custom categories
- Income/Expense category separation
- Icon picker with Lucide icons
- Edit existing categories
- Delete with dependency check
- Default categories auto-created for new users

**Default Categories**:
- **Income**: Salary, Freelance, Investment, Gift
- **Expense**: Food, Transport, Shopping, Bills, Entertainment

**Key Service**: `src/lib/categoryService.ts`

### 5. Reports & Analytics
**Location**: `src/app/reports/page.tsx`

- Monthly spending breakdown
- Category-wise expense analysis
- Income source tracking
- Visual progress bars
- Period selection (month/year)
- Export-ready data format

### 6. Launch Screen Experience
**Location**: `src/app/launch/page.tsx`

A unique 4-stage interactive launch sequence:

**Stage 0**: Welcome screen with BeeWise logo
**Stage 1**: Activate platform (honeycomb grid activates ring 1)
**Stage 2**: Connect ecosystem (rings 1-2 activate)
**Stage 3**: Launching (all rings active, counter animates to 10,000)

**Components**:
- `HoneycombGrid.tsx` - Interactive hexagonal grid
- `HexCell.tsx` - Individual hexagon cells with animations
- `LaunchCounter.tsx` - Animated counter from 0 to 10,000
- QR code placeholder for mobile download

**User Experience**:
- Click anywhere to advance stages
- Keyboard support (Space/Enter to advance, Escape to skip)
- Skip button to jump directly to dashboard
- Stage indicators (progress dots)

### 7. Ask AI Feature
**Location**: `src/app/ask-ai/page.tsx`

The crown jewel of BeeWise - AI-powered financial assistant.

**Core Functionality**:
- OpenAI GPT-3.5-turbo integration
- Streaming responses for real-time interaction
- Financial context analysis of user transactions
- Suggested questions based on spending patterns
- Quick insights card with key financial metrics

**Financial Context Analysis** (`src/lib/financialAnalysisService.ts`):
```typescript
- Total income/expenses analysis
- Top spending categories
- Monthly comparison (current vs previous)
- Spending patterns and trends
- Category-wise breakdown
```

**AI System Prompt** (`src/lib/aiPrompts.ts`):
- Personalized to user's financial situation
- Currency-aware (supports INR, USD, EUR, LKR)
- Contextual suggestions based on spending patterns
- Educational tone aligned with financial literacy

**Components**:
- `ChatMessage.tsx` - Message bubbles with markdown support
- `ChatInput.tsx` - Input field with send button
- `TypingIndicator.tsx` - AI thinking animation
- `QuickInsightsCard.tsx` - Summary of financial health
- `SuggestedQuestions.tsx` - Smart question chips

**Example Suggested Questions**:
- "Why are my expenses higher this month?"
- "How can I reduce my Food & Dining spending?"
- "What's my largest expense category?"
- "Am I saving enough this month?"

**Error Handling**:
- No API key: Displays setup instructions
- No transactions: Prompts to add transactions first
- Rate limiting: User-friendly error messages

### 8. Financial Literacy Games
**Location**: `src/app/game/page.tsx`, `src/app/game-scenarios/page.tsx`

Interactive decision-based games for learning financial management:

**Scenario 1**: Student Loan Management Game
- Profile: 22-year-old graduate with Rs. 50,000 loan
- 6 decision steps with multiple options
- Real-time balance tracking
- Timer to track decision-making time
- Refresh detection to prevent cheating

**Scenario 2**: Investment Management Game
- Profile: 28-year-old professional with Rs. 80,000 salary
- Focus on investment choices and portfolio building

**Scenario 3**: Expense Management Game
- Profile: 25-year-old professional with Rs. 60,000 salary
- Focus on daily expense decisions and budgeting

**Game Features**:
- Group number selection (1-12)
- Choice history tracking
- Option cards with cost indicators
- Confirmation dialogs
- Final results with performance breakdown
- Winning/losing path detection
- Tamil & English language support

**Components**:
- `OptionCard.tsx` - Game choice cards
- `ChoiceHistory.tsx` - Past decisions display
- `ConfirmationDialog.tsx` - Choice confirmation
- `GameResults.tsx` - Final score and analysis
- `LiveTimer.tsx` - Real-time timer

### 9. Loan Calculator
**Location**: `src/app/loan-calculator/page.tsx`

Comprehensive EMI calculator with Sri Lankan interest rates:

**Loan Types**:
- Personal Loan (12-15%)
- Home Loan (8-10%)
- Vehicle Loan (10-13%)
- Education Loan (8-12%)

**Features**:
- Principal amount input
- Interest rate slider
- Loan tenure selection (months/years)
- Monthly EMI calculation
- Total interest payable
- Total amount payable
- Amortization schedule
- Currency formatting (LKR)

### 10. Multi-Language Support
**Location**: `src/contexts/LanguageContext.tsx`

Full bilingual support for English and Tamil:

**Supported Languages**:
- English (default)
- Tamil (தமிழ்)

**Translation Coverage**:
- All UI elements
- Navigation labels
- Form fields and buttons
- Error messages
- Game scenarios and options
- Success messages

**Translation Files**:
- `src/lib/translations/en.ts`
- `src/lib/translations/ta.ts`

### 11. Currency Support
**Location**: `src/contexts/CurrencyContext.tsx`

Multi-currency support with proper formatting:

**Supported Currencies**:
- INR (Indian Rupee) - ₹
- USD (US Dollar) - $
- EUR (Euro) - €
- LKR (Sri Lankan Rupee) - Rs.

**Features**:
- Currency switcher in profile/settings
- Automatic number formatting
- Thousand separators
- Decimal precision
- Symbol placement

---

## File Structure

```
spendo/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── login/page.tsx        # Login page
│   │   │   └── register/page.tsx     # Register page
│   │   ├── dashboard/page.tsx        # Main dashboard
│   │   ├── transactions/page.tsx     # Transactions list
│   │   ├── add/page.tsx             # Add transaction
│   │   ├── categories/page.tsx       # Category management
│   │   ├── reports/page.tsx          # Analytics & reports
│   │   ├── profile/page.tsx          # User profile settings
│   │   ├── launch/page.tsx           # Launch screen
│   │   ├── ask-ai/page.tsx           # AI assistant
│   │   ├── game/page.tsx             # Financial games
│   │   ├── game-scenarios/page.tsx   # Game scenario selector
│   │   ├── loan-calculator/page.tsx  # Loan EMI calculator
│   │   ├── cleanup-duplicates/page.tsx # Admin utility
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home/redirect page
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # Base UI components
│   │   │   ├── button.tsx            # Button component
│   │   │   ├── card.tsx              # Card component
│   │   │   ├── input.tsx             # Input component
│   │   │   ├── label.tsx             # Label component
│   │   │   ├── alert.tsx             # Alert component
│   │   │   ├── FormattedNumberInput.tsx # Currency input
│   │   │   ├── HexagonPattern.tsx    # Hexagon background
│   │   │   ├── PageTransition.tsx    # Page animations
│   │   │   ├── Skeleton.tsx          # Loading skeletons
│   │   │   ├── ThemeToggle.tsx       # Dark mode toggle
│   │   │   └── LoadingBee.tsx        # Bee loading animation
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   └── BottomNavigation.tsx  # Mobile bottom nav
│   │   │
│   │   ├── forms/                    # Form components
│   │   │   ├── TransactionForm.tsx   # Transaction form
│   │   │   └── CategoryForm.tsx      # Category form
│   │   │
│   │   ├── branding/                 # Branding components
│   │   │   ├── Logo.tsx              # BeeWise logo
│   │   │   └── TrustBadge.tsx        # SLIIT badge
│   │   │
│   │   ├── ai/                       # AI chat components
│   │   │   ├── ChatMessage.tsx       # Message bubbles
│   │   │   ├── ChatInput.tsx         # Chat input field
│   │   │   ├── TypingIndicator.tsx   # AI typing animation
│   │   │   ├── QuickInsightsCard.tsx # Financial summary
│   │   │   └── SuggestedQuestions.tsx # Question chips
│   │   │
│   │   ├── launch/                   # Launch screen components
│   │   │   ├── HoneycombGrid.tsx     # Hexagon grid
│   │   │   ├── HexCell.tsx           # Single hexagon
│   │   │   └── LaunchCounter.tsx     # Animated counter
│   │   │
│   │   └── game/                     # Game components
│   │       ├── OptionCard.tsx        # Game choice card
│   │       ├── ChoiceHistory.tsx     # Decision history
│   │       ├── ConfirmationDialog.tsx # Choice confirm
│   │       ├── GameResults.tsx       # Final results
│   │       └── LiveTimer.tsx         # Game timer
│   │
│   ├── contexts/                     # React contexts
│   │   ├── AuthContext.tsx           # Authentication state
│   │   ├── LanguageContext.tsx       # Language state
│   │   └── CurrencyContext.tsx       # Currency state
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── firebase.ts               # Firebase config
│   │   ├── types.ts                  # TypeScript types
│   │   ├── utils.ts                  # Utility functions
│   │   ├── categoryService.ts        # Category CRUD
│   │   ├── transactionService.ts     # Transaction CRUD
│   │   ├── openaiService.ts          # OpenAI integration
│   │   ├── financialAnalysisService.ts # Financial analysis
│   │   ├── aiPrompts.ts              # AI system prompts
│   │   ├── gameTypes.ts              # Game type definitions
│   │   ├── gameData.ts               # Scenario 1 data
│   │   ├── game2Data.ts              # Scenario 2 data
│   │   ├── game3Data.ts              # Scenario 3 data
│   │   ├── gameLogic.ts              # Scenario 1 logic
│   │   ├── game2Logic.ts             # Scenario 2 logic
│   │   ├── game3Logic.ts             # Scenario 3 logic
│   │   └── refreshDetection.ts       # Game refresh detection
│   │
│   └── hooks/                        # Custom React hooks
│       └── useLaunchStage.ts         # Launch screen state
│
├── public/                           # Static assets
│   ├── manifest.json                 # PWA manifest
│   └── icons/                        # App icons
│
├── .env.local                        # Environment variables
├── .env.example                      # Env template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind config
├── next.config.ts                    # Next.js config
├── CLAUDE.md                         # Development context
├── README.md                         # Project documentation
└── full-app-context.md              # This file
```

---

## Key Components

### 1. BottomNavigation
**Location**: `src/components/layout/BottomNavigation.tsx`

Modern 4-icon bottom navigation for mobile:

```typescript
Icons:
- Home (Home)
- Transactions (List)
- Reports (BarChart3)
- Profile (User)

Features:
- Active state highlighting
- Badge notifications
- Smooth transitions
- Fixed positioning
- Gold active color (#FFCD3F)
```

### 2. Logo Component
**Location**: `src/components/branding/Logo.tsx`

Flexible BeeWise logo component:

```typescript
Variants:
- full: Bee icon + "BeeWise" text
- icon: Bee icon only
- text: Text only

Sizes:
- sm: 32px (mobile nav)
- md: 48px (default)
- lg: 64px (headers)
- xl: 96px (launch screen)

Features:
- Animated bee icon
- Responsive sizing
- Color variants
```

### 3. LoadingBee
**Location**: `src/components/ui/LoadingBee.tsx`

Animated bee loading indicator:

```typescript
Animations:
- bee-entrance: Bee flies in from left
- bee-hover: Continuous hovering motion
- wing-flutter: Wing animation
- honey-drop: Bouncing animation

Usage:
- Page loading states
- Data fetching
- Transaction processing
```

### 4. HoneycombGrid
**Location**: `src/components/launch/HoneycombGrid.tsx`

Interactive hexagonal grid for launch screen:

```typescript
Structure:
- 3 concentric rings of hexagons
- Center hexagon (always active)
- Ring 1: 6 hexagons
- Ring 2: 12 hexagons

Features:
- Stage-based activation
- Click interactions
- Smooth transitions
- Color animations (gold glow)
```

---

## Design System

### Color Palette

#### Primary Colors
```css
--bee-primary: #FFCD3F        /* Honey Gold - Main buttons */
--bee-primary-hover: #E6B12E  /* Darker gold - Hover state */
--bee-primary-light: #FFD96B  /* Lighter gold - Accent */
--bee-secondary: #3BABCD      /* BeeWise Blue - Highlights */
--bee-dark: #232323           /* Professional dark */
```

#### Semantic Colors
```css
--success: #3BABCD            /* Blue (Income) */
--info: #FFCD3F              /* Gold (Expenses) */
--warning: #F59E0B           /* Amber (Warnings) */
--error: #EF4444             /* Red (Errors) */
```

#### Text Colors
```css
--text-primary: #0F172A      /* Slate 900 - Main text */
--text-secondary: #475569    /* Slate 600 - Secondary */
--text-muted: #94A3B8        /* Slate 400 - Muted */
```

#### Surface Colors
```css
--surface-bg: #F8FAFC        /* Slate 50 - Background */
--surface-elevated: #FFFFFF  /* White - Cards */
--surface-accent: #EFF6FF    /* Blue 50 - Accents */
--surface-border: #E2E8F0    /* Slate 200 - Borders */
```

### Typography

```css
Primary Font: Geist Sans (system font)
Monospace Font: Geist Mono (numbers/code)

Sizes:
- text-xs: 12px (labels, captions)
- text-sm: 14px (body text)
- text-base: 16px (default)
- text-lg: 18px (headings)
- text-xl: 20px (card titles)
- text-2xl: 24px (stats, amounts)
- text-3xl: 30px (page titles)
- text-5xl: 48px (hero text)
```

### Spacing & Layout

```css
Padding/Margin Scale:
- p-1: 4px
- p-2: 8px
- p-3: 12px
- p-4: 16px (standard card padding)
- p-6: 24px (large card padding)
- p-8: 32px (section padding)

Gaps:
- gap-2: 8px (tight spacing)
- gap-4: 16px (default spacing)
- gap-6: 24px (loose spacing)

Border Radius:
- rounded-lg: 12px (cards, buttons)
- rounded-2xl: 16px (large cards)
- rounded-full: 9999px (circles, pills)
```

### Animations

```css
/* Bee Entrance */
@keyframes bee-entrance {
  0% {
    transform: translateX(-100vw) rotate(-15deg) scale(0.5);
    opacity: 0;
  }
  100% {
    transform: translateX(0) rotate(0) scale(1);
    opacity: 1;
  }
}

/* Bee Hover */
@keyframes bee-hover {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-12px) rotate(2deg); }
}

/* Honey Drop */
@keyframes honey-drop {
  0%, 80%, 100% { transform: translateY(0) scale(1); }
  40% { transform: translateY(-16px) scale(1.05); }
}

/* Scale In */
@keyframes scale-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* Fade Slide Up */
@keyframes fade-slide-up {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
```

### Hexagon Background Pattern

```css
.hexagon-bg {
  background-color: var(--surface-bg);
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 80px,
      rgba(255, 205, 63, 0.02) 80px, rgba(255, 205, 63, 0.02) 81px),
    repeating-linear-gradient(60deg, transparent, transparent 80px,
      rgba(255, 205, 63, 0.02) 80px, rgba(255, 205, 63, 0.02) 81px),
    repeating-linear-gradient(120deg, transparent, transparent 80px,
      rgba(255, 205, 63, 0.02) 80px, rgba(255, 205, 63, 0.02) 81px);
  background-size: 140px 242px;
}
```

---

## Special Features

### Ask AI - Deep Dive

The Ask AI feature is the most innovative aspect of BeeWise, providing personalized financial guidance.

#### Architecture

```
User → ChatInput → OpenAI Service → Streaming Response → ChatMessage
                 ↓
        Financial Analysis Service
                 ↓
        User's Transaction Data (Firestore)
```

#### Financial Context Generation

```typescript
interface FinancialContext {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  topExpenseCategories: Array<{
    categoryName: string;
    amount: number;
    percentage: number;
  }>;
  lastMonthComparison: {
    incomeDiff: number;
    expensesDiff: number;
  };
  averageDailySpending: number;
  spendingPatterns: string[];
}
```

#### AI System Prompt Structure

```
You are BeeWise AI, a financial advisor for {userName}.

Current Financial Situation:
- Monthly Income: {totalIncome}
- Monthly Expenses: {totalExpenses}
- Net Balance: {balance}

Top Spending Categories:
1. {category1}: {amount1} ({percentage1}%)
2. {category2}: {amount2} ({percentage2}%)
...

Provide helpful, actionable advice on:
- Expense optimization
- Saving strategies
- Budget planning
- Financial goal setting

Use {currency} for all amounts.
Keep responses concise and friendly.
```

#### Suggested Questions Generation

Based on financial context:

```typescript
if (balance < 0) {
  "Why am I spending more than I earn?"
}

if (topCategory.percentage > 40) {
  "How can I reduce my {categoryName} spending?"
}

if (lastMonthComparison.expensesDiff > 20%) {
  "Why are my expenses higher this month?"
}
```

---

## Data Models

### User

```typescript
interface User {
  uid: string;                // Firebase Auth UID
  email: string;              // User email
  displayName?: string;       // Display name
  createdAt: Date;            // Account creation date
  currency?: string;          // Preferred currency (INR, USD, EUR, LKR)
  language?: string;          // Preferred language (en, ta)
}
```

### Category

```typescript
interface Category {
  id: string;                 // Firestore document ID
  name: string;               // Category name (e.g., "Food & Dining")
  type: 'income' | 'expense'; // Category type
  icon: string;               // Lucide icon name (e.g., "Utensils")
  userId: string;             // Associated user ID
  createdAt: Date;            // Creation timestamp
}
```

### Transaction

```typescript
interface Transaction {
  id: string;                 // Firestore document ID
  amount: number;             // Transaction amount
  type: 'income' | 'expense'; // Transaction type
  categoryId: string;         // Reference to category
  description: string;        // Transaction description
  date: Date;                 // Transaction date
  userId: string;             // Associated user ID
  createdAt: Date;            // Creation timestamp
}

interface TransactionWithCategory extends Transaction {
  category: Category;         // Populated category object
}
```

### Game State

```typescript
interface GameState {
  groupNumber: number;        // Group ID (1-12)
  scenarioId: string;         // 'scenario-1', 'scenario-2', 'scenario-3'
  currentStep: number;        // Current step in game
  choices: Array<{
    step: number;
    optionId: string;
    timestamp: Date;
  }>;
  startTime: Date;            // Game start time
  completedAt?: Date;         // Game completion time
  wasRefreshed: boolean;      // Refresh detection flag
  pageLoadCount: number;      // Number of page loads
  refreshTimestamps: Date[];  // Timestamps of refreshes
  studentAnswer?: number;     // Student's final balance guess
  isCorrect?: boolean;        // Was the guess correct?
  actualBalance?: number;     // Actual final balance
}
```

---

## User Journey

### New User Flow

```
1. Landing Page (/)
   ↓
2. Launch Screen (/launch)
   - Stage 0: Welcome
   - Stage 1: Activate platform
   - Stage 2: Connect ecosystem
   - Stage 3: Launch countdown
   ↓
3. Registration (/register)
   - Enter email, password, display name
   - Create account
   ↓
4. Dashboard (/dashboard)
   - See empty state
   - Prompted to add first transaction
   ↓
5. Add Transaction (/add)
   - Select type, category, enter amount
   - Add description and date
   ↓
6. Dashboard (updated)
   - View transaction in recent list
   - See updated balance
   ↓
7. Explore Features
   - View all transactions (/transactions)
   - Check reports (/reports)
   - Try Ask AI (/ask-ai)
   - Play games (/game)
   - Calculate loans (/loan-calculator)
```

### Returning User Flow

```
1. Landing Page (/)
   - Auto-redirect if logged in
   ↓
2. Dashboard (/dashboard)
   - View balance, income, expenses
   - See recent transactions
   ↓
3. Quick Actions
   - Add transaction (FAB)
   - Ask AI question
   - View reports
   - Play educational game
```

---

## Deployment & Performance

### Build Configuration

```json
// next.config.ts
{
  "output": "standalone",
  "images": {
    "domains": ["firebasestorage.googleapis.com"]
  },
  "experimental": {
    "optimizeCss": true
  }
}
```

### Performance Metrics

```
Build Output:
- Total Bundle Size: ~416KB (largest page)
- Shared Chunks: 102KB optimized
- Static Generation: All pages pre-rendered
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
```

### Optimization Features

- Code splitting by route
- Image optimization (Next.js built-in)
- Font optimization with next/font
- Tree shaking for unused code
- Minification and compression
- Firestore real-time listeners (efficient)
- React component memoization

### Environment Variables

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI Configuration (Optional - for Ask AI feature)
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

### Security Considerations

1. **Authentication**:
   - Firebase Auth handles password security
   - Session management with tokens
   - Protected routes with AuthContext

2. **Data Security**:
   - Firestore security rules (user data isolation)
   - Input validation and sanitization
   - Environment variable protection
   - HTTPS-only connections

3. **API Security**:
   - OpenAI API key stored as environment variable
   - Client-side API calls (rate limiting needed)
   - Error handling for API failures

---

## Future Enhancements

### Potential Features

- [ ] Export data to CSV/PDF
- [ ] Budget planning and tracking
- [ ] Recurring transactions
- [ ] Multi-currency real-time conversion
- [ ] Advanced data visualization charts (Chart.js/Recharts)
- [ ] Expense photo attachments (Firebase Storage)
- [ ] Social sharing features
- [ ] Dark mode enhancement
- [ ] Biometric authentication
- [ ] Push notifications for budget alerts
- [ ] Receipt scanning with OCR
- [ ] Bank account integration
- [ ] Investment portfolio tracking
- [ ] Financial goal setting with milestones

### Technical Improvements

- [ ] Offline-first architecture with IndexedDB
- [ ] Service worker for PWA
- [ ] Advanced filtering options
- [ ] Data backup/restore functionality
- [ ] Performance optimizations (React.memo, useMemo)
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Unit tests (Jest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Analytics integration (Google Analytics 4)

---

## Support & Documentation

### Resources

- **GitHub Repository**: [Link to repo]
- **Documentation**: This file + CLAUDE.md + README.md
- **Firebase Console**: [Firebase project link]
- **Deployment**: [Vercel deployment link]

### Contact

- **Developer**: SLIIT Kandy Campus
- **Email**: [Contact email]
- **Aligned with**: Central Bank of Sri Lanka's Financial Literacy Initiative

---

## License

MIT License - See LICENSE file for details

---

**BeeWise** - Building Financial Wisdom, One Decision at a Time 🐝

*Last Updated: October 13, 2025*
