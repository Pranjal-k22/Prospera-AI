const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9226',
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9226/json/list');
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

    ws.addEventListener('message', (evt) => {
      const data = JSON.parse(evt.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        console.log('[Browser Console]', data.params.type, data.params.args.map(a => a.value || a.description).join(' '));
      }
      if (data.method === 'Runtime.exceptionThrown') {
        console.error('[Browser Exception]', JSON.stringify(data.params.exceptionDetails));
      }
    });

    await send('Page.enable');
    await send('Runtime.enable');

    console.log('Navigating to http://localhost:3000/dev/fog...');
    await send('Page.navigate', { url: 'http://localhost:3000/dev/fog' });
    await new Promise(r => setTimeout(r, 4000));

    ws.close();
    chromeProc.kill();
  } catch (e) {
    console.error(e);
    chromeProc.kill();
  }
}, 1500);
