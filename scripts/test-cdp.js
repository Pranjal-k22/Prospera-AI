const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const outDir = path.join(__dirname, '..', 'docs', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const tempDir = path.join(__dirname, '..', '.chrome-temp');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + tempDir,
    'http://localhost:3000/',
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json/list');
    const tabs = await listRes.json();
    console.log('Available targets:', tabs.length);
    const target = tabs.find((t) => t.type === 'page') || tabs[0];

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve) => (ws.onopen = resolve));

    let msgId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (evt) => {
          const res = JSON.parse(evt.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCommand('Page.enable');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await new Promise((r) => setTimeout(r, 1200));

    const shot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'home-1440-light.png'), Buffer.from(shot.data, 'base64'));
    console.log('Successfully captured home-1440-light.png');

    await sendCommand('Runtime.evaluate', {
      expression: `document.documentElement.setAttribute('data-theme', 'dark');`,
    });
    await new Promise((r) => setTimeout(r, 400));

    const shotDark = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'home-1440-dark.png'), Buffer.from(shotDark.data, 'base64'));
    console.log('Successfully captured home-1440-dark.png');

    ws.close();
  } catch (err) {
    console.error('CDP Error:', err);
  } finally {
    chromeProc.kill();
  }
}

run();
