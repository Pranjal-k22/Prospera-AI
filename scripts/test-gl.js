const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9225',
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9225/json/list');
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

    const testFn = `
      (() => {
        const c = document.createElement('canvas');
        const gl = c.getContext('webgl2');
        if (!gl) return { error: 'No webgl2' };
        
        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, '#version 300 es\\nvoid main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0,1);}\\n');
        gl.compileShader(vs);
        const vsOk = gl.getShaderParameter(vs, gl.COMPILE_STATUS);
        const vsLog = gl.getShaderInfoLog(vs);
        
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        const fsSrc = '#version 300 es\\n' +
'precision highp float;\\n' +
'uniform vec2 R;uniform float T,S,K;uniform vec2 uGlow;out vec4 O;\\n' +
'float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}\\n' +
'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);\\n' +
'  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}\\n' +
'float fbm(vec2 p){float a=.5,s=0.;mat2 m=mat2(1.6,1.2,-1.2,1.6);p=mat2(.8,.6,-.6,.8)*p+5.3;for(int i=0;i<5;i++){s+=a*n(p);p=m*p;a*=.5;}return s;}\\n' +
'void main(){\\n' +
'  vec2 uv=gl_FragCoord.xy/R;uv.y=1.-uv.y;\\n' +
'  float asp=R.x/R.y;vec2 p=vec2(uv.x*asp,uv.y);\\n' +
'  float t=T*.05;\\n' +
'  vec2 w=vec2(fbm(p*1.3+vec2(t,-t*.6)),fbm(p*1.3+vec2(-t*.8,t)+7.));\\n' +
'  float d=fbm(p*1.9+w*1.7+vec2(t*1.6,-t*1.1+S*.5));\\n' +
'  float e=fbm(p*.9-w+vec2(-t,t*.5)+3.);\\n' +
'  float low=smoothstep(.70,1.04,uv.y+(d-.5)*.34);\\n' +
'  float side=smoothstep(.2,.0,uv.x+(e-.5)*.28)+smoothstep(.8,1.,uv.x+(e-.5)*.28);\\n' +
'  side*=smoothstep(.25,.6,uv.y)*.2;\\n' +
'  float wisps=smoothstep(.5,.78,d)*smoothstep(.22,.5,uv.y)*smoothstep(.86,.6,uv.y)*.18;\\n' +
'  float rest=clamp(low+side+wisps,0.,1.);\\n' +
'  float front=1.02-S*.68;\\n' +
'  float rise=smoothstep(front-.02,front+.26,uv.y+(d-.5)*.5);\\n' +
'  float haze=S*(.3+.46*d);\\n' +
'  float a=clamp(max(rest,max(rise*.97,haze)),0.,1.);\\n' +
'  vec3 dayA=vec3(.97,.93,.84),dayB=vec3(.79,.78,.71);\\n' +
'  vec3 nitA=vec3(.40,.45,.57),nitB=vec3(.15,.19,.29);\\n' +
'  vec3 c=mix(mix(dayB,dayA,d*1.15),mix(nitB,nitA,d*1.1),K);\\n' +
'  vec2 glowPos=uGlow;\\n' +
'  float porch=exp(-dot((uv-glowPos)*vec2(1.7,2.6),(uv-glowPos)*vec2(1.7,2.6))*3.2);\\n' +
'  c=mix(c,vec3(.86,.55,.27),K*porch*.42*(1.-S));\\n' +
'  O=vec4(c*a,a);\\n' +
'}\\n';
        gl.shaderSource(fs, fsSrc);
        gl.compileShader(fs);
        const fsOk = gl.getShaderParameter(fs, gl.COMPILE_STATUS);
        const fsLog = gl.getShaderInfoLog(fs);

        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        const linkOk = gl.getProgramParameter(prog, gl.LINK_STATUS);
        const linkLog = gl.getProgramInfoLog(prog);

        return { vsOk, vsLog, fsOk, fsLog, linkOk, linkLog };
      })()
    `;

    const res = await send('Runtime.evaluate', { expression: testFn, returnByValue: true });
    console.log('Shader test result:', JSON.stringify(res.result.value, null, 2));

    ws.close();
    chromeProc.kill();
  } catch (e) {
    console.error('Error:', e);
    chromeProc.kill();
  }
}, 1500);
