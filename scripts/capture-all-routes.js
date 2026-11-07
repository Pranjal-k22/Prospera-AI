const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROUTES = [
  { name: 'landing', url: 'http://localhost:3000/' },
  { name: 'broker-desk', url: 'http://localhost:3000/broker' },
  { name: 'lead-hub', url: 'http://localhost:3000/broker/leads/lead-1' },
  { name: 'buyer-portal', url: 'http://localhost:3000/buyer' },
  { name: 'dev-ui', url: 'http://localhost:3000/dev/ui' },
  { name: 'not-found', url: 'http://localhost:3000/non-existent-route-for-404' },
];

const VIEWPORTS = [
  { name: '390', width: 390, height: 844, isMobile: true },
  { name: '768', width: 768, height: 1024, isMobile: false },
  { name: '1440', width: 1440, height: 900, isMobile: false },
];

async function capture() {
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
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json/list');
    const tabs = await listRes.json();
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

    for (const route of ROUTES) {
      console.log(`\nNavigating to ${route.name} (${route.url})...`);
      await sendCommand('Page.navigate', { url: route.url });
      await new Promise((r) => setTimeout(r, 1500));

      for (const vp of VIEWPORTS) {
        await sendCommand('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.isMobile,
        });
        await new Promise((r) => setTimeout(r, 300));

        // 1. Light Mode
        await sendCommand('Runtime.evaluate', {
          expression: `document.documentElement.removeAttribute('data-theme'); localStorage.removeItem('prospera-theme');`,
        });
        await new Promise((r) => setTimeout(r, 400));
        const shotLight = await sendCommand('Page.captureScreenshot', { format: 'png' });
        const lightFile = `${route.name}-${vp.name}-light.png`;
        fs.writeFileSync(path.join(outDir, lightFile), Buffer.from(shotLight.data, 'base64'));
        console.log(`Saved: ${lightFile}`);

        // 2. Dark Mode
        await sendCommand('Runtime.evaluate', {
          expression: `document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('prospera-theme', 'dark');`,
        });
        await new Promise((r) => setTimeout(r, 400));
        const shotDark = await sendCommand('Page.captureScreenshot', { format: 'png' });
        const darkFile = `${route.name}-${vp.name}-dark.png`;
        fs.writeFileSync(path.join(outDir, darkFile), Buffer.from(shotDark.data, 'base64'));
        console.log(`Saved: ${darkFile}`);
      }
    }

    ws.close();
    console.log('\nAll audit screenshots captured successfully!');
  } catch (err) {
    console.error('CDP Capture Error:', err);
  } finally {
    chromeProc.kill();
  }
}

capture();

