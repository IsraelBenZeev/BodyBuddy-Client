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
- Reusable components: if a new component is likely to be used in more than one place, place it in `src/ui/` and make it as generic as possible (accept props instead of hardcoding data, no feature-specific logic)

## Typography System
Every screen and component **must** follow this hierarchy — no exceptions:

| Level | className | px | Usage |
|-------|-----------|-----|-------|
| Display | `text-4xl font-black` | 36 | Hero numbers (calories, age picker) |
| H1 – Screen Title | `text-3xl font-black` | 30 | Main title at top of every screen |
| H2 – Section Title | `text-2xl font-black` | 24 | Onboarding step titles, primary modal titles |
| H3 – Card Header | `text-xl font-bold` | 20 | Card titles, inner section headers |
| H4 – Sub Label | `text-lg font-bold` | 18 | Exercise names in cards, subsection titles |
| Body Primary | `text-base font-semibold` | 16 | Main content, item names, secondary buttons |
| Body | `text-base` | 16 | Regular body text |
| Button CTA | `text-base font-extrabold` | 16 | Primary action buttons |
| Body Small | `text-sm font-medium` | 14 | Descriptions, field labels, helper text |
| Caption Bold | `text-xs font-bold` | 12 | ALL-CAPS labels, important metadata |
| Caption | `text-xs` | 12 | Counts, timestamps, secondary metadata |

**Hard rules:**
- Minimum size is `text-xs` (12px) — never use `text-[9px]`, `text-[10px]`, `text-[11px]` or any custom pixel size
- Never use `StyleSheet` or inline `style={{ fontSize: ... }}` for text size/weight — always Tailwind className
- Exception: hero display numbers that need sizes outside the scale (e.g. `style={{ fontSize: 52 }}`) are allowed only when no Tailwind class fits

## Dev Server
**Always ask** before starting: regular (`npm start`) or tunnel (`npx expo start --tunnel`)?
