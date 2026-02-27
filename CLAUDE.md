# CLAUDE.md

**Always respond in Hebrew** (code/variables/technical terms stay in English).

## Stack
React Native + Expo v54, TypeScript strict, NativeWind (Tailwind), Expo Router, React Query, Zustand, Supabase, Reanimated/Lottie.

## Structure
- `app/` - pages (Expo Router file-based)
- `src/Features/` - domain modules
- `src/service/` - Supabase calls only
- `src/hooks/` - React Query wrappers around services
- `src/store/` - Zustand (useUIStore, workoutsStore)
- `src/types/` - TypeScript interfaces
- `src/ui/` - shared UI components

## Data Flow
Services → Hooks (React Query, `staleTime: Infinity`) → Components. Components never call services directly.

## Rules
- Styling: Tailwind via `className` only, no StyleSheet. Colors in `colors.ts` / `tailwind.config.js`
- TypeScript: no `any`, interfaces for all props/state, types in `src/types/`
- Code changes: fix only what's asked, don't refactor unrelated code, preserve structure
- Renders: useCallback/useMemo for stability, update state before navigation

## Dev Server
**Always ask** before starting: regular (`npm start`) or tunnel (`npx expo start --tunnel`)?
