const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.join(__dirname, '..', 'docs', 'listing-fog');
const artifactDir = 'C:\\Users\\pc\\.gemini\\antigravity\\brain\\043be107-233d-476c-9e11-aedf6daa0a15';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function saveShot(filename, base64Data) {
  const buf = Buffer.from(base64Data, 'base64');
  const targetPath = path.join(outDir, filename);
  const artPath = path.join(artifactDir, filename);
  fs.writeFileSync(targetPath, buf);
  fs.writeFileSync(artPath, buf);
  console.log(`Saved screenshot: ${filename} (${buf.length} bytes)`);
}

async function capture() {
  console.log('Launching headless Chrome for /dev/fog capture...');
  const tempDir = path.join(__dirname, '..', '.chrome-temp-fog');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + tempDir,
    'http://localhost:3000/dev/fog',
  ]);

  await new Promise((r) => setTimeout(r, 2200));

  try {
    const listRes = await fetch('http://127.0.0.1:9228/json/list');
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
    await sendCommand('Runtime.enable');

    console.log('Navigating to http://localhost:3000/dev/fog...');
    await sendCommand('Page.navigate', { url: 'http://localhost:3000/dev/fog' });
    await new Promise((r) => setTimeout(r, 2000));

    // Configure 1440x900 viewport
    console.log('Setting 1440x900 desktop viewport...');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await new Promise((r) => setTimeout(r, 1500));

    // 1. Capture settled Morning view
    console.log('Capturing settled Morning view...');
    const morningShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    saveShot('dev-fog-morning.png', morningShot.data);

    // 2. Trigger switch to Night view
    console.log('Triggering switch to Night view via toggle click...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        const nightBtn = document.querySelector('div[role="group"] button:nth-child(2)');
        if (nightBtn) nightBtn.click();
      `,
    });

    // 3. Capture at exactly 240ms (deepest sink point & maximum fog surge!)
    await new Promise((r) => setTimeout(r, 240));
    console.log('Capturing transition surge at SINK=240ms...');
    const surgeShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    saveShot('dev-fog-transition-surge.png', surgeShot.data);

    // 4. Wait for rise curve to finish and night view to settle (850ms)
    await new Promise((r) => setTimeout(r, 900));
    console.log('Capturing settled Night view...');
    const nightShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    saveShot('dev-fog-night.png', nightShot.data);

    // 5. Test 390px mobile viewport
    console.log('Configuring mobile 390x844 viewport...');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 800));

    // Switch back to morning on mobile to verify responsive layout
    await sendCommand('Runtime.evaluate', {
      expression: `
        const morningBtn = document.querySelector('div[role="group"] button:nth-child(1)');
        if (morningBtn) morningBtn.click();
      `,
    });
    await new Promise((r) => setTimeout(r, 1200));

    console.log('Capturing mobile 390px view...');
    const mobileShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    saveShot('dev-fog-mobile-390.png', mobileShot.data);

    ws.close();
    chromeProc.kill();
    console.log('All /dev/fog preview screenshots captured successfully!');
  } catch (err) {
    console.error('Capture failed:', err);
    chromeProc.kill();
    process.exit(1);
  }
}

capture();
