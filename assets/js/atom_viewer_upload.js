// atom_viewer_upload.js

console.log("Atom viewer script loaded");

function createAtomViewerWithUpload(containerId, inputId) {
  const container = document.getElementById(containerId);
  const fileInput = document.getElementById(inputId);

  if (!container || !fileInput) {
    console.error("Container or file input not found");
    return;
  }

  // --- Escena básica Three.js ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // fondo negro

  const width  = container.clientWidth || 600;
  const height = container.clientHeight || 400;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
  camera.position.set(0, 0, 100);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  container.appendChild(renderer.domElement);

  // --- Luces ---
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(1, 1, 1);
  scene.add(dirLight);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight2.position.set(-1, -1, -1);
  scene.add(dirLight2);

  // --- Controles tipo Ovito ---
  if (!THREE.OrbitControls) {
    console.error("OrbitControls not found. Check the script URL.");
  }
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed   = 0.6;
  controls.zoomSpeed     = 1.0;
  controls.panSpeed      = 0.8;
  controls.target.set(0, 0, 0);

  // Resize responsivo
  window.addEventListener("resize", () => {
    const newWidth  = container.clientWidth || width;
    const newHeight = container.clientHeight || height;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });

  let atomGroup = null; // para borrar cuando subas otro archivo

  // --- Listener para subir archivo ---
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("Selected file:", file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      try {
        const data = parseLAMMPSAuto(text);   // <--- detección automática
        console.log("Parsed atoms:", data.atoms.length);
        if (atomGroup) {
          scene.remove(atomGroup);
          atomGroup.traverse(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
          });
          atomGroup = null;
        }
        atomGroup = addAtomsToScene(scene, camera, controls, data);
      } catch (err) {
        console.error("Error parsing file:", err);
        alert(
          "No pude leer el archivo.\n\n" +
          "Verifica que sea:\n" +
          "  • un dump de LAMMPS (ITEM: TIMESTEP / ITEM: ATOMS ...),\n" +
          "  • o un data file de LAMMPS con sección 'Atoms'.\n" +
          "Revisa la consola (F12 > Console) para más detalles."
        );
      }
    };
    reader.readAsText(file);
  });

  // --- Animación ---
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

// ------------------------------------------------------------------
// Auto: dump o data file
// ------------------------------------------------------------------
function parseLAMMPSAuto(text) {
  if (text.includes("ITEM: TIMESTEP")) {
    console.log("Detected LAMMPS dump format");
    return parseLAMMPSDump(text);
  }
  if (text.match(/^\s*\d+\s+atoms\b/mi) && text.match(/^\s*Atoms\b/mi)) {
    console.log("Detected LAMMPS data file format");
    return parseLAMMPSData(text);
  }
  throw new Error("Formato no reconocido como dump ni data file");
}

// ------------------------------------------------------------------
// 1) Dump de LAMMPS
//    Soporta x,y,z  o xs,ys,zs  o xu,yu,zu
// ------------------------------------------------------------------
function parseLAMMPSDump(text) {
  const lines = text.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line.startsWith("ITEM: TIMESTEP")) {
      i++;
      continue;
    }

    const timestep = parseInt(lines[++i].trim(), 10);

    i++; // ITEM: NUMBER OF ATOMS
    const natoms = parseInt(lines[++i].trim(), 10);

    i++; // ITEM: BOX BOUNDS
    const bounds = [];
    for (let d = 0; d < 3; d++) {
      const parts = lines[++i].trim().split(/\s+/);
      const lo = parseFloat(parts[0]);
      const hi = parseFloat(parts[1]);
      bounds.push({ lo, hi });
    }

    const headerParts = lines[++i].trim().split(/\s+/);
    const colNames = headerParts.slice(2);
    console.log("Dump columns:", colNames);
    const colIndex = {};
    colNames.forEach((name, idx) => { colIndex[name] = idx; });

    // soportar x/y/z, xs/ys/zs, xu/yu/zu
    const xKey = colIndex["x"]  !== undefined ? "x"
                : colIndex["xs"] !== undefined ? "xs"
                : colIndex["xu"] !== undefined ? "xu" : null;
    const yKey = colIndex["y"]  !== undefined ? "y"
                : colIndex["ys"] !== undefined ? "ys"
                : colIndex["yu"] !== undefined ? "yu" : null;
    const zKey = colIndex["z"]  !== undefined ? "z"
                : colIndex["zs"] !== undefined ? "zs"
                : colIndex["zu"] !== undefined ? "zu" : null;

    if (!xKey || !yKey || !zKey) {
      throw new Error("Dump file must contain x/y/z or xs/ys/zs or xu/yu/zu");
    }

    const atoms = [];
    for (let a = 0; a < natoms; a++) {
      if (i + 1 >= lines.length) break;
      const l = lines[++i].trim();
      if (!l) { a--; continue; }
      const parts = l.split(/\s+/);
      const x = parseFloat(parts[colIndex[xKey]]);
      const y = parseFloat(parts[colIndex[yKey]]);
      const z = parseFloat(parts[colIndex[zKey]]);
      const type = colIndex["type"] !== undefined ? parseInt(parts[colIndex["type"]], 10) : 1;
      atoms.push({ x, y, z, type });
    }

    return { timestep, bounds, atoms };
  }

  throw new Error("No timestep found in dump");
}

// ------------------------------------------------------------------
// 2) Data file de LAMMPS
// ------------------------------------------------------------------
function parseLAMMPSData(text) {
  const lines = text.split(/\r?\n/);

  let natoms = null;
  let bounds = [null, null, null];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const mAtoms = line.match(/^(\d+)\s+atoms\b/i);
    if (mAtoms) natoms = parseInt(mAtoms[1], 10);

    if (line.toLowerCase().includes("xlo xhi")) {
      const parts = line.split(/\s+/);
      bounds[0] = { lo: parseFloat(parts[0]), hi: parseFloat(parts[1]) };
    }
    if (line.toLowerCase().includes("ylo yhi")) {
      const parts = line.split(/\s+/);
      bounds[1] = { lo: parseFloat(parts[0]), hi: parseFloat(parts[1]) };
    }
    if (line.toLowerCase().includes("zlo zhi")) {
      const parts = line.split(/\s+/);
      bounds[2] = { lo: parseFloat(parts[0]), hi: parseFloat(parts[1]) };
    }
  }

  if (natoms === null) throw new Error("No encontré la línea 'N atoms'");

  let atomsStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^\s*Atoms\b/i)) {
      atomsStart = i;
      break;
    }
  }
  if (atomsStart === -1) throw new Error("No encontré la sección 'Atoms'");

  let i = atomsStart + 1;
  while (i < lines.length && !lines[i].trim()) i++;

  const atoms = [];
  for (let a = 0; a < natoms && i < lines.length; a++, i++) {
    const l = lines[i].trim();
    if (!l || l.startsWith("#")) { a--; continue; }

    const parts = l.split(/\s+/);

    if (parts.length >= 5) {
      // formato: id type x y z ...
      const type = parseInt(parts[1], 10);
      const x = parseFloat(parts[2]);
      const y = parseFloat(parts[3]);
      const z = parseFloat(parts[4]);
      atoms.push({ x, y, z, type });
    } else if (parts.length >= 6) {
      // formato: id mol type x y z ...
      const type = parseInt(parts[2], 10);
      const x = parseFloat(parts[3]);
      const y = parseFloat(parts[4]);
      const z = parseFloat(parts[5]);
      atoms.push({ x, y, z, type });
    }
  }

  // si no hay bounds, se calculan
  if (!bounds[0] || !bounds[1] || !bounds[2]) {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    atoms.forEach(a => {
      if (a.x < minX) minX = a.x;
      if (a.y < minY) minY = a.y;
      if (a.z < minZ) minZ = a.z;
      if (a.x > maxX) maxX = a.x;
      if (a.y > maxY) maxY = a.y;
      if (a.z > maxZ) maxZ = a.z;
    });
    bounds = [
      { lo: minX, hi: maxX },
      { lo: minY, hi: maxY },
      { lo: minZ, hi: maxZ },
    ];
  }

  return { timestep: 0, bounds, atoms };
}

// ------------------------------------------------------------------
// Dibujar las esferas
// ------------------------------------------------------------------
function addAtomsToScene(scene, camera, controls, data) {
  const atoms = data.atoms;
  if (!atoms || atoms.length === 0) {
    throw new Error("No se encontraron átomos en el archivo");
  }

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  atoms.forEach(a => {
    if (a.x < minX) minX = a.x;
    if (a.y < minY) minY = a.y;
    if (a.z < minZ) minZ = a.z;
    if (a.x > maxX) maxX = a.x;
    if (a.y > maxY) maxY = a.y;
    if (a.z > maxZ) maxZ = a.z;
  });

  const centerX = 0.5 * (minX + maxX);
  const centerY = 0.5 * (minY + maxY);
  const centerZ = 0.5 * (minZ + maxZ);

  const sizeX = maxX - minX;
  const sizeY = maxY - minY;
  const sizeZ = maxZ - minZ;
  const maxSize = Math.max(sizeX, sizeY, sizeZ);

  const group = new THREE.Group();

  const typeColors = [
    0xff5555,
    0x5599ff,
    0x55ff55,
    0xffaa00,
    0xaa55ff
  ];

  const materialCache = {};
  const radius = maxSize * 0.015 || 0.5;
  const geometry = new THREE.SphereGeometry(radius, 20, 20);

  atoms.forEach(a => {
    const t = a.type || 1;
    if (!materialCache[t]) {
      materialCache[t] = new THREE.MeshPhongMaterial({
        color: typeColors[(t - 1) % typeColors.length],
        shininess: 80,
        specular: 0xffffff
      });
    }
    const mesh = new THREE.Mesh(geometry, materialCache[t]);
    mesh.position.set(
      a.x - centerX,
      a.y - centerY,
      a.z - centerZ
    );
    group.add(mesh);
  });

  scene.add(group);

  const dist = maxSize * 1.8 || 50;
  camera.position.set(dist, dist, dist);
  camera.lookAt(0, 0, 0);
  controls.target.set(0, 0, 0);
  controls.update();

  return group;
}
