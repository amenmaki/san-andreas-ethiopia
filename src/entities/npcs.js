import * as THREE from 'three';

export function spawnNPC(scene, npcs, x, z, isCop = false) {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 2.2, 0.6),
    new THREE.MeshLambertMaterial({
      color: isCop ? 0x15803d : Math.random() > 0.5 ? 0xff4ecd : 0x38bdf8
    })
  );
  m.position.set(x, 1.1, z);
  scene.add(m);

  const npc = { mesh: m, isCop, hp: 100, dir: Math.random() * 6.28, timer: 2, alive: true };
  npcs.push(npc);
  return npc;
}

export function spawnInitialNPCs(scene, npcs) {
  for (let i = 0; i < 26; i++) {
    spawnNPC(scene, npcs, (Math.random() - 0.5) * 280, (Math.random() - 0.5) * 280, false);
  }
}

export function updateNPCs(scene, npcs, activeObj, playerObj, state, dt, onHudChange, onNotify) {
  // Spawn police units automatically if wanted level rises and not enough cops exist
  const activeCops = npcs.filter((n) => n.alive && n.isCop).length;
  if (state.wanted > 0 && activeCops < Math.min(6, state.wanted)) {
    const ang = Math.random() * Math.PI * 2;
    spawnNPC(
      scene,
      npcs,
      activeObj.position.x + Math.cos(ang) * 28,
      activeObj.position.z + Math.sin(ang) * 28,
      true
    );
  }

  for (const n of npcs) {
    if (!n.alive) continue;
    n.timer -= dt;

    if (n.isCop && state.wanted > 0) {
      const dx = activeObj.position.x - n.mesh.position.x;
      const dz = activeObj.position.z - n.mesh.position.z;
      const dist = Math.hypot(dx, dz);
      const ang = Math.atan2(dx, dz);
      n.mesh.position.x += Math.sin(ang) * 8.0 * dt;
      n.mesh.position.z += Math.cos(ang) * 8.0 * dt;

      if (dist < 2.2) {
        const dmg = 14 * dt;
        if (state.armor > 0) {
          state.armor = Math.max(0, state.armor - dmg);
        } else {
          state.health = Math.max(0, state.health - dmg);
        }
        if (state.health <= 0) {
          state.health = 100;
          state.wanted = 0;
          state.cash = Math.max(0, state.cash - 100);
          if (state.inVehicle) {
            state.inVehicle = null;
            playerObj.mesh.visible = true;
            const vb = document.getElementById('vehicle-banner');
            if (vb) vb.style.display = 'none';
            const carBtn = document.getElementById('btn-car');
            if (carBtn) carBtn.innerHTML = 'ENTER<br>CAR';
          }
          playerObj.mesh.position.set(0, 0, 24);
          onNotify('WASTED — Respawned at Meskel Square');
        }
        onHudChange();
      }
    } else {
      if (n.timer <= 0) {
        n.dir = Math.random() * 6.28;
        n.timer = 2 + Math.random() * 3;
      }
      n.mesh.position.x += Math.sin(n.dir) * 2.4 * dt;
      n.mesh.position.z += Math.cos(n.dir) * 2.4 * dt;
    }
  }
}
