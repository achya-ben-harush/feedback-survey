// גשר שאלון סיום מנוי – התוכנית של אחיה בן הרוש
// מקבל תשובות מדף שאלון סיום המנוי ושומר אותן בלשונית "תשובות".
const SECRET = 'siyum-4b7e19c2';

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
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
