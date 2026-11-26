const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.join(__dirname, '..', 'docs', 'ai-chat');
const artifactDir = 'C:\\Users\\pc\\.gemini\\antigravity\\brain\\043be107-233d-476c-9e11-aedf6daa0a15';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function saveShot(filename, base64Data) {
  const buf = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(path.join(outDir, filename), buf);
  fs.writeFileSync(path.join(artifactDir, filename), buf);
  console.log(`Saved screenshot: ${filename} (${buf.length} bytes)`);
}

async function capture() {
  console.log('Launching headless Chrome for AI chat capture...');
  const tempDir = path.join(__dirname, '..', '.chrome-temp-ai');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--enable-webgl',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + tempDir,
    'http://localhost:3000/',
  ]);

  await new Promise((r) => setTimeout(r, 2200));

  try {
    const listRes = await fetch('http://127.0.0.1:9229/json/list');
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

    console.log('Setting 1440x900 desktop viewport...');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('Navigating to landing page http://localhost:3000/...');
    await sendCommand('Page.navigate', { url: 'http://localhost:3000/' });
    await new Promise((r) => setTimeout(r, 2500));

    // 1. Capture Collapsed Pill State
    console.log('1. Capturing collapsed pill state...');
    const shotCollapsed = await sendCommand('Page.captureScreenshot', { format: 'png' });
    saveShot('ai-launcher-collapsed.png', shotCollapsed.data);

    // 2. Click launcher to expand into input with rising suggestions
    console.log('2. Clicking launcher to expand with suggestions...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('button[aria-label="Open AI assistant"]');
        if (btn) btn.click();
      `,
    });
    await new Promise((r) => setTimeout(r, 850)); // Wait for gooey spring morph & staggered rising pills

    const shotExpanded = await sendCommand('Page.captureScreenshot', { format: 'png' });
    saveShot('ai-launcher-expanded.png', shotExpanded.data);

    // 3. Click first suggestion to send and morph into full LiquidGlass Chat Panel
    console.log('3. Clicking first suggestion pill to open chat panel and stream response...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        const firstSuggestion = document.querySelector('ul[aria-label="Suggested questions"] button');
        if (firstSuggestion) firstSuggestion.click();
      `,
    });
    // Wait 300ms to capture active streaming state
    await new Promise((r) => setTimeout(r, 350));
    const shotStreaming = await sendCommand('Page.captureScreenshot', { format: 'png' });
    saveShot('ai-chat-panel-streaming.png', shotStreaming.data);

    // Wait 2500ms for streaming to finish completely
    await new Promise((r) => setTimeout(r, 2500));
    const shotOpen = await sendCommand('Page.captureScreenshot', { format: 'png' });
    saveShot('ai-chat-panel-open.png', shotOpen.data);

    // 4. Test listing detail context: navigate to /homes/prop-1 and click "Ask Prospera AI about this property"
    console.log('4. Navigating to /homes/prop-1 to test listing context...');
    await sendCommand('Page.navigate', { url: 'http://localhost:3000/homes/prop-1' });
    await new Promise((r) => setTimeout(r, 2000));

    // Click the "Ask Prospera AI about this property" button
    console.log('Clicking "Ask Prospera AI about this property" button...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        const askBtns = Array.from(document.querySelectorAll('button'));
        const askBtn = askBtns.find(b => b.textContent.includes('Ask') && b.textContent.includes('AI'));
        if (askBtn) askBtn.click();
      `,
    });
    await new Promise((r) => setTimeout(r, 2000));

    const shotListing = await sendCommand('Page.captureScreenshot', { format: 'png' });
    saveShot('ai-chat-listing-context.png', shotListing.data);

    // 5. Test Mobile 390px Viewport
    console.log('5. Configuring mobile 390x844 viewport...');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 1000));

    const shotMobile = await sendCommand('Page.captureScreenshot', { format: 'png' });
    saveShot('ai-chat-mobile-390.png', shotMobile.data);

    ws.close();
    chromeProc.kill();
    console.log('All AI Chat screenshots captured successfully!');
  } catch (err) {
    console.error('Capture failed:', err);
    chromeProc.kill();
    process.exit(1);
  }
}

capture();
