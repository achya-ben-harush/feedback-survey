// גשר שאלון סיום מנוי – התוכנית של אחיה בן הרוש
// מקבל תשובות מדף שאלון סיום המנוי ושומר אותן בלשונית "תשובות".
const SECRET = 'siyum-4b7e19c2';
const NOTIFY_EMAIL = 'achya.iski@gmail.com'; // לאן נשלח מייל על כל תשובה חדשה

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.key !== SECRET) return json_({ ok: false, error: 'bad key' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const name = String(d.sheet || 'שאלון').slice(0, 90);
    let sh = ss.getSheetByName(name);
    if (!sh) {
      sh = ss.insertSheet(name);
      sh.setRightToLeft(true);
    }

    const fields = [
      { id: 'timestamp', label: 'חותמת זמן', value: new Date() },
      { id: 'source', label: 'מקור', value: d.source || '' }
    ].concat(d.fields || []);

    const lastCol = sh.getLastColumn();
    const header = lastCol ? sh.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    const ids = header.map(h => String(h).split(' · ')[0]);
    fields.forEach(f => {
      if (ids.indexOf(f.id) === -1) {
        ids.push(f.id);
        header.push(f.id + ' · ' + f.label);
      }
    });
    sh.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold');
    sh.setFrozenRows(1);

    const row = ids.map(id => {
      const f = fields.find(x => x.id === id);
      if (!f) return '';
      let v = Array.isArray(f.value) ? f.value.join(', ') : f.value;
      if (typeof v === 'string' && /^[=+\-@]/.test(v)) v = "'" + v; // הגנה מנוסחאות
      return v;
    });
    sh.appendRow(row);
    try { notify_(fields, ss); } catch (mailErr) { console.error(mailErr); } // תקלה במייל לא מפילה את השמירה
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// שולח מייל קצר עם התשובות (טקסט פשוט בלבד)
function notify_(fields, ss) {
  if (!NOTIFY_EMAIL) return;
  const nameF = fields.find(f => f.id === 'name');
  const who = String(nameF && nameF.value || 'מתאמן').replace(/[\r\n]+/g, ' ').slice(0, 60);
  const lines = fields
    .filter(f => f.id !== 'timestamp' && f.id !== 'scale')
    .map(f => {
      const v = Array.isArray(f.value) ? f.value.join(', ') : f.value;
      return (v === '' || v == null) ? null : f.label + ': ' + String(v).slice(0, 1000);
    })
    .filter(Boolean);
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'משוב סיום מנוי חדש: ' + who,
    body: who + ' מילא/ה את שאלון סיום המנוי.\n\n' + lines.join('\n') +
          '\n\nכל התשובות בגיליון:\n' + ss.getUrl()
  });
}

// הרצה חד-פעמית מהעורך: בודקת שהמייל מגיע (ומבקשת אישור לשלוח מיילים)
function testEmail() {
  notify_([{ id: 'name', label: 'שם', value: 'בדיקה' }, { id: 'best_thing', label: 'הדבר הכי טוב', value: 'זה מייל ניסיון' }], SpreadsheetApp.getActiveSpreadsheet());
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
