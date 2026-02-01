# HoldButton – הוראות שימוש

כפתור "החזק לאישור" – הפעולה מתבצעת רק אחרי החזקה רצופה (למניעת לחיצה בטעות).

## סוגי מחווה (fillVariant)

| ערך               | תיאור                                                                     |
| ----------------- | ------------------------------------------------------------------------- |
| `fill-both-sides` | **(ברירת מחדל)** צבע מתמלא משני הקצוות ונפגש במרכז – מחווה ויזואלית ברורה |
| `darken`          | שכבה כהה שמתחזקת (opacity) – כמו גרסה ישנה                                |

## Props

| Prop               | סוג                                                                             | ברירת מחדל           | תיאור                                     |
| ------------------ | ------------------------------------------------------------------------------- | -------------------- | ----------------------------------------- |
| `holdDurationMs`   | `number`                                                                        | `1500`               | משך ההחזקה במילי־שניות עד שהפעולה תרוץ    |
| `onPress`          | `() => void`                                                                    | חובה                 | נקרא רק כשהמשתמש החזיק את כל הזמן         |
| `className`        | `string`                                                                        | `""`                 | Tailwind לכפתור (גודל, צבע, ריווח, פינות) |
| `fillVariant`      | `'fill-both-sides' \| 'darken'`                                                 | `"fill-both-sides"`  | סוג מחווה: מילוי משני הכיוונים או התכההות |
| `fillColor`        | `string`                                                                        | `"rgba(0,0,0,0.45)"` | צבע המילוי (RGBA או שם צבע)               |
| `overlayClassName` | `string`                                                                        | אופציונלי            | Tailwind לשכבה (רק ב־darken)              |
| `hapticOnComplete` | `'light' \| 'medium' \| 'heavy' \| 'success' \| 'warning' \| 'error' \| 'none'` | `"success"`          | ויברציה כשמסיימים החזקה                   |
| `resetDurationMs`  | `number`                                                                        | `200`                | משך האנימציה לאיפוס כשמשחררים (ms)        |
| `children`         | `ReactNode`                                                                     | חובה                 | תוכן הכפתור (טקסט, אייקון וכו')           |

## דוגמה – התחל אימון (ReviewWorkoutPlan)

```tsx
import HoldButton from '@/src/ui/HoldButton';

<HoldButton
  holdDurationMs={1500}
  onPress={() => setIsStart(true)}
  className="bg-lime-500 w-full py-4 rounded-2xl flex-row justify-center items-center shadow-2xl"
  fillVariant="fill-both-sides"
  fillColor="rgba(0,0,0,0.45)"
  hapticOnComplete="success"
>
  <View className="flex-row justify-center items-center">
    <Text className="text-black font-black text-xl mr-2">התחל אימון</Text>
    <MaterialCommunityIcons name="play" size={28} color="black" />
  </View>
</HoldButton>;
```

## דוגמאות נוספות

**מילוי משני הכיוונים עם צבע מותאם (לבן):**

```tsx
<HoldButton
  fillVariant="fill-both-sides"
  fillColor="rgba(255,255,255,0.4)"
  onPress={submit}
  className="bg-zinc-800 py-4 rounded-xl"
>
  <Text>שלח</Text>
</HoldButton>
```

**מחוות התכההות (darken):**

```tsx
<HoldButton
  fillVariant="darken"
  fillColor="rgba(0,0,0,0.5)"
  onPress={handleDelete}
  className="bg-red-500 py-3 rounded-xl"
  hapticOnComplete="none"
>
  <Text>מחק</Text>
</HoldButton>
```
