/**
 * Language reference data used by the scorer.
 *
 * The lists are intentionally small: they only need to recognise everyday
 * text well enough to tell real language from wrong-layout gibberish.
 */

/**
 * Builds a Set from a whitespace-separated list.
 * @param {string} list
 * @returns {ReadonlySet<string>}
 */
function toSet(list) {
  return new Set(list.trim().split(/\s+/));
}

/** Common English words, lowercase. */
export const ENGLISH_WORDS = toSet(`
  the be to of and a in that have i it for not on with he as you do at this
  but his by from they we say her she or an will my one all would there their
  what so up out if about who get which go me when make can like time no just
  him know take people into year your good some could them see other than then
  now look only come its over think also back after use two how our work first
  well way even new want because any these give day most us is are was were
  been has had did does am said says got made went knew thing man woman child
  world life hand part place case week company system program question number
  night point home water room mother area money story fact month lot right
  study book eye job word business issue side kind head house service friend
  father power hour game line end member law car city community name team
  minute idea kid body information parent face others level office door health
  person art war history party result change morning reason research girl guy
  moment air teacher force education yes hello hi hey thanks thank please sorry
  okay ok bye today tomorrow yesterday here where why very much many more need
  help love great little big small long high old young next last same
  different important few still should must may might never always often again
  too really something nothing everything anything someone everyone before
  between under while without through during against each both own those such
  off down let put mean keep begin seem talk turn start show hear play run move
  live believe bring happen write provide sit stand lose pay meet include
  continue set learn lead understand watch follow stop create speak read allow
  add spend grow open walk win offer remember consider appear buy wait serve
  send expect build stay fall cut reach remain email mail password file
  computer phone message test check link click page site web google internet
  online code data user address list order price free best sure maybe already
  soon later evening meeting call text type keyboard language english hebrew
  fix wrong correct quick find tell ask try feel leave become
`);

/** Common Hebrew words. */
export const HEBREW_WORDS = toSet(`
  של את לא על זה הוא היא אני הם הן אתה אתם אנחנו כי גם אם או כל מה מי יש אין
  היה היתה הייתה היו עם אל כמו רק עוד אבל כך כן אז עד בין לפני אחרי תחת מול
  אצל בלי כדי אשר כאשר איך למה מתי איפה כמה איזה איזו זאת זו אלה אלו שם פה
  כאן עכשיו היום מחר אתמול תמיד אף פעם כבר עדיין מאוד טוב טובה רע יפה גדול
  גדולה קטן קטנה חדש חדשה ישן הרבה מעט קצת יותר פחות אחד אחת שני שתי שניים
  שלוש שלושה ארבע חמש שש שבע שמונה תשע עשר ראשון אחרון דבר דברים איש אישה
  ילד ילדה ילדים אנשים בית ספר עבודה יום ימים שנה שנים שבוע חודש שעה דקה זמן
  מקום דרך עיר ארץ עולם חיים אהבה כסף מים אוכל לחם אבא אמא אח אחות בן בת חבר
  חברה משפחה שלום תודה בבקשה סליחה בוקר ערב לילה צהריים שלי שלך שלו שלה שלנו
  שלכם שלהם לי לך לו לה לנו לכם להם אותי אותך אותו אותה אותנו אותם בו בה בי
  בך בהם ממני ממך ממנו עליו עליה אליו אליה איתי איתך איתו רוצה רוצים צריך
  צריכה צריכים יכול יכולה יכולים יודע יודעת יודעים חושב חושבת אוהב אוהבת
  הולך הולכת בא באה עושה עושים אומר אומרת רואה שומע מדבר כותב קורא נותן לוקח
  עובד עובדת גר לומד מבין מבינה מחכה מקווה מרגיש לעשות ללכת לבוא לראות לדעת
  לומר להגיד לתת לקחת לדבר לכתוב לקרוא לשמוע לעבוד ללמוד להיות לאכול לשתות
  לישון לקנות לשלוח לבדוק לתקן לעזור לחשוב להבין אמר אמרה עשה עשתה הלך ראה
  רצה נתן לקח כתב שלח קיבל קיבלתי אמרתי עשיתי ראיתי רציתי הייתי יהיה תהיה
  נהיה אפשר אולי בטח בסדר נכון באמת פשוט ממש בכלל לפעמים אחר אחרת אחרים כולם
  כולנו משהו מישהו שום כלום הכל הכול הנה נראה נשמע מעניין חשוב קל קשה מהר
  לאט ביחד לבד שוב פעמים בגלל למרות אפילו כמעט בערך לגמרי מייל הודעה טלפון
  מחשב קובץ סיסמה אתר קישור מקלדת שפה עברית אנגלית טקסט בדיקה תיקון שאלה
  תשובה בעיה פתרון פגישה ישיבה חשבון מספר כתובת רשימה מחיר הזמנה לקוח שירות
  מערכת פרויקט דוח נתונים מידע היי הי ביי להתראות בהצלחה מזל שלומך רבה עזרה
`);

/** Letter pairs that occur frequently inside English words. */
export const ENGLISH_COMMON_BIGRAMS = toSet(`
  th he in er an re on at en nd ti es or te of ed is it al ar st to nt ng se
  ha as ou io le ve co me de hi ri ro ic ne ea ra ce li ch ll be ma si om ur
  ca el ta la ns di fo ho pe ec pr no ct us ac ot il tr ly nc et ut ss so rs
  un lo wa ge ie wh ee wi em ad ol rt po we na ul ni ts mo ow pa im mi ai sh
  ir su id os iv ia am fi ci vi pl ig tu ev ld ry mp fe bl ab gh ty op wo sa
  ay ex ke fr oo av ag if ap gr od bo sp rd do
`);

/** One-letter particles that attach to the start of Hebrew words. */
export const HEBREW_PREFIX_LETTERS = new Set(["ו", "ה", "ב", "כ", "ל", "מ", "ש"]);

/** Endings that can be removed from an English word to find its base form. */
export const ENGLISH_SUFFIXES = Object.freeze([
  "n't", "'t", "'s", "'re", "'ll", "'ve", "'m", "'d",
  "ing", "es", "ed", "ly", "s", "d",
]);
