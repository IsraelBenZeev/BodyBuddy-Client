# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language

**Always respond in Hebrew** (except for code, variables, and technical terms which remain in English).

## Commands

```bash
npm install          # Install dependencies
npm start            # Start Expo dev server (alias: npx expo start)
npx expo start --tunnel # Start Expo dev server with tunnel (for physical devices)
npm run android      # Run on Android emulator
npm run ios          # Run on iOS simulator
npm run web          # Run in web browser
npm run lint         # Run ESLint via expo lint
npm run reset-project # Reset to blank project structure

## Technology Stack

- **Framework:** React Native with Expo (v54) and New Architecture enabled
- **Language:** TypeScript (strict mode)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Navigation:** Expo Router (file-based routing)
- **Server State:** React Query (@tanstack/react-query)
- **UI State:** Zustand
- **Backend:** Supabase (PostgreSQL)
- **Animations:** React Native Reanimated, Lottie

## Architecture

### File Structure
- `app/` - Expo Router pages (file-based routing)
  - `(tabs)/` - Bottom tab navigation (Home, Workouts, Nutrition, Profile)
  - `exercise/[exerciseId].tsx` - Exercise detail modal
  - `exercises/[parts].tsx` - Exercise list by body parts
  - `form_create_Workout/[mode].tsx` - Workout plan form
  - `workout_plan/[paramse].tsx` - Workout session review
- `src/Features/` - Domain modules (avatar, exercises, workoutsPlans)
- `src/service/` - Supabase API calls (exercisesService, workoutService, sessionService)
- `src/hooks/` - React Query hooks wrapping services
- `src/store/` - Zustand stores (useUIStore, workoutsStore)
- `src/types/` - TypeScript interfaces
- `src/ui/` - Shared UI components

### Data Flow Pattern
1. Services (`src/service/`) contain all Supabase calls
2. Hooks (`src/hooks/`) wrap services with React Query
3. Components use hooks only, never call services directly
4. React Query handles caching with `staleTime: Infinity` (manual invalidation)

### State Management
- **Server state:** React Query with infinite pagination for lists
- **UI state:** Zustand for global notifications (useUIStore) and selected exercises (workoutsStore)
- **Referential Identity:** Prioritize useCallback/useMemo for stability

## Coding Guidelines


## Running the Project
-Always ask the user before starting the dev server whether they want to run a regular start (npm start) or use a tunnel (npx expo start --tunnel).
-Use the tunnel option if the user needs to test on a physical device outside the local network.


### Styling
- Use **only Tailwind CSS** via `className` prop
- Do NOT use React Native StyleSheet unless explicitly required
- Colors defined in `colors.ts` and extended in `tailwind.config.js`

### TypeScript
- Strict types required - no `any` types
- Define interfaces for all Props and State
- Types in `src/types/`

### Code Changes
- Focus only on the specific fix requested
- Do not refactor unrelated logic
- Do not rename existing variables unless necessary for the fix
- Preserve original code structure

### React Native Best Practices
- Use Hooks appropriately
- Optimize renders with useCallback/useMemo
- Update state before navigation/URL changes to prevent race conditions
```
