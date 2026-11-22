export const CHEAT_CODES = [
  // Vice City Cheats
  'ASPIRINE',
  'PROFESSIONALTOOLS',
  'NUTTERTOOLS',
  'LEAVEMEALONE',
  'YOUWONTTAKEMEALIVE',
  'PANZER',
  'COMEFLYWITHME',
  'SEAWAYS',
  'BIGBANG',
  // San Andreas Cheats
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
  spawnVehicle,
  spawnNPC,
  showBanner,
  updateHUD
}) {
  function runCheat(raw) {
    const code = String(raw || '').toUpperCase().trim();
    const pos = state.inVehicle ? state.inVehicle.mesh.position : playerObj.mesh.position;
    const yaw = state.inVehicle ? state.inVehicle.mesh.rotation.y : playerObj.mesh.rotation.y;

    if (code === 'ASPIRINE') {
      state.health = 100;
      state.armor = 100;
      if (state.inVehicle) state.inVehicle.health = 100;
      showBanner('CHEAT: Health & Armor Restored');
    } else if (code === 'HESOYAM') {
      state.health = 100;
      state.armor = 100;
      state.cash += 250000;
      if (state.inVehicle) state.inVehicle.health = 100;
      showBanner('CHEAT: Health, Armor, Repair +$250,000');
    } else if (code === 'PROFESSIONALTOOLS') {
      state.weaponIndex = 3;
      showBanner('CHEAT: M4 Assault Rifle Equipped');
    } else if (code === 'NUTTERTOOLS') {
      state.weaponIndex = 4;
      state.cash += 100000;
      showBanner('CHEAT: RPG-7 + $100,000');
    } else if (code === 'UZUMYMW') {
      state.weaponIndex = 4;
      showBanner('CHEAT: Heavy Weapons Pack');
    } else if (code === 'LEAVEMEALONE') {
      state.wanted = 0;
      showBanner('CHEAT: Wanted Level Cleared');
    } else if (code === 'AEZAKMI') {
      state.neverWanted = !state.neverWanted;
      if (state.neverWanted) state.wanted = 0;
      showBanner('CHEAT: Never Wanted ' + (state.neverWanted ? 'ON' : 'OFF'));
    } else if (code === 'YOUWONTTAKEMEALIVE') {
      state.neverWanted = false;
      state.wanted = Math.min(6, state.wanted + 2);
      showBanner('CHEAT: Wanted Level Raised');
    } else if (code === 'BRINGITON') {
      state.neverWanted = false;
      state.wanted = 6;
      for (let i = 0; i < 4; i++) {
        spawnNPC(scene, npcs, pos.x + 18, pos.z + i * 4, true);
      }
      showBanner('CHEAT: 6-Star Wanted Level');
    } else if (code === 'PANZER') {
      spawnVehicle(scene, vehicles, 'Rhino Tank', pos.x + Math.sin(yaw) * 10, pos.z + Math.cos(yaw) * 10);
      showBanner('CHEAT: Rhino Tank Spawned');
    } else if (code === 'JUMPJET') {
      spawnVehicle(scene, vehicles, 'Fighter Jet', pos.x + Math.sin(yaw) * 12, pos.z + Math.cos(yaw) * 12);
      showBanner('CHEAT: Fighter Jet Spawned');
    } else if (code === 'COMEFLYWITHME' || code === 'RIPAZHA') {
      state.flyingCars = !state.flyingCars;
      showBanner('CHEAT: Flying Cars ' + (state.flyingCars ? 'ON' : 'OFF'));
    } else if (code === 'SEAWAYS') {
      state.driveOnWater = !state.driveOnWater;
      showBanner('CHEAT: Drive on Water ' + (state.driveOnWater ? 'ON' : 'OFF'));
    } else if (code === 'BIGBANG') {
      let count = 0;
      vehicles.forEach((v) => {
        if (v !== state.inVehicle && v.mesh.position.distanceTo(pos) < 85) {
          v.speed = 0;
          v.disabled = true;
          v.mesh.rotation.z = 0.25;
          count++;
        }
      });
      showBanner(`CHEAT: BIGBANG! Disabled ${count} nearby vehicles`);
    } else if (code === 'ROCKETMAN') {
      state.jetpack = !state.jetpack;
      playerObj.jetpackMesh.visible = state.jetpack;
      showBanner('CHEAT: Jetpack ' + (state.jetpack ? 'ON' : 'OFF'));
    } else if (code === 'YSOHNUL') {
      state.fastClock = !state.fastClock;
      showBanner('CHEAT: Turbo Clock ' + (state.fastClock ? 'ON' : 'OFF'));
    } else {
      showBanner('UNKNOWN CHEAT: ' + code);
    }
    updateHUD();
  }

  return { runCheat };
}
