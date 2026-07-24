# סיכום: אימות OAuth Branding מול Google ל-BodyBuddy

תאריך עדכון אחרון: 2026-07-24

## הבעיה המקורית

אימות ה-OAuth consent screen (Branding) בגוגל קלאוד נכשל עם השגיאה:
> "The website of your home page URL is not registered to you"

**הסיבה האמיתית**: דף הבית ומדיניות הפרטיות היו מתארחים ב-GitHub Pages תחת `israelbenzeev.github.io` — דומיין **משותף** (shared platform domain), בדיוק כמו Google Sites / Wix / Vercel (`*.vercel.app`). גוגל דורש **דומיין פרטי בבעלות בלעדית**, ולא מקבל אימות Search Console על תת-דומיין תחת פלטפורמה משותפת, גם אם עושים אימות בעלות HTML/DNS תקין.

## הפתרון: דומיין מותאם אישית

- נרכש דומיין: **`bodybuddy.fitness`** דרך Porkbun ($5.66 שנה ראשונה, חידוש כ-$33.47/שנה).
- נבחר מבנה של **נתיבים (paths) תחת דומיין אחד**, לא תת-דומיינים:
  - `https://bodybuddy.fitness/` → דף הבית
  - `https://bodybuddy.fitness/privecypolicy/` → מדיניות הפרטיות

## מבנה הפרויקט

- Repo חדש ב-GitHub: **`IsraelBenZeev/bodybuddy-website`**
- מיקום מקומי: `C:\Users\i0548\Documents\BodyBuddy\bodybuddy-website`
- שני ה-repos הישנים (`bodybuddy-homePage`, `BodyBuddy-Privacy-Policy`) אוחדו ל-repo אחד:
  ```
  bodybuddy-website/
  ├── index.html          ← דף הבית
  ├── style.css, script.js, logo.png
  ├── CNAME               ← נוצר אוטומטית ע"י GitHub (custom domain)
  └── privecypolicy/
      ├── index.html      ← מדיניות פרטיות
      ├── favicon.png/svg
      └── images/
  ```
- תוקן קישור hardcoded ישן בפוטר של `index.html` (הצביע ל-GitHub Pages הישן) לנתיב יחסי `/privecypolicy/`.
- תוקנה בעיית **CSS scroll-reveal** (`opacity: 0` עד לגלילה + JS `IntersectionObserver`) שהסתירה מבוטים אוטומטיים את הטקסט שמסביר את מטרת האפליקציה — הוסרה מחלקת `reveal` מהכותרת הראשית, פסקת ה-"about", וכותרת אזור הפיצ'רים (נשארה רק על כרטיסי הפיצ'רים הבודדים, לא קריטי).

## הגדרות DNS (Porkbun, DNS Powered by Cloudflare)

| Type | Host | Value |
|------|------|-------|
| ALIAS | `bodybuddy.fitness` (שורש, ריק) | `israelbenzeev.github.io` |
| CNAME | `www` | `israelbenzeev.github.io` |
| TXT | `bodybuddy.fitness` (שורש) | `google-site-verification=UtkIgwCxW2-qZV834jvARKn-hD7GYNKsPLY3j5bVJz4` |

⚠️ **חשוב: אסור למחוק את רשומת ה-TXT** — היא נדרשת לשמירה על אימות הבעלות ב-Search Console.

## GitHub Pages Settings

- Repo `bodybuddy-website` → Settings → Pages
- Source: Deploy from branch `main` / root
- Custom domain: `bodybuddy.fitness`
- ✅ DNS check successful
- ✅ Enforce HTTPS פעיל (תעודת SSL הונפקה אוטומטית)

## Google Search Console

- נוסף property חדש מסוג **"Domain"** (לא URL-prefix) עבור `bodybuddy.fitness`
- אומת בהצלחה דרך רשומת TXT (ראה טבלת DNS למעלה)
- ✅ הבעלות מאומתת

## Google Cloud OAuth Consent Screen — עדכונים

- **App name**: `BodyBuddy` (תוקן מ-`bodybuddy` lowercase המקורי)
- **Application home page**: `https://bodybuddy.fitness/`
- **Application privacy policy link**: `https://bodybuddy.fitness/privecypolicy/`
- **Authorized domains**: נוסף `bodybuddy.fitness`

## תהליך האימות מול גוגל — סטטוס נוכחי

לאחר תיקון הבעיות, גוגל עדיין דיווח על 2 ממצאים ב-Branding verification:
1. "Your home page does not explain the purpose of your app" — **נפתר** (תוקן ה-CSS reveal)
2. "The app name...does not match..." — עדיין מופיע, **למרות** ששני הצדדים (השדה באתר) תואמים במדויק ל-`BodyBuddy`

הוגש **ערעור (Appeal)** דרך "I believe the issues found are incorrect" עם הסברים לשני הממצאים.

**מסך "Verification progress" (מ-23-24.7.2026) מראה:**
- ✅ Privacy policy requirements — **עבר**
- ⏳ Homepage requirements — **"currently under review"** (לא נכשל, בתור לבדיקה אנושית)
- ⚠️ Branding guidelines (app name mismatch) — עדיין מסומן, אך מחקר בפורומים הרשמיים של גוגל (`discuss.google.dev`) מראה שזו **תקלה מוכרת בבוט האוטומטי** — מפתחים אחרים דיווחו על אותה תופעה בדיוק (שם תואם לחלוטין, ובכל זאת מסומן), ואצלם זה נפתר **לבד, בלי לשנות כלום**, ברגע שבן אדם אמיתי מה-Trust and Safety team בדק את הבקשה.

## למה אנחנו מחכים עכשיו

**בדיקה אנושית של צוות Trust and Safety של גוגל.** אין יותר פעולות טכניות לבצע — כל מה שניתן לתקן מהצד שלנו כבר תוקן ואומת (דומיין, DNS, HTTPS, תוכן, שמות).

- **זמן רשמי**: 2-3 ימי עסקים לבדיקת Branding, 2 ימי עסקים לערעור.
- **בפועל (לפי דיווחי מפתחים בפורומים)**: יכול לקחת גם 10+ ימים ועד חודש, בתקופות עומס.
- Google שולח עדכון **במייל** (`i0548542122@gmail.com`, כולל לבדוק ספאם) כשהסטטוס משתנה.
- אם אחרי כשבוע-שבועיים אין תגובה, אפשר לפתוח שאלה בפורום `discuss.google.dev`.

## הערה נפרדת (לא קשורה לאימות Branding)

התקבל מייל אוטומטי שגרתי על **OAuth Client לא פעיל** (`gen-lang-client-0147785573`) שעומד להימחק תוך 30 יום אם לא ישמש ב-Sign in with Google. אם ה-Client הזה לא בשימוש כרגע — ניתן להתעלם, הוא יימחק אוטומטית. אם הוא כן קשור לאפליקציה הפעילה — יש להשתמש בו לפני שיימחק.

## פרטי גישה חשובים

- דומיין: `bodybuddy.fitness` — רשום ב-Porkbun (משתמש: `ibz1330`)
- GitHub repo: `https://github.com/IsraelBenZeev/bodybuddy-website`
- חשבון גוגל לניהול הפרויקט/Search Console: `i0548542122@gmail.com`
