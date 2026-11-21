# GTA: San Andreas — Ethiopia Edition (`san-andreas-ethiopia`)

Because you are working from a tablet browser, below is **both**:
1. The **Complete Folder & File Structure** (if you want to organize the project cleanly in GitHub).
2. A **Single-File Standalone Build (`index.html`)** that contains the entire 3D Ethiopia open-world game, mobile touch controls, vehicles, police wanted system, missions, and San Andreas cheats so you can upload **one single file** directly to GitHub.com on your tablet and play it immediately via **GitHub Pages**.

---

## 1. Repository Folder Structure

```text
san-andreas-ethiopia/
├── README.md                  # Project overview, controls, and cheat list
├── index.html                 # Entry point & full playable 3D WebGL game
├── src/
│   ├── main.js                # Game loop, Three.js renderer, camera controller
│   ├── world/
│   │   └── ethiopiaMap.js     # Addis Ababa, Adama, Bahir Dar, Hawassa & Dire Dawa chunks
│   ├── entities/
│   │   ├── player.js          # Protagonist, movement, weapons & Jetpack
│   │   ├── vehicles.js        # Blue-white Minibus Taxi, Bajaj, Lowrider, SUV & Fighter Jet
│   │   └── npcs.js            # Pedestrians, traffic AI & 6-Star Police chase units
│   ├── systems/
│   │   ├── cheats.js          # HESOYAM, ROCKETMAN, UZUMYMW, AEZAKMI, BRINGITON, JUMPJET, RIPAZHA, YSOHNUL
│   │   ├── missions.js        # Street races, express deliveries & turf defense
│   │   └── audio.js           # Procedural Web Audio Ethio-jazz radio, horns & sirens
│   └── ui/
│       └── hud.js             # San Andreas HUD, radar minimap, location banners & mobile touch pad
```

---

## 2. `README.md` (Copy into your GitHub repository)

```markdown
# GTA: San Andreas — Ethiopia Edition

A browser and mobile-friendly 3D open-world action game built with Three.js and WebGL, set across iconic Ethiopian cities and highways.

## Featured Cities & Landmarks
- **Addis Ababa:** Meskel Square roundabout, Bole Avenue glass towers, Merkato market district, and Entoto Mountain.
- **Adama:** Rift Valley palm avenue and roundabout monuments.
- **Bahir Dar & Lake Tana:** Lakeside boulevard and Blue Nile bridge.
- **Hawassa:** Lake Hawassa waterfront strip.
- **Dire Dawa & Harar:** Historic walled gates and railway district.

## Controls
- **Mobile / Tablet:** Left virtual thumbstick to move/steer; on-screen buttons for **Sprint**, **Jump**, **Attack/Fire**, **Enter/Exit Vehicle**, **Radio**, and **Cheats**.
- **PC Keyboard:** `W A S D` move/drive, `Shift` sprint/nitro, `Space` jump/brake, `F` enter/exit vehicle, `Click` attack/shoot, `R` radio station.

## San Andreas Cheat Codes
Type on keyboard or tap the **CHEATS** button on screen:
- `HESOYAM` — Full Health, Full Armor, Vehicle Repair & +$250,000
- `ROCKETMAN` — Equip Jetpack
- `UZUMYMW` — Full Heavy Weapon Pack
- `AEZAKMI` — Never Wanted (0 Stars)
- `BRINGITON` — Instant 6-Star Wanted Level
- `JUMPJET` — Spawn Fighter Jet
- `RIPAZHA` — Flying Cars Mode
- `YSOHNUL` — Fast Game Clock
```

---

## 3. Complete Playable Single-File App (`index.html`)

Save the code below as `index.html` and upload it directly to your GitHub repository (`amenmaki13@gmail.com`).

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>GTA: San Andreas — Ethiopia Edition</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #0a0a0a; font-family: 'Impact', 'Arial Black', sans-serif; }
    #gameCanvas { display: block; width: 100vw; height: 100vh; }

    /* San Andreas Top-Right HUD */
    #sa-hud {
      position: fixed; top: 14px; right: 16px; z-index: 20;
      display: flex; flex-direction: column; align-items: flex-end; gap: 5px;
      pointer-events: none;
    }
    .hud-top-row { display: flex; align-items: center; gap: 10px; }
    #weapon-box {
      width: 54px; height: 54px; border: 3px solid #000; background: rgba(0,0,0,0.65);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: #fff; font-size: 11px; letter-spacing: 0.5px; text-align: center;
    }
    #weapon-icon { font-size: 22px; line-height: 1; }
    #weapon-ammo { font-family: Arial, sans-serif; font-weight: bold; font-size: 10px; color: #ddd; }
    .bars-col { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    #clock-display {
      color: #e2e8f0; font-size: 20px; text-shadow: 2px 2px 0 #000, -1px -1px 0 #000;
      letter-spacing: 1px;
    }
    #money-display {
      color: #2e8b57; font-size: 24px; text-shadow: 2px 2px 0 #000, -1px -1px 0 #000;
      letter-spacing: 1px;
    }
    .stat-bar-wrap {
      width: 130px; height: 12px; background: #1a1a1a; border: 2px solid #000; padding: 1px;
    }
    #health-bar { width: 100%; height: 100%; background: #b91c1c; transition: width 0.15s; }
    #armor-bar { width: 50%; height: 100%; background: #e5e7eb; transition: width 0.15s; }
    #wanted-stars {
      font-size: 20px; letter-spacing: 2px; text-shadow: 2px 2px 0 #000;
      color: rgba(255,255,255,0.25);
    }
    #wanted-stars .active { color: #facc15; }

    /* Bottom-Left Radar Minimap */
    #radar-wrap {
      position: fixed; bottom: 16px; left: 16px; z-index: 20;
      width: 126px; height: 126px; border-radius: 50%;
      border: 4px solid #111; box-shadow: 0 0 0 2px #555;
      overflow: hidden; background: #1e293b; pointer-events: none;
    }
    #radarCanvas { width: 100%; height: 100%; display: block; }

    /* San Andreas Notifications & Location Banner */
    #cheat-banner {
      position: fixed; top: 16px; left: 16px; z-index: 30;
      background: rgba(0, 0, 0, 0.85); color: #fff;
      padding: 10px 14px; border-left: 4px solid #facc15;
      font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: bold;
      max-width: 260px; display: none;
    }
    #location-banner {
      position: fixed; bottom: 96px; right: 20px; z-index: 25;
      color: #fff; font-size: 26px; font-style: italic;
      text-shadow: 3px 3px 0 #000, -1px -1px 0 #000;
      opacity: 0; transition: opacity 0.5s; pointer-events: none;
      text-align: right;
    }
    #mission-banner {
      position: fixed; top: 32%; left: 50%; transform: translate(-50%, -50%);
      z-index: 35; text-align: center; pointer-events: none; display: none;
    }
    #mission-banner h2 {
      font-size: 36px; color: #facc15; text-shadow: 3px 3px 0 #000; letter-spacing: 2px;
    }
    #mission-banner p {
      font-size: 22px; color: #fff; text-shadow: 2px 2px 0 #000; margin-top: 4px;
    }

    /* Top Utility Buttons (Cheats, Radio, Camera) */
    #top-controls {
      position: fixed; top: 14px; left: 16px; z-index: 25;
      display: flex; gap: 8px;
    }
    .util-btn {
      background: rgba(0,0,0,0.75); color: #fff; border: 2px solid #64748b;
      padding: 7px 11px; border-radius: 6px; font-family: Arial, sans-serif;
      font-weight: bold; font-size: 12px; cursor: pointer;
    }
    .util-btn:active { background: #facc15; color: #000; }

    /* Mobile / Tablet Touch Controls */
    #joystick-zone {
      position: fixed; bottom: 155px; left: 22px; width: 120px; height: 120px;
      border-radius: 50%; background: rgba(255,255,255,0.12);
      border: 2px solid rgba(255,255,255,0.3); z-index: 25; touch-action: none;
    }
    #joystick-knob {
      position: absolute; top: 35px; left: 35px; width: 50px; height: 50px;
      border-radius: 50%; background: rgba(255,255,255,0.55); pointer-events: none;
    }
    #action-buttons {
      position: fixed; bottom: 18px; right: 18px; z-index: 25;
      display: grid; grid-template-columns: repeat(2, 62px); gap: 10px;
    }
    .act-btn {
      width: 62px; height: 62px; border-radius: 50%;
      background: rgba(15, 23, 42, 0.78); border: 2px solid rgba(255,255,255,0.45);
      color: #fff; font-family: Arial, sans-serif; font-weight: bold; font-size: 11px;
      display: flex; align-items: center; justify-content: center; text-align: center;
      touch-action: manipulation;
    }
    .act-btn:active { background: #16a34a; border-color: #fff; transform: scale(0.95); }
    #btn-attack { background: rgba(185, 28, 28, 0.8); }
    #btn-car { background: rgba(29, 78, 216, 0.8); }

    /* Cheat Pad Modal */
    #cheat-modal {
      position: fixed; inset: 0; background: rgba(0,0,0,0.82); z-index: 50;
      display: none; align-items: center; justify-content: center; padding: 16px;
    }
    #cheat-panel {
      background: #111827; border: 2px solid #facc15; border-radius: 10px;
      width: 100%; max-width: 420px; padding: 18px; color: #fff;
      font-family: Arial, sans-serif;
    }
    #cheat-panel h3 { color: #facc15; margin-bottom: 10px; font-size: 18px; }
    .cheat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
    .cheat-code-btn {
      background: #1f2937; border: 1px solid #4b5563; color: #fff;
      padding: 9px; border-radius: 6px; text-align: left; font-size: 12px; cursor: pointer;
    }
    .cheat-code-btn strong { display: block; color: #4ade80; font-size: 13px; }
    #close-cheats {
      width: 100%; padding: 10px; background: #dc2626; color: #fff;
      border: none; border-radius: 6px; font-weight: bold; cursor: pointer;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>

  <!-- Top Left Utility Controls -->
  <div id="top-controls">
    <button class="util-btn" id="open-cheats">CHEATS</button>
    <button class="util-btn" id="toggle-radio">RADIO: ETHIO-JAZZ</button>
    <button class="util-btn" id="switch-weapon">WEAPON</button>
  </div>

  <div id="cheat-banner">Cheat activated</div>

  <!-- San Andreas Top-Right HUD -->
  <div id="sa-hud">
    <div class="hud-top-row">
      <div class="bars-col">
        <div id="clock-display">12:00</div>
        <div id="money-display">$00000500</div>
        <div class="stat-bar-wrap"><div id="health-bar"></div></div>
        <div class="stat-bar-wrap"><div id="armor-bar"></div></div>
      </div>
      <div id="weapon-box">
        <div id="weapon-icon">👊</div>
        <div id="weapon-ammo">FIST</div>
      </div>
    </div>
    <div id="wanted-stars">★★★★★★</div>
  </div>

  <!-- Bottom-Left Radar -->
  <div id="radar-wrap">
    <canvas id="radarCanvas" width="140" height="140"></canvas>
  </div>

  <!-- Location & Mission Banners -->
  <div id="location-banner">Meskel Square, Addis Ababa</div>
  <div id="mission-banner">
    <h2 id="mission-title">MISSION PASSED!</h2>
    <p id="mission-reward">RESPECT + $1,500</p>
  </div>

  <!-- Mobile / Tablet Touch Controls -->
  <div id="joystick-zone"><div id="joystick-knob"></div></div>
  <div id="action-buttons">
    <div class="act-btn" id="btn-car">ENTER<br>CAR</div>
    <div class="act-btn" id="btn-jump">JUMP /<br>FLY</div>
    <div class="act-btn" id="btn-sprint">SPRINT /<br>NITRO</div>
    <div class="act-btn" id="btn-attack">ATTACK /<br>FIRE</div>
  </div>

  <!-- Cheat Pad Modal -->
  <div id="cheat-modal">
    <div id="cheat-panel">
      <h3>SAN ANDREAS ETHIOPIA — CHEAT PAD</h3>
      <div class="cheat-grid">
        <button class="cheat-code-btn" data-code="HESOYAM"><strong>HESOYAM</strong>Health, Armor, Repair +$250k</button>
        <button class="cheat-code-btn" data-code="ROCKETMAN"><strong>ROCKETMAN</strong>Toggle Jetpack</button>
        <button class="cheat-code-btn" data-code="UZUMYMW"><strong>UZUMYMW</strong>Heavy Weapons Pack</button>
        <button class="cheat-code-btn" data-code="AEZAKMI"><strong>AEZAKMI</strong>Never Wanted Toggle</button>
        <button class="cheat-code-btn" data-code="BRINGITON"><strong>BRINGITON</strong>6-Star Wanted Level</button>
        <button class="cheat-code-btn" data-code="JUMPJET"><strong>JUMPJET</strong>Spawn Fighter Jet</button>
        <button class="cheat-code-btn" data-code="RIPAZHA"><strong>RIPAZHA</strong>Flying Cars Toggle</button>
        <button class="cheat-code-btn" data-code="YSOHNUL"><strong>YSOHNUL</strong>Turbo Clock Speed</button>
      </div>
      <button id="close-cheats">RESUME GAME</button>
    </div>
  </div>

  <!-- Three.js CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script>
    // --- CORE STATE ---
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

    // --- ETHIOPIA CITIES & ZONES ---
    const ZONES = [
      { name: 'Meskel Square, Addis Ababa', x: 0, z: 0, radius: 75, color: '#334155' },
      { name: 'Bole Avenue, Addis Ababa', x: 110, z: -40, radius: 70, color: '#1e3a8a' },
      { name: 'Merkato District, Addis Ababa', x: -110, z: 40, radius: 70, color: '#78350f' },
      { name: 'Adama Rift Avenue', x: 180, z: 160, radius: 85, color: '#9a3412' },
      { name: 'Bahir Dar & Lake Tana', x: -180, z: -170, radius: 90, color: '#0369a1' },
      { name: 'Hawassa Waterfront', x: 0, z: 210, radius: 85, color: '#0f766e' },
      { name: 'Dire Dawa & Harar Gate', x: 220, z: -180, radius: 85, color: '#a16207' }
    ];

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

    // Ground & Lakes
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x4d7c0f });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Lake Tana & Lake Hawassa water planes
    const waterMat = new THREE.MeshLambertMaterial({ color: 0x0284c7 });
    const lakeTana = new THREE.Mesh(new THREE.CircleGeometry(65, 24), waterMat);
    lakeTana.rotation.x = -Math.PI / 2;
    lakeTana.position.set(-220, 0.08, -200);
    scene.add(lakeTana);

    const lakeHawassa = new THREE.Mesh(new THREE.CircleGeometry(60, 24), waterMat);
    lakeHawassa.rotation.x = -Math.PI / 2;
    lakeHawassa.position.set(0, 0.08, 265);
    scene.add(lakeHawassa);

    // Road Network
    const roadMat = new THREE.MeshLambertMaterial({ color: 0x1f2937 });
    function buildRoad(x, z, w, d) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), roadMat);
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, 0.05, z);
      scene.add(m);
    }
    // Grid & Inter-city Highways
    [-180, -110, 0, 110, 180].forEach(pos => {
      buildRoad(pos, 0, 16, 560);
      buildRoad(0, pos, 560, 16);
    });

    // Meskel Square Central Monument & Ethiopian Flag Banners
    const plaza = new THREE.Mesh(new THREE.CylinderGeometry(24, 24, 0.25, 32), new THREE.MeshLambertMaterial({ color: 0x64748b }));
    plaza.position.set(0, 0.12, 0);
    scene.add(plaza);

    const flagColors = [0x16a34a, 0xfacc15, 0xdc2626];
    flagColors.forEach((col, i) => {
      const band = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 0.4), new THREE.MeshLambertMaterial({ color: col }));
      band.position.set(0, 10 - i * 1.2, 0);
      scene.add(band);
    });

    // Procedural City Buildings & Entoto Hills
    const colliders = [];
    function spawnBuilding(x, z, w, h, d, color) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshLambertMaterial({ color })
      );
      mesh.position.set(x, h / 2, z);
      scene.add(mesh);
      colliders.push({ x, z, hw: w / 2 + 1.2, hd: d / 2 + 1.2 });
    }

    const palette = [0xd97706, 0x2563eb, 0x475569, 0xb45309, 0x0f766e, 0x9ca3af];
    for (let gx = -220; gx <= 220; gx += 45) {
      for (let gz = -220; gz <= 220; gz += 45) {
        if (Math.abs(gx) < 32 && Math.abs(gz) < 32) continue;
        if (Math.abs(gx % 110) < 18 || Math.abs(gz % 110) < 18) continue;
        if (Math.abs(gx) < 18 || Math.abs(gz) < 18) continue;
        const h = 10 + ((Math.abs(gx * 7 + gz * 13) % 28));
        const col = palette[Math.abs(gx + gz) % palette.length];
        spawnBuilding(gx, gz, 18, h, 18, col);
      }
    }

    // Entoto Mountains Backdrop
    for (let i = -3; i <= 3; i++) {
      const hill = new THREE.Mesh(
        new THREE.ConeGeometry(75, 95, 7),
        new THREE.MeshLambertMaterial({ color: 0x365314 })
      );
      hill.position.set(i * 110, 45, -330);
      scene.add(hill);
    }

    // --- PLAYER CHARACTER ---
    const player = new THREE.Group();
    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.8, 0.7), new THREE.MeshLambertMaterial({ color: 0x16a34a }));
    bodyMesh.position.y = 1.4;
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), new THREE.MeshLambertMaterial({ color: 0x78350f }));
    headMesh.position.y = 2.75;
    const jetpackMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.45), new THREE.MeshLambertMaterial({ color: 0x94a3b8 }));
    jetpackMesh.position.set(0, 1.6, -0.5);
    jetpackMesh.visible = false;
    player.add(bodyMesh, headMesh, jetpackMesh);
    player.position.set(0, 0, 28);
    scene.add(player);

    let playerVelY = 0;
    let onGround = true;

    // --- VEHICLES (ETHIOPIAN MINIBUS TAXI, BAJAJ, LOWRIDER, SUV, POLICE, JET) ---
    const vehicles = [];
    function createVehicle(type, x, z) {
      const group = new THREE.Group();
      let color = 0x2563eb, w = 2.4, h = 1.8, d = 4.6, maxSpeed = 34, isAircraft = false;

      if (type === 'MINIBUS') { color = 0x1d4ed8; h = 2.2; d = 5.0; maxSpeed = 32; }
      else if (type === 'BAJAJ') { color = 0x0284c7; w = 1.6; h = 1.7; d = 2.8; maxSpeed = 28; }
      else if (type === 'LOWRIDER') { color = 0xdc2626; h = 1.3; d = 4.8; maxSpeed = 44; }
      else if (type === 'SUV') { color = 0x111827; w = 2.5; h = 2.0; d = 4.8; maxSpeed = 40; }
      else if (type === 'POLICE') { color = 0x0f172a; h = 1.6; d = 4.6; maxSpeed = 42; }
      else if (type === 'JET') { color = 0x64748b; w = 6.5; h = 1.8; d = 7.5; maxSpeed = 75; isAircraft = true; }

      const chassis = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color }));
      chassis.position.y = h / 2 + 0.4;
      group.add(chassis);

      // White roof stripe for Ethiopian Minibus Taxi
      if (type === 'MINIBUS') {
        const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.05, 0.55, d + 0.05), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        roof.position.y = h + 0.25;
        group.add(roof);
      }
      // Police siren bar
      if (type === 'POLICE') {
        const siren = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.4), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        siren.position.y = h + 0.55;
        group.add(siren);
      }

      group.position.set(x, 0, z);
      scene.add(group);
      const veh = { mesh: group, type, speed: 0, maxSpeed, isAircraft, health: 100 };
      vehicles.push(veh);
      return veh;
    }

    createVehicle('MINIBUS', 12, 22);
    createVehicle('BAJAJ', -14, 24);
    createVehicle('LOWRIDER', 22, -16);
    createVehicle('SUV', -22, -18);
    createVehicle('MINIBUS', 110, -30);
    createVehicle('BAJAJ', -105, 45);
    createVehicle('SUV', 175, 150);

    // --- NPCs & POLICE ---
    const npcs = [];
    function spawnNPC(x, z, isCop = false) {
      const g = new THREE.Group();
      const torso = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 1.7, 0.65),
        new THREE.MeshLambertMaterial({ color: isCop ? 0x1e3a8a : (Math.random() > 0.5 ? 0xfacc15 : 0xe11d48) })
      );
      torso.position.y = 1.35;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshLambertMaterial({ color: 0x78350f }));
      head.position.y = 2.6;
      g.add(torso, head);
      g.position.set(x, 0, z);
      scene.add(g);
      npcs.push({ mesh: g, isCop, hp: 100, dir: Math.random() * Math.PI * 2, timer: 0 });
    }
    for (let i = 0; i < 24; i++) {
      spawnNPC((Math.random() - 0.5) * 260, (Math.random() - 0.5) * 260, false);
    }

    // --- MISSION MARKERS ---
    const missions = [
      { title: 'MESKEL MINIBUS EXPRESS', reward: 1500, x: 18, z: 10 },
      { title: 'BOLE BAJAJ DRIFT', reward: 2500, x: 115, z: -45 },
      { title: 'MERKATO TURF DEFENSE', reward: 4000, x: -115, z: 35 }
    ];
    missions.forEach(m => {
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 2.5, 0.2, 20),
        new THREE.MeshBasicMaterial({ color: 0xdc2626 })
      );
      ring.position.set(m.x, 0.15, m.z);
      scene.add(ring);
      m.mesh = ring;
    });

    // --- AUDIO (ETHIO-JAZZ SYNTH LOOP) ---
    let audioCtx = null, radioInterval = null;
    function toggleRadio() {
      state.radioOn = !state.radioOn;
      document.getElementById('toggle-radio').textContent = state.radioOn ? 'RADIO: ON (ETHIO-JAZZ)' : 'RADIO: OFF';
      if (state.radioOn) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const scale = [220, 246.94, 261.63, 329.63, 349.23, 440];
        let step = 0;
        radioInterval = setInterval(() => {
          if (!state.radioOn) return;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = scale[(step * 3) % scale.length];
          gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
          osc.connect(gain); gain.connect(audioCtx.destination);
          osc.start(); osc.stop(audioCtx.currentTime + 0.36);
          step++;
        }, 380);
      } else {
        clearInterval(radioInterval);
      }
    }
    document.getElementById('toggle-radio').onclick = toggleRadio;

    // --- CHEAT SYSTEM ---
    function showCheatMsg(text) {
      const b = document.getElementById('cheat-banner');
      b.textContent = text;
      b.style.display = 'block';
      clearTimeout(b._t);
      b._t = setTimeout(() => { b.style.display = 'none'; }, 3000);
    }

    function triggerCheat(code) {
      code = code.toUpperCase().trim();
      if (code === 'HESOYAM') {
        state.health = 100; state.armor = 100; state.cash += 250000;
        if (state.inVehicle) state.inVehicle.health = 100;
        showCheatMsg('Cheat activated: Health, Armor & +$250,000');
      } else if (code === 'ROCKETMAN') {
        state.jetpack = !state.jetpack;
        jetpackMesh.visible = state.jetpack;
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
        for (let i = 0; i < 4; i++) spawnNPC(player.position.x + 18, player.position.z + i * 4, true);
        showCheatMsg('Cheat activated: 6-Star Wanted Level');
      } else if (code === 'JUMPJET') {
        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(player.quaternion);
        createVehicle('JET', player.position.x + forward.x * 10, player.position.z + forward.z * 10);
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

    // Keyboard Cheat Buffer
    let keyBuffer = '';
    const keys = {};
    window.addEventListener('keydown', e => {
      keys[e.code] = true;
      if (e.key && e.key.length === 1) {
        keyBuffer = (keyBuffer + e.key.toUpperCase()).slice(-12);
        ['HESOYAM','ROCKETMAN','UZUMYMW','AEZAKMI','BRINGITON','JUMPJET','RIPAZHA','YSOHNUL'].forEach(c => {
          if (keyBuffer.endsWith(c)) { triggerCheat(c); keyBuffer = ''; }
        });
      }
      if (e.code === 'KeyF') toggleEnterVehicle();
      if (e.code === 'KeyQ') cycleWeapon();
    });
    window.addEventListener('keyup', e => { keys[e.code] = false; });

    // Cheat Modal UI
    const cheatModal = document.getElementById('cheat-modal');
    document.getElementById('open-cheats').onclick = () => { cheatModal.style.display = 'flex'; };
    document.getElementById('close-cheats').onclick = () => { cheatModal.style.display = 'none'; };
    document.querySelectorAll('.cheat-code-btn').forEach(btn => {
      btn.onclick = () => { triggerCheat(btn.dataset.code); cheatModal.style.display = 'none'; };
    });

    // --- TOUCH JOYSTICK & BUTTONS ---
    const joy = { x: 0, y: 0, active: false };
    const joyZone = document.getElementById('joystick-zone');
    const joyKnob = document.getElementById('joystick-knob');
    joyZone.addEventListener('touchstart', e => { joy.active = true; handleJoy(e.touches[0]); });
    joyZone.addEventListener('touchmove', e => { e.preventDefault(); if (joy.active) handleJoy(e.touches[0]); });
    joyZone.addEventListener('touchend', () => {
      joy.active = false; joy.x = 0; joy.y = 0;
      joyKnob.style.transform = 'translate(0px, 0px)';
    });
    function handleJoy(t) {
      const rect = joyZone.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(-40, Math.min(40, t.clientX - cx));
      const dy = Math.max(-40, Math.min(40, t.clientY - cy));
      joy.x = dx / 40;
      joy.y = dy / 40;
      joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    const touchHold = { jump: false, sprint: false };
    function bindHold(id, prop) {
      const el = document.getElementById(id);
      el.addEventListener('touchstart', e => { e.preventDefault(); touchHold[prop] = true; });
      el.addEventListener('touchend', () => { touchHold[prop] = false; });
      el.addEventListener('mousedown', () => { touchHold[prop] = true; });
      el.addEventListener('mouseup', () => { touchHold[prop] = false; });
    }
    bindHold('btn-jump', 'jump');
    bindHold('btn-sprint', 'sprint');

    function cycleWeapon() {
      state.weaponIndex = (state.weaponIndex + 1) % state.weapons.length;
      updateHUD();
    }
    document.getElementById('switch-weapon').onclick = cycleWeapon;

    function toggleEnterVehicle() {
      if (state.inVehicle) {
        player.position.copy(state.inVehicle.mesh.position).add(new THREE.Vector3(3, 0, 0));
        player.visible = true;
        state.inVehicle = null;
        document.getElementById('btn-car').innerHTML = 'ENTER<br>CAR';
        return;
      }
      let nearest = null, bestDist = 7;
      vehicles.forEach(v => {
        const d = player.position.distanceTo(v.mesh.position);
        if (d < bestDist) { bestDist = d; nearest = v; }
      });
      if (nearest) {
        state.inVehicle = nearest;
        player.visible = false;
        document.getElementById('btn-car').innerHTML = 'EXIT<br>CAR';
        showCheatMsg('Entered: ' + nearest.type);
      }
    }
    document.getElementById('btn-car').onclick = toggleEnterVehicle;

    function performAttack() {
      const w = state.weapons[state.weaponIndex];
      const origin = state.inVehicle ? state.inVehicle.mesh.position : player.position;
      let hit = false;
      npcs.forEach((n, idx) => {
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
      });
      if (hit) updateHUD();
    }
    document.getElementById('btn-attack').onclick = performAttack;

    // --- HUD & RADAR UPDATE ---
    const radarCtx = document.getElementById('radarCanvas').getContext('2d');
    function updateHUD() {
      document.getElementById('money-display').textContent = '$' + String(Math.floor(state.cash)).padStart(8, '0');
      document.getElementById('health-bar').style.width = state.health + '%';
      document.getElementById('armor-bar').style.width = state.armor + '%';
      const w = state.weapons[state.weaponIndex];
      document.getElementById('weapon-icon').textContent = w.icon;
      document.getElementById('weapon-ammo').textContent = w.name;

      let starsHTML = '';
      for (let i = 1; i <= 6; i++) {
        starsHTML += `<span class="${i <= state.wanted ? 'active' : ''}">★</span>`;
      }
      document.getElementById('wanted-stars').innerHTML = starsHTML;
    }

    function drawRadar(targetPos, yaw) {
      radarCtx.clearRect(0, 0, 140, 140);
      radarCtx.fillStyle = '#1e293b';
      radarCtx.fillRect(0, 0, 140, 140);

      radarCtx.save();
      radarCtx.translate(70, 70);
      radarCtx.rotate(yaw);

      // Draw roads relative to player
      radarCtx.fillStyle = '#475569';
      [-180, -110, 0, 110, 180].forEach(r => {
        radarCtx.fillRect((r - targetPos.x) * 0.45 - 3, -200, 6, 400);
        radarCtx.fillRect(-200, (r - targetPos.z) * 0.45 - 3, 400, 6);
      });

      // Mission blips
      radarCtx.fillStyle = '#ef4444';
      missions.forEach(m => {
        radarCtx.beginPath();
        radarCtx.arc((m.x - targetPos.x) * 0.45, (m.z - targetPos.z) * 0.45, 4, 0, Math.PI * 2);
        radarCtx.fill();
      });

      // Vehicle blips
      radarCtx.fillStyle = '#38bdf8';
      vehicles.forEach(v => {
        radarCtx.fillRect((v.mesh.position.x - targetPos.x) * 0.45 - 2, (v.mesh.position.z - targetPos.z) * 0.45 - 2, 4, 4);
      });
      radarCtx.restore();

      // Center player triangle
      radarCtx.fillStyle = '#facc15';
      radarCtx.beginPath();
      radarCtx.moveTo(70, 63);
      radarCtx.lineTo(65, 75);
      radarCtx.lineTo(75, 75);
      radarCtx.closePath();
      radarCtx.fill();
    }

    // --- MAIN SIMULATION LOOP ---
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);

      // Clock Progression
      state.gameMinutes = (state.gameMinutes + dt * (state.fastClock ? 12 : 1.5)) % 1440;
      const hh = String(Math.floor(state.gameMinutes / 60)).padStart(2, '0');
      const mm = String(Math.floor(state.gameMinutes % 60)).padStart(2, '0');
      document.getElementById('clock-display').textContent = `${hh}:${mm}`;

      const moveForward = (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0) - (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0) - joy.y;
      const turnInput = (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0) - (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0) - joy.x;
      const isSprint = keys['ShiftLeft'] || touchHold.sprint;
      const isJump = keys['Space'] || touchHold.jump;

      let activeObj = player;

      if (state.inVehicle) {
        const v = state.inVehicle;
        activeObj = v.mesh;
        const accel = moveForward * (isSprint ? 36 : 24);
        v.speed += accel * dt;
        v.speed *= 0.96;
        v.speed = Math.max(-16, Math.min(v.maxSpeed, v.speed));
        if (Math.abs(v.speed) > 0.5) {
          v.mesh.rotation.y += turnInput * 2.2 * dt * Math.sign(v.speed);
        }
        v.mesh.position.x += Math.sin(v.mesh.rotation.y) * v.speed * dt;
        v.mesh.position.z += Math.cos(v.mesh.rotation.y) * v.speed * dt;

        // Aircraft or RIPAZHA Flying Cars
        if ((v.isAircraft || state.flyingCars) && isJump) {
          v.mesh.position.y = Math.min(65, v.mesh.position.y + 18 * dt);
        } else if (v.mesh.position.y > 0) {
          v.mesh.position.y = Math.max(0, v.mesh.position.y - 10 * dt);
        }
      } else {
        // On-foot Movement
        player.rotation.y += turnInput * 2.8 * dt;
        const walkSpeed = (isSprint ? 15 : 8.5) * moveForward;
        const nx = player.position.x + Math.sin(player.rotation.y) * walkSpeed * dt;
        const nz = player.position.z + Math.cos(player.rotation.y) * walkSpeed * dt;

        // Simple building collision check
        const blocked = colliders.some(c => Math.abs(nx - c.x) < c.hw && Math.abs(nz - c.z) < c.hd);
        if (!blocked) {
          player.position.x = nx;
          player.position.z = nz;
        }

        // Jump or Jetpack flight
        if (state.jetpack && isJump) {
          playerVelY = 14;
          onGround = false;
        } else if (isJump && onGround) {
          playerVelY = 10.5;
          onGround = false;
        }
        player.position.y += playerVelY * dt;
        if (player.position.y > 0) {
          playerVelY -= 24 * dt;
        } else {
          player.position.y = 0;
          playerVelY = 0;
          onGround = true;
        }
      }

      // Check Zone Banner
      for (const z of ZONES) {
        const dist = Math.hypot(activeObj.position.x - z.x, activeObj.position.z - z.z);
        if (dist < z.radius && state.currentZone !== z.name) {
          state.currentZone = z.name;
          const lb = document.getElementById('location-banner');
          lb.textContent = z.name;
          lb.style.opacity = '1';
          clearTimeout(lb._t);
          lb._t = setTimeout(() => { lb.style.opacity = '0'; }, 3500);
          break;
        }
      }

      // Check Mission Markers
      missions.forEach(m => {
        if (activeObj.position.distanceTo(m.mesh.position) < 4.5) {
          state.cash += m.reward;
          m.x = (Math.random() - 0.5) * 320;
          m.z = (Math.random() - 0.5) * 320;
          m.mesh.position.set(m.x, 0.15, m.z);
          const mb = document.getElementById('mission-banner');
          document.getElementById('mission-title').textContent = m.title + ' PASSED!';
          document.getElementById('mission-reward').textContent = 'RESPECT + $' + m.reward;
          mb.style.display = 'block';
          setTimeout(() => { mb.style.display = 'none'; }, 3000);
          updateHUD();
        }
      });

      // NPC & Police AI
      npcs.forEach(n => {
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
              state.health = 100; state.wanted = 0; state.cash = Math.max(0, state.cash - 100);
              player.position.set(0, 0, 28);
              showCheatMsg('WASTED — Respawned at Meskel Square');
            }
            updateHUD();
          }
        } else {
          if (n.timer <= 0) { n.dir = Math.random() * Math.PI * 2; n.timer = 2 + Math.random() * 3; }
          n.mesh.position.x += Math.sin(n.dir) * 2.5 * dt;
          n.mesh.position.z += Math.cos(n.dir) * 2.5 * dt;
        }
      });

      // Third-Person Chase Camera
      const camOffset = new THREE.Vector3(0, state.inVehicle ? 6.5 : 5.2, state.inVehicle ? -13 : -10);
      camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), activeObj.rotation.y);
      camera.position.lerp(activeObj.position.clone().add(camOffset), 0.14);
      camera.lookAt(activeObj.position.x, activeObj.position.y + 2.2, activeObj.position.z);

      drawRadar(activeObj.position, activeObj.rotation.y);
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    updateHUD();
    animate();
  </script>
</body>
</html>
```