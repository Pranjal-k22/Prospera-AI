const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const outDir = path.join(__dirname, '..', 'docs', 'generate-button');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const tempDir = path.join(__dirname, '..', '.chrome-gen-btn');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + tempDir,
    'http://localhost:3000/dev/ui',
  ]);

  await new Promise((r) => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://127.0.0.1:9223/json/list');
    const tabs = await listRes.json();
    const target = tabs.find((t) => t.type === 'page') || tabs[0];

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve) => (ws.onopen = resolve));

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (evt) => {
          const data = JSON.parse(evt.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            if (data.error) reject(data.error);
            else resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('DOM.enable');

    async function takeShot(name, clip) {
      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        ...(clip ? { clip: { ...clip, scale: 1 } } : {}),
      });
      fs.writeFileSync(path.join(outDir, name), Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot: ${name}`);
    }

    async function setViewport(w, h, isMobile = false) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: w,
        height: h,
        deviceScaleFactor: 1,
        mobile: isMobile,
      });
    }

    async function navigate(url) {
      await send('Page.navigate', { url });
      await new Promise((r) => setTimeout(r, 2000));
    }

    // 1. /dev/ui in Dark Mode (1440)
    console.log('Capturing /dev/ui in Dark Mode (1440)...');
    await setViewport(1440, 1200);
    await navigate('http://localhost:3000/dev/ui');
    await send('Runtime.evaluate', {
      expression: `document.documentElement.setAttribute('data-theme', 'dark'); window.scrollTo(0, 400);`,
    });
    await new Promise((r) => setTimeout(r, 600));
    await takeShot('dev-ui-generate-button-dark-1440.png');

    // 2. /dev/ui in Light Mode (1440)
    console.log('Capturing /dev/ui in Light Mode (1440)...');
    await send('Runtime.evaluate', {
      expression: `document.documentElement.removeAttribute('data-theme'); window.scrollTo(0, 400);`,
    });
    await new Promise((r) => setTimeout(r, 600));
    await takeShot('dev-ui-generate-button-light-1440.png');

    // 3. /dev/ui Tablet (768)
    console.log('Capturing /dev/ui Tablet (768)...');
    await setViewport(768, 1024);
    await send('Runtime.evaluate', {
      expression: `document.documentElement.setAttribute('data-theme', 'dark'); window.scrollTo(0, 400);`,
    });
    await new Promise((r) => setTimeout(r, 600));
    await takeShot('dev-ui-generate-button-dark-768.png');

    // 4. /dev/ui Mobile (390)
    console.log('Capturing /dev/ui Mobile (390)...');
    await setViewport(390, 844, true);
    await send('Runtime.evaluate', {
      expression: `document.documentElement.setAttribute('data-theme', 'dark'); window.scrollTo(0, 350);`,
    });
    await new Promise((r) => setTimeout(r, 600));
    await takeShot('dev-ui-generate-button-dark-390.png');

    // 5. Landing SearchBar (1440)
    console.log('Capturing Landing SearchBar usage...');
    await setViewport(1440, 900);
    await navigate('http://localhost:3000/');
    await new Promise((r) => setTimeout(r, 1000));
    await takeShot('usage-landing-searchbar-frosted.png');

    // 6. Property Detail (1440)
    console.log('Capturing Property Detail AI usage...');
    await navigate('http://localhost:3000/homes/prop-1');
    await new Promise((r) => setTimeout(r, 1500));
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 350);`,
    });
    await new Promise((r) => setTimeout(r, 600));
    await takeShot('usage-property-detail-ai-actions.png');

    // 7. Broker Desk (1440)
    console.log('Capturing Broker Desk AI usage...');
    await navigate('http://localhost:3000/broker');
    await new Promise((r) => setTimeout(r, 1200));
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 200);`,
    });
    await new Promise((r) => setTimeout(r, 600));
    await takeShot('usage-broker-desk-reengage.png');

    // 8. Lead Hub (1440)
    console.log('Capturing Lead Hub AI usage...');
    await navigate('http://localhost:3000/broker/leads/lead-1');
    await new Promise((r) => setTimeout(r, 1200));
    await takeShot('usage-lead-hub-ai-cockpit.png');

    // 9. Admin Analytics (1440)
    console.log('Capturing Admin Analytics report usage...');
    await navigate('http://localhost:3000/admin/analytics');
    await new Promise((r) => setTimeout(r, 1200));
    await takeShot('usage-admin-analytics-report.png');

    ws.close();
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    chromeProc.kill();
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('Capture process finished.');
  }
}

capture();
