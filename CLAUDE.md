# פרויקט: שאלון משוב תקופתי

השאלון בכתובת https://feedback.achya-ben-harush.com. בתחילת כל עבודה טוענים את סקיל המותג `achiya-brand`.
- באוויר: פרויקט Cloudflare Pages `achiya-feedback`. פקודת ה-build מעתיקה ל-`dist` את `index.html`, `img/` ו-`siyum/`, ומוחקת את `siyum/bridge.gs` כדי שהקוד של גוגל לא יהיה ציבורי.
- התשובות נשמרות בגיליון גוגל, דרך Apps Script. הגיליון לא משותף לציבור.
- `draft-claude-artifact.html` היא טיוטה ישנה ולא עולה לאוויר.
- המשתמש אינו טכני: מדברים איתו בעברית פשוטה.

## אחסון ואתרים (עודכן 5.11.2026)
- **כל האתרים עברו מ-Netlify ל-Cloudflare Pages** (חשבון Cloudflare של העסק, נכנסים עם גוגל של העסק). Netlify כבר לא בשימוש, ולא מעלים אליו יותר שום דבר.
- **הקבצים נשמרים רק בגיטהאב (achya-ben-harush) ובגוגל דרייב של העסק.** כל אתר ב-Cloudflare מחובר לריפו שלו: עושים commit ו-push לענף main, ו-Cloudflare מעלה לאוויר לבד תוך כדקה. אין יותר zip, אין העלאה ידנית ואין קרדיטים.
- הכתובות: renew, welcome, kit, vote, feedback, challenge ו-malai (כולן ב-`<שם>.achya-ben-harush.com`). ב-Namecheap לכל אחת יש רשומת CNAME ל-`achiya-<שם>.pages.dev`.
- דף חדש: יוצרים ריפו פרטי בגיטהאב, ואז פרויקט Pages חדש ב-Cloudflare שמחובר אליו. מוסיפים Custom domain, ואז ב-Namecheap רשומת CNAME חדשה שמצביעה ל-`<פרויקט>.pages.dev`. אם הריפו מכיל קבצים שלא צריכים להיות ציבוריים, מגדירים פקודת build שמעתיקה ל-`dist` רק את הקבצים של האתר.
- הדף הראשי (achya-ben-harush.com) עדיין ב-GitHub Pages של המתכנת הקודם (yonicobin). לא לגעת בו בלי אישור.
- בכל בנייה בודקים חשיפת מידע: אין מפתחות או טוקנים בקוד הדף, ואין גיליונות עם תשובות שמשותפים לציבור.
