# BodyBuddy — Design Language

Dark, premium, lime-accented. Every screen feels like a high-end fitness app: deep backgrounds, glowing lime highlights, rounded pill shapes, and subtle borders instead of heavy fills.

---

## Color Palette

| Role | Token | Value |
|------|-------|-------|
| Primary accent (text/icons) | `lime[300]` | `rgb(213, 255, 95)` |
| Primary accent (borders/bg tint) | `lime[500]` | `rgb(150, 200, 40)` |
| Active icon background tint | — | `rgba(150, 200, 40, 0.18)` |
| Active icon border | — | `rgba(150, 200, 40, 0.45)` |
| App background | `background[1200]` | `rgb(5, 3, 10)` |
| Main card surface | `background[950]` | `rgb(20, 15, 30)` |
| Tab bar / elevated surface | `background[900]` | `rgb(20, 22, 26)` |
| Muted / inactive text | `background[400]` | `#71717a` |
| Card border (neutral) | — | `rgba(255, 255, 255, 0.05–0.10)` |
| Carbs | `orange[400]` | `rgb(251, 146, 60)` |
| Fat | — | `rgb(234, 179, 8)` |
| Danger / overage | `red[400]` | `rgb(255, 60, 60)` |

All colors are defined in `colors.ts`. Never hardcode hex values that exist there.

---

## Roundedness

| Element | Class / Value |
|---------|---------------|
| Buttons, pills, tab bar, chips | `rounded-full` / `borderRadius: 32` |
| Cards, modals, large containers | `rounded-3xl` |
| Small inline badges / chips | `rounded-2xl` |

**Rule**: never use `rounded-sm`, `rounded-md`, or `rounded-lg` on interactive or prominent elements. If in doubt, go rounder.

---

## Buttons

**The only button component in this app is `src/ui/ActionButton.tsx`. Never build a custom button — always use this component.**

Props available:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onPress` | `() => void` | required | — |
| `label` | `string` | required | Button text |
| `iconName` | `IoniconName` | `'add'` | Ionicons icon |
| `variant` | `'outline' \| 'secondary' \| 'primary'` | `'outline'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size |
| `fullWidth` | `boolean` | `false` | Stretch to container width |
| `loading` | `boolean` | `false` | Shows spinner |
| `disabled` | `boolean` | `false` | Disables interaction |

Every button follows this anatomy:
```
[ circular icon wrapper ]  Label text
```

- Shape: `rounded-full` always
- Active state: semi-transparent lime tint + lime border (never solid fill)
  - `backgroundColor: rgba(150, 200, 40, 0.18–0.25)`
  - `borderWidth: 1, borderColor: rgba(150, 200, 40, 0.45–0.5)`
- Inactive / secondary: transparent background, `background[400]` text/icon
- Icon wrapper is always a separate circle inside the button

### Variants (from ActionButton)

| Variant | Button bg | Icon wrapper | Text color |
|---------|-----------|--------------|------------|
| `outline` | `lime-500/15 → lime-500/5` gradient + `lime-500/40` border | `lime-500/25` bg + `lime-500/50` border | `lime-400` |
| `secondary` | `white/10 → white/5` gradient + `white/60` border | `white/15` bg + `white/20` border | `white` |
| `primary` | `background-700/80` + `lime-500` border | `lime-500/40` bg + `lime-500/80` border | `lime-300` |

---

## Cards & Containers

- Background: `bg-background-950` or `bg-white/[0.03]` for nested cards
- Border: `borderWidth: 1` with colored low-opacity — `rgba(255,255,255,0.05–0.10)` neutral, or accent color at `0.25–0.35` for semantic cards
- Padding: `p-4` (compact) or `p-5` (standard)
- Rounding: `rounded-3xl`
- Shadow on elevated surfaces: `shadow-black shadow-md`

---

## Tab Bar

- Shape: floating pill — `borderRadius: 32`, inset `16pt` from sides
- Position: `bottom: insets.bottom` (always respects safe area)
- Height: `74pt`
- Background: `background[900]` + `borderWidth: 1, borderColor: rgba(255,255,255,0.07)`
- Shadow: `elevation: 16` (Android) + iOS shadow `opacity 0.45, radius 20`
- Active tab: lime semi-transparent circle on icon + `lime[300]` icon & label color
- Inactive tab: transparent circle + `background[400]` icon & label color

---

## Spacing & Layout

- Screen horizontal padding: `px-5` (20pt)
- Section gaps: `gap-4` between cards, `gap-2` within cards
- Content bottom padding on screens: enough to clear the floating tab bar (~`pb-44` minimum)

---

## Accent Line (Screen Headers)

Under each `typo-h1` screen title, a short lime underline:
```js
height: 5, width: 60, backgroundColor: colors.lime[500], borderRadius: 10
```

---

## Semantic Color Usage

Semantic cards (motivation, warnings, overage) use the accent color at low opacity:
- Background: `rgba(accentColor, 0.08)`
- Border: `rgba(accentColor, 0.30)`

This pattern applies to any state-driven card (success → lime, warning → orange, danger → red).
