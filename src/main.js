import * as THREE from 'three';
import { buildEthiopiaMap } from './world/ethiopiaMap.js';
import { createPlayer, updatePlayer } from './entities/player.js';
import { createVehicle, spawnInitialVehicles, updateVehicle } from './entities/vehicles.js';
import { spawnNPC, spawnInitialNPCs, updateNPCs } from './entities/npcs.js';
import { CHEAT_CODES, createCheatSystem } from './systems/cheats.js';
import { createMissions, updateMissions } from './systems/missions.js';
import { createAudioSystem } from './systems/audio.js';
import { createHUD, initTouchControls } from './ui/hud.js';

// --- CORE STATE (In-memory only, no persistent storage required) ---
const state = {
  cash: 500,
  health: 100,
  armor: 50,
  wanted: 0,
  neverWanted: false,
  flyingCars: false,
  fastClock: false,
  jetpack: false,
  radioOn: false,
  inVehicle: null,
  weaponIndex: 0,
  weapons: [
    { name: 'FIST', icon: '👊', ammo: '∞', range: 3.2, dmg: 35, cooldown: 0.35 },
    { name: 'PISTOL', icon: '🔫', ammo: '999', range: 45, dmg: 50, cooldown: 0.25 },
    { name: 'AK-47', icon: '💥', ammo: '999', range: 65, dmg: 75, cooldown: 0.12 },
    { name: 'RPG', icon: '🚀', ammo: '50', range: 85, dmg: 200, cooldown: 0.8 }
  ],
  gameMinutes: 720,
  currentZone: ''
};

// --- SCENE, CAMERA, RENDERER ---
const canvas = document.getElementById('gameCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.FogExp2(0x87ceeb, 0.0028);

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.5, 450);

// Lighting
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x3f6212, 0.9);
scene.add(hemiLight);
const dirLight = new THREE.DirectionalLight(0xfffbeb, 0.9);
dirLight.position.set(100, 180, 80);
scene.add(dirLight);

// World, Entities, Missions, Audio & UI
const { colliders } = buildEthiopiaMap(scene);
const playerObj = createPlayer(scene);
const vehicles = [];
spawnInitialVehicles(scene, vehicles);

const npcs = [];
spawnInitialNPCs(scene, npcs);

const missions = createMissions(scene);
const hud = createHUD(state);
const { toggleRadio } = createAudioSystem(state);
const { triggerCheat } = createCheatSystem({
  state,
  playerObj,
  scene,
  vehicles,
  npcs,
  createVehicle,
  spawnNPC,
  showCheatMsg: hud.showCheatMsg,
  updateHUD: hud.updateHUD
});

// --- ACTIONS ---
function cycleWeapon() {
  state.weaponIndex = (state.weaponIndex + 1) % state.weapons.length;
  hud.updateHUD();
}

function toggleEnterVehicle() {
  const carBtn = document.getElementById('btn-car');
  if (state.inVehicle) {
    playerObj.mesh.position.copy(state.inVehicle.mesh.position).add(new THREE.Vector3(3, 0, 0));
    playerObj.mesh.visible = true;
    state.inVehicle = null;
    carBtn.innerHTML = 'ENTER<br>CAR';
    return;
  }

  let nearest = null;
  let bestDist = 7;
  for (const v of vehicles) {
    const d = playerObj.mesh.position.distanceTo(v.mesh.position);
    if (d < bestDist) {
      bestDist = d;
      nearest = v;
    }
  }
  if (nearest) {
    state.inVehicle = nearest;
    playerObj.mesh.visible = false;
    carBtn.innerHTML = 'EXIT<br>CAR';
    hud.showCheatMsg('Entered: ' + nearest.type);
  }
}

function performAttack() {
  const w = state.weapons[state.weaponIndex];
  const origin = state.inVehicle ? state.inVehicle.mesh.position : playerObj.mesh.position;
  let hit = false;

  for (let idx = npcs.length - 1; idx >= 0; idx--) {
    const n = npcs[idx];
    if (origin.distanceTo(n.mesh.position) <= w.range) {
      n.hp -= w.dmg;
      hit = true;
      if (n.hp <= 0) {
        scene.remove(n.mesh);
        npcs.splice(idx, 1);
        state.cash += 75;
        if (!state.neverWanted) state.wanted = Math.min(6, state.wanted + 1);
      }
    }
  }
  if (hit) hud.updateHUD();
}

// --- INPUTS (KEYBOARD + TOUCH + CANVAS CLICK) ---
const { joy, touchHold } = initTouchControls({
  onToggleCar: toggleEnterVehicle,
  onAttack: performAttack,
  onCycleWeapon: cycleWeapon
});

let keyBuffer = '';
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.key && e.key.length === 1) {
    keyBuffer = (keyBuffer + e.key.toUpperCase()).slice(-12);
    for (const c of CHEAT_CODES) {
      if (keyBuffer.endsWith(c)) {
        triggerCheat(c);
        keyBuffer = '';
        break;
      }
    }
  }
  if (e.code === 'KeyF') toggleEnterVehicle();
  if (e.code === 'KeyQ') cycleWeapon();
  if (e.code === 'KeyR') toggleRadio();
});
window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});
canvas.addEventListener('click', () => {
  performAttack();
});

// --- MAIN SIMULATION LOOP ---
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  // Clock progression
  state.gameMinutes = (state.gameMinutes + dt * (state.fastClock ? 12 : 1.5)) % 1440;
  hud.updateClock(state.gameMinutes);

  const input = {
    moveForward:
      (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0) -
      (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0) -
      joy.y,
    turnInput:
      (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0) -
      (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0) -
      joy.x,
    isSprint: Boolean(keys['ShiftLeft'] || keys['ShiftRight'] || touchHold.sprint),
    isJump: Boolean(keys['Space'] || touchHold.jump)
  };

  let activeObj = playerObj.mesh;
  if (state.inVehicle) {
    activeObj = state.inVehicle.mesh;
    updateVehicle(state.inVehicle, state, input, dt);
  } else {
    updatePlayer(playerObj, state, input, colliders, dt);
  }

  hud.updateZoneBanner(activeObj);
  updateMissions(missions, activeObj, state, hud.showMissionBanner, hud.updateHUD);
  updateNPCs(npcs, activeObj, playerObj, state, dt, hud.updateHUD, hud.showCheatMsg);

  // Third-person chase camera
  const camOffset = new THREE.Vector3(
    0,
    state.inVehicle ? 6.5 : 5.2,
    state.inVehicle ? -13 : -10
  );
  camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), activeObj.rotation.y);
  camera.position.lerp(activeObj.position.clone().add(camOffset), 0.14);
  camera.lookAt(activeObj.position.x, activeObj.position.y + 2.2, activeObj.position.z);

  hud.drawRadar(activeObj.position, activeObj.rotation.y, missions, vehicles);
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

hud.updateHUD();
animate();
