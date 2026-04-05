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
Every screen and component **must** follow this hierarchy — no exceptions.
**Use the custom utility classes defined in `tailwind.config.js`:**

| Level | className | px | Usage |
|-------|-----------|-----|-------|
| Display | `text-4xl font-black` | 36 | Hero numbers (calories, age picker) |
| H1 – Screen Title | `typo-h1` | 30 | Main title at top of every screen |
| H2 – Section Title | `typo-h2` | 24 | Onboarding step titles, primary modal titles |
| H3 – Card Header | `typo-h3` | 20 | Card titles, inner section headers |
| H4 – Sub Label | `typo-h4` | 18 | Exercise names in cards, subsection titles |
| Body Primary | `typo-body-primary` | 16 | Main content, item names, secondary buttons |
| Body | `typo-body` | 16 | Regular body text |
| Button CTA | `typo-btn-cta` | 16 | Primary action buttons |
| Button Secondary | `typo-btn-secondary` | 16 | Secondary action buttons |
| Input | `typo-input` | 16 | Text input fields |
| Body Small | `typo-label` | 14 | Descriptions, field labels, helper text |
| Caption Bold | `typo-caption-bold` | 12 | ALL-CAPS labels, important metadata |
| Caption | `typo-caption` | 12 | Counts, timestamps, secondary metadata |

**Hard rules:**
- Always use the `typo-*` utility classes — never combine raw `text-{size}` + `font-{weight}` manually
- Minimum size is `typo-caption` (12px) — never use `text-[9px]`, `text-[10px]`, `text-[11px]` or any custom pixel size
- Never use `StyleSheet` or inline `style={{ fontSize: ... }}` for text size/weight — always Tailwind className
- Exception: hero display numbers that need sizes outside the scale (e.g. `style={{ fontSize: 52 }}`) are allowed only when no Tailwind class fits

## Accessibility (a11y)
Every new component **must** meet these requirements — no exceptions:

- **`accessibilityLabel`** — every interactive element (`TouchableOpacity`, `Pressable`, `Button`, custom controls) must have a descriptive label in Hebrew that describes the action (e.g. `accessibilityLabel="הוסף ארוחה"`)
- **`accessibilityRole`** — set the correct role: `button`, `link`, `header`, `image`, `checkbox`, `radio`, `tab`, `search`, `text`, etc.
- **`accessibilityHint`** — add a hint when the action isn't obvious from the label alone (e.g. `accessibilityHint="לחץ פעמיים כדי לפתוח פרטים"`)
- **`accessibilityState`** — reflect dynamic state: `{ disabled, checked, selected, expanded, busy }` as relevant
- **`accessible={true}`** — required on custom container components that should be treated as a single focusable unit
- **`importantForAccessibility`** — set to `"no"` or `"no-hide-descendants"` on decorative/icon-only elements that should be skipped by screen readers
- **Minimum touch target** — interactive elements must be at least 44×44 pt (use `minHeight` / `minWidth` or padding to ensure this)
- **Color contrast** — text and icons must meet WCAG AA (4.5:1 for normal text, 3:1 for large text / UI components); never rely on color alone to convey meaning
- **Focus order** — logical reading/tab order; avoid trapping focus inside non-modal views

**Hard rules:**
- Never ship a `TouchableOpacity` / `Pressable` without `accessibilityLabel` and `accessibilityRole`
- Icon-only buttons must have `accessibilityLabel` describing the action, not the icon name
- Images that convey meaning need `accessibilityLabel`; purely decorative images need `accessible={false}`

## Dev Server
**Always ask** before starting: regular (`npm start`) or tunnel (`npx expo start --tunnel`)?
