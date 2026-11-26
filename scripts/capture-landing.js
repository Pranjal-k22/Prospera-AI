const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900, isMobile: false },
  { name: '768', width: 768, height: 1024, isMobile: false },
  { name: '390', width: 390, height: 844, isMobile: true },
];

async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const outDir = path.join(__dirname, '..', 'docs', 'landing-screenshots');
  const stage0Dir = path.join(__dirname, '..', 'docs', 'stage-0');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  if (!fs.existsSync(stage0Dir)) fs.mkdirSync(stage0Dir, { recursive: true });

  function saveShot(filename, base64Data) {
    const buf = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(path.join(outDir, filename), buf);
    fs.writeFileSync(path.join(stage0Dir, filename), buf);
    console.log(`Saved: ${filename} (to docs/landing-screenshots and docs/stage-0)`);
  }

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

  await new Promise((r) => setTimeout(r, 2000));

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

    console.log('Navigating to landing page http://localhost:3000/...');
    await sendCommand('Page.navigate', { url: 'http://localhost:3000/' });
    await new Promise((r) => setTimeout(r, 2500));

    for (const vp of VIEWPORTS) {
      console.log(`\nConfiguring viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      await sendCommand('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.isMobile,
      });
      await new Promise((r) => setTimeout(r, 400));

      // 1. Light Mode - Hero
      await sendCommand('Runtime.evaluate', {
        expression: `
          window.scrollTo(0, 0);
          document.documentElement.removeAttribute('data-theme');
          localStorage.removeItem('prospera-theme');
        `,
      });
      await new Promise((r) => setTimeout(r, 800));
      const shotLight = await sendCommand('Page.captureScreenshot', { format: 'png' });
      saveShot(`landing-${vp.name}-light.png`, shotLight.data);

      // 2. Dark Mode - Hero
      await sendCommand('Runtime.evaluate', {
        expression: `
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('prospera-theme', 'dark');
        `,
      });
      await new Promise((r) => setTimeout(r, 600));
      const shotDark = await sendCommand('Page.captureScreenshot', { format: 'png' });
      saveShot(`landing-${vp.name}-dark.png`, shotDark.data);

      // 3. Recommended Homes Grid Scrolled View (Light)
      await sendCommand('Runtime.evaluate', {
        expression: `
          document.documentElement.removeAttribute('data-theme');
          const el = document.getElementById('recommended-homes');
          if (el) {
            const rect = el.getBoundingClientRect();
            window.scrollTo(0, window.pageYOffset + rect.top);
          }
        `,
      });
      await new Promise((r) => setTimeout(r, 1000));
      const shotGrid = await sendCommand('Page.captureScreenshot', { format: 'png' });
      saveShot(`recommended-${vp.name}-light.png`, shotGrid.data);
    }

    // Capture Detail View at 1440
    console.log('\nNavigating to property detail /homes/prop-1...');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sendCommand('Page.navigate', { url: 'http://localhost:3000/homes/prop-1' });
    await new Promise((r) => setTimeout(r, 2000));

    const shotDetail = await sendCommand('Page.captureScreenshot', { format: 'png' });
    saveShot('detail-1440-light.png', shotDetail.data);

    await sendCommand('Runtime.evaluate', {
      expression: `document.documentElement.setAttribute('data-theme', 'dark');`,
    });
    await new Promise((r) => setTimeout(r, 600));
    const shotDetailDark = await sendCommand('Page.captureScreenshot', { format: 'png' });
    saveShot('detail-1440-dark.png', shotDetailDark.data);

    ws.close();
    console.log('\nAll landing screenshots captured successfully!');
  } catch (err) {
    console.error('CDP Error:', err);
  } finally {
    chromeProc.kill();
  }
}

capture();
