document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("phononCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;

  // -------------------------------
  // Atomic lattice
  // -------------------------------
  const cols = 20;
  const rows = 10;
  const atoms = [];

  function rebuildAtoms() {
    atoms.length = 0;

    const paddingX = Math.max(22, width * 0.035);
    const paddingY = Math.max(22, height * 0.05);
    const stepX = cols > 1 ? (width - 2 * paddingX) / (cols - 1) : 0;
    const stepY = rows > 1 ? (height - 2 * paddingY) / (rows - 1) : 0;

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        atoms.push({
          baseX: paddingX + i * stepX,
          baseY: paddingY + j * stepY
        });
      }
    }
  }

  // -------------------------------
  // Phonon-like pulses
  // -------------------------------
  const waves = [];
  const WAVE_LIFETIME = 3500;
  canvas.style.touchAction = "none";

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuildAtoms();
  }

  function getCanvasPoint(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  canvas.addEventListener("pointerdown", (evt) => {
    if (evt.pointerType === "mouse" && evt.button !== 0) return;

    const { x, y } = getCanvasPoint(evt);
    waves.push({
      x,
      y,
      t0: performance.now()
    });
  });

  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(canvas);
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // -------------------------------
  // Main animation
  // -------------------------------
  function draw(time) {
    if (!width || !height) {
      requestAnimationFrame(draw);
      return;
    }

    // Fondo
    const grad = ctx.createRadialGradient(
      width / 2, height / 2, 10,
      width / 2, height / 2, width / 1.2
    );
    grad.addColorStop(0, "#020617");
    grad.addColorStop(1, "#000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Texto guía
    // ctx.save();
    // ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
    // ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";
    // ctx.textAlign = "center";
    // ctx.fillText("Click anywhere to excite a phonon wave ✨", width / 2, 32);
    // ctx.restore();

    // Eliminar ondas viejas
    for (let i = waves.length - 1; i >= 0; i--) {
      if (time - waves[i].t0 > WAVE_LIFETIME) {
        waves.splice(i, 1);
      }
    }

    // Dibujar enlaces de la red
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const idx = j * cols + i;
        const atom = atoms[idx];

        if (i < cols - 1) {
          const atomR = atoms[idx + 1];
          ctx.beginPath();
          ctx.moveTo(atom.baseX, atom.baseY);
          ctx.lineTo(atomR.baseX, atomR.baseY);
          ctx.stroke();
        }
        if (j < rows - 1) {
          const atomD = atoms[idx + cols];
          ctx.beginPath();
          ctx.moveTo(atom.baseX, atom.baseY);
          ctx.lineTo(atomD.baseX, atomD.baseY);
          ctx.stroke();
        }
      }
    }

    // Dibujar átomos
    for (const atom of atoms) {
      let amp = 0;

      // Sumar contribución de todas las ondas
      for (const w of waves) {
        const dt = (time - w.t0) / 1000; // s
        if (dt < 0) continue;

        const dx = atom.baseX - w.x;
        const dy = atom.baseY - w.y;
        const r = Math.hypot(dx, dy);

        const k = 1 / 22;   // número de onda
        const omega = 7.5;  // frecuencia
        const decaySpace = Math.exp(-r / 160);
        const decayTime = Math.exp(-dt * 1.2);

        const phase = k * r - omega * dt;
        const localAmp = Math.sin(phase) * decaySpace * decayTime;

        amp += localAmp;
      }

      // Limitar amplitud
      if (amp > 1) amp = 1;
      if (amp < -1) amp = -1;

      const shiftY = amp * Math.min(24, height * 0.035);
      const radius = 4 + 7 * Math.abs(amp);

      const intensity = Math.floor(150 + 100 * Math.abs(amp));
      const green = intensity;
      const blue = 230;
      const red = 90;
      const color = `rgb(${red}, ${green}, ${blue})`;

      ctx.beginPath();
      ctx.arc(atom.baseX, atom.baseY + shiftY, radius, 0, Math.PI * 2);

      const glow = 0.4 + 0.5 * Math.abs(amp);
      ctx.fillStyle = color;
      ctx.shadowColor = `rgba(125, 211, 252, ${glow})`;
      ctx.shadowBlur = 18 + 20 * Math.abs(amp);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
});
