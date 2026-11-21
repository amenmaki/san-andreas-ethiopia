import * as THREE from 'three';

export function spawnNPC(scene, npcs, x, z, isCop = false) {
  const g = new THREE.Group();
  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 1.7, 0.65),
    new THREE.MeshLambertMaterial({
      color: isCop ? 0x1e3a8a : Math.random() > 0.5 ? 0xfacc15 : 0xe11d48
    })
  );
  torso.position.y = 1.35;

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.7, 0.7),
    new THREE.MeshLambertMaterial({ color: 0x78350f })
  );
  head.position.y = 2.6;

  g.add(torso, head);
  g.position.set(x, 0, z);
  scene.add(g);

  const npc = { mesh: g, isCop, hp: 100, dir: Math.random() * Math.PI * 2, timer: 0 };
  npcs.push(npc);
  return npc;
}

export function spawnInitialNPCs(scene, npcs) {
  for (let i = 0; i < 24; i++) {
    spawnNPC(scene, npcs, (Math.random() - 0.5) * 260, (Math.random() - 0.5) * 260, false);
  }
}

export function updateNPCs(npcs, activeObj, playerObj, state, dt, onHudChange, onNotify) {
  for (const n of npcs) {
    n.timer -= dt;
    if (n.isCop && state.wanted > 0) {
      const dx = activeObj.position.x - n.mesh.position.x;
      const dz = activeObj.position.z - n.mesh.position.z;
      const ang = Math.atan2(dx, dz);
      n.mesh.position.x += Math.sin(ang) * 7.5 * dt;
      n.mesh.position.z += Math.cos(ang) * 7.5 * dt;

      if (Math.hypot(dx, dz) < 2.2) {
        state.health = Math.max(0, state.health - 12 * dt);
        if (state.health <= 0) {
          state.health = 100;
          state.wanted = 0;
          state.cash = Math.max(0, state.cash - 100);
          if (state.inVehicle) {
            state.inVehicle = null;
            playerObj.mesh.visible = true;
            const carBtn = document.getElementById('btn-car');
            if (carBtn) carBtn.innerHTML = 'ENTER<br>CAR';
          }
          playerObj.mesh.position.set(0, 0, 28);
          onNotify('WASTED — Respawned at Meskel Square');
        }
        onHudChange();
      }
    } else {
      if (n.timer <= 0) {
        n.dir = Math.random() * Math.PI * 2;
        n.timer = 2 + Math.random() * 3;
      }
      n.mesh.position.x += Math.sin(n.dir) * 2.5 * dt;
      n.mesh.position.z += Math.cos(n.dir) * 2.5 * dt;
    }
  }
}
