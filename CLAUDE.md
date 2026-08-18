# CLAUDE.md

**Always respond in Hebrew** (code/variables/technical terms stay in English).

## Stack
React Native + Expo v54, TypeScript strict, NativeWind (Tailwind), Expo Router, React Query, Zustand, Supabase, Reanimated/Lottie.

## Backend Server (separate repo — actively used)
There is a separate FastAPI backend that this app calls for operations that need a server-side secret (OpenAI/Google keys, Cloudinary, Supabase service role). Client calls use `Authorization: Bearer <supabase JWT>`; the server verifies it via `verify_supabase_token` (Supabase JWKS) in its own `dependencies.py`.
- Local path: `C:\Users\user\Documents\projects\BodyBuddy-Server`
- Deployed URL: `https://bodybuddy-server-eta.vercel.app/`
- Called today (via `EXPO_PUBLIC_*_URL` env vars in `.env`): AI food-photo analysis (`nutritionService.ts` → `/nutrition/analyze-food`), custom exercise image uploads (`cloudinaryService.ts` → `/uploads/custom-exercise-images`), exercise-missing reports, privacy policy content
- It also has an admin panel (`require_admin`, checks `profiles.is_admin`) with routes like `DELETE /admin/users/{id}` for admin-triggered user deletion, and existing `delete_user()` logic in `controllers/admin_controller.py` that already works around the `body_stats` FK not cascading
- When adding a new privileged/server-side operation, prefer adding a route to this server (consistent with existing patterns) over a Supabase Edge Function, unless told otherwise

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

## Design Language

The visual identity is dark, premium, and lime-accented. Every new component must follow these rules.

### Colors
- **Primary accent**: `lime[300]` (`rgb(213,255,95)`) for active icons/text, `lime[500]` (`rgb(150,200,40)`) for borders/backgrounds
- **Backgrounds**: `background[900]` for surfaces/tab bar, `background[950]` for main card containers
- **Secondary text**: `background[400]` for inactive/muted labels
- **Semantic**: `orange[400]` for carbs, `rgb(234,179,8)` for fat, `red[400]` for danger/overage

### Roundedness
| Element | Value |
|---------|-------|
| Full pills (buttons, tab bar, chips) | `rounded-full` / `borderRadius: 32` |
| Cards, modals, large containers | `rounded-3xl` |
| Small chips / inline badges | `rounded-2xl` |
| Never | `rounded-sm`, `rounded-md`, `rounded-lg`, or no rounding on interactive elements |

### Interactive Elements (Buttons)
**Always use `src/ui/ActionButton.tsx` for buttons — never build a custom button from scratch.**

`ActionButton` supports: `variant` (`outline` / `secondary` / `primary`), `size` (`sm` / `md` / `lg`), `iconName`, `label`, `fullWidth`, `loading`, `disabled`.

- **Shape**: always `rounded-full`
- **Structure**: icon wrapper (circle) + label text side by side
- **Focused/primary state**: semi-transparent lime background + colored border
  - Background: `rgba(150, 200, 40, 0.18–0.25)`
  - Border: `rgba(150, 200, 40, 0.45–0.5)` with `borderWidth: 1`
  - Icon color: `lime[300]`
- **Inactive/secondary state**: `transparent` background, `background[400]` color
- Never use solid opaque lime fill for buttons — always semi-transparent

### Cards & Containers
- Background: semi-transparent dark (`bg-background-950`, `bg-white/[0.03]`)
- Border: `borderWidth: 1` with low-opacity color (`rgba(255,255,255,0.05–0.10)` or colored at `0.25–0.35`)
- Padding: `p-4` or `p-5`
- Shadow: `shadow-black shadow-md` on elevated surfaces

### Tab Bar
- Floating pill: `borderRadius: 32`, `left/right: 16`, `bottom: insets.bottom`
- Background: `background[900]` with `borderWidth: 1, borderColor: rgba(255,255,255,0.07)`
- Active tab icon: lime semi-transparent circle (`rgba(150,200,40,0.18)` bg + `rgba(150,200,40,0.45)` border)
- Height: `74`

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
