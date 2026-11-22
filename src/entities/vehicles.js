import * as THREE from 'three';
import { isInLake } from '../world/ethiopiaMap.js';

export function spawnVehicle(scene, vehicles, type, x, z) {
  const g = new THREE.Group();
  let color = 0xff4ecd;
  let roof = 0xffffff;
  let w = 2.3;
  let h = 1.4;
  let l = 4.9;
  let maxSpeed = 48;
  let isAir = false;
  let isTank = false;

  if (type === 'Infernus Supercar') {
    color = 0xff4ecd;
    roof = 0x1e1b4b;
    maxSpeed = 58;
  } else if (type === 'Cheetah V8') {
    color = 0xfacc15;
    roof = 0x18181b;
    maxSpeed = 54;
  } else if (type === 'Blue-White Minibus') {
    color = 0x0284c7;
    roof = 0xffffff;
    h = 2.2;
    l = 5.2;
    maxSpeed = 36;
  } else if (type === 'Bajaj Tuk-Tuk') {
    color = 0x1d4ed8;
    roof = 0xfacc15;
    w = 1.7;
    h = 1.9;
    l = 3.1;
    maxSpeed = 30;
  } else if (type === 'Vice Police Cruiser') {
    color = 0x15803d;
    roof = 0xffffff;
    maxSpeed = 48;
  } else if (type === 'Hunter Helicopter') {
    color = 0x334155;
    roof = 0x38bdf8;
    w = 2.6;
    h = 2.2;
    l = 6.8;
    maxSpeed = 62;
    isAir = true;
  } else if (type === 'Rhino Tank') {
    color = 0x3f6212;
    roof = 0x1a2e05;
    w = 3.4;
    h = 2.4;
    l = 6.2;
    maxSpeed = 28;
    isTank = true;
  } else if (type === 'Fighter Jet') {
    color = 0x64748b;
    roof = 0x38bdf8;
    w = 6.5;
    h = 1.8;
    l = 7.5;
    maxSpeed = 75;
    isAir = true;
  }

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(w, h * 0.6, l),
    new THREE.MeshLambertMaterial({ color })
  );
  body.position.y = h * 0.4;

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.88, h * 0.45, l * 0.6),
    new THREE.MeshLambertMaterial({ color: roof })
  );
  top.position.y = h * 0.85;
  g.add(body, top);

  if (type === 'Hunter Helicopter') {
    const rotor = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.15, 0.5),
      new THREE.MeshBasicMaterial({ color: 0x94a3b8 })
    );
    rotor.position.y = h + 0.6;
    g.add(rotor);
    g.userData.rotor = rotor;
  }
  if (type === 'Vice Police Cruiser') {
    const siren = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.25, 0.4),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    siren.position.y = h + 0.2;
    g.add(siren);
  }
  if (isTank) {
    const barrel = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.45, 4.5),
      new THREE.MeshLambertMaterial({ color: 0x1a2e05 })
    );
    barrel.position.set(0, h * 0.9, l * 0.5);
    g.add(barrel);
  }

  g.position.set(x, 0, z);
  scene.add(g);
  const v = { mesh: g, type, speed: 0, vy: 0, maxSpeed, isAir, isTank, health: 100, disabled: false };
  vehicles.push(v);
  return v;
}

export function spawnInitialVehicles(scene, vehicles) {
  spawnVehicle(scene, vehicles, 'Infernus Supercar', 10, 20);
  spawnVehicle(scene, vehicles, 'Blue-White Minibus', -12, 22);
  spawnVehicle(scene, vehicles, 'Cheetah V8', 112, -60);
  spawnVehicle(scene, vehicles, 'Bajaj Tuk-Tuk', -105, -55);
  spawnVehicle(scene, vehicles, 'Vice Police Cruiser', 24, -18);
  spawnVehicle(scene, vehicles, 'Hunter Helicopter', 0, -35);
}

export function updateVehicle(v, state, input, colliders, dt, onNotify) {
  if (v.disabled) {
    v.speed = 0;
    return;
  }

  v.speed += input.moveForward * (input.isSprint ? 42 : 28) * dt;
  v.speed *= 0.96;
  v.speed = Math.max(-18, Math.min(v.maxSpeed, v.speed));

  if (Math.abs(v.speed) > 0.5) {
    v.mesh.rotation.y += input.turnInput * 2.3 * dt * Math.sign(v.speed);
  }

  const nx = Math.max(-560, Math.min(560, v.mesh.position.x + Math.sin(v.mesh.rotation.y) * v.speed * dt));
  const nz = Math.max(-560, Math.min(560, v.mesh.position.z + Math.cos(v.mesh.rotation.y) * v.speed * dt));

  const hitBuilding = colliders.some(
    (c) => v.mesh.position.y < c.h && Math.abs(nx - c.x) < c.hw + 1.1 && Math.abs(nz - c.z) < c.hd + 1.1
  );

  if (!hitBuilding) {
    // Check lake water unless flying high or SEAWAYS enabled
    const enteringWater = isInLake(nx, nz) && v.mesh.position.y < 1.5 && !v.isAir && !state.driveOnWater;
    if (enteringWater) {
      v.speed *= -0.4;
      if (!v._waterWarned) {
        v._waterWarned = true;
        onNotify('WATER! Dial SEAWAYS to drive on lakes');
        setTimeout(() => {
          v._waterWarned = false;
        }, 2500);
      }
    } else {
      v.mesh.position.x = nx;
      v.mesh.position.z = nz;
    }
  } else {
    v.speed *= -0.3;
  }

  // Hover slightly on water when SEAWAYS is active
  const minY = isInLake(v.mesh.position.x, v.mesh.position.z) && state.driveOnWater ? 0.25 : 0;

  if ((v.isAir || state.flyingCars) && input.isJump) {
    v.mesh.position.y = Math.min(70, v.mesh.position.y + 20 * dt);
  } else if (v.mesh.position.y > minY) {
    v.mesh.position.y = Math.max(minY, v.mesh.position.y - 11 * dt);
  } else {
    v.mesh.position.y = minY;
  }
}
