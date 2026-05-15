# בעיית האייקון באפליקציה — סיכום ופתרון

## מה הבעיה

לאחר הורדת האפליקציה מ-Google Play, נראה על המכשיר אייקון גנרי (סילואט של יוזר) במקום הלוגו של BodyBuddy.  
בחנות עצמה (Google Play) נראה האייקון הנכון — כי שם מדובר בתמונה שמועלית ידנית ל-Google Play Console ואינה קשורה ל-APK.

---

## מה הסיבה

### הרקע הטכני
ב-Android, אייקון האפליקציה נקבע על ידי קבצי WebP שנמצאים בתיקיות:
```
android/app/src/main/res/mipmap-mdpi/ic_launcher.webp
android/app/src/main/res/mipmap-hdpi/ic_launcher.webp
android/app/src/main/res/mipmap-xhdpi/ic_launcher.webp
android/app/src/main/res/mipmap-xxhdpi/ic_launcher.webp
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.webp
```
וכן קבצי foreground לאייקון האדפטיבי (Android 8+):
```
android/app/src/main/res/mipmap-*/ic_launcher_foreground.webp
```

Gradle (מנוע ה-build של Android) לוקח קבצים אלה כמו שהם ואורז אותם לתוך ה-APK/AAB. הוא **אינו** קורא את `app.json` ואינו יודע על `icon.png`.

### מה שקרה בפועל
1. בשלב מוקדם בפרויקט הוגדר `icon.png` עם תמונה גנרית (סילואט יוזר)
2. הורץ `expo prebuild` — Expo יצר את תיקיית `android/` כולל קבצי WebP **מאותה תמונה גנרית**
3. מאוחר יותר עודכן `icon.png` ו-`adaptive-icon.png` לאייקון הנכון של BodyBuddy
4. **אבל** `expo prebuild` לא הורץ שוב — כלומר קבצי ה-WebP בתיקיית `android/` נשארו עם האייקון הישן
5. כל build (מקומי או EAS) השתמש בקבצי WebP הישנים → אייקון גנרי על המכשיר

### למה Google Play מציגה נכון
Google Play Console מאפשר להעלות "High-res icon" ו-"Feature Graphic" ישירות לדף החנות — אלה תמונות נפרדות לחלוטין שאינן מגיעות מה-APK. לכן דף החנות נראה נכון, אבל האייקון על המכשיר (שמגיע מה-APK) שגוי.

---

## הפתרון

### שלב 1 — הרצת prebuild מחדש
```bash
npx expo prebuild --clean --platform android
```

**מה זה עושה:**
- `--clean` — מוחק את כל תיקיית `android/` ומתחיל מאפס
- `prebuild` — יוצר מחדש את תיקיית `android/` מ-`app.json`:
  - ממיר את `icon.png` ו-`adaptive-icon.png` הנוכחיים (הנכונים) לקבצי WebP בכל הגדלים
  - מריץ את כל ה-plugins (`withAndroidRTL`, `withIosRTL`, `expo-splash-screen` וכו')
  - מגדיר `AndroidManifest.xml`, `build.gradle`, וכל שאר קבצי ה-native
- `--platform android` — פועל רק על Android, לא נוגע ב-iOS

### שלב 2 — בניית AAB חדש
לאחר ה-prebuild, לבנות APK/AAB כרגיל ולהעלות ל-Google Play.

---

## סדר הפעולות המלא

```
1. npx expo prebuild --clean --platform android
2. לבנות AAB (build-aab / Gradle)
3. להעלות ל-Google Play Console
```

---

## איך למנוע בעדיד בעתיד

בכל פעם שמשנים אחד מהקבצים הבאים:
- `assets/images/icon.png`
- `assets/images/adaptive-icon.png`
- `assets/images/splash-icon.png`
- `app.json` (plugins, צבעים, הגדרות Android)

**חובה להריץ `expo prebuild` לפני ה-build** כדי שהשינויים ייכנסו לתוך תיקיית `android/`.
