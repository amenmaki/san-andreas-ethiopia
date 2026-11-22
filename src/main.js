import * as THREE from 'three';
import { buildEthiopiaMap } from './world/ethiopiaMap.js';
import { createPlayer, updatePlayer } from './entities/player.js';
import { spawnVehicle, spawnInitialVehicles, updateVehicle } from './entities/vehicles.js';
import { spawnNPC, spawnInitialNPCs, updateNPCs } from './entities/npcs.js';
import { CHEAT_CODES, createCheatSystem } from './systems/cheats.js';
import { createMissionSystem } from './systems/missions.js';
import { createAudioSystem } from './systems/audio.js';
import { createHUD, initTouchControls } from './ui/hud.js';
import { createPhoneSystem } from './ui/phone.js';

// --- GAME STATE (Pure in-memory state, no external/browser storage) ---
const state = {
  cash: 1000,
  health: 100,
  armor: 50,
  wanted: 0,
  neverWanted: false,
  flyingCars: false,
  driveOnWater: false,
  fastClock: false,
  jetpack: false,
  radioStation: 0, // 0: Off, 1: Flash FM Synth, 2: Fever 105 Ethio-Jazz
  inVehicle: null,
  weaponIndex: 0,
  weapons: [
    { name: 'FIST', icon: '👊', range: 3.4, dmg: 35, color: 0xfacc15 },
    { name: 'COLT .45', icon: '🔫', range: 48, dmg: 55, color: 0x38bdf8 },
    { name: 'UZI-9MM', icon: '💥', range: 58, dmg: 45, color: 0xff4ecd },
    { name: 'M4 RIFLE', icon: '🔥', range: 72, dmg: 80, color: 0x4ade80 },
    { name: 'RPG-7', icon: '🚀', range: 90, dmg: 220, color: 0xf97316 }
  ],
  gameMinutes: 20 * 60 + 30,
  currentZone: '',
  activeMission: null
};

// --- THREE.JS SETUP (VICE CITY SUNSET NEON + ETHIOPIA) ---
const canvas = document.getElementById('gameCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2e1065);
scene.fog = new THREE.FogExp2(0x3b0764, 0.0024);

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.5, 650);

scene.add(new THREE.HemisphereLight(0xf472b6, 0x1e1b4b, 1.05));
const sunLight = new THREE.DirectionalLight(0xfef08a, 0.9);
sunLight.position.set(120, 200, 90);
scene.add(sunLight);

// --- WORLD, ENTITIES, SYSTEMS & UI ---
const { colliders } = buildEthiopiaMap(scene);
const playerObj = createPlayer(scene);
const vehicles = [];
spawnInitialVehicles(scene, vehicles);

const npcs = [];
spawnInitialNPCs(scene, npcs);

const missionSys = createMissionSystem(scene);
const hud = createHUD(state);
const { cycleRadio } = createAudioSystem(state);
const { runCheat } = createCheatSystem({
  state,
  playerObj,
  scene,
  vehicles,
  npcs,
  spawnVehicle,
  spawnNPC,
  showBanner: hud.showBanner,
  updateHUD: hud.updateHUD
});

const keys = {};
function clearInputs() {
  for (const k of Object.keys(keys)) keys[k] = false;
}

const phone = createPhoneSystem({
  state,
  playerObj,
  scene,
  vehicles,
  spawnVehicle,
  startPhoneMission: missionSys.startPhoneMission,
  runCheat,
  showBanner: hud.showBanner,
  updateHUD: hud.updateHUD,
  onOpen: clearInputs
});

// --- WEAPON TRACER VISUAL FEEDBACK ---
const tracers = [];
function spawnTracer(origin, yaw, range, color) {
  const start = origin.clone().add(new THREE.Vector3(0, 1.6, 0));
  const end = start.clone().add(new THREE.Vector3(Math.sin(yaw) * range, 0, Math.cos(yaw) * range));
  const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
  const mat = new THREE.LineBasicMaterial({ color });
  const line = new THREE.Line(geo, mat);
  scene.add(line);
  tracers.push({ line, ttl: 0.08 });
}

// --- PLAYER ACTIONS ---
function cycleWeapon() {
  state.weaponIndex = (state.weaponIndex + 1) % state.weapons.length;
  hud.updateHUD();
}

function toggleVehicle() {
  const carBtn = document.getElementById('btn-car');
  if (state.inVehicle) {
    playerObj.mesh.position.copy(state.inVehicle.mesh.position).add(new THREE.Vector3(3.2, 0, 0));
    playerObj.mesh.position.y = 0;
    playerObj.mesh.visible = true;
    state.inVehicle = null;
    hud.showVehicleBanner(null);
    carBtn.innerHTML = 'ENTER<br>CAR';
    return;
  }

  let best = null;
  let dMin = 7;
  for (const v of vehicles) {
    const d = playerObj.mesh.position.distanceTo(v.mesh.position);
    if (d < dMin) {
      dMin = d;
      best = v;
    }
  }
  if (best) {
    state.inVehicle = best;
    playerObj.mesh.visible = false;
    hud.showVehicleBanner(best.type);
    carBtn.innerHTML = 'EXIT<br>CAR';
  }
}

function performAttack() {
  const w = state.weapons[state.weaponIndex];
  const active = state.inVehicle ? state.inVehicle.mesh : playerObj.mesh;
  const pos = active.position;

  if (state.weaponIndex > 0) {
    spawnTracer(pos, active.rotation.y, Math.min(w.range, 35), w.color);
  }

  for (const n of npcs) {
    if (n.alive && pos.distanceTo(n.mesh.position) < w.range) {
      n.hp -= w.dmg;
      if (n.hp <= 0) {
        n.alive = false;
        n.mesh.rotation.z = Math.PI / 2;
        n.mesh.position.y = 0.4;
        state.cash += 100;
        if (!state.neverWanted) state.wanted = Math.min(6, state.wanted + 1);
      }
    }
  }
  hud.updateHUD();
}

// --- CONTROLS (KEYBOARD + TOUCH + CANVAS CLICK) ---
const { joy, hold } = initTouchControls({
  onToggleCar: toggleVehicle,
  onAttack: performAttack,
  onCycleWeapon: cycleWeapon
});

let keyBuf = '';
window.addEventListener('keydown', (e) => {
  // Do not trigger game hotkeys while typing inside smartphone dialer
  if (document.activeElement && document.activeElement.tagName === 'INPUT') {
    if (e.code === 'Escape') phone.closePhone();
    return;
  }

  if (e.code === 'KeyP') {
    if (phone.isPhoneOpen()) phone.closePhone();
    else phone.openPhone();
    return;
  }
  if (e.code === 'Escape' && phone.isPhoneOpen()) {
    phone.closePhone();
    return;
  }
  if (phone.isPhoneOpen()) return;

  keys[e.code] = true;
  if (e.code === 'KeyF') toggleVehicle();
  if (e.code === 'KeyQ') cycleWeapon();
  if (e.code === 'KeyR') cycleRadio();

  if (e.key && e.key.length === 1) {
    keyBuf = (keyBuf + e.key.toUpperCase()).slice(-20);
    for (const c of CHEAT_CODES) {
      if (keyBuf.endsWith(c)) {
        runCheat(c);
        keyBuf = '';
        break;
      }
    }
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});
window.addEventListener('blur', clearInputs);

canvas.addEventListener('click', () => {
  if (!phone.isPhoneOpen()) performAttack();
});

// --- MAIN LOOP ---
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  // Clock progression
  state.gameMinutes = (state.gameMinutes + dt * (state.fastClock ? 12 : 1.5)) % 1440;
  hud.updateClock(state.gameMinutes);

  // Spin helicopter rotors & fade weapon tracers
  for (const v of vehicles) {
    if (v.mesh.userData.rotor && !v.disabled) {
      v.mesh.userData.rotor.rotation.y += 18 * dt;
    }
  }
  for (let i = tracers.length - 1; i >= 0; i--) {
    tracers[i].ttl -= dt;
    if (tracers[i].ttl <= 0) {
      scene.remove(tracers[i].line);
      tracers[i].line.geometry.dispose();
      tracers[i].line.material.dispose();
      tracers.splice(i, 1);
    }
  }

  const input = {
    moveForward:
      (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0) -
      (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0) -
      joy.y,
    turnInput:
      (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0) -
      (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0) -
      joy.x,
    isSprint: Boolean(keys['ShiftLeft'] || keys['ShiftRight'] || hold.sprint),
    isJump: Boolean(keys['Space'] || hold.jump)
  };

  let active = playerObj.mesh;
  if (state.inVehicle) {
    active = state.inVehicle.mesh;
    updateVehicle(state.inVehicle, state, input, colliders, dt, hud.showBanner);
  } else {
    updatePlayer(playerObj, state, input, colliders, dt);
  }

  hud.updateZoneBanner(active);
  missionSys.updateMissions(active, state, hud.showMissionBanner, hud.updateHUD);
  updateNPCs(scene, npcs, active, playerObj, state, dt, hud.updateHUD, hud.showBanner);

  // Third-person chase camera
  const camOff = new THREE.Vector3(0, state.inVehicle ? 6.8 : 5.2, state.inVehicle ? -13.5 : -10);
  camOff.applyAxisAngle(new THREE.Vector3(0, 1, 0), active.rotation.y);
  camera.position.lerp(active.position.clone().add(camOff), 0.14);
  camera.lookAt(active.position.x, active.position.y + 2.2, active.position.z);

  hud.drawRadar(active.position, active.rotation.y, missionSys.streetMissions, vehicles);
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

hud.updateHUD();
animate();
