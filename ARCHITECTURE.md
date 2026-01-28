# StudyQuest Architecture

This document provides a comprehensive overview of the StudyQuest application architecture, a gamified study session tracker built with modern web technologies.

## Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [System Architecture Diagram](#system-architecture-diagram)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Data Flow](#data-flow)
6. [Database Schema](#database-schema)
7. [Authentication Flow](#authentication-flow)
8. [State Management](#state-management)
9. [Component Architecture](#component-architecture)
10. [Technology Stack](#technology-stack)

---

## High-Level Overview

StudyQuest is a single-page application (SPA) that gamifies the study experience by tracking study sessions, awarding XP points, maintaining streaks, and providing achievement badges. The application follows a client-server architecture with a React frontend and Supabase as the backend-as-a-service (BaaS) platform.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           StudyQuest System                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────────────┐         ┌──────────────────────────────────┐ │
│   │    React Frontend    │ ◄─────► │         Supabase Backend         │ │
│   │  (Vite + TypeScript) │  HTTPS  │  (PostgreSQL + Auth + Realtime)  │ │
│   └──────────────────────┘         └──────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT SIDE                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              Presentation Layer                             │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────────────┐  │ │
│  │  │   Pages      │ │  Dashboard   │ │    Study     │ │   Achievements    │  │ │
│  │  │  - Index     │ │  Components  │ │  Components  │ │   & Stats         │  │ │
│  │  │  - Auth      │ │              │ │              │ │   Components      │  │ │
│  │  │  - Study     │ │              │ │              │ │                   │  │ │
│  │  │  - Stats     │ │              │ │              │ │                   │  │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └───────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                        │                                         │
│                                        ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                               State Layer                                   │ │
│  │  ┌──────────────────────┐  ┌──────────────────────┐  ┌───────────────────┐ │ │
│  │  │   React Query        │  │   Auth Context       │  │   Custom Hooks    │ │ │
│  │  │   (Server State)     │  │   (User State)       │  │   (UI State)      │ │ │
│  │  │   - Caching          │  │   - Session          │  │   - useTimer      │ │ │
│  │  │   - Mutations        │  │   - Sign In/Out      │  │   - useProfile    │ │ │
│  │  │   - Invalidation     │  │   - Sign Up          │  │   - useStreak     │ │ │
│  │  └──────────────────────┘  └──────────────────────┘  └───────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                        │                                         │
│                                        ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                           Integration Layer                                 │ │
│  │  ┌──────────────────────────────────────────────────────────────────────┐  │ │
│  │  │                      Supabase Client SDK                              │  │ │
│  │  │   - Authentication     - Database Queries     - Real-time             │  │ │
│  │  └──────────────────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         │ HTTPS / WebSocket
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   SERVER SIDE                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              Supabase Platform                              │ │
│  │                                                                              │ │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────────────────────┐  │ │
│  │  │  Auth Service  │  │   PostgREST    │  │      PostgreSQL Database     │  │ │
│  │  │  - JWT Tokens  │  │   (REST API)   │  │  ┌─────────────────────────┐ │  │ │
│  │  │  - Sessions    │  │   - Auto API   │  │  │  Tables:                │ │  │ │
│  │  │  - OAuth       │  │   - CRUD       │  │  │  - profiles             │ │  │ │
│  │  └────────────────┘  └────────────────┘  │  │  - study_sessions       │ │  │ │
│  │                                           │  │  - daily_quests         │ │  │ │
│  │  ┌────────────────┐  ┌────────────────┐  │  │  - achievements         │ │  │ │
│  │  │   Realtime     │  │  Row Level     │  │  │  - xp_log               │ │  │ │
│  │  │   Engine       │  │  Security      │  │  └─────────────────────────┘ │  │ │
│  │  │   (WebSocket)  │  │  (RLS)         │  └──────────────────────────────┘  │ │
│  │  └────────────────┘  └────────────────┘                                     │ │
│  │                                                                              │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with concurrent features |
| **TypeScript** | Type safety and developer experience |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | Accessible component library |
| **TanStack Query** | Server state management |
| **React Router** | Client-side routing |
| **Recharts** | Data visualization |
| **React Hook Form + Zod** | Form handling and validation |

### Project Structure

```
src/
├── components/           # Reusable React components
│   ├── achievements/     # Achievement-related components
│   ├── dashboard/        # Dashboard page components
│   ├── layout/           # Layout components (Navbar, AppLayout)
│   ├── stats/            # Statistics page components
│   ├── study/            # Study session components
│   └── ui/               # shadcn/ui base components
│
├── contexts/             # React Context providers
│   └── AuthContext.tsx   # Authentication state management
│
├── hooks/                # Custom React hooks
│   ├── useTimer.ts       # Timer functionality
│   ├── useProfile.ts     # User profile operations
│   ├── useStreak.ts      # Streak tracking
│   ├── useStudySessions.ts # Study session management
│   ├── useDailyQuests.ts # Quest system
│   └── useAchievements.ts # Achievement system
│
├── integrations/         # External service integrations
│   └── supabase/         # Supabase client and types
│
├── lib/                  # Utility functions
│   └── utils.ts          # Helper functions (cn, etc.)
│
├── pages/                # Route page components
│   ├── Index.tsx         # Landing/Dashboard page
│   ├── Auth.tsx          # Authentication page
│   ├── Study.tsx         # Study session page
│   ├── Stats.tsx         # Statistics page
│   └── Achievements.tsx  # Achievements page
│
└── types/                # TypeScript type definitions
    └── gamification.ts   # Gamification domain types
```

### Component Hierarchy

```
App
├── QueryClientProvider (TanStack Query)
│   └── AuthProvider (Authentication Context)
│       └── TooltipProvider (UI Provider)
│           └── BrowserRouter (Routing)
│               ├── Auth (Public)
│               ├── Index (Public/Protected)
│               └── ProtectedRoute
│                   ├── Study
│                   ├── Stats
│                   └── Achievements
```

---

## Backend Architecture

### Supabase Services

StudyQuest utilizes Supabase as a complete backend solution:

```
┌─────────────────────────────────────────────────────────────┐
│                     Supabase Backend                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                Authentication                        │    │
│  │  • Email/Password sign up and sign in               │    │
│  │  • JWT-based session management                     │    │
│  │  • Automatic token refresh                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                Database (PostgreSQL)                 │    │
│  │  • Auto-generated REST API via PostgREST            │    │
│  │  • Row Level Security (RLS) for data isolation      │    │
│  │  • Database triggers for automation                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                Security (RLS Policies)               │    │
│  │  • Users can only read/write their own data         │    │
│  │  • Automatic user_id verification                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Database Triggers

```sql
-- Automatic profile creation on user signup
on_auth_user_created → handle_new_user() → INSERT into profiles

-- Automatic timestamp updates
update_profiles_updated_at → update_updated_at_column() → UPDATE updated_at
```

---

## Data Flow

### Study Session Flow

```
┌─────────┐    ┌───────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User   │───►│  Timer    │───►│ Complete │───►│  Save    │───►│  Update  │
│ Starts  │    │  Running  │    │ Session  │    │ Session  │    │  Profile │
│ Session │    │           │    │          │    │ to DB    │    │  XP/Stats│
└─────────┘    └───────────┘    └──────────┘    └──────────┘    └──────────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │   Check      │
                              │  Quests &    │
                              │ Achievements │
                              └──────────────┘
```

### Data Synchronization

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Data Flow                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   React Component                                                    │
│        │                                                             │
│        ▼                                                             │
│   Custom Hook (useProfile, useStudySessions, etc.)                  │
│        │                                                             │
│        ▼                                                             │
│   TanStack Query                                                     │
│   ┌─────────────────────────────────────────────────────────┐       │
│   │  • Cache queries with unique keys                        │       │
│   │  • Automatic background refetching                       │       │
│   │  • Optimistic updates via mutations                      │       │
│   │  • Cache invalidation on data changes                    │       │
│   └─────────────────────────────────────────────────────────┘       │
│        │                                                             │
│        ▼                                                             │
│   Supabase Client                                                    │
│        │                                                             │
│        ▼                                                             │
│   Supabase API (PostgREST)                                          │
│        │                                                             │
│        ▼                                                             │
│   PostgreSQL Database                                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            Database Schema                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────┐                                                            │
│  │  auth.users     │ (Supabase managed)                                         │
│  │  ─────────────  │                                                            │
│  │  id (PK)        │                                                            │
│  │  email          │                                                            │
│  │  ...            │                                                            │
│  └────────┬────────┘                                                            │
│           │                                                                      │
│           │ 1:1                                                                  │
│           ▼                                                                      │
│  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐        │
│  │    profiles     │       │ study_sessions  │       │  daily_quests   │        │
│  │  ─────────────  │       │  ─────────────  │       │  ─────────────  │        │
│  │  id (PK, FK)    │◄──1:N─│  id (PK)        │       │  id (PK)        │        │
│  │  email          │       │  user_id (FK)   │───►   │  user_id (FK)   │───┐    │
│  │  total_xp       │       │  duration_mins  │       │  quest_type     │   │    │
│  │  level          │       │  xp_earned      │       │  title          │   │    │
│  │  current_streak │       │  started_at     │       │  target_value   │   │    │
│  │  last_session   │       │  completed_at   │       │  current_value  │   │    │
│  │  total_sessions │       │  created_at     │       │  xp_reward      │   │    │
│  │  total_minutes  │       └─────────────────┘       │  quest_date     │   │    │
│  │  created_at     │                                 │  completed      │   │    │
│  │  updated_at     │                                 └─────────────────┘   │    │
│  └─────────────────┘                                                       │    │
│           ▲                                                                │    │
│           │                                                                │    │
│           │ 1:N                                                            │    │
│           │                                                                │    │
│  ┌─────────────────┐       ┌─────────────────┐                            │    │
│  │  achievements   │       │     xp_log      │                            │    │
│  │  ─────────────  │       │  ─────────────  │                            │    │
│  │  id (PK)        │       │  id (PK)        │◄───────────────────────────┘    │
│  │  user_id (FK)   │───►   │  user_id (FK)   │                                 │
│  │  badge_type     │       │  xp_amount      │                                 │
│  │  badge_name     │       │  source         │ (session/quest/achievement)     │
│  │  badge_desc     │       │  source_id      │                                 │
│  │  unlocked_at    │       │  created_at     │                                 │
│  └─────────────────┘       └─────────────────┘                                 │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Table Descriptions

| Table | Description |
|-------|-------------|
| **profiles** | User profile data including XP, level, streak, and aggregate statistics |
| **study_sessions** | Individual study session records with duration and XP earned |
| **daily_quests** | Daily challenge quests with progress tracking |
| **achievements** | Unlocked badges/achievements for users |
| **xp_log** | Audit log of all XP transactions |

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring users can only access their own data:

```sql
-- Example policy pattern
CREATE POLICY "Users can view their own data" 
  ON public.table_name FOR SELECT 
  USING (auth.uid() = user_id);
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Authentication Flow                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  SIGN UP:                                                                        │
│  ┌──────┐    ┌───────────────┐    ┌──────────────┐    ┌────────────────────┐    │
│  │ User │───►│ Auth.tsx Page │───►│ AuthContext  │───►│ supabase.auth      │    │
│  │      │    │ (Form Submit) │    │ signUp()     │    │ .signUp()          │    │
│  └──────┘    └───────────────┘    └──────────────┘    └─────────┬──────────┘    │
│                                                                  │               │
│                                                                  ▼               │
│                                                    ┌────────────────────────┐   │
│                                                    │ Supabase Auth Service  │   │
│                                                    │ • Create user          │   │
│                                                    │ • Trigger: create      │   │
│                                                    │   profile              │   │
│                                                    │ • Return session       │   │
│                                                    └────────────────────────┘   │
│                                                                                  │
│  SIGN IN:                                                                        │
│  ┌──────┐    ┌───────────────┐    ┌──────────────┐    ┌────────────────────┐    │
│  │ User │───►│ Auth.tsx Page │───►│ AuthContext  │───►│ supabase.auth      │    │
│  │      │    │ (Form Submit) │    │ signIn()     │    │ .signInWithPassword│    │
│  └──────┘    └───────────────┘    └──────────────┘    └─────────┬──────────┘    │
│                                                                  │               │
│                                                                  ▼               │
│                                                    ┌────────────────────────┐   │
│                                                    │ Returns JWT Session    │   │
│                                                    │ • Stored in localStorage│  │
│                                                    │ • Auto-refreshed       │   │
│                                                    └────────────────────────┘   │
│                                                                                  │
│  SESSION PERSISTENCE:                                                            │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │  AuthContext useEffect:                                                    │  │
│  │  1. Set up onAuthStateChange listener                                      │  │
│  │  2. Check for existing session (getSession)                                │  │
│  │  3. Update user/session state on changes                                   │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## State Management

### State Categories

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            State Management                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         SERVER STATE                                     │    │
│  │                    (TanStack Query + Supabase)                          │    │
│  │                                                                          │    │
│  │  • Profile data (XP, level, streak, statistics)                         │    │
│  │  • Study sessions history                                                │    │
│  │  • Daily quests and progress                                            │    │
│  │  • Achievements                                                          │    │
│  │                                                                          │    │
│  │  Query Keys:                                                             │    │
│  │  - ['profile', userId]                                                   │    │
│  │  - ['study-sessions', userId]                                            │    │
│  │  - ['today-sessions', userId]                                            │    │
│  │  - ['week-sessions', userId]                                             │    │
│  │  - ['daily-quests', userId, date]                                        │    │
│  │  - ['achievements', userId]                                              │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         CLIENT STATE                                     │    │
│  │                      (React Context + Hooks)                            │    │
│  │                                                                          │    │
│  │  AuthContext:                                                            │    │
│  │  • user - Current authenticated user                                     │    │
│  │  • session - Current session with JWT                                    │    │
│  │  • loading - Auth initialization state                                   │    │
│  │                                                                          │    │
│  │  useTimer (useState):                                                    │    │
│  │  • isRunning - Timer active state                                        │    │
│  │  • isPaused - Timer paused state                                         │    │
│  │  • duration - Selected duration                                          │    │
│  │  • remaining - Time remaining                                            │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                          UI STATE                                        │    │
│  │                    (Component-level useState)                           │    │
│  │                                                                          │    │
│  │  • Modal visibility states                                               │    │
│  │  • Form input values                                                     │    │
│  │  • Tab selections                                                        │    │
│  │  • Toast notifications                                                   │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Custom Hooks Architecture

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                            Custom Hooks                                        │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  useProfile()                    useStudySessions()                           │
│  ├── profile                     ├── sessions                                 │
│  ├── isLoading                   ├── todaySessions                            │
│  ├── updateProfile()             ├── weekSessions                             │
│  └── addXp()                     ├── completeSession()                        │
│                                  ├── todayMinutes                             │
│                                  └── todaySessionCount                        │
│                                                                                │
│  useStreak()                     useDailyQuests()                             │
│  ├── streak                      ├── quests                                   │
│  ├── isActive                    ├── isLoading                                │
│  └── updateStreak()              ├── generateDailyQuests()                    │
│                                  └── updateQuestProgress()                    │
│                                                                                │
│  useAchievements()               useTimer()                                   │
│  ├── achievements                ├── timerState                               │
│  ├── unlockedAchievements        ├── start()                                  │
│  ├── checkAndUnlock()            ├── pause()                                  │
│  └── isLoading                   ├── resume()                                 │
│                                  └── reset()                                  │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Page Components

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                              Page Components                                   │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌─────────────────┐                                                          │
│  │  Index/Dashboard │                                                          │
│  │  ┌─────────────┐ │     ┌─────────────┐     ┌─────────────────┐             │
│  │  │ XpLevelCard │ │     │  Study Page │     │ Achievements    │             │
│  │  ├─────────────┤ │     │ ┌─────────┐ │     │ ┌─────────────┐ │             │
│  │  │ StreakCard  │ │     │ │Duration │ │     │ │Achievement  │ │             │
│  │  ├─────────────┤ │     │ │Selector │ │     │ │Card         │ │             │
│  │  │TodayStats   │ │     │ ├─────────┤ │     │ │(for each)   │ │             │
│  │  │   Card      │ │     │ │Timer    │ │     │ └─────────────┘ │             │
│  │  ├─────────────┤ │     │ │Display  │ │     └─────────────────┘             │
│  │  │ QuestsCard  │ │     │ ├─────────┤ │                                     │
│  │  └─────────────┘ │     │ │Timer    │ │     ┌─────────────────┐             │
│  └─────────────────┘     │ │Controls │ │     │  Stats Page     │             │
│                           │ ├─────────┤ │     │ ┌─────────────┐ │             │
│                           │ │XpPreview│ │     │ │WeeklyChart  │ │             │
│                           │ └─────────┘ │     │ ├─────────────┤ │             │
│                           └─────────────┘     │ │AllTimeStats │ │             │
│                                               │ ├─────────────┤ │             │
│                                               │ │Session      │ │             │
│                                               │ │History      │ │             │
│                                               │ └─────────────┘ │             │
│                                               └─────────────────┘             │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Layout Components

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                              AppLayout                                         │
├───────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                              Navbar                                      │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐   │  │
│  │  │  Logo    │  Dashboard  │  Study  │  Stats  │  Achievements  │ User│  │  │
│  │  └──────────────────────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                         Main Content Area                                │  │
│  │                                                                          │  │
│  │                         {children}                                       │  │
│  │                                                                          │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  LevelUpModal (conditional)    XpPopup (conditional)                     │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Complete Technology Overview

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           Technology Stack                                     │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  FRONTEND                                                                      │
│  ─────────────────────────────────────────────────────────────────────────    │
│  Framework:        React 18 (with concurrent features)                         │
│  Language:         TypeScript 5.x                                              │
│  Build Tool:       Vite 5.x (esbuild + Rollup)                                │
│  Styling:          Tailwind CSS 3.x + tailwindcss-animate                     │
│  Components:       shadcn/ui (Radix UI primitives)                            │
│  Routing:          React Router DOM 6.x                                        │
│  State:            TanStack Query 5.x (server state)                          │
│  Forms:            React Hook Form + Zod validation                            │
│  Charts:           Recharts 2.x                                                │
│  Icons:            Lucide React                                                │
│  Notifications:    Sonner                                                      │
│  Date Handling:    date-fns                                                    │
│                                                                                │
│  BACKEND                                                                       │
│  ─────────────────────────────────────────────────────────────────────────    │
│  Platform:         Supabase (BaaS)                                             │
│  Database:         PostgreSQL 14+                                              │
│  API:              PostgREST (auto-generated REST)                             │
│  Auth:             Supabase Auth (JWT-based)                                   │
│  Security:         Row Level Security (RLS)                                    │
│                                                                                │
│  DEVELOPMENT                                                                   │
│  ─────────────────────────────────────────────────────────────────────────    │
│  Linting:          ESLint 9.x + typescript-eslint                              │
│  Package Manager:  npm / bun                                                   │
│  Version Control:  Git                                                         │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                         Deployment Architecture                                │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                    Build Process (Vite)                                  │  │
│  │                                                                          │  │
│  │   src/           vite build        dist/                                 │  │
│  │   ├── *.tsx  ──────────────────►  ├── index.html                        │  │
│  │   ├── *.ts                        ├── assets/                            │  │
│  │   └── *.css                       │   ├── *.js (bundled)                 │  │
│  │                                   │   └── *.css (bundled)                │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                      │
│                                         ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                    Static Hosting Options                                │  │
│  │                                                                          │  │
│  │   • Vercel          • Netlify        • GitHub Pages                      │  │
│  │   • Cloudflare      • AWS S3 + CF    • Firebase Hosting                  │  │
│  │                                                                          │  │
│  │   Requirements:                                                          │  │
│  │   • SPA routing (redirect all routes to index.html)                     │  │
│  │   • Environment variables for Supabase credentials                       │  │
│  │     - VITE_SUPABASE_URL                                                  │  │
│  │     - VITE_SUPABASE_PUBLISHABLE_KEY                                      │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Security Considerations

### Security Model

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           Security Architecture                                │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  AUTHENTICATION                                                                │
│  ─────────────────────────────────────────────────────────────────────────    │
│  • JWT tokens with automatic refresh                                           │
│  • Secure session storage in localStorage                                      │
│  • Email/password authentication                                               │
│                                                                                │
│  AUTHORIZATION (Row Level Security)                                            │
│  ─────────────────────────────────────────────────────────────────────────    │
│  • All tables have RLS enabled                                                 │
│  • Users can only access their own data                                        │
│  • Policies verify auth.uid() matches user_id                                  │
│                                                                                │
│  DATA PROTECTION                                                               │
│  ─────────────────────────────────────────────────────────────────────────    │
│  • HTTPS for all API communications                                            │
│  • Environment variables for sensitive config                                  │
│  • No sensitive data stored client-side                                        │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Gamification System

### XP and Leveling

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           Gamification System                                  │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  XP SOURCES                                                                    │
│  ─────────────────────────────────────────────────────────────────────────    │
│  • Study Sessions: 1 XP per minute studied                                     │
│  • Daily Quests: Variable XP rewards (50 XP default)                          │
│  • Achievements: One-time XP bonuses                                           │
│                                                                                │
│  LEVELING FORMULA                                                              │
│  ─────────────────────────────────────────────────────────────────────────    │
│  Level = floor(total_xp / 500) + 1                                            │
│                                                                                │
│  Level 1:    0 - 499 XP                                                        │
│  Level 2:  500 - 999 XP                                                        │
│  Level 3: 1000 - 1499 XP                                                       │
│  ...                                                                           │
│                                                                                │
│  ACHIEVEMENTS (12 Total)                                                       │
│  ─────────────────────────────────────────────────────────────────────────    │
│  Streak:     7-day, 30-day, 100-day                                           │
│  XP:         1K, 5K, 10K total XP                                              │
│  Sessions:   10, 50, 100 sessions                                              │
│  Minutes:    60, 600 (10hr), 3000 (50hr)                                       │
│                                                                                │
│  DAILY QUESTS (3 Types)                                                        │
│  ─────────────────────────────────────────────────────────────────────────    │
│  • Session Sprint: Complete N sessions                                         │
│  • Time Warrior: Study for N minutes                                           │
│  • Deep Focus: Complete a long session (45+ min)                              │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Future Considerations

### Potential Enhancements

- **Real-time Features**: Leverage Supabase Realtime for live updates
- **Social Features**: Friends, leaderboards, study groups
- **Push Notifications**: Study reminders and streak alerts
- **Mobile App**: React Native version using shared business logic
- **Analytics Dashboard**: Advanced statistics and insights
- **OAuth Providers**: Google, GitHub, Discord sign-in
- **Offline Support**: Service worker for offline functionality

---

*Last updated: January 2026*
