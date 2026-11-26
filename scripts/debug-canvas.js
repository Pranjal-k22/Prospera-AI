const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9227',
  '--no-first-run',
  '--no-default-browser-check',
  'http://localhost:3000/dev/fog'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9227/json/list');
    const tabs = await listRes.json();
    const target = tabs.find(t => t.type === 'page') || tabs[0];
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((res, rej) => {
        const id = msgId++;
        const h = (evt) => {
          const r = JSON.parse(evt.data);
          if (r.id === id) {
            ws.removeEventListener('message', h);
            if (r.error) rej(r.error); else res(r.result);
          }
        };
        ws.addEventListener('message', h);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Runtime.enable');
    await new Promise(r => setTimeout(r, 2000));

    const check = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const canvas = document.querySelector('canvas');
          if (!canvas) return 'No canvas found';
          const gl = canvas.getContext('webgl2');
          if (!gl) return 'No webgl2 context on canvas (maybe already grabbed or not supported)';
          return 'Canvas has webgl2: ' + (gl ? 'yes' : 'no');
        })()
      `,
      returnByValue: true
    });

    console.log('Canvas check:', check.result.value);

    ws.close();
    chromeProc.kill();
  } catch (e) {
    console.error(e);
    chromeProc.kill();
  }
}, 2000);
