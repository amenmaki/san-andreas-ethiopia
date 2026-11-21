import * as THREE from 'three';

export const ZONES = [
  { name: 'Meskel Square, Addis Ababa', x: 0, z: 0, radius: 75, color: '#334155' },
  { name: 'Bole Avenue, Addis Ababa', x: 110, z: -40, radius: 70, color: '#1e3a8a' },
  { name: 'Merkato District, Addis Ababa', x: -110, z: 40, radius: 70, color: '#78350f' },
  { name: 'Adama Rift Avenue', x: 180, z: 160, radius: 85, color: '#9a3412' },
  { name: 'Bahir Dar & Lake Tana', x: -180, z: -170, radius: 90, color: '#0369a1' },
  { name: 'Hawassa Waterfront', x: 0, z: 210, radius: 85, color: '#0f766e' },
  { name: 'Dire Dawa & Harar Gate', x: 220, z: -180, radius: 85, color: '#a16207' }
];

export const ROAD_POSITIONS = [-180, -110, 0, 110, 180];

export function buildEthiopiaMap(scene) {
  // Ground
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x4d7c0f });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), groundMat);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Lake Tana & Lake Hawassa water planes
  const waterMat = new THREE.MeshLambertMaterial({ color: 0x0284c7 });
  const lakeTana = new THREE.Mesh(new THREE.CircleGeometry(65, 24), waterMat);
  lakeTana.rotation.x = -Math.PI / 2;
  lakeTana.position.set(-220, 0.08, -200);
  scene.add(lakeTana);

  const lakeHawassa = new THREE.Mesh(new THREE.CircleGeometry(60, 24), waterMat);
  lakeHawassa.rotation.x = -Math.PI / 2;
  lakeHawassa.position.set(0, 0.08, 265);
  scene.add(lakeHawassa);

  // Road Network
  const roadMat = new THREE.MeshLambertMaterial({ color: 0x1f2937 });
  function buildRoad(x, z, w, d) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), roadMat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.05, z);
    scene.add(m);
  }

  ROAD_POSITIONS.forEach((pos) => {
    buildRoad(pos, 0, 16, 560);
    buildRoad(0, pos, 560, 16);
  });

  // Meskel Square Central Monument & Ethiopian Flag Banners
  const plaza = new THREE.Mesh(
    new THREE.CylinderGeometry(24, 24, 0.25, 32),
    new THREE.MeshLambertMaterial({ color: 0x64748b })
  );
  plaza.position.set(0, 0.12, 0);
  scene.add(plaza);

  const flagColors = [0x16a34a, 0xfacc15, 0xdc2626];
  flagColors.forEach((col, i) => {
    const band = new THREE.Mesh(
      new THREE.BoxGeometry(8, 1.2, 0.4),
      new THREE.MeshLambertMaterial({ color: col })
    );
    band.position.set(0, 10 - i * 1.2, 0);
    scene.add(band);
  });

  // Procedural City Buildings
  const colliders = [];
  function spawnBuilding(x, z, w, h, d, color) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshLambertMaterial({ color })
    );
    mesh.position.set(x, h / 2, z);
    scene.add(mesh);
    colliders.push({ x, z, hw: w / 2 + 1.2, hd: d / 2 + 1.2 });
  }

  const palette = [0xd97706, 0x2563eb, 0x475569, 0xb45309, 0x0f766e, 0x9ca3af];
  for (let gx = -220; gx <= 220; gx += 45) {
    for (let gz = -220; gz <= 220; gz += 45) {
      if (Math.abs(gx) < 32 && Math.abs(gz) < 32) continue;
      if (Math.abs(gx % 110) < 18 || Math.abs(gz % 110) < 18) continue;
      if (Math.abs(gx) < 18 || Math.abs(gz) < 18) continue;
      const h = 10 + (Math.abs(gx * 7 + gz * 13) % 28);
      const col = palette[Math.abs(gx + gz) % palette.length];
      spawnBuilding(gx, gz, 18, h, 18, col);
    }
  }

  // Entoto Mountains Backdrop
  for (let i = -3; i <= 3; i++) {
    const hill = new THREE.Mesh(
      new THREE.ConeGeometry(75, 95, 7),
      new THREE.MeshLambertMaterial({ color: 0x365314 })
    );
    hill.position.set(i * 110, 45, -330);
    scene.add(hill);
  }

  return { colliders };
}
