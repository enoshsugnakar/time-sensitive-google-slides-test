const SLIDES_ID      = 'ENTER_slides_id';
const LOG_SHEET_ID   = 'ENter_sheets_id';
const SHEET_NAME     = 'Sheet1';
const EXPIRE_MINUTES = 6 * 60 + 30;  // 390

function doGet(e) {
  
  const userEmail = Session.getActiveUser().getEmail();
  if (!userEmail) {
    return HtmlService
      .createHtmlOutput('Please <a href="https://accounts.google.com">sign in</a>.')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  const ss    = SpreadsheetApp.openById(LOG_SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data  = sheet.getDataRange().getValues();
  let row, firstAccess;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userEmail) {
      row         = i + 1;
      firstAccess = new Date(data[i][1]);
      break;
    }
  }
  if (!row) {
    firstAccess = new Date();
    sheet.appendRow([userEmail, firstAccess.toISOString()]);
  }
  // Compute expiry timestamp (ms since epoch)
  const expireAt = firstAccess.getTime() + EXPIRE_MINUTES * 60 * 1000;
  const now      = Date.now();
  if (now > expireAt) {
    return HtmlService
      .createHtmlOutput('<h2>Access Expired</h2><p>Your 6 h 30 m window has closed.</p>')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

 
  const embedUrl = `https://docs.google.com/presentation/d/${SLIDES_ID}/embed?start=false&loop=false&rm=minimal`;
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      html, body {
        margin: 0; padding: 0;
        width: 100%; height: 100%;
        overflow: hidden;
        background: #000;
      }
      #timer {
        position: absolute;
        top: 10px; right: 10px;
        padding: 6px 12px;
        font-size: 16px;
        color: #fff;
        background: rgba(0,0,0,0.5);
        border-radius: 4px;
        z-index: 1000;
        font-family: sans-serif;
      }
      iframe {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        border: none;
      }
    </style>
  </head>
  <body>
    <div id="timer">Loading…</div>
    <iframe src="${embedUrl}"
            allowfullscreen allow="fullscreen">
    </iframe>
    <script>
      // Expiry time passed in from server
      const expireAt = ${expireAt};
      const timerEl  = document.getElementById('timer');
      
      function updateTimer() {
        const now = Date.now();
        const diff = expireAt - now;
        if (diff <= 0) {
          timerEl.textContent = '00:00:00';
          // Optionally auto-redirect or show expired message
          document.body.innerHTML = '<h1 style="color:#fff;text-align:center;margin-top:20vh;">Access Expired</h1>';
          return;
        }
        const hrs = Math.floor(diff/3600000);
        const mins = Math.floor((diff%3600000)/60000);
        const secs = Math.floor((diff%60000)/1000);
        // pad to two digits
        const pad = n => n.toString().padStart(2,'0');
        timerEl.textContent = pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
      }
      // kick off
      updateTimer();
      setInterval(updateTimer, 1000);
    </script>
  </body>
</html>
  `;
  return HtmlService
    .createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
