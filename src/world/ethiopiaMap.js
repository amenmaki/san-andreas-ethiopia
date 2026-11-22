import * as THREE from 'three';

export const ZONES = [
  { name: 'Meskel Square, Addis Ababa', x: 0, z: 0, radius: 85 },
  { name: 'Bole Neon Strip, Addis Ababa', x: 110, z: -70, radius: 80 },
  { name: 'Merkato Market, Addis Ababa', x: -110, z: -60, radius: 80 },
  { name: 'Adama Palm Boulevard', x: 240, z: 200, radius: 100 },
  { name: 'Lake Tana, Bahir Dar', x: -250, z: -230, radius: 110 },
  { name: 'Lake Hawassa Marina', x: -20, z: 250, radius: 100 },
  { name: 'Harar Jugol & Dire Dawa', x: 260, z: -210, radius: 100 }
];

export const LAKES = [
  { name: 'Lake Tana', x: -310, z: -280, radius: 95 },
  { name: 'Lake Hawassa', x: -20, z: 330, radius: 90 }
];

export function isInLake(x, z) {
  return LAKES.some((lake) => Math.hypot(x - lake.x, z - lake.z) < lake.radius);
}

export function buildEthiopiaMap(scene) {
  // Terrain
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1200, 1200),
    new THREE.MeshLambertMaterial({ color: 0x365314 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Lake Tana & Lake Hawassa
  const waterMat = new THREE.MeshPhongMaterial({ color: 0x06b6d4, shininess: 90 });
  for (const lake of LAKES) {
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(lake.radius, 32), waterMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(lake.x, 0.12, lake.z);
    scene.add(mesh);
  }

  // Highway Grid
  const roadMat = new THREE.MeshLambertMaterial({ color: 0x18181b });
  function addRoad(x, z, w, l, rot = 0) {
    const r = new THREE.Mesh(new THREE.PlaneGeometry(w, l), roadMat);
    r.rotation.x = -Math.PI / 2;
    r.rotation.z = rot;
    r.position.set(x, 0.06, z);
    scene.add(r);
  }
  addRoad(0, 0, 18, 720);
  addRoad(0, 0, 720, 18);
  addRoad(110, -70, 14, 280);
  addRoad(-110, -60, 14, 280);
  addRoad(120, 100, 16, 380, -0.78);
  addRoad(-125, -115, 16, 380, 0.78);
  addRoad(130, -105, 16, 380, -0.68);

  // Meskel Square Central Plaza & Ethiopian Flag Monument
  const plaza = new THREE.Mesh(
    new THREE.CylinderGeometry(24, 24, 0.25, 32),
    new THREE.MeshLambertMaterial({ color: 0x334155 })
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

  // Neon-lit Ethiopian Buildings
  const colliders = [];
  const neonTrimColors = [0xff4ecd, 0x38bdf8, 0xfacc15, 0x4ade80];
  ZONES.forEach((z, idx) => {
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const dist = 34 + (i % 3) * 20;
      const bx = z.x + Math.cos(ang) * dist;
      const bz = z.z + Math.sin(ang) * dist;
      if (Math.abs(bx) < 18 || Math.abs(bz) < 18) continue;

      const w = 10 + (i % 3) * 3;
      const d = 10 + ((i + 1) % 3) * 3;
      const h = 14 + ((i + idx) % 5) * 7;

      const building = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshLambertMaterial({ color: i % 2 === 0 ? 0xf8fafc : 0xfde68a })
      );
      building.position.set(bx, h / 2, bz);
      scene.add(building);

      const neon = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.4, 0.6, d + 0.4),
        new THREE.MeshBasicMaterial({ color: neonTrimColors[(i + idx) % neonTrimColors.length] })
      );
      neon.position.set(bx, h + 0.2, bz);
      scene.add(neon);

      colliders.push({ x: bx, z: bz, h, hw: w / 2 + 0.9, hd: d / 2 + 0.9 });
    }
  });

  // Entoto Mountains Backdrop
  for (let i = -4; i <= 4; i++) {
    const hill = new THREE.Mesh(
      new THREE.ConeGeometry(80, 105, 7),
      new THREE.MeshLambertMaterial({ color: 0x1e293b })
    );
    hill.position.set(i * 120, 48, -420);
    scene.add(hill);
  }

  return { colliders };
}
