/**
 * WebGL2 Fog Shader Module
 * Exact GLSL source of truth for the cinematic listing hero fog transition.
 */

export const FOG_VERTEX_SHADER = `#version 300 es
void main(){
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2. - 1., 0.0, 1.0);
}
`;

export const FOG_FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec2 R;
uniform float T, S, K;
uniform vec2 uGlow;
out vec4 O;

float h(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float n(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
}

float fbm(vec2 p){
  float a = .5, s = 0.;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  p = mat2(.8, .6, -.6, .8) * p + 5.3;
  for(int i = 0; i < 5; i++){
    s += a * n(p);
    p = m * p;
    a *= .5;
  }
  return s;
}

void main(){
  vec2 uv = gl_FragCoord.xy / R;
  uv.y = 1. - uv.y;
  float asp = R.x / R.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  float t = T * .05;
  vec2 w = vec2(fbm(p * 1.3 + vec2(t, -t * .6)), fbm(p * 1.3 + vec2(-t * .8, t) + 7.));
  float d = fbm(p * 1.9 + w * 1.7 + vec2(t * 1.6, -t * 1.1 + S * .5));
  float e = fbm(p * .9 - w + vec2(-t, t * .5) + 3.);
  float low = smoothstep(.70, 1.04, uv.y + (d - .5) * .34);
  float side = smoothstep(.2, .0, uv.x + (e - .5) * .28) + smoothstep(.8, 1., uv.x + (e - .5) * .28);
  side *= smoothstep(.25, .6, uv.y) * .2;
  float wisps = smoothstep(.5, .78, d) * smoothstep(.22, .5, uv.y) * smoothstep(.86, .6, uv.y) * .18;
  float rest = clamp(low + side + wisps, 0., 1.);
  float front = 1.02 - S * .68;
  float rise = smoothstep(front - .02, front + .26, uv.y + (d - .5) * .5);
  float haze = S * (.3 + .46 * d);
  float a = clamp(max(rest, max(rise * .97, haze)), 0., 1.);
  vec3 dayA = vec3(.97, .93, .84), dayB = vec3(.79, .78, .71);
  vec3 nitA = vec3(.40, .45, .57), nitB = vec3(.15, .19, .29);
  vec3 c = mix(mix(dayB, dayA, d * 1.15), mix(nitB, nitA, d * 1.1), K);
  vec2 glowPos = uGlow;
  float porch = exp(-dot((uv - glowPos) * vec2(1.7, 2.6), (uv - glowPos) * vec2(1.7, 2.6)) * 3.2);
  c = mix(c, vec3(.86, .55, .27), K * porch * .42 * (1. - S));
  O = vec4(c * a, a);
}
`;

export interface FogShaderContext {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  uniforms: {
    R: WebGLUniformLocation | null;
    T: WebGLUniformLocation | null;
    S: WebGLUniformLocation | null;
    K: WebGLUniformLocation | null;
    uGlow: WebGLUniformLocation | null;
  };
  render: (tSec: number, surge: number, kVal: number, glowX?: number, glowY?: number) => void;
  resize: (width: number, height: number) => void;
  destroy: () => void;
}

export function initFogShader(canvas: HTMLCanvasElement): FogShaderContext | null {
  const gl = canvas.getContext('webgl2', {
    premultipliedAlpha: true,
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
  });

  if (!gl) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[FogShader] WebGL2 not supported in this environment');
    }
    return null;
  }

  // Compile helper
  function compileShader(type: number, src: string): WebGLShader | null {
    if (!gl) return null;
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[FogShader] Compile Error:', gl.getShaderInfoLog(s));
      }
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vs = compileShader(gl.VERTEX_SHADER, FOG_VERTEX_SHADER);
  const fs = compileShader(gl.FRAGMENT_SHADER, FOG_FRAGMENT_SHADER);

  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[FogShader] Link Error:', gl.getProgramInfoLog(program));
    }
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  const uniforms = {
    R: gl.getUniformLocation(program, 'R'),
    T: gl.getUniformLocation(program, 'T'),
    S: gl.getUniformLocation(program, 'S'),
    K: gl.getUniformLocation(program, 'K'),
    uGlow: gl.getUniformLocation(program, 'uGlow'),
  };

  gl.useProgram(program);

  // Set default glow
  if (uniforms.uGlow) {
    gl.uniform2f(uniforms.uGlow, 0.72, 0.74);
  }

  let canvasW = canvas.width;
  let canvasH = canvas.height;

  const resize = (width: number, height: number) => {
    // Max width 960px, or 640px on mobile <= 820px, DPR = 1
    const isMobile = window.innerWidth <= 820;
    const maxW = isMobile ? 640 : 960;
    const aspect = width > 0 && height > 0 ? height / width : 9 / 16;
    
    const targetW = Math.min(width, maxW);
    const targetH = Math.round(targetW * aspect);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      canvasW = targetW;
      canvasH = targetH;
    }

    gl.viewport(0, 0, targetW, targetH);
    if (uniforms.R) {
      gl.useProgram(program);
      gl.uniform2f(uniforms.R, targetW, targetH);
    }
  };

  const render = (
    tSec: number,
    surge: number,
    kVal: number,
    glowX = 0.72,
    glowY = 0.74
  ) => {
    gl.useProgram(program);
    if (uniforms.R) gl.uniform2f(uniforms.R, canvasW, canvasH);
    if (uniforms.T) gl.uniform1f(uniforms.T, tSec);
    if (uniforms.S) gl.uniform1f(uniforms.S, surge);
    if (uniforms.K) gl.uniform1f(uniforms.K, kVal);
    if (uniforms.uGlow) gl.uniform2f(uniforms.uGlow, glowX, glowY);

    // Fullscreen single triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const destroy = () => {
    try {
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    } catch {
      // ignore
    }
  };

  return {
    gl,
    program,
    uniforms,
    render,
    resize,
    destroy,
  };
}
