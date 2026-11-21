import * as THREE from 'three';

export function createMissions(scene) {
  const missions = [
    { title: 'MESKEL MINIBUS EXPRESS', reward: 1500, x: 18, z: 10 },
    { title: 'BOLE BAJAJ DRIFT', reward: 2500, x: 115, z: -45 },
    { title: 'MERKATO TURF DEFENSE', reward: 4000, x: -115, z: 35 }
  ];

  missions.forEach((m) => {
    const ring = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 0.2, 20),
      new THREE.MeshBasicMaterial({ color: 0xdc2626 })
    );
    ring.position.set(m.x, 0.15, m.z);
    scene.add(ring);
    m.mesh = ring;
  });

  return missions;
}

export function updateMissions(missions, activeObj, state, onMissionPassed, onHudChange) {
  for (const m of missions) {
    if (activeObj.position.distanceTo(m.mesh.position) < 4.5) {
      state.cash += m.reward;
      m.x = (Math.random() - 0.5) * 320;
      m.z = (Math.random() - 0.5) * 320;
      m.mesh.position.set(m.x, 0.15, m.z);
      onMissionPassed(m.title + ' PASSED!', 'RESPECT + $' + m.reward);
      onHudChange();
    }
  }
}
