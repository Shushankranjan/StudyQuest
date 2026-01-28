# StudyQuest

A gamified study session tracker built with React, TypeScript, and Supabase.

## Folder Structure

```
StudyQuest/
├── public/                    # Static assets
│   └── robots.txt             # Search engine crawler configuration
│
├── src/                       # Source code
│   ├── components/            # Reusable React components
│   │   ├── achievements/      # Achievement-related components
│   │   │   └── AchievementCard.tsx
│   │   ├── dashboard/         # Dashboard page components
│   │   │   ├── QuestsCard.tsx
│   │   │   ├── StartStudyButton.tsx
│   │   │   ├── StreakCard.tsx
│   │   │   ├── TodayStatsCard.tsx
│   │   │   └── XpLevelCard.tsx
│   │   ├── layout/            # Layout components
│   │   │   ├── AppLayout.tsx
│   │   │   └── Navbar.tsx
│   │   ├── stats/             # Statistics page components
│   │   │   ├── AllTimeStats.tsx
│   │   │   ├── SessionHistory.tsx
│   │   │   └── WeeklyChart.tsx
│   │   ├── study/             # Study session components
│   │   │   ├── DurationSelector.tsx
│   │   │   ├── TimerControls.tsx
│   │   │   ├── TimerDisplay.tsx
│   │   │   └── XpPreview.tsx
│   │   ├── ui/                # shadcn/ui components
│   │   ├── LevelUpModal.tsx   # Level up notification modal
│   │   ├── NavLink.tsx        # Navigation link component
│   │   ├── ProtectedRoute.tsx # Route protection for auth
│   │   └── XpPopup.tsx        # XP gain popup notification
│   │
│   ├── contexts/              # React context providers
│   │   └── AuthContext.tsx    # Authentication context
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-mobile.tsx     # Mobile device detection
│   │   ├── use-toast.ts       # Toast notifications
│   │   ├── useAchievements.ts # Achievements data hook
│   │   ├── useDailyQuests.ts  # Daily quests data hook
│   │   ├── useProfile.ts      # User profile data hook
│   │   ├── useStreak.ts       # Study streak data hook
│   │   ├── useStudySessions.ts # Study sessions data hook
│   │   └── useTimer.ts        # Timer functionality hook
│   │
│   ├── integrations/          # External service integrations
│   │   └── supabase/          # Supabase client and types
│   │       ├── client.ts      # Supabase client configuration
│   │       └── types.ts       # Database type definitions
│   │
│   ├── lib/                   # Utility libraries
│   │   └── utils.ts           # General utility functions
│   │
│   ├── pages/                 # Page components (routes)
│   │   ├── Achievements.tsx   # Achievements page
│   │   ├── Auth.tsx           # Authentication page
│   │   ├── Dashboard.tsx      # Main dashboard page
│   │   ├── Index.tsx          # Landing/home page
│   │   ├── NotFound.tsx       # 404 error page
│   │   ├── Stats.tsx          # Statistics page
│   │   └── Study.tsx          # Study session page
│   │
│   ├── types/                 # TypeScript type definitions
│   │   └── gamification.ts    # Gamification-related types
│   │
│   ├── App.css                # App-level styles
│   ├── App.tsx                # Main App component with routing
│   ├── index.css              # Global styles
│   ├── main.tsx               # Application entry point
│   └── vite-env.d.ts          # Vite environment types
│
├── supabase/                  # Supabase configuration
│   ├── config.toml            # Supabase local config
│   └── migrations/            # Database migrations
│
├── components.json            # shadcn/ui configuration
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML entry point
├── package.json               # Project dependencies
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── tsconfig.app.json          # App-specific TS config
├── tsconfig.node.json         # Node-specific TS config
└── vite.config.ts             # Vite build configuration
```

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend/Database**: Supabase
- **State Management**: TanStack React Query
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build with development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
