import * as THREE from 'three';

export const CHEAT_CODES = [
  'HESOYAM',
  'ROCKETMAN',
  'UZUMYMW',
  'AEZAKMI',
  'BRINGITON',
  'JUMPJET',
  'RIPAZHA',
  'YSOHNUL'
];

export function createCheatSystem({
  state,
  playerObj,
  scene,
  vehicles,
  npcs,
  createVehicle,
  spawnNPC,
  showCheatMsg,
  updateHUD
}) {
  function triggerCheat(rawCode) {
    const code = rawCode.toUpperCase().trim();
    if (code === 'HESOYAM') {
      state.health = 100;
      state.armor = 100;
      state.cash += 250000;
      if (state.inVehicle) state.inVehicle.health = 100;
      showCheatMsg('Cheat activated: Health, Armor & +$250,000');
    } else if (code === 'ROCKETMAN') {
      state.jetpack = !state.jetpack;
      playerObj.jetpackMesh.visible = state.jetpack;
      showCheatMsg('Cheat activated: Jetpack ' + (state.jetpack ? 'ON' : 'OFF'));
    } else if (code === 'UZUMYMW') {
      state.weaponIndex = 3;
      showCheatMsg('Cheat activated: Heavy Weapon Pack');
    } else if (code === 'AEZAKMI') {
      state.neverWanted = !state.neverWanted;
      if (state.neverWanted) state.wanted = 0;
      showCheatMsg('Cheat activated: Never Wanted ' + (state.neverWanted ? 'ON' : 'OFF'));
    } else if (code === 'BRINGITON') {
      state.neverWanted = false;
      state.wanted = 6;
      for (let i = 0; i < 4; i++) {
        spawnNPC(scene, npcs, playerObj.mesh.position.x + 18, playerObj.mesh.position.z + i * 4, true);
      }
      showCheatMsg('Cheat activated: 6-Star Wanted Level');
    } else if (code === 'JUMPJET') {
      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(playerObj.mesh.quaternion);
      createVehicle(
        scene,
        vehicles,
        'JET',
        playerObj.mesh.position.x + forward.x * 10,
        playerObj.mesh.position.z + forward.z * 10
      );
      showCheatMsg('Cheat activated: Fighter Jet Spawned');
    } else if (code === 'RIPAZHA') {
      state.flyingCars = !state.flyingCars;
      showCheatMsg('Cheat activated: Flying Cars ' + (state.flyingCars ? 'ON' : 'OFF'));
    } else if (code === 'YSOHNUL') {
      state.fastClock = !state.fastClock;
      showCheatMsg('Cheat activated: Fast Clock ' + (state.fastClock ? 'ON' : 'OFF'));
    }
    updateHUD();
  }

  const cheatModal = document.getElementById('cheat-modal');
  document.getElementById('open-cheats').onclick = () => {
    cheatModal.style.display = 'flex';
  };
  document.getElementById('close-cheats').onclick = () => {
    cheatModal.style.display = 'none';
  };
  document.querySelectorAll('.cheat-code-btn').forEach((btn) => {
    btn.onclick = () => {
      triggerCheat(btn.dataset.code);
      cheatModal.style.display = 'none';
    };
  });

  return { triggerCheat };
}
