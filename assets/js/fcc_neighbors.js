document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("fccCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const info = document.getElementById("fcc-info");

  function setInfo(msg) {
    if (info) info.textContent = msg;
  }

  // -------------------------------
  // Construir supercelda FCC 3x3x3
  // -------------------------------
  const nx = 3, ny = 3, nz = 3; // número de celdas
  const a = 1.0;                // parámetro de red (arbitrario)
  const basis = [
    [0,   0,   0  ],
    [0,   0.5, 0.5],
    [0.5, 0,   0.5],
    [0.5, 0.5, 0  ]
  ];

  const atoms = [];

  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        for (const b of basis) {
          const x = (i + b[0]) * a;
          const y = (j + b[1]) * a;
          const z = (k + b[2]) * a;
          atoms.push({ x, y, z });
        }
      }
    }
  }

  // Elegir átomo origen: el más cercano al centro geométrico
  const cx = (nx * a) / 2;
  const cy = (ny * a) / 2;
  const cz = (nz * a) / 2;

  let origin = null;
  let bestDist = Infinity;
  for (const atom of atoms) {
    const dx = atom.x - cx;
    const dy = atom.y - cy;
    const dz = atom.z - cz;
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 < bestDist) {
      bestDist = d2;
      origin = atom;
    }
  }
  origin.isOrigin = true;

  // -------------------------------
  // Calcular distancias y shells FCC
  // -------------------------------
  const distancesRaw = [];

  for (const atom of atoms) {
    if (atom === origin) {
      atom.distance = 0;
      atom.shell = 0;
      continue;
    }
    const dx = atom.x - origin.x;
    const dy = atom.y - origin.y;
    const dz = atom.z - origin.z;
    const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
    atom.distance = r;
    distancesRaw.push(r);
  }

  // Agrupar distancias únicas (1er NN, 2do NN, etc.)
  const unique = [...new Set(distancesRaw.map(v => +v.toFixed(3)))]
    .sort((a, b) => a - b);

  for (const atom of atoms) {
    if (atom === origin) continue;
    const key = +atom.distance.toFixed(3);
    atom.shell = unique.indexOf(key) + 1; // shell 1, 2, 3...
  }

  // -------------------------------
  // Proyección pseudo-3D (isométrica)
  // -------------------------------
  function projectAtom(atom) {
    const s = 70;   // escala
    // proyección simple tipo isométrica
    const isoX = (atom.x - atom.z) * s;
    const isoY = (atom.x + atom.z) * s * 0.35 - atom.y * s;

    atom.screenX = width / 2 + isoX;
    atom.screenY = height / 2 + isoY;
  }

  atoms.forEach(projectAtom);

  // Orden de dibujo: de atrás hacia adelante (por z)
  atoms.sort((a, b) => a.z - b.z);

  // -------------------------------
  // Colores por shell
  // -------------------------------
  const shellColors = {
    1: "#f97316", // 1st NN - orange
    2: "#22c55e", // 2nd NN - green
    3: "#38bdf8", // 3rd NN - cyan
    4: "#a855f7", // 4th NN - purple
    5: "#eab308"  // etc...
  };

  let selectedAtom = null;

  function ordinal(n) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    const suf = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    return `${n}${suf}`;
  }

  // -------------------------------
  // Dibujo
  // -------------------------------
  function draw() {
    // Fondo
    const grad = ctx.createRadialGradient(
      width / 2, height / 2, 10,
      width / 2, height / 2, width / 1.2
    );
    grad.addColorStop(0, "#020617");
    grad.addColorStop(1, "#000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Enlaces (simple: unir átomos cercanos al origen visualmente)
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
    for (const a of atoms) {
      for (const b of atoms) {
        if (a === b) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 0.75 * a) { // umbral para vecinos próximos
          ctx.beginPath();
          ctx.moveTo(a.screenX, a.screenY);
          ctx.lineTo(b.screenX, b.screenY);
          ctx.stroke();
        }
      }
    }

    // Átomos
    for (const atom of atoms) {
      const isOrigin = atom.isOrigin;
      const isSelected = atom === selectedAtom;

      const baseRadius = isOrigin ? 10 : 7;
      const radius = isSelected ? baseRadius + 2 : baseRadius;

      let color;
      if (isOrigin) {
        color = "#facc15"; // amarillo
      } else {
        color = shellColors[atom.shell] || "#9ca3af";
      }

      // halo si está seleccionado
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(atom.screenX, atom.screenY, radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(248, 250, 252, 0.3)";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(atom.screenX, atom.screenY, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = "rgba(148, 163, 184, 0.6)";
      ctx.shadowBlur = isOrigin ? 18 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  draw();
  setInfo("Click any atom to see its FCC neighbor shell relative to the yellow origin atom.");

  // -------------------------------
  // Selección con el mouse
  // -------------------------------
  canvas.addEventListener("mousedown", (evt) => {
    const rect = canvas.getBoundingClientRect();
    const mx = evt.clientX - rect.left;
    const my = evt.clientY - rect.top;

    let hit = null;

    // recorrer al revés para dar prioridad a los que están "sobre" otros
    for (let i = atoms.length - 1; i >= 0; i--) {
      const atom = atoms[i];
      const dx = mx - atom.screenX;
      const dy = my - atom.screenY;
      const r = Math.sqrt(dx * dx + dy * dy);
      const pickRadius = atom.isOrigin ? 12 : 9;
      if (r <= pickRadius) {
        hit = atom;
        break;
      }
    }

    selectedAtom = hit;
    if (!hit) {
      setInfo("Click an atom close to the center of the cluster.");
    } else if (hit.isOrigin) {
      setInfo("This is the origin atom (reference site).");
    } else {
      const shell = hit.shell;
      const d = hit.distance.toFixed(2);
      setInfo(
        `This atom is in shell ${shell} (${ordinal(shell)}-nearest neighbor), distance ≈ ${d} a.`
      );
    }

    draw();
  });
});
