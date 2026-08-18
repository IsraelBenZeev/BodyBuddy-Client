---
name: add-exercises
description: הוספת תרגילים חדשים לקטלוג exercises_v2 - העלאת מדיה ל-Cloudinary והכנסת שורות ל-Supabase. Use when the user adds new exercise folders (images/video) under the exercises media drive and wants them added to the app catalog "like the rest".
license: MIT
version: 1.0.1
---

# הוספת תרגילים לקטלוג (exercises_v2)

תמיד ענה בעברית. ערכים טכניים (IDs, נתיבים, שמות עמודות, קוד) נשארים באנגלית.

תהליך זה שוחזר ואומת מול הדאטה החי ב-2026-08-17 (העלאת 21 תרגילים לקטגוריות אירובי/אמות/שוק/ישבן). כל הערכים למטה מאומתים מול ה-DB בפועל, לא רק מתועדים.

## משתנים קבועים

- **Supabase project**: `BodyBuddy`, `project_id = arxscyvqikyjupszspym`
- **טבלה**: `exercises_v2` (public schema, RLS מופעל, PK = `exerciseId`) — אין טבלה אחרת, אין צורך ליצור/לשנות סכימה
- **Cloudinary cloud name**: `dvvv9odme`
- **Cloudinary credentials**: `C:\Users\user\Documents\projects\BodyBuddy-Server\.env` (`CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) — **לעולם אל תשכפל/תדביק את הערכים עצמם בקוד או בקבצים ששמורים בריפו (כולל הסקיל הזה)**. תמיד לטעון אותם ב-runtime מה-.env הזה בסקריפט Node זמני ב-scratchpad.
- **תיקיית מקור המדיה**: `G:\האחסון שלי\תרגילים` (Google Drive של המשתמש) — תיקייה אחת לכל קטגוריית גוף (בשם עברי), ובתוכה תת-תיקייה אחת לכל תרגיל (שם עברי = `name_he` בדיוק, כולל תווים נסתרים אם יש), ובתוכה קובץ mp4 אחד (כמעט תמיד) ו-1-3 תמונות png/jpg.
- **מוסכמת נתיבי Cloudinary** (מאומת משורה חיה ב-DB):
  - וידאו: `exercises-v2/video/{exerciseId}` → `https://res.cloudinary.com/dvvv9odme/video/upload/v.../exercises-v2/video/{exerciseId}.mp4`
  - תמונות: `exercises-v2/images/{exerciseId}_{n}` (1-indexed) → `.../image/upload/v.../exercises-v2/images/{exerciseId}_1.png`
- **`exerciseId`**: מחרוזת אקראית של 7 תווים אלפאנומריים מעורבי-case (למשל `9Cwskez`). תמיד לוודא ייחודיות מול הטבלה עם שאילתת `execute_sql` לפני שימוש (`select "exerciseId" from exercises_v2 where "exerciseId" in (...)`), לא להניח.
- **`sort_order`**: לקחת `select max(sort_order) from exercises_v2` **חי** בכל הרצה (יש בטבלה גם שורות ידניות/בדיקה עם `sort_order` גבוה שלא קשורות לרצף המקורי) ולהמשיך ממנו +1 ואילך, ברצף לפי סדר התרגילים בבאטש.
- **`idx`**: עמודה legacy מהיבוא המקורי (ExerciseDB), **לא בשימוש** באפליקציה (נבדק ב-`src/service/exercisesService.ts` - הסינון/מיון תמיד לפי `sort_order` בלבד). להשאיר `NULL` בשורות חדשות.
- **`status`**: תמיד `'active'`. **`gif_available`**: תמיד `false`. **`gifUrl`**: תמיד `NULL` (עמודה legacy מ-v1, לא בשימוש ב-v2).

## אוצר מילים - חלקי גוף ושרירי מטרה (`src/types/bodtPart.ts`)

`bodyParts`/`bodyParts_he` (מ-`partsBodyHebrew`):
neck/צוואר, chest/חזה, shoulders/כתפיים, `upper arms`/ידיים, `lower arms`/אמות, waist/בטן, `upper legs`/רגל, `lower legs`/שוק, glutes/ישבן, back/גב, general/כללי, cardio/אירובי.

`targetMuscles`/`targetMuscles_he` (מ-`targetMusclesHebrew`, לדוגמה): calves/שוק, forearms/אמה, glutes/ישבן, abductors/מרחיקים, biceps/יד קדמית, triceps/יד אחורית, `cardiovascular system`/לב וריאות.

**הערה חשובה (משוב משתמש מפורש)**: לתרגילי **אירובי** (cardio) - להשתמש ב-`targetMuscles: ["cardio"]` / `targetMuscles_he: ["אירובי"]` ולא ב-`cardiovascular system`/`לב וריאות`. הסיבה: אין באפליקציה מסך/פילטר ייעודי לפי שריר עבור אירובי (אין breakdown לפי שריר) - יש רק כפתור ייעודי לאירובי כקטגוריה שטוחה אחת, ו-`targetMuscles_he[0]` הוא מה שמוצג בפועל מתחת לשם התרגיל ברשימות (`ListExercises.tsx`, `CardExercise.tsx`), אז חשוב שהתווית תתאים לאיך שהמשתמש מנווט לקטגוריה.

## תבניות `input_fields` (`src/types/customExercise.ts` → `CUSTOM_EXERCISE_TEMPLATES`)

יש 4 תבניות קבועות בלבד, לבחור לפי ציוד התרגיל:

| תבנית | שדות | מתי |
|---|---|---|
| `strength` | `reps` + `weight (kg)` | ציוד עם משקל מדויק - מכונה/מוט/כבלים/משקולת בישיבה יציבה |
| `bodyweight` | `reps` + `added_weight (kg, optional)` | משקל גוף, אפשרות להוסיף משקל |
| `duration` | `duration (sec)` בלבד | תרגילי החזקה/איזומטריים |
| `cardio` | `duration` + `speed (km/h)` + `incline (%)` | מכשירי קרדיו עם מהירות ושיפוע (הליכון) |

למכשירי קרדיו בלי שיפוע (אופניים/אליפטיקל/חתירה) - subset סביר: `duration+speed`. למכשירים בלי מהירות משמעותית (מדרגות, חבל קפיצה) - `duration` בלבד.

## כלל `homeFriendly`

`true` **רק** אם: משקל גוף בלבד / משקולת יד בלי ספסל / מתקן מתח / גלגל בטן / ציוד מינימלי דומה (חבל קפיצה, סטפר+משקולת יד). `false` לכל דבר עם ספסל (כל סוג), מוט, כבלים/מכונת כבלים, מכונה ייעודית, או ציוד ייחודי.

## תהליך העבודה

1. **זיהוי תרגילים חדשים** - לבקש/לזהות אילו תיקיות/תת-תיקיות חדשות נוספו תחת `G:\האחסון שלי\תרגילים` (השוואה מול מה שכבר בטבלה, או לפי מה שהמשתמש מציין).
2. **צפייה בתמונות רפרנס** - לכל תרגיל חדש, **חובה** לצפות בתמונה/ות עם כלי ה-Read (במיוחד בין וריאציות דומות - למשל כמה סוגי הרמות עקבים) כדי לזהות ציוד מדויק, לא לנחש לפי שם התיקייה בלבד.
3. **כתיבת תוכן דו-לשוני** לכל תרגיל, לפי המבנה המדויק של `src/types/exercise.ts` (`Exercise` interface): `name`/`name_he` (= שם התיקייה בדיוק), `bodyParts`/`_he`, `subBodyParts`/`_he`, `targetMuscles`/`_he`, `secondaryMuscles`/`_he`, `equipments`/`_he`, `homeFriendly`, `instructions`/`instructions_he`, `input_fields`.
   - **`instructions` (אנגלית בלבד)**: 6 שלבים ממוספרים בפורמט `"Step:N ..."` (למשל `"Step:1 Kneel on the floor..."`).
   - **`instructions_he` (עברית)**: **בלי** קידומת `Step:N` בכלל - טקסט נקי בלבד (למשל `"כרע על הרצפה..."`). הלקוח לוקח את מספר השלב לפי המיקום במערך (index), לא מפרסר את הטקסט - קידומת `Step:N` בעברית תוצג כטקסט מיותר במסך (`Step:2 ...` בתוך המשפט עצמו). **טעות שכבר קרתה פעם אחת** - חשוב לא לחזור עליה.
4. **שמירת מניפסט** ל-JSON זמני ב-scratchpad (כולל נתיב התיקייה בדיסק לכל תרגיל, לשימוש בהעלאה).
5. **דף בדיקה (Artifact)** - לבנות דף HTML (RTL, פלטת האפליקציה - background-950/900 כהה + lime-300/500 accent, `tailwind.config.js`) שמציג את כל התרגילים הממתינים לפי קטגוריה, ולבקש אישור מפורש מהמשתמש **לפני** העלאה/הכנסה בפועל. **לא לדלג על הצ'קפוינט הזה** גם בהוספה קטנה, אלא אם המשתמש מבקש במפורש להתקדם ישר.
6. **הפקת exerciseId** ייחודי לכל תרגיל, מאומת מול הטבלה.
7. **העלאת מדיה ל-Cloudinary** - סקריפט Node חד-פעמי ב-scratchpad (`npm install cloudinary` שם, לא בריפו), טוען credentials מ-`BodyBuddy-Server\.env`, מעלה לפי מוסכמת הנתיבים למעלה עם `overwrite: true`, אוסף `secure_url`.
8. **בניית ה-INSERT** - מיזוג התוכן + ה-URLs שהתקבלו + `sort_order` הבא + `status='active'` + `created_at=now()`, והרצה דרך `mcp__claude_ai_Supabase__execute_sql` (project_id למעלה). שימו לב לשמות עמודות עם camelCase שדורשים מרכאות כפולות (`"exerciseId"`, `"imageUrls"`, `"videoUrl"`, `"bodyParts"` וכו').
9. **אימות סופי** - ספירת שורות לפני/אחרי, בדיקת אין כפילויות `exerciseId`/`sort_order`, spot-check על כמה שורות (URLs תקינים, שדות נכונים).

## קבצים רלוונטיים לקריאה (לא לשנות קוד - זו הזנת דאטה בלבד)

- `src/types/exercise.ts` - טיפוס `Exercise` + `InputFieldDefinition`
- `src/types/bodtPart.ts` - אוצר המילים לחלקי גוף/שרירים
- `src/types/customExercise.ts` - תבניות `input_fields`
- `src/service/exercisesService.ts` - איך האפליקציה שולפת מהטבלה (מסנן `status='active'`, ממיין לפי `sort_order`)

אין צורך בשינוי קוד באפליקציה בתהליך הזה - הכל כבר קורא מ-`exercises_v2` כפי שהוא.
