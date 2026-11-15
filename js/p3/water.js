/* Water scene: one full-screen three.js shader. Needs the THREE global (loaded from cdnjs before this file).
   Without WebGL the page keeps its CSS blue gradient. Colours follow the time of day, or the Dawn palette. */
(function () {
  "use strict";
  if (!window.THREE) return;

  var PALETTES = {
    morning: { top: "#8be8ff", mid: "#25a9f2", bot: "#0b4bbd", foam: "#ffffff", glow: 0, wave: 1 },
    day: { top: "#43d3ff", mid: "#0a8ef0", bot: "#0a30b2", foam: "#eafaff", glow: 0, wave: 1 },
    afternoon: { top: "#2cc6ff", mid: "#0b7ae6", bot: "#0a2299", foam: "#e2f7ff", glow: 0, wave: 1 },
    evening: { top: "#17b4ff", mid: "#0a4fd8", bot: "#050f7a", foam: "#d6f3ff", glow: 0, wave: 0.8 },
    /* Night: the green moon of the reference, kept deep and low in saturation so it stays easy on the eyes. */
    night: { top: "#2c6d5d", mid: "#123f3a", bot: "#051a1c", foam: "#9fc7a4", glow: 0, wave: 0.4 },
    /* Sunset reference: deep violet sky above, magenta clouds in the middle, red-coral and gold near the horizon, with a low sun and rays. */
    dawn: { top: "#2a0e52", mid: "#b3307a", bot: "#e8505a", foam: "#ffd9a0", glow: 1, wave: 0.6 }
  };

  var VERT = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
  var FRAG = [
    "uniform vec2 uRes; uniform float uTime; uniform float uGlow; uniform float uWave;",
    "uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uBot; uniform vec3 uFoam;",
    "uniform vec3 uPtr; uniform vec4 uPulse;",
    "varying vec2 vUv;",
    "float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }",
    "vec2 hash2(vec2 p){ return vec2(hash(p), hash(p + 17.17)); }",
    "vec2 voro(vec2 p, float t){",
    "  vec2 g = floor(p); vec2 f = fract(p); float d1 = 8.0; float d2 = 8.0;",
    "  for (int y = -1; y <= 1; y++) { for (int x = -1; x <= 1; x++) {",
    "    vec2 o = vec2(float(x), float(y));",
    "    vec2 r = hash2(g + o); r = 0.5 + 0.5 * sin(t * 0.6 + 6.2831 * r);",
    "    float d = length(o + r - f);",
    "    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }",
    "  } }",
    "  return vec2(d1, d2);",
    "}",
    "float bubbles(vec2 p, float sc, float sp, float seed){",
    "  vec2 q = p * sc; q.y -= uTime * sp * sc;",
    "  vec2 id = floor(q); vec2 f = fract(q) - 0.5;",
    "  vec2 r = hash2(id + seed) - 0.5;",
    "  float on = step(0.62, hash(id + seed + 3.1));",
    "  float rad = 0.07 + 0.09 * hash(id + seed + 7.7);",
    "  float d = length(f - r * 0.6);",
    "  return on * (1.0 - smoothstep(rad, rad + 0.025, d));",
    "}",
    "void main(){",
    "  float asp = uRes.x / uRes.y;",
    "  vec2 uv = vUv; vec2 p = vec2(uv.x * asp, uv.y);",
    "  float depth = 1.0 - uv.y;",
    "  vec2 ptr = vec2(uPtr.x * asp, uPtr.y);",
    "  float dp = length(p - ptr);",
    "  float rip = sin(dp * 38.0 - uTime * 7.0) * exp(-dp * 7.0) * uPtr.z;",
    "  float age = uTime - uPulse.z;",
    "  vec2 pc = vec2(uPulse.x * asp, uPulse.y);",
    "  float dc = length(p - pc); float front = age * 0.55;",
    "  rip += uPulse.w * sin((dc - front) * 45.0) * exp(-abs(dc - front) * 16.0) * exp(-age * 1.1);",
    "  vec2 q = p + (0.018 + 0.016 * uWave) * vec2(sin(p.y * 7.0 + uTime * 0.7), cos(p.x * 6.0 - uTime * 0.55)) + rip * 0.012;",
    "  q.y += 0.014 * uWave * sin(p.x * 4.0 + uTime * 0.8);",
    "  float surf = smoothstep(0.42, 0.0, depth);",
    "  vec2 v = voro(q * vec2(4.0, 9.0) + vec2(uTime * 0.04, 0.0), uTime);",
    "  float net = 1.0 - smoothstep(0.03, 0.10, v.y - v.x);",
    "  float cel = step(0.42, v.x);",
    "  vec3 col = mix(uTop, uMid, smoothstep(0.0, 0.5, depth));",
    "  col = mix(col, uBot, smoothstep(0.4, 1.0, depth));",
    "  col = mix(col, uFoam, cel * surf * 0.16);",
    "  col = mix(col, uFoam, net * surf * 0.85);",
    "  vec2 w = voro(q * vec2(2.2, 3.4) + vec2(-uTime * 0.03, uTime * 0.02), uTime * 0.7);",
    "  float net2 = 1.0 - smoothstep(0.02, 0.09, w.y - w.x);",
    "  col += uFoam * net2 * 0.07 * (1.0 - depth);",
    "  float sw1 = sin(p.x * 4.2 + sin(p.y * 5.0 + uTime * 0.6) * 1.5 + uTime * 0.45);",
    "  float sw2 = sin(p.x * 2.6 - p.y * 3.4 - uTime * 0.38 + sin(p.x * 3.0 + uTime * 0.5));",
    "  float swell = smoothstep(0.6, 1.0, sw1) * 0.7 + smoothstep(0.7, 1.0, sw2) * 0.5;",
    "  col += uFoam * swell * uWave * (0.04 + 0.09 * (1.0 - depth));",
    "  float ray = pow(max(0.0, sin((p.x + depth * 0.7) * 5.0 + uTime * 0.15)), 8.0) * smoothstep(1.0, 0.0, depth);",
    "  col += uFoam * ray * 0.06;",
    "  float b = bubbles(p, 4.0, 0.05, 1.0) + bubbles(p, 7.0, 0.09, 5.0) * 0.7;",
    "  col = mix(col, uFoam, clamp(b, 0.0, 1.0) * 0.22);",
    "  col += uFoam * rip * 0.05;",
    "  vec2 sp = vec2((uv.x - 0.5) * asp, uv.y - 1.04);",
    "  float sg = exp(-length(sp * vec2(0.6, 1.0)) * 2.6);",
    "  float sr = pow(max(0.0, sin(atan(sp.x, -sp.y) * 9.0 + uTime * 0.12)), 5.0) * smoothstep(1.1, 0.0, length(sp));",
    "  col += mix(uFoam, vec3(1.0, 0.76, 0.4), 0.55) * (sg * 0.5 + sr * 0.16) * uGlow;",
    "  col *= 1.0 - 0.25 * smoothstep(0.5, 1.2, length(uv - vec2(0.5, 0.45)) * 1.2);",
    "  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0;",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  var canvas = document.createElement("canvas");
  canvas.id = "water";
  canvas.setAttribute("aria-hidden", "true");
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false, powerPreference: "low-power" });
  } catch (e) {
    return;
  }
  document.body.insertBefore(canvas, document.body.firstChild);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var scene = new THREE.Scene();
  var camera = new THREE.Camera();
  var cur = { top: new THREE.Color(), mid: new THREE.Color(), bot: new THREE.Color(), foam: new THREE.Color() };
  var tgt = { top: new THREE.Color(), mid: new THREE.Color(), bot: new THREE.Color(), foam: new THREE.Color() };
  var uniforms = {
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uGlow: { value: 0 }, uWave: { value: 1 },
    uTop: { value: cur.top }, uMid: { value: cur.mid }, uBot: { value: cur.bot }, uFoam: { value: cur.foam },
    uPtr: { value: new THREE.Vector3(0.5, 0.8, 0) },
    uPulse: { value: new THREE.Vector4(0.5, 0.5, -100, 0) }
  };
  var mat = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: VERT, fragmentShader: FRAG, depthTest: false, depthWrite: false });
  scene.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), mat));

  var tgtGlow = 0, tgtWave = 1;
  function setTargets(name, instant) {
    var p = PALETTES[name] || PALETTES.evening;
    tgtGlow = p.glow || 0;
    tgtWave = p.wave == null ? 1 : p.wave;
    if (instant) { uniforms.uGlow.value = tgtGlow; uniforms.uWave.value = tgtWave; }
    ["top", "mid", "bot", "foam"].forEach(function (k) {
      tgt[k].set(p[k]);
      if (instant) cur[k].copy(tgt[k]);
    });
  }

  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    var s = renderer.getDrawingBufferSize ? renderer.getDrawingBufferSize(new THREE.Vector2()) : new THREE.Vector2(w, h);
    uniforms.uRes.value.set(s.x, s.y);
    if (reduce) draw();
  }

  var lastMove = -10, t0 = performance.now(), running = true;
  function now() { return (performance.now() - t0) / 1000; }
  window.addEventListener("pointermove", function (e) {
    uniforms.uPtr.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight, 1);
    lastMove = now();
  }, { passive: true });
  window.addEventListener("pointerdown", function (e) {
    uniforms.uPulse.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight, now(), 1);
  }, { passive: true });

  function draw() { renderer.render(scene, camera); }
  function frame() {
    if (!running) return;
    var t = now();
    uniforms.uTime.value = t;
    uniforms.uPtr.value.z = Math.max(0, 1 - (t - lastMove) / 1.2);
    if (t - uniforms.uPulse.value.z > 4) uniforms.uPulse.value.w = 0;
    ["top", "mid", "bot", "foam"].forEach(function (k) { cur[k].lerp(tgt[k], 0.04); });
    uniforms.uGlow.value += (tgtGlow - uniforms.uGlow.value) * 0.04;
    uniforms.uWave.value += (tgtWave - uniforms.uWave.value) * 0.04;
    draw();
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () {
    if (reduce) return;
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });

  window.LTLWater = {
    setPalette: function (name) {
      setTargets(name, reduce);
      if (reduce) draw();
    }
  };

  setTargets("evening", true);
  uniforms.uTime.value = 2.0;
  resize();
  if (reduce) { draw(); } else { requestAnimationFrame(frame); }
})();
