// atom_viewer_upload.js

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

  const width  = container.clientWidth;
  const height = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
  camera.position.set(0, 0, 100);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // --- Luces para que se vean "atómicos" ---
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(1, 1, 1);
  scene.add(dirLight);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight2.position.set(-1, -1, -1);
  scene.add(dirLight2);

  // --- Controles tipo Ovito ---
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed   = 0.6;
  controls.zoomSpeed     = 1.0;
  controls.panSpeed      = 0.8;
  controls.target.set(0, 0, 0);

  // Resize responsivo
  window.addEventListener("resize", () => {
    const newWidth  = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });

  let atomGroup = null; // para poder borrar y cargar otro archivo

  // --- Listener para subir archivo ---
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      try {
        const data = parseLAMMPSDump(text);
        // si ya había átomos, borrarlos
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
        console.error("Error parsing LAMMPS dump:", err);
        alert("Error al leer el dump.\nRevisa que el formato sea el de LAMMPS con ITEM: ATOMS id type x y z ...");
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
// Parsear el dump de LAMMPS (primer timestep)
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

    // TIMESTEP
    const timestep = parseInt(lines[++i].trim(), 10);

    // NUMBER OF ATOMS
    i++; // ITEM: NUMBER OF ATOMS
    const natoms = parseInt(lines[++i].trim(), 10);

    // BOX BOUNDS
    i++; // ITEM: BOX BOUNDS ...
    const bounds = [];
    for (let d = 0; d < 3; d++) {
      const parts = lines[++i].trim().split(/\s+/);
      const lo = parseFloat(parts[0]);
      const hi = parseFloat(parts[1]);
      bounds.push({ lo, hi });
    }

    // ATOMS header
    const headerParts = lines[++i].trim().split(/\s+/); // ITEM: ATOMS id type x y z ...
    const colNames = headerParts.slice(2);
    const colIndex = {};
    colNames.forEach((name, idx) => {
      colIndex[name] = idx;
    });

    if (colIndex["x"] === undefined || colIndex["y"] === undefined || colIndex["z"] === undefined) {
      throw new Error("Dump file must contain x y z columns");
    }

    const atoms = [];
    for (let a = 0; a < natoms; a++) {
      if (i + 1 >= lines.length) break;
      const l = lines[++i].trim();
      if (!l) {
        a--;
        continue;
      }
      const parts = l.split(/\s+/);
      const x = parseFloat(parts[colIndex["x"]]);
      const y = parseFloat(parts[colIndex["y"]]);
      const z = parseFloat(parts[colIndex["z"]]);
      const type = colIndex["type"] !== undefined ? parseInt(parts[colIndex["type"]], 10) : 1;
      atoms.push({ x, y, z, type });
    }

    return { timestep, bounds, atoms };
  }

  throw new Error("No timestep found in dump");
}

// ------------------------------------------------------------------
// Crear las esferitas con luz y sombra
// ------------------------------------------------------------------
function addAtomsToScene(scene, camera, controls, data) {
  const atoms = data.atoms;

  // Calcular caja para centrar
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

  // Grupo de átomos
  const group = new THREE.Group();

  // Colores por tipo
  const typeColors = [
    0xff5555, // tipo 1
    0x5599ff, // tipo 2
    0x55ff55, // tipo 3
    0xffaa00, // tipo 4
    0xaa55ff  // tipo 5
  ];

  const materialCache = {};
  const radius = maxSize * 0.015; // tamaño relativo de las esferas
  const geometry = new THREE.SphereGeometry(radius, 18, 18);

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

  // Colocar la cámara a una distancia razonable
  const dist = maxSize * 1.8 || 50;
  camera.position.set(dist, dist, dist);
  camera.lookAt(0, 0, 0);
  controls.target.set(0, 0, 0);
  controls.update();

  return group;
}
