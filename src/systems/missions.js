import * as THREE from 'three';

export function createMissionSystem(scene) {
  const missionMarker = new THREE.Mesh(
    new THREE.CylinderGeometry(3.8, 3.8, 22, 16),
    new THREE.MeshBasicMaterial({ color: 0xff4ecd, transparent: true, opacity: 0.45 })
  );
  missionMarker.visible = false;
  scene.add(missionMarker);

  // Ambient street mission rings
  const streetMissions = [
    { title: 'MESKEL MINIBUS EXPRESS', reward: 1500, x: 18, z: 10 },
    { title: 'BOLE BAJAJ DRIFT', reward: 2500, x: 115, z: -45 },
    { title: 'MERKATO TURF DEFENSE', reward: 4000, x: -115, z: 35 }
  ];

  streetMissions.forEach((m) => {
    const ring = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 0.25, 20),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    ring.position.set(m.x, 0.15, m.z);
    scene.add(ring);
    m.mesh = ring;
  });

  function startPhoneMission(state, title, x, z, reward, showBanner, closePhone) {
    state.activeMission = { title, x, z, reward };
    missionMarker.position.set(x, 11, z);
    missionMarker.visible = true;
    showBanner(`MISSION: ${title} — Drive to Pink Beacon!`);
    closePhone();
  }

  function updateMissions(activeObj, state, showMissionBanner, updateHUD) {
    // Phone mission beacon
    if (state.activeMission) {
      const m = state.activeMission;
      if (Math.hypot(activeObj.position.x - m.x, activeObj.position.z - m.z) < 7) {
        state.cash += m.reward;
        state.activeMission = null;
        missionMarker.visible = false;
        showMissionBanner(m.title.toUpperCase() + ' PASSED!', '+$' + m.reward);
        updateHUD();
      }
    }

    // Ambient street rings
    for (const m of streetMissions) {
      if (Math.hypot(activeObj.position.x - m.x, activeObj.position.z - m.z) < 4.5) {
        state.cash += m.reward;
        m.x = (Math.random() - 0.5) * 320;
        m.z = (Math.random() - 0.5) * 320;
        m.mesh.position.set(m.x, 0.15, m.z);
        showMissionBanner(m.title + ' PASSED!', 'RESPECT + $' + m.reward);
        updateHUD();
      }
    }
  }

  return {
    streetMissions,
    startPhoneMission,
    updateMissions
  };
}
