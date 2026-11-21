import * as THREE from 'three';

export function createVehicle(scene, vehicles, type, x, z) {
  const group = new THREE.Group();
  let color = 0x2563eb;
  let w = 2.4;
  let h = 1.8;
  let d = 4.6;
  let maxSpeed = 34;
  let isAircraft = false;

  if (type === 'MINIBUS') {
    color = 0x1d4ed8;
    h = 2.2;
    d = 5.0;
    maxSpeed = 32;
  } else if (type === 'BAJAJ') {
    color = 0x0284c7;
    w = 1.6;
    h = 1.7;
    d = 2.8;
    maxSpeed = 28;
  } else if (type === 'LOWRIDER') {
    color = 0xdc2626;
    h = 1.3;
    d = 4.8;
    maxSpeed = 44;
  } else if (type === 'SUV') {
    color = 0x111827;
    w = 2.5;
    h = 2.0;
    d = 4.8;
    maxSpeed = 40;
  } else if (type === 'POLICE') {
    color = 0x0f172a;
    h = 1.6;
    d = 4.6;
    maxSpeed = 42;
  } else if (type === 'JET') {
    color = 0x64748b;
    w = 6.5;
    h = 1.8;
    d = 7.5;
    maxSpeed = 75;
    isAircraft = true;
  }

  const chassis = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshLambertMaterial({ color })
  );
  chassis.position.y = h / 2 + 0.4;
  group.add(chassis);

  // White roof stripe for Ethiopian Minibus Taxi
  if (type === 'MINIBUS') {
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.05, 0.55, d + 0.05),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    roof.position.y = h + 0.25;
    group.add(roof);
  }

  // Police siren bar
  if (type === 'POLICE') {
    const siren = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.3, 0.4),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    siren.position.y = h + 0.55;
    group.add(siren);
  }

  group.position.set(x, 0, z);
  scene.add(group);
  const veh = { mesh: group, type, speed: 0, maxSpeed, isAircraft, health: 100 };
  vehicles.push(veh);
  return veh;
}

export function spawnInitialVehicles(scene, vehicles) {
  createVehicle(scene, vehicles, 'MINIBUS', 12, 22);
  createVehicle(scene, vehicles, 'BAJAJ', -14, 24);
  createVehicle(scene, vehicles, 'LOWRIDER', 22, -16);
  createVehicle(scene, vehicles, 'SUV', -22, -18);
  createVehicle(scene, vehicles, 'MINIBUS', 110, -30);
  createVehicle(scene, vehicles, 'BAJAJ', -105, 45);
  createVehicle(scene, vehicles, 'SUV', 175, 150);
}

export function updateVehicle(v, state, input, dt) {
  const accel = input.moveForward * (input.isSprint ? 36 : 24);
  v.speed += accel * dt;
  v.speed *= 0.96;
  v.speed = Math.max(-16, Math.min(v.maxSpeed, v.speed));

  if (Math.abs(v.speed) > 0.5) {
    v.mesh.rotation.y += input.turnInput * 2.2 * dt * Math.sign(v.speed);
  }

  v.mesh.position.x += Math.sin(v.mesh.rotation.y) * v.speed * dt;
  v.mesh.position.z += Math.cos(v.mesh.rotation.y) * v.speed * dt;

  // Aircraft or RIPAZHA Flying Cars
  if ((v.isAircraft || state.flyingCars) && input.isJump) {
    v.mesh.position.y = Math.min(65, v.mesh.position.y + 18 * dt);
  } else if (v.mesh.position.y > 0) {
    v.mesh.position.y = Math.max(0, v.mesh.position.y - 10 * dt);
  }
}
