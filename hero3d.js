/*========== hero 3D column chart (Three.js) =========
  A field of instanced bars on a gridded floor with chart axes — a live,
  slowly shifting dataset. Bars grow in on load, are coloured along the
  chart ramp by height, and rise around the cursor's position on the floor.
  Heights are computed in the vertex shader, so each frame only updates a
  few uniforms (plus one ray–plane test for the pointer).
=======================================================*/
(() => {
  const container = document.querySelector(".hero-canvas");
  const canvas = document.getElementById("hero-canvas");
  if (!container || !canvas) return;

  const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // without WebGL the CSS glow behind the hero stays as the fallback
  const probe = document.createElement("canvas");
  if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return;

  import(THREE_URL)
    .then(init)
    .catch(() => {});

  function init(THREE) {
    const css = getComputedStyle(document.documentElement);
    const token = (name, fallback) => new THREE.Color(css.getPropertyValue(name).trim() || fallback);

    const isSmall = window.matchMedia("(max-width: 768px)").matches;
    const N = isSmall ? 12 : 18; // bars per side
    const SPACING = 0.5;
    const BAR = 0.34; // bar footprint
    const HALF = ((N - 1) * SPACING) / 2;

    /* ---------- renderer / scene / camera ---------- */
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    const target = new THREE.Vector3(0, 0.8, 0);
    camera.position.set(0, 7, 15);
    camera.lookAt(target);

    // tilt (layout + pointer) > chart (bars, floor, axes)
    const tilt = new THREE.Group();
    const chart = new THREE.Group();
    tilt.add(chart);
    scene.add(tilt);

    /* ---------- bars ---------- */
    const box = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
    const geo = new THREE.InstancedBufferGeometry().copy(box);
    const grid = new Float32Array(N * N * 2);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const k = (i * N + j) * 2;
        grid[k] = i * SPACING - HALF;
        grid[k + 1] = j * SPACING - HALF;
      }
    }
    geo.setAttribute("aGrid", new THREE.InstancedBufferAttribute(grid, 2));
    geo.instanceCount = N * N;

    const uniforms = {
      uTime: { value: 0 },
      uIntro: { value: reduceMotion ? 1 : 0 },
      uPointer: { value: new THREE.Vector2(999, 999) },
      uPointerStrength: { value: 0 },
      uHalf: { value: HALF },
      uBar: { value: BAR },
      uLow: { value: token("--chart-low", "#0c1f45") },
      uMid: { value: token("--chart-mid", "#1d5fd6") },
      uHigh: { value: token("--chart-high", "#38bdf8") },
      uPeak: { value: token("--chart-peak", "#c7ecff") },
      uBg: { value: token("--color-bg", "#04060a") },
    };

    const barMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uIntro;
        uniform vec2 uPointer;
        uniform float uPointerStrength;
        uniform float uHalf;
        uniform float uBar;
        attribute vec2 aGrid;
        varying float vH;
        varying vec3 vNormal;
        varying float vFade;

        // a smooth, slowly drifting "dataset"
        float field(vec2 p) {
          float a = sin(p.x * 0.85 + uTime * 0.55);
          float b = cos(p.y * 0.7 - uTime * 0.4);
          float c = sin((p.x - p.y) * 0.45 + uTime * 0.3);
          float n = (a * 0.4 + b * 0.35 + c * 0.25) * 0.5 + 0.5;
          float h = 0.15 + pow(n, 1.5) * 3.4;
          vec2 d = p - uPointer;
          h += uPointerStrength * 1.8 * exp(-dot(d, d) * 0.9);
          return h;
        }

        void main() {
          // bars grow in as a diagonal wave on load
          float delay = ((aGrid.x - aGrid.y) / (uHalf * 4.0) + 0.5) * 0.6;
          float k = clamp((uIntro - delay) / 0.4, 0.0, 1.0);
          k = 1.0 - pow(1.0 - k, 3.0);

          float h = field(aGrid) * k;
          vec3 pos = position;
          pos.y *= max(h, 0.001);
          pos.xz = pos.xz * uBar + aGrid;

          vH = h;
          vNormal = normal;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          vFade = smoothstep(-27.0, -13.0, mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uLow;
        uniform vec3 uMid;
        uniform vec3 uHigh;
        uniform vec3 uPeak;
        uniform vec3 uBg;
        varying float vH;
        varying vec3 vNormal;
        varying float vFade;

        void main() {
          // sequential chart ramp by value
          float t = clamp(vH / 3.8, 0.0, 1.0);
          vec3 col = mix(uLow, uMid, smoothstep(0.0, 0.45, t));
          col = mix(col, uHigh, smoothstep(0.45, 0.8, t));
          col = mix(col, uPeak, smoothstep(0.8, 1.0, t));

          // flat faceted shading: lit tops, darker sides
          float shade = vNormal.y > 0.5 ? 1.0 : (abs(vNormal.x) > 0.5 ? 0.62 : 0.42);
          col *= shade;
          if (vNormal.y > 0.5) col = mix(col, uPeak, 0.12);

          // fade the far rows into the page background
          col = mix(uBg, col, mix(0.2, 1.0, vFade));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const bars = new THREE.Mesh(geo, barMaterial);
    bars.frustumCulled = false; // instances extend far past the unit box's bounds
    chart.add(bars);

    /* ---------- floor grid + axes ---------- */
    const size = N * SPACING;
    const floor = new THREE.GridHelper(size, N, 0x1b2638, 0x1b2638);
    floor.material.transparent = true;
    floor.material.opacity = 0.6;
    floor.position.y = -0.001;
    chart.add(floor);

    const edge = size / 2;
    const axisGeo = new THREE.BufferGeometry().setFromPoints([
      // x axis, z axis, value axis — all meeting at the back-left corner
      new THREE.Vector3(-edge, 0, -edge), new THREE.Vector3(edge, 0, -edge),
      new THREE.Vector3(-edge, 0, -edge), new THREE.Vector3(-edge, 0, edge),
      new THREE.Vector3(-edge, 0, -edge), new THREE.Vector3(-edge, 4.2, -edge),
    ]);
    const axes = new THREE.LineSegments(
      axisGeo,
      new THREE.LineBasicMaterial({ color: uniforms.uHigh.value, transparent: true, opacity: 0.55 })
    );
    chart.add(axes);

    // value-axis ticks
    const tickPts = [];
    for (let v = 0.5; v <= 4.0; v += 0.5) {
      tickPts.push(new THREE.Vector3(-edge, v, -edge), new THREE.Vector3(-edge + 0.18, v, -edge));
    }
    chart.add(
      new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(tickPts),
        new THREE.LineBasicMaterial({ color: uniforms.uHigh.value, transparent: true, opacity: 0.4 })
      )
    );

    /* ---------- layout ---------- */
    // chart sits to the right of the name on wide screens, above it on narrow ones
    let baseRotY = -0.55;
    const layout = (aspect) => {
      const dist = camera.position.distanceTo(target);
      const halfWidth = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist * aspect;
      if (aspect >= 1.1) {
        // a framed object in the right half, never touching the edges
        tilt.position.set(halfWidth * 0.48, -0.4, 0);
        tilt.scale.setScalar(Math.min(0.85, (halfWidth * 0.62) / size));
        baseRotY = -0.62;
      } else {
        tilt.position.set(0, 2.6, -1);
        tilt.scale.setScalar(Math.max(0.5, Math.min(0.8, (halfWidth * 1.15) / size)));
        baseRotY = -0.7;
      }
      chart.rotation.y = baseRotY;
    };

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      layout(camera.aspect);
      if (!running) renderer.render(scene, camera);
    };

    /* ---------- pointer → point on the chart floor ---------- */
    const pointer = { x: 0, y: 0, active: false, last: 0 };
    const smooth = { x: 0, y: 0 };
    window.addEventListener(
      "pointermove",
      (e) => {
        const rect = container.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        pointer.active = e.clientY >= rect.top && e.clientY <= rect.bottom;
        pointer.last = performance.now();
      },
      { passive: true }
    );

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hit = new THREE.Vector3();
    const hit2 = new THREE.Vector2();
    const invMatrix = new THREE.Matrix4();

    /* ---------- loop ---------- */
    const clock = new THREE.Clock();
    let running = false;
    let visible = true;
    let rafId = 0;
    let elapsed = reduceMotion ? 1.5 : 0;
    uniforms.uTime.value = elapsed;

    const frame = () => {
      rafId = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;

      uniforms.uTime.value = elapsed;
      uniforms.uIntro.value = Math.min(1, uniforms.uIntro.value + dt / 2.2);

      // eased pointer so the tilt feels weighty
      const k = Math.min(1, dt * 2.5);
      smooth.x += (pointer.x - smooth.x) * k;
      smooth.y += (pointer.y - smooth.y) * k;

      chart.rotation.y = baseRotY + Math.sin(elapsed * 0.12) * 0.1 + smooth.x * 0.22;
      tilt.rotation.x = -smooth.y * 0.06;

      // where the cursor lands on the floor, in bar coordinates
      const engaged = pointer.active && performance.now() - pointer.last < 2500;
      if (engaged) {
        ndc.set(pointer.x, pointer.y);
        raycaster.setFromCamera(ndc, camera);
        tilt.updateMatrixWorld();
        invMatrix.copy(bars.matrixWorld).invert();
        raycaster.ray.applyMatrix4(invMatrix);
        if (raycaster.ray.intersectPlane(floorPlane, hit)) {
          hit2.set(hit.x, hit.z);
          // snap on first contact, then glide
          if (uniforms.uPointerStrength.value < 0.05) uniforms.uPointer.value.copy(hit2);
          else uniforms.uPointer.value.lerp(hit2, Math.min(1, dt * 8));
        }
      }
      const targetStrength = engaged ? 1 : 0;
      uniforms.uPointerStrength.value += (targetStrength - uniforms.uPointerStrength.value) * Math.min(1, dt * 3);

      renderer.render(scene, camera);
    };

    const start = () => {
      if (running || reduceMotion || !visible || document.hidden) return;
      running = true;
      clock.getDelta();
      rafId = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    // only render while the hero is on screen and the tab is visible
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    }).observe(container);

    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

    if ("ResizeObserver" in window) {
      new ResizeObserver(resize).observe(container);
    } else {
      window.addEventListener("resize", resize, { passive: true });
    }

    resize();
    renderer.render(scene, camera);
    container.classList.add("is-ready");
    start();
  }
})();
