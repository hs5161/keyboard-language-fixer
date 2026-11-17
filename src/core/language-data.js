/**
 * Language reference data used by the scorer.
 *
 * The lists cover everyday vocabulary only: they need to recognise ordinary
 * text well enough to tell real language from wrong-layout gibberish, not to
 * be complete dictionaries.
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

  able above accept across act action activity actually age ago agree ahead
  almost alone along although among amount animal another answer anyone apply
  around arrive article attention available away baby bad bank base beautiful
  bed behind below better beyond bill bit black blue board born box boy break
  brother budget building camera cannot card care carry catch cause center
  central century certain certainly chair chance chapter charge choice choose
  church class clear clearly close coach cold color common compare complete
  condition control cost country couple course cover cup current customer dark
  daughter dead deal death decide decision deep degree describe design detail
  develop development difference difficult dinner direction discuss doctor dog
  done draw dream drive drop early east easy eat economy edge effect effort
  eight either else employee enjoy enough enter entire environment especially
  event ever every exactly example experience explain family far fast fear
  feeling field fight figure fill film final finally financial fine finger
  finish fire five floor fly food foot foreign forget form former forward four
  front full fund future garden general glass goal gone green ground group
  hair half hang happy hard heart heat heavy herself himself hit hold hope
  hospital hot hotel however huge human hundred husband image imagine impact
  indeed industry inside instead interest interesting interview itself join
  key kitchen knowledge land large late laugh lawyer lay least left leg less
  letter light likely listen local machine magazine main major manage manager
  market marriage material matter media medical memory mention method middle
  military million mind miss model modern movie music myself nation national
  natural nature near nearly necessary network news nice nine none nor north
  note notice occur official oh oil once onto operation opportunity option
  organization outside pain paper particular partner pass past patient pattern
  peace per perhaps period pick picture piece plan plant player policy poor
  popular position positive possible practice prepare present pressure pretty
  prevent private probably problem process produce product professional
  project property protect prove public pull purpose push quality quickly
  quite race radio raise range rate rather ready real reality realize receive
  recent recently record red reduce region relationship report represent
  require resource respond response rest return rich rise risk road rock role
  rule safe sale save scene school science sea season seat second section
  security seek sell sense series serious seven several shake share shoot
  short shot shoulder sign similar simple simply since sing single sister
  situation six size skill skin social society soldier son song sort sound
  source south space special specific sport spring staff stage standard star
  state statement station step stock store street strong structure student
  stuff style subject success successful suddenly suffer suggest summer
  support surface table task tax technology television ten term themselves
  theory third thought thousand threat three throughout throw thus together
  tonight top total tough toward town trade training travel treat tree trial
  trip trouble true truth twenty unit until upon usually value various victim
  view visit voice vote wall wear weight west whatever whether white whole
  whom whose wide wife window wish within wonder worker worry worse yard yeah
  yet yourself

  came seen took taken gave given found told felt kept began brought wrote
  written heard held stood ran sat spoke bought sent built paid met lost won
  fell grew

  app update download upload login account screen button search video photo
  post chat document client invoice payment delivery credit cash shop discount
  closed monday tuesday wednesday thursday friday saturday sunday january
  february march april june july august september october november december
  afternoon cool awesome welcome congratulations birthday dear regards
  sincerely attached attachment reply urgent asap fyi lol omg btw yep nope
  html css pdf url http https www com org net api usb wifi sms pc tv faq

  can't won't don't doesn't didn't isn't aren't wasn't weren't haven't hasn't
  hadn't wouldn't couldn't shouldn't i'm i'll i've i'd you're you'll you've
  it's that's there's what's let's he's she's we're they're
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

  אנו הינו אותן אתן עצמו עצמה עצמי עצמם בעצם כלל כלומר לכן אולם אך אלא אילו
  מאז מתוך לתוך בתוך מעל מתחת ליד לקראת לעבר סביב נגד בעד לגבי לפי בזכות
  במקום בנוסף בעיקר בדיוק בקרוב בינתיים בהחלט בוודאי כמובן כנראה כרגע כעת
  לאחרונה מיד מייד מוקדם מאוחר קודם לבסוף סוף תחילה התחלה אמצע המשך הבא הבאה
  הקודם ראשונה שנייה שלישי רביעי חמישי שישי שביעי שבת ינואר פברואר מרץ אפריל
  מאי יוני יולי אוגוסט ספטמבר אוקטובר נובמבר דצמבר קיץ חורף אביב סתיו שמש ירח
  כוכב שמיים אדמה ים הר נהר עץ פרח גן שדה יער מדבר חול אבן אש רוח גשם שלג ענן
  חם קר חמים נעים יבש רטוב אור חושך צבע לבן שחור אדום כחול ירוק צהוב כתום
  סגול ורוד חום אפור כלב חתול סוס פרה ציפור דג חיה בעל אדם בני נשים גברים
  גבר בחור בחורה תינוק נער נערה זקן צעיר צעירה הורים הורה סבא סבתא דוד דודה
  אשה נכד נכדה שכן שכנה אורח חברים חברות קבוצה צוות מנהל מנהלת עובדים מורה
  תלמיד תלמידה סטודנט רופא רופאה שוטר חייל נהג טבח מוכר לקוחות בוס מזכירה
  מהנדס מתכנת עורך דין שופט ראש ממשלה מדינה ישראל ירושלים תל אביב חיפה כפר
  רחוב שכונה בניין דירה חדר מטבח סלון מקלחת שירותים מרפסת גג קומה דלת חלון
  קיר רצפה שולחן כיסא מיטה ארון מדף מנורה מראה שטיח מפתח תיק ארנק שעון
  משקפיים בגד בגדים חולצה מכנסיים שמלה נעליים כובע מעיל גרביים ארוחה בשר עוף
  דגים ירקות פירות סלט מרק אורז פסטה ביצה גבינה חלב חמאה שמן מלח סוכר קפה תה
  מיץ יין בירה עוגה שוקולד גלידה תפוח בננה תפוז עגבניה מלפפון בצל שום כוס
  צלחת מזלג סכין כף סיר מקרר תנור כיור מסעדה חנות סופר שוק קניון בנק דואר
  חולים אוניברסיטה ספריה משרד מפעל תחנה תעופה מלון חוף פארק מוזיאון קולנוע
  תיאטרון כנסת מכונית אוטו רכב אוטובוס רכבת מטוס אופניים מונית אוניה כביש
  רמזור חניה דלק נסיעה טיול חופשה חג מסיבה חתונה הולדת מתנה משחק כדור
  כדורגל ספורט מוזיקה שיר סרט ספרים עיתון חדשות טלוויזיה רדיו תמונה צילום
  מצלמה אינטרנט רשת אפליקציה תוכנה תוכנית מסך מקש עכבר מדפסת קבצים תיקיה
  מסמך טופס חתימה חוזה הסכם תשלום חשבונית קבלה הצעה מחירים עלות תקציב הכנסה
  הוצאה רווח הפסד מס שכר משכורת עסק עסקים מוצר מוצרים מכירה מכירות קניה
  שיווק פרסום ניהול תכנון פיתוח עיצוב בנייה ייצור אספקה משלוח הובלה מלאי
  הזמנות תמיכה איכות בטיחות אבטחה סיכון ביטוח בריאות מחלה כאב תרופה טיפול
  ניתוח בדיקות תוצאה תוצאות פנים עין עיניים אוזן פה שן שיניים לשון צוואר כתף
  יד ידיים אצבע גב בטן רגל רגליים ברך לב דם עור שיער גוף נפש רגש שמחה עצב
  כעס פחד תקווה אמונה מחשבה רעיון דעה החלטה בחירה ניסיון הצלחה כישלון טעות
  אמת שקר סוד חלום מציאות עבר הווה עתיד היסטוריה מדע טבע אמנות תרבות חינוך
  פוליטיקה חוק משפט צדק שלטון מלחמה צבא ביטחון סיבה מטרה דוגמה חלק סוג צורה
  גודל מצב מקרה עניין נושא שיעור כיתה מבחן ציון תרגיל לימודים קורס הרצאה
  מילה מילים שורה עמוד כותרת סיפור מכתב אות אותיות ספרה חישוב סכום אחוז חצי
  רבע כפול זוג מאה אלף מיליון עשרים שלושים ארבעים חמישים אפס שתיים ארבעה
  חמישה שישה שבעה תשעה עשרה עשרות מאות אלפי קילו מטר ליטר שקל שקלים דולר
  יורו נקודה קו עיגול ריבוע צד ימין שמאל למעלה למטה קדימה אחורה פנימה החוצה
  צפון דרום מזרח מערב מרכז קרוב רחוק ארוך קצר רחב צר גבוה נמוך עמוק כבד חזק
  חלש מהיר איטי חכם טיפש יפים יפות נחמד נחמדה מצוין מעולה נהדר נפלא מדהים
  נורא גרוע מוזר רגיל מיוחד שונה דומה זהה שווה מלא ריק פתוח סגור נקי מלוכלך
  חופשי תפוס עסוק פנוי מוכן עייף רעב צמא חולה בריא שמח עצוב כועס רגוע בטוח
  מסוכן אפשרי חייב מותר אסור דחוף חינם יקר זול עשיר עני פרטי ציבורי אישי
  כללי ראשי מרכזי מקומי בינלאומי חיצוני פנימי טכני רשמי אמיתי מלאכותי טבעי
  פיזי דיגיטלי אוטומטי ידני

  הלכתי הלכנו הלכו באתי באנו באו אכלתי שתיתי ישנתי קניתי מכרתי שלחתי קיבלנו
  כתבתי קראתי שמעתי דיברתי חשבתי הבנתי ידעתי רצינו יכולתי ניסיתי התחלתי
  סיימתי שכחתי זכרתי מצאתי איבדתי פתחתי סגרתי שאלתי עניתי ביקשתי נתתי לקחתי
  הבאתי שמתי עבדתי למדתי גרתי נסעתי חזרתי הגעתי יצאתי נכנסתי עליתי ירדתי
  קמתי ישבתי עמדתי רצתי שיחקתי צחקתי בכיתי אהבתי שנאתי פחדתי חיכיתי קיוויתי
  הרגשתי אומרים הולכים באים יושבים עומדים רצים אוכלים שותים ישנים קונים
  מוכרים שולחים מקבלים כותבים קוראים שומעים מדברים חושבים מבינים לומדים
  גרים נוסעים חוזרים מגיעים יוצאים נכנסים עולים יורדים משחקים צוחקים אוהבים
  מחכים מקווים מרגישים מנסה מנסים מתחיל מתחילים מסיים שוכח זוכר מוצא פותח
  סוגר שואל עונה מבקש מביא נוסע חוזר מגיע יוצא נכנס עולה יורד קם יושב עומד
  רץ צוחק בוכה שונא מפחד שותה קונה שולח מקבל נמצא נמצאת נמצאים קורה קרה
  יקרה אעשה תעשה יעשה נעשה אלך תלך ילך נלך אבוא תבוא יבוא נבוא אתן תתן יתן
  ניתן אקח תקח יקח אדע תדע ידע תוכל יוכל נוכל ארצה תרצה ירצה אהיה תגיד יגיד
  נגיד אראה תראה יראה

  לצאת להיכנס לעלות לרדת לקום לשבת לעמוד לרוץ לשחק לצחוק לבכות לאהוב לשנוא
  לפחד לחכות לקוות להרגיש לנסות להתחיל לסיים לשכוח לזכור למצוא לאבד לפתוח
  לסגור לשאול לענות לבקש להביא לשים לנסוע לחזור להגיע לגור למכור לקבל לשלם
  להזמין לבטל לאשר לעדכן להוסיף למחוק לשמור להעתיק להדביק להקליד לחפש לבחור
  להמשיך לעצור להתקשר להכיר לפגוש להיפגש לספר להסביר להראות לשנות להחליט
  לתכנן לבנות ליצור לנהל לטפל לבצע להשתמש להפעיל להתקין להוריד להעלות לשתף
  להדפיס
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
