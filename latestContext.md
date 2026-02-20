# Latest Context (Full Application)

Last updated: 2026-02-20

## App Overview
- **Name**: BeeWise (financial literacy app with tracking, education, and games)
- **Framework**: Next.js 15.5 (App Router), TypeScript, Tailwind CSS 4
- **Backend**: Firebase Auth + Firestore
- **UI**: Shadcn/ui components + custom components, Lucide icons
- **Primary platforms**: Mobile-first web + PWA (manifest in `public/manifest.json`)
- **Languages**: English, Tamil, Sinhala (from `src/locales/*`)

## High-Level Architecture
- **Entry**: `src/app/page.tsx` routes to `/dashboard` if authenticated, else `/login`.
- **Root Layout**: `src/app/layout.tsx` wraps app in providers: `ThemeProvider`, `LoadingProvider`, `LanguageProvider`, `CurrencyProvider`, `AuthProvider`.
- **State & Services**:
  - Auth and user state in `src/contexts/AuthContext.tsx`.
  - Language and translations via `src/contexts/LanguageContext.tsx`.
  - Currency (LKR/USD) via `src/contexts/CurrencyContext.tsx`.
  - Theme (light/dark) via `src/contexts/ThemeContext.tsx`.
  - Route-change loading overlay in `src/contexts/LoadingContext.tsx`.
  - Firestore service wrappers in `src/lib/*`.

## Key Routes (App Router)
- **Auth**: `/login`, `/register`
- **Core**: `/dashboard`, `/transactions`, `/add`, `/categories`, `/reports`, `/profile`
- **AI**: `/ask-ai`
- **Games**: `/game-scenarios`, `/game`
- **Quiz (Kahoot-style)**: `/quiz` (student), `/quiz/admin` (admin)
- **Utilities**: `/loan-calculator`, `/fraud-checker`, `/settings`, `/cleanup-duplicates`
- **Informational**: `/privacy`, `/help`
- **Launch experience**: `/launch`

## Core Features
### Authentication
- Email/password login and registration via Firebase Auth.
- On sign-up, default categories are created; on sign-in, categories are ensured.

### Dashboard
- Monthly summary: income, expenses, balance, count.
- Recent transactions (latest 5).

### Transactions
- Add/edit/delete with category selection.
- Search by description or category.
- Uses `transactionService` with Firestore reads/writes.

### Categories
- User-defined income/expense categories with icons.
- Default categories auto-initialized (`categoryService`, `initializeCategoriesService`).
- Cleanup tool for duplicate categories (`/cleanup-duplicates`).

### Reports
- Monthly stats + category breakdown.
- Month/year selector.

### Ask AI
- Financial analysis from user transactions.
- OpenAI streaming chat (`gpt-3.5-turbo`) with system prompt from `aiPrompts`.
- Suggested questions + quick insights card.
- Requires `NEXT_PUBLIC_OPENAI_API_KEY`.

### Game Scenarios
- 3 scenarios implemented (student loan, investment, expense management).
- Group-based sessions (1–12), stored in `localStorage` per group.
- Step-based decisions with disabled options and dead-ends.
- Refresh detection tracked and submitted with results.
- Results can be submitted to Firestore (`gameResults` collection).

### Quiz (Classroom)
- Admin creates/resumes sessions with 6-digit PINs.
- Students join unauthenticated via `/quiz`.
- Real-time session state in Firestore.
- Kahoot-style scoring and leaderboard.
- **Security note**: Firestore rules allow public read/write for quiz sessions and participants.

### Loan Calculator
- EMI calculator with preset Sri Lankan rate ranges by loan type.

### Fraud Checker
- Searchable list of scam companies and types (local list in `spamCompany.ts`).

### Settings & Local Storage
- Admin password gate (`6164`) to clear localStorage.
- Quiz Admin uses same password.

### Privacy & Help
- Static informational pages with FAQ and support guidance.

### Launch Experience
- Multi-stage animated launch screen with draggable bee, stage progression, and background music.

## Data Model (Types)
- `User`, `Category`, `Transaction`, `TransactionWithCategory` in `src/lib/types.ts`.
- `Language` = `en | ta | si`, `Currency` = `USD | LKR`.
- Game types and results in `src/lib/gameTypes.ts`.
- Quiz types in `src/lib/quiz/types.ts`.

## Firebase / Firestore
### Firebase Config
- `src/lib/firebase.ts` reads `NEXT_PUBLIC_FIREBASE_*` env vars.

### Collections
- `users`: user profiles.
- `userMetadata`: category initialization metadata.
- `categories`: user categories.
- `transactions`: user transactions.
- `gameResults`: submitted game results.
- `quiz_sessions` + `participants` subcollection: quiz state.

### Security Rules (`firestore.rules`)
- Authenticated access only for `users`, `userMetadata`, `categories`, `transactions`.
- `gameResults` readable by any authenticated user; write/update/delete only by owner.
- `quiz_sessions` and `participants` are public read/write (unauthenticated allowed).

## Important Services
- `categoryService`: CRUD + default category list.
- `transactionService`: CRUD + date-range stats + monthly stats (client-side sorting to avoid indexes).
- `initializeCategoriesService`: atomic category initialization + duplicate cleanup.
- `financialAnalysisService`: builds AI context (top categories, trends, comparisons).
- `openaiService`: streaming chat completion calls to OpenAI API.
- `gameResultsService`: submit results, leaderboards, winner calculation.
- `quiz/service`: create/join sessions, subscribe to session/participants, submit answers, run session flow.

## UI Components (Notable)
- `BottomNavigation`: main app nav with FAB.
- `TransactionForm`, `CategoryForm`.
- AI: `ChatMessage`, `ChatInput`, `QuickInsightsCard`, `SuggestedQuestions`.
- Game: `OptionCard`, `ChoiceHistory`, `GameResults`, `LiveTimer`.
- Quiz: `AdminDashboard`, `JoinScreen`, `QuestionScreen`, `AnswerRevealScreen`, `LeaderboardScreen`.
- Branding: `Logo`, `TrustBadge`.

## Styling & Theme
- Global CSS in `src/app/globals.css` defines BeeWise color system, light/dark themes.
- Tailwind tokens map to custom CSS variables for consistent theming.

## Configuration
- `next.config.ts`: ignores ESLint and TypeScript errors during build (important for CI).
- `package.json`: Next 15.5.3, React 19, Firebase 12, Tailwind 4, Lucide icons, Zod, React Hook Form.

## Local Storage & Session Usage
- Game state saved in `localStorage` per group.
- Refresh tracking in `sessionStorage` for games.
- Language/currency/theme preferences in `localStorage`.
- Quiz admin session + student session/participant IDs stored in `sessionStorage`.

## Documentation / Notes
- Root docs: `full-app-context.md`, `FIREBASE_SETUP.md`, `ANIMATIONS_GUIDE.md`, `launch.md`, `game*.md` and winpath/disabled-option notes.
- These are reference docs and not runtime logic.
