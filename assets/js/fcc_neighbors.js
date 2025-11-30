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
  // Construir supercelda FCC 3x3x3 centrada
  // -------------------------------
  const nx = 3, ny = 3, nz = 3; // número de celdas
  const a = 3.0;                // parámetro de red (arbitrario)
  const basis = [
    [0,   0,   0  ],
    [0,   0.5, 0.5],
    [0.5, 0,   0.5],
    [0.5, 0.5, 0  ]
  ];

  // distancias analíticas de los 5 primeros vecinos FCC
  const a_val = a;
  const nn_dists = [
    a_val / Math.sqrt(2),             // 1st NN
    a_val,                            // 2nd NN
    Math.sqrt(6) * a_val / 2,         // 3rd NN
    Math.sqrt(2) * a_val,             // 4th NN
    Math.sqrt(10) * a_val / 2         // 5th NN
  ];

  const atoms = [];

  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        for (const b of basis) {
          const x = (i - (nx - 1) / 2 + b[0]) * a;
          const y = (j - (ny - 1) / 2 + b[1]) * a;
          const z = (k - (nz - 1) / 2 + b[2]) * a;
          atoms.push({ x, y, z });
        }
      }
    }
  }

  // Elegir átomo origen: el más cercano al centro (0,0,0)
  let origin = null;
  let bestDist2 = Infinity;
  for (const atom of atoms) {
    const d2 = atom.x * atom.x + atom.y * atom.y + atom.z * atom.z;
    if (d2 < bestDist2) {
      bestDist2 = d2;
      origin = atom;
    }
  }
  origin.isOrigin = true;

      
  // // -------------------------------
  // // Distancias al origen y shells FCC
  // // -------------------------------
  // const distancesRaw = [];

  // for (const atom of atoms) {
  //   if (atom === origin) {
  //     atom.distance = 0;
  //     atom.shell = 0;
  //     continue;
  //   }
  //   const dx = atom.x - origin.x;
  //   const dy = atom.y - origin.y;
  //   const dz = atom.z - origin.z;
  //   const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
  //   atom.distance = r;
  //   distancesRaw.push(r);
  // }

  // const unique = [...new Set(distancesRaw.map(v => +v.toFixed(3)))]
  //   .sort((a, b) => a - b);

  // const firstShellDist = unique[0]; // d ~ a/sqrt(2)

  // for (const atom of atoms) {
  //   if (atom === origin) continue;
  //   const key = +atom.distance.toFixed(3);
  //   atom.shell = unique.indexOf(key) + 1; // 1er NN, 2do NN, etc.
  // }

  // -------------------------------
  // Distancias al origen y shells FCC (analítico)
  // -------------------------------
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
  
    // Clasificar en shell 1–5 usando las fórmulas FCC
    let shell = 0;
    const tol = 0.05; // tolerancia numérica
  
    for (let s = 0; s < nn_dists.length; s++) {
      if (Math.abs(r - nn_dists[s]) < tol) {
        shell = s + 1; // shells 1,2,3,4,5
        break;
      }
    }
  
    atom.shell = shell; // 0 = más allá del 5º vecino
  }


  
  
  // // -------------------------------
  // // Enlaces (solo 1st NN) precomputados
  // // -------------------------------
  // const bonds = [];
  // for (let i = 0; i < atoms.length; i++) {
  //   for (let j = i + 1; j < atoms.length; j++) {
  //     const ai = atoms[i];
  //     const aj = atoms[j];
  //     const dx = ai.x - aj.x;
  //     const dy = ai.y - aj.y;
  //     const dz = ai.z - aj.z;
  //     const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
  //     if (Math.abs(d - firstShellDist) < 0.01) {
  //       bonds.push({ left: ai, right: aj });
  //     }
  //   }
  // }

  // -------------------------------
  // Enlaces (solo 1st NN) precomputados
  // -------------------------------
  const bonds = [];
  const firstShellDist = nn_dists[0];
  const bondTol = 0.05;
  
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const ai = atoms[i];
      const aj = atoms[j];
      const dx = ai.x - aj.x;
      const dy = ai.y - aj.y;
      const dz = ai.z - aj.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (Math.abs(d - firstShellDist) < bondTol) {
        bonds.push({ left: ai, right: aj });
      }
    }
  }


  

  
  // -------------------------------
  // Interacción: rotación y hover
  // -------------------------------
  let angleY = 0.6;       // rotación inicial alrededor de Y
  let angleX = -0.4;      // inclinación inicial
  let isDragging = false;
  let lastDragX = 0;
  let lastDragY = 0;
  let zoom = 1.0;
  const minZoom = 5;
  const maxZoom = 3;


  // nuevas variables para distinguir click vs drag real
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStarted = false;
  const DRAG_THRESHOLD = 4;   // píxeles mínimos para considerar que estás "rotando"

    
  let mouseX = null;
  let mouseY = null;
  let hoverAtom = null;

  const defaultMsg =
    "Move your mouse over atoms and drag to rotate the FCC cluster (yellow = origin).";

  // canvas.addEventListener("mousedown", function (evt) {
  //   isDragging = true;
  //   lastDragX = evt.clientX;
  //   lastDragY = evt.clientY;
  // });
  
  canvas.addEventListener("mousedown", function (evt) {
    isDragging = true;
    dragStarted = false;      // todavía no contamos que sea drag
    dragStartX = evt.clientX; // punto donde empezó el clic
    dragStartY = evt.clientY;
  });


  window.addEventListener("mouseup", function () {
      isDragging = false;
      dragStarted = false;
    });
  
  canvas.addEventListener("wheel", function (evt) {
    evt.preventDefault(); // para que no haga scroll la página
  
    const zoomFactor = evt.deltaY < 0 ? 1.05 : 0.95; // arriba = zoom in, abajo = zoom out
    zoom *= zoomFactor;
  
    if (zoom < minZoom) zoom = minZoom;
    if (zoom > maxZoom) zoom = maxZoom;
  }, { passive: false });




  

  canvas.addEventListener("mouseleave", function () {
    mouseX = mouseY = null;
    hoverAtom = null;
    isDragging = false;
    dragStarted = false;
    setInfo(defaultMsg);
  });


  
  
  // canvas.addEventListener("mousemove", function (evt) {
  //   const rect = canvas.getBoundingClientRect();
  //   mouseX = evt.clientX - rect.left;
  //   mouseY = evt.clientY - rect.top;

  //   if (isDragging) {
  //     const dx = evt.clientX - lastDragX;
  //     const dy = evt.clientY - lastDragY;
  //     angleY += dx * 0.01;
  //     angleX += dy * 0.01;

  //     const maxTilt = Math.PI / 2.5;
  //     if (angleX > maxTilt) angleX = maxTilt;
  //     if (angleX < -maxTilt) angleX = -maxTilt;

  //     lastDragX = evt.clientX;
  //     lastDragY = evt.clientY;
  //   }
  // });

  canvas.addEventListener("mousemove", function (evt) {
    const rect = canvas.getBoundingClientRect();
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
  
    if (!isDragging) return;
  
    // Distancia total desde donde empezó el clic
    const dxTotal = evt.clientX - dragStartX;
    const dyTotal = evt.clientY - dragStartY;
  
    // Si todavía no hemos declarado "drag" y el movimiento es muy pequeño, no rotamos
    if (!dragStarted) {
      if (Math.abs(dxTotal) + Math.abs(dyTotal) < DRAG_THRESHOLD) {
        return;  // tratarlo como simple clic por ahora
      }
      // A partir de aquí sí consideramos que es un drag real
      dragStarted = true;
      lastDragX = evt.clientX;
      lastDragY = evt.clientY;
    }
  
    // Rotación real solo cuando ya se pasó el umbral
    const dx = evt.clientX - lastDragX;
    const dy = evt.clientY - lastDragY;
    angleY += dx * 0.01;
    angleX += dy * 0.01;
  
    const maxTilt = Math.PI / 2.5;
    if (angleX > maxTilt) angleX = maxTilt;
    if (angleX < -maxTilt) angleX = -maxTilt;
  
    lastDragX = evt.clientX;
    lastDragY = evt.clientY;
  });

  
  function ordinal(n) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    const suf = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    return `${n}${suf}`;
  }

  // -------------------------------
  // Bucle de dibujo (rotación + hover)
  // -------------------------------
  function updateAndDraw() {
    // Fondo
    const grad = ctx.createRadialGradient(
      width / 2, height / 2, 10,
      width / 2, height / 2, width / 1.2
    );
    grad.addColorStop(0, "#020617");
    grad.addColorStop(1, "#000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Rotación 3D
    const cosy = Math.cos(angleY);
    const siny = Math.sin(angleY);
    const cosx = Math.cos(angleX);
    const sinx = Math.sin(angleX);

    // const scale = 200;
    // const zOffset = 3;
    const baseScale = 200;
    const scale = baseScale * zoom; // escala depende del zoom
    const zOffset = 3;


    // Actualizar coords proyectadas
    for (const atom of atoms) {
      const x0 = atom.x;
      const y0 = atom.y;
      const z0 = atom.z;

      // Rotación Y
      const x1 = x0 * cosy + z0 * siny;
      const z1 = -x0 * siny + z0 * cosy;

      // Rotación X
      const y1 = y0 * cosx - z1 * sinx;
      const z2 = y0 * sinx + z1 * cosx;

      const zCam = z2 + zOffset;
      const factor = scale / zCam;

      atom.screenX = width / 2 + x1 * factor;
      atom.screenY = height / 2 - y1 * factor;
      atom.depth = zCam;
    }

    // Determinar átomo bajo el mouse (hover)
    hoverAtom = null;
    if (mouseX !== null && mouseY !== null) {
      let bestR2 = Infinity;
      for (const atom of atoms) {
        const dx = mouseX - atom.screenX;
        const dy = mouseY - atom.screenY;
        const r2 = dx * dx + dy * dy;
        const pickR = atom.isOrigin ? 14 : 11;
        if (r2 <= pickR * pickR && r2 < bestR2) {
          bestR2 = r2;
          hoverAtom = atom;
        }
      }
    }

    // Info
    if (!hoverAtom) {
      setInfo(defaultMsg);
    } else if (hoverAtom.isOrigin) {
      setInfo("This is the origin atom (reference site).");
    } else {
      const shell = hoverAtom.shell;
      const d = hoverAtom.distance.toFixed(2);
      setInfo(
        `This atom is in shell ${shell} (${ordinal(shell)}-nearest neighbor), distance ≈ ${d} a.`
      );
    }

    // Dibujar enlaces (1st NN)
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.55)";
    ctx.beginPath();
    for (const bond of bonds) {
      const aL = bond.left;
      const aR = bond.right;
      ctx.moveTo(aL.screenX, aL.screenY);
      ctx.lineTo(aR.screenX, aR.screenY);
    }
    ctx.stroke();

    // Dibujar átomos (ordenados por profundidad: lejos → cerca)
    atoms.sort((aObj, bObj) => bObj.depth - aObj.depth);




    for (const atom of atoms) {
      const isOrigin = atom.isOrigin;
      const isHover = atom === hoverAtom;
    
      const baseR = isOrigin ? 10 : 7;
      const radius = isHover ? baseR + 3 : baseR;
    
      // Solo el origen tiene color distinto, todos los demás iguales
      let color;
      if (isOrigin) {
        color = "#facc15"; // origen: amarillo
      } else {
        color = "#9ca3af"; // todos los demás: gris (cámbialo si quieres otro)
      }
    
      // anillo suave si está en hover
      if (isHover) {
        ctx.beginPath();
        ctx.arc(atom.screenX, atom.screenY, radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(248, 250, 252, 0.25)";
        ctx.fill();
      }
    
      ctx.beginPath();
      ctx.arc(atom.screenX, atom.screenY, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = "rgba(148, 163, 184, 0.7)";
      ctx.shadowBlur = isOrigin || isHover ? 18 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    
    // for (const atom of atoms) {
    //   const isOrigin = atom.isOrigin;
    //   const isHover = atom === hoverAtom;

    //   const baseR = isOrigin ? 10 : 7;
    //   const radius = isHover ? baseR + 3 : baseR;

    //   let color;
    //   if (isOrigin) {
    //     color = "#facc15"; // amarillo
    //   } else if (atom.shell === 1) {
    //     color = "#22d3ee"; // 1er NN - cyan
    //   } else if (atom.shell === 2) {
    //     color = "#60a5fa"; // 2do NN - azul
    //   } else {
    //     color = "#9ca3af"; // demás - gris
    //   }

    //   // anillo suave si está en hover
    //   if (isHover) {
    //     ctx.beginPath();
    //     ctx.arc(atom.screenX, atom.screenY, radius + 4, 0, Math.PI * 2);
    //     ctx.fillStyle = "rgba(248, 250, 252, 0.25)";
    //     ctx.fill();
    //   }

    //   ctx.beginPath();
    //   ctx.arc(atom.screenX, atom.screenY, radius, 0, Math.PI * 2);
    //   ctx.fillStyle = color;
    //   ctx.shadowColor = "rgba(148, 163, 184, 0.7)";
    //   ctx.shadowBlur = isOrigin || isHover ? 18 : 10;
    //   ctx.fill();
    //   ctx.shadowBlur = 0;
    // }

    // Auto-rotación muy suave cuando no arrastras
    // if (!isDragging) {
    //   angleY += 0.0025;
    // }

    requestAnimationFrame(updateAndDraw);
  }

  setInfo(defaultMsg);
  requestAnimationFrame(updateAndDraw);
});
