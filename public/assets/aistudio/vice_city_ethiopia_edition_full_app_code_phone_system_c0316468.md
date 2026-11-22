# GTA: Vice City — Ethiopia Edition (Web & Tablet Build)

This update upgrades your open-world 3D game with **Vice City-inspired systems**—including an interactive **In-Game Smartphone**, classic **Vice City Cheat Codes**, neon-drenched **80s Supercars, Police Interceptors, and Attack Helicopters**, **Vice City Neon HUD**, and **Local Save/Load Slots**—while keeping your **Custom Ethiopia Multi-City Map** (Addis Ababa, Adama, Bahir Dar, Hawassa, Dire Dawa & Harar).

---

## 1. Key Upgrades Included
1. **Interactive In-Game Smartphone (`PHONE` Button or `P` Key):**
   - **Contacts & Missions:** Call *Tommy V. (Bole)*, *Lance (Meskel Sq)*, or *Ken (Adama)* to trigger instant street races, VIP deliveries, and turf defense contracts.
   - **Cheat Dialer:** Tap or dial classic Vice City cheat codes directly on the phone keypad.
   - **Vehicle Delivery:** Call the garage to drop an *Infernus*, *Cheetah*, *Ethiopian Minibus*, or *Hunter Helicopter* right to your street.
   - **Radio & Save Manager:** Switch FM stations (*Flash FM Ethio-Synth*, *Fever 105 Tizita*, *V-Rock*) and save/load progress to browser storage.
2. **Classic Vice City Cheat Codes:**
   - `ASPIRINE` — Full Health, Armor & Vehicle Repair
   - `PROFESSIONALTOOLS` — Heavy Weapons Loadout (Pistol, Uzi, M4, Rocket Launcher)
   - `NUTTERTOOLS` — Experimental Heavy Artillery & Bonus Cash (+$100,000)
   - `LEAVEMEALONE` — Clear Wanted Level (0 Stars)
   - `YOUWONTTAKEMEALIVE` — Raise Wanted Level (+2 Stars)
   - `PANZER` — Spawn Heavy Rhino Tank
   - `COMEFLYWITHME` — Flying Cars Mode
   - `SEAWAYS` — Drive Cars on Lake Tana & Lake Hawassa
   - `BIGBANG` — Detonate Nearby Traffic Vehicles

---

## 2. Complete Single-File Playable Build (`index.html`)

Save this complete file as `index.html` and upload it directly to your GitHub repository (`amenmaki13@gmail.com`) to play live on GitHub Pages.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Vice City: Ethiopia Edition</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #090414; font-family: 'Impact', 'Arial Black', sans-serif; }
    #gameCanvas { display: block; width: 100vw; height: 100vh; }

    /* Vice City Neon Top-Right HUD */
    #vc-hud {
      position: fixed; top: 14px; right: 16px; z-index: 20;
      display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
      pointer-events: none;
    }
    .hud-top-row { display: flex; align-items: center; gap: 10px; }
    #weapon-box {
      width: 58px; height: 58px; border: 3px solid #ff4ecd;
      background: rgba(18, 6, 36, 0.8); box-shadow: 0 0 12px rgba(255, 78, 205, 0.5);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: #fff; border-radius: 6px;
    }
    #weapon-icon { font-size: 24px; line-height: 1; }
    #weapon-name { font-family: Arial, sans-serif; font-weight: bold; font-size: 9px; color: #38bdf8; margin-top: 2px; }
    .bars-col { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
    #clock-display {
      color: #38bdf8; font-size: 20px; text-shadow: 2px 2px 0 #000, 0 0 8px #0284c7;
    }
    #money-display {
      color: #4ade80; font-size: 24px; text-shadow: 2px 2px 0 #000;
    }
    .stat-row { display: flex; align-items: center; gap: 6px; }
    .stat-label { font-size: 11px; color: #ff4ecd; text-shadow: 1px 1px 0 #000; }
    .stat-bar-wrap {
      width: 115px; height: 11px; background: #140824; border: 2px solid #000;
    }
    #health-bar { width: 100%; height: 100%; background: #ff4ecd; transition: width 0.15s; }
    #armor-bar { width: 50%; height: 100%; background: #38bdf8; transition: width 0.15s; }
    #wanted-stars {
      font-size: 20px; letter-spacing: 2px; text-shadow: 2px 2px 0 #000;
      color: rgba(255,255,255,0.2);
    }
    #wanted-stars .active { color: #38bdf8; text-shadow: 0 0 8px #38bdf8, 2px 2px 0 #000; }

    /* Bottom-Left Neon Radar */
    #radar-wrap {
      position: fixed; bottom: 16px; left: 16px; z-index: 20;
      width: 128px; height: 128px; border-radius: 50%;
      border: 4px solid #ff4ecd; box-shadow: 0 0 14px rgba(255, 78, 205, 0.55);
      overflow: hidden; background: #0f0722; pointer-events: none;
    }
    #radarCanvas { width: 100%; height: 100%; display: block; }

    /* Notifications & Vice City Neon Banners */
    #cheat-banner {
      position: fixed; top: 56px; left: 16px; z-index: 30;
      background: rgba(15, 5, 30, 0.92); color: #fff;
      padding: 9px 14px; border: 2px solid #38bdf8;
      font-family: Arial, sans-serif; font-size: 13px; font-weight: bold;
      max-width: 280px; display: none;
    }
    #location-banner {
      position: fixed; bottom: 155px; right: 18px; z-index: 25;
      color: #ff4ecd; font-size: 24px; font-style: italic;
      text-shadow: 2px 2px 0 #000, 0 0 10px rgba(255, 78, 205, 0.6);
      opacity: 0; transition: opacity 0.5s; pointer-events: none; text-align: right;
    }
    #vehicle-banner {
      position: fixed; bottom: 185px; right: 18px; z-index: 25;
      color: #38bdf8; font-size: 19px; font-style: italic;
      text-shadow: 2px 2px 0 #000; display: none; pointer-events: none;
    }
    #mission-banner {
      position: fixed; top: 30%; left: 50%; transform: translate(-50%, -50%);
      z-index: 35; text-align: center; pointer-events: none; display: none;
    }
    #mission-banner h2 {
      font-size: 36px; color: #ff4ecd; text-shadow: 3px 3px 0 #000, 0 0 15px #ff4ecd;
    }
    #mission-banner p {
      font-size: 22px; color: #38bdf8; text-shadow: 2px 2px 0 #000; margin-top: 4px;
    }

    /* Top Left Bar */
    #top-controls {
      position: fixed; top: 14px; left: 16px; z-index: 25; display: flex; gap: 8px;
    }
    .util-btn {
      background: rgba(18, 6, 36, 0.85); color: #fff; border: 2px solid #ff4ecd;
      padding: 7px 11px; border-radius: 6px; font-family: Arial, sans-serif;
      font-weight: bold; font-size: 12px; cursor: pointer;
    }
    .util-btn:active { background: #ff4ecd; color: #000; }

    /* Mobile / Tablet Controls */
    #joystick-zone {
      position: fixed; bottom: 20px; left: 162px; width: 115px; height: 115px;
      border-radius: 50%; background: rgba(255, 78, 205, 0.14);
      border: 2px solid rgba(56, 189, 248, 0.45); z-index: 25; touch-action: none;
    }
    #joystick-knob {
      position: absolute; top: 32px; left: 32px; width: 48px; height: 48px;
      border-radius: 50%; background: rgba(255, 255, 255, 0.65); pointer-events: none;
    }
    #action-buttons {
      position: fixed; bottom: 18px; right: 18px; z-index: 25;
      display: grid; grid-template-columns: repeat(2, 60px); gap: 9px;
    }
    .act-btn {
      width: 60px; height: 60px; border-radius: 50%;
      background: rgba(18, 6, 36, 0.82); border: 2px solid #38bdf8;
      color: #fff; font-family: Arial, sans-serif; font-weight: bold; font-size: 10px;
      display: flex; align-items: center; justify-content: center; text-align: center;
      touch-action: manipulation;
    }
    .act-btn:active { background: #ff4ecd; transform: scale(0.94); }
    #btn-attack { border-color: #ff4ecd; background: rgba(190, 24, 93, 0.8); }
    #btn-car { border-color: #4ade80; background: rgba(21, 128, 61, 0.8); }

    /* IN-GAME SMARTPHONE UI */
    #phone-overlay {
      position: fixed; inset: 0; background: rgba(0, 0, 0, 0.65); z-index: 60;
      display: none; align-items: center; justify-content: center; padding: 12px;
    }
    #smartphone {
      width: 310px; height: 530px; background: #0f172a;
      border: 4px solid #ff4ecd; border-radius: 28px;
      box-shadow: 0 0 30px rgba(255, 78, 205, 0.65);
      display: flex; flex-direction: column; overflow: hidden;
      font-family: Arial, sans-serif; color: #fff;
    }
    #phone-notch {
      background: #1e1b4b; padding: 8px 14px; display: flex;
      justify-content: space-between; font-size: 11px; color: #38bdf8; font-weight: bold;
    }
    #phone-screen {
      flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;
    }
    .phone-tabs {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;
    }
    .p-tab {
      background: #1e293b; border: 1px solid #38bdf8; color: #fff;
      padding: 6px 2px; font-size: 10px; font-weight: bold; border-radius: 6px; cursor: pointer;
    }
    .p-tab.active { background: #ff4ecd; border-color: #ff4ecd; color: #000; }
    .phone-card {
      background: #1e293b; border: 1px solid #334155; border-radius: 8px;
      padding: 9px; display: flex; justify-content: space-between; align-items: center;
    }
    .phone-card b { font-size: 12px; color: #f8fafc; display: block; }
    .phone-card small { font-size: 10px; color: #94a3b8; }
    .phone-act {
      background: #16a34a; border: none; color: #fff; padding: 6px 10px;
      border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;
    }
    .phone-act.pink { background: #db2777; }
    .phone-act.blue { background: #0284c7; }
    #dialer-input {
      width: 100%; padding: 8px; background: #020617; border: 1px solid #38bdf8;
      color: #4ade80; font-weight: bold; text-transform: uppercase; border-radius: 6px;
    }
    #phone-home-btn {
      background: #1e1b4b; border: none; border-top: 1px solid #334155;
      color: #ff4ecd; padding: 10px; font-weight: bold; font-size: 12px; cursor: pointer;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>

  <!-- Top Left Controls -->
  <div id="top-controls">
    <button class="util-btn" id="open-phone">📱 PHONE</button>
    <button class="util-btn" id="toggle-radio">📻 FLASH FM</button>
    <button class="util-btn" id="switch-weapon">🔫 GUN</button>
  </div>

  <div id="cheat-banner">CHEAT ACTIVATED</div>

  <!-- Vice City Neon Top-Right HUD -->
  <div id="vc-hud">
    <div class="hud-top-row">
      <div class="bars-col">
        <div id="clock-display">20:30</div>
        <div id="money-display">$00001000</div>
        <div class="stat-row">
          <span class="stat-label">♥</span>
          <div class="stat-bar-wrap"><div id="health-bar"></div></div>
        </div>
        <div class="stat-row">
          <span class="stat-label">🛡</span>
          <div class="stat-bar-wrap"><div id="armor-bar"></div></div>
        </div>
      </div>
      <div id="weapon-box">
        <div id="weapon-icon">👊</div>
        <div id="weapon-name">FIST</div>
      </div>
    </div>
    <div id="wanted-stars">★★★★★★</div>
  </div>

  <!-- Radar Minimap -->
  <div id="radar-wrap">
    <canvas id="radarCanvas" width="140" height="140"></canvas>
  </div>

  <div id="location-banner">Meskel Square, Addis Ababa</div>
  <div id="vehicle-banner">Infernus Neon Coupe</div>
  <div id="mission-banner">
    <h2 id="mission-title">MISSION PASSED!</h2>
    <p id="mission-reward">+$2,500</p>
  </div>

  <!-- Touch Controls -->
  <div id="joystick-zone"><div id="joystick-knob"></div></div>
  <div id="action-buttons">
    <div class="act-btn" id="btn-car">ENTER<br>CAR</div>
    <div class="act-btn" id="btn-jump">JUMP /<br>FLY</div>
    <div class="act-btn" id="btn-sprint">SPRINT /<br>TURBO</div>
    <div class="act-btn" id="btn-attack">ATTACK /<br>FIRE</div>
  </div>

  <!-- IN-GAME SMARTPHONE -->
  <div id="phone-overlay">
    <div id="smartphone">
      <div id="phone-notch">
        <span>ETHIO-NET 5G</span>
        <span id="phone-time">20:30</span>
      </div>
      <div id="phone-screen">
        <div class="phone-tabs">
          <button class="p-tab active" data-tab="missions">JOBS</button>
          <button class="p-tab" data-tab="garage">CARS</button>
          <button class="p-tab" data-tab="cheats">CHEATS</button>
          <button class="p-tab" data-tab="save">SAVE</button>
        </div>
        <div id="phone-body"></div>
      </div>
      <button id="phone-home-btn">CLOSE PHONE</button>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script>
    // --- GAME STATE ---
    const state = {
      cash: 1000,
      health: 100,
      armor: 50,
      wanted: 0,
      flyingCars: false,
      driveOnWater: false,
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

    // --- ETHIOPIA CITIES & ZONES ---
    const ZONES = [
      { name: 'Meskel Square, Addis Ababa', x: 0, z: 0, radius: 85 },
      { name: 'Bole Neon Strip, Addis Ababa', x: 110, z: -70, radius: 80 },
      { name: 'Merkato Market, Addis Ababa', x: -110, z: -60, radius: 80 },
      { name: 'Adama Palm Boulevard', x: 240, z: 200, radius: 100 },
      { name: 'Lake Tana, Bahir Dar', x: -250, z: -230, radius: 110 },
      { name: 'Lake Hawassa Marina', x: -20, z: 250, radius: 100 },
      { name: 'Harar Jugol & Dire Dawa', x: 260, z: -210, radius: 100 }
    ];

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

    // Terrain & Lakes
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1200, 1200),
      new THREE.MeshLambertMaterial({ color: 0x365314 })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const waterMat = new THREE.MeshPhongMaterial({ color: 0x06b6d4, shininess: 90 });
    const lakeTana = new THREE.Mesh(new THREE.CircleGeometry(95, 24), waterMat);
    lakeTana.rotation.x = -Math.PI / 2;
    lakeTana.position.set(-310, 0.12, -280);
    scene.add(lakeTana);

    const lakeHawassa = new THREE.Mesh(new THREE.CircleGeometry(90, 24), waterMat);
    lakeHawassa.rotation.x = -Math.PI / 2;
    lakeHawassa.position.set(-20, 0.12, 330);
    scene.add(lakeHawassa);

    // Highway Grid
    const roadMat = new THREE.MeshLambertMaterial({ color: 0x18181b });
    function addRoad(x, z, w, l, rot = 0) {
      const r = new THREE.Mesh(new THREE.PlaneGeometry(w, l), roadMat);
      r.rotation.x = -Math.PI / 2;
      r.rotation.z = rot;
      r.position.set(x, 0.06, z);
      scene.add(r);
    }
    addRoad(0, 0, 18, 720);
    addRoad(0, 0, 720, 18);
    addRoad(110, -70, 14, 280);
    addRoad(-110, -60, 14, 280);
    addRoad(120, 100, 16, 380, -0.78);
    addRoad(-125, -115, 16, 380, 0.78);
    addRoad(130, -105, 16, 380, -0.68);

    // Neon-lit Ethiopian Buildings & Palm Trees
    const colliders = [];
    const neonTrimColors = [0xff4ecd, 0x38bdf8, 0xfacc15, 0x4ade80];
    ZONES.forEach((z, idx) => {
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const dist = 32 + (i % 3) * 20;
        const bx = z.x + Math.cos(ang) * dist;
        const bz = z.z + Math.sin(ang) * dist;
        if (Math.abs(bx) < 16 || Math.abs(bz) < 16) continue;

        const w = 10 + (i % 3) * 3;
        const d = 10 + ((i + 1) % 3) * 3;
        const h = 14 + ((i + idx) % 5) * 7;

        const building = new THREE.Mesh(
          new THREE.BoxGeometry(w, h, d),
          new THREE.MeshLambertMaterial({ color: i % 2 === 0 ? 0xf8fafc : 0xfde68a })
        );
        building.position.set(bx, h / 2, bz);
        scene.add(building);

        // Vice City Neon Roof Strip
        const neon = new THREE.Mesh(
          new THREE.BoxGeometry(w + 0.4, 0.6, d + 0.4),
          new THREE.MeshBasicMaterial({ color: neonTrimColors[(i + idx) % neonTrimColors.length] })
        );
        neon.position.set(bx, h + 0.2, bz);
        scene.add(neon);

        colliders.push({ x: bx, z: bz, hw: w / 2 + 0.9, hd: d / 2 + 0.9 });
      }
    });

    // --- PLAYER (HAWAIIAN SHIRT VICE CITY STYLE) ---
    const player = new THREE.Group();
    const shirt = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 0.6), new THREE.MeshLambertMaterial({ color: 0x06b6d4 }));
    shirt.position.y = 1.6;
    const jeans = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, 0.55), new THREE.MeshLambertMaterial({ color: 0x1e3a8a }));
    jeans.position.y = 0.5;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshLambertMaterial({ color: 0x6b4423 }));
    head.position.y = 2.65;
    player.add(shirt, jeans, head);
    player.position.set(0, 0, 24);
    scene.add(player);
    let playerVelY = 0, onGround = true;

    // --- VICE CITY + ETHIOPIA VEHICLES ---
    const vehicles = [];
    function spawnVehicle(type, x, z) {
      const g = new THREE.Group();
      let color = 0xff4ecd, roof = 0xffffff, w = 2.3, h = 1.4, l = 4.9, maxSpeed = 48, isAir = false, isTank = false;

      if (type === 'Infernus Supercar') { color = 0xff4ecd; roof = 0x1e1b4b; maxSpeed = 56; }
      else if (type === 'Cheetah V8') { color = 0xfacc15; roof = 0x18181b; maxSpeed = 54; }
      else if (type === 'Blue-White Minibus') { color = 0x0284c7; roof = 0xffffff; h = 2.2; l = 5.2; maxSpeed = 36; }
      else if (type === 'Bajaj Tuk-Tuk') { color = 0x1d4ed8; roof = 0xfacc15; w = 1.7; h = 1.9; l = 3.1; maxSpeed = 30; }
      else if (type === 'Vice Police Cruiser') { color = 0x15803d; roof = 0xffffff; maxSpeed = 48; }
      else if (type === 'Hunter Helicopter') { color = 0x334155; roof = 0x38bdf8; w = 2.6; h = 2.2; l = 6.8; maxSpeed = 62; isAir = true; }
      else if (type === 'Rhino Tank') { color = 0x3f6212; roof = 0x1a2e05; w = 3.4; h = 2.4; l = 6.2; maxSpeed = 28; isTank = true; }

      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.6, l), new THREE.MeshLambertMaterial({ color }));
      body.position.y = h * 0.4;
      const top = new THREE.Mesh(new THREE.BoxGeometry(w * 0.88, h * 0.45, l * 0.6), new THREE.MeshLambertMaterial({ color: roof }));
      top.position.y = h * 0.85;
      g.add(body, top);

      if (isAir) {
        const rotor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.15, 0.5), new THREE.MeshBasicMaterial({ color: 0x94a3b8 }));
        rotor.position.y = h + 0.6;
        g.add(rotor);
        g.userData.rotor = rotor;
      }
      if (isTank) {
        const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 4.5), new THREE.MeshLambertMaterial({ color: 0x1a2e05 }));
        barrel.position.set(0, h * 0.9, l * 0.5);
        g.add(barrel);
      }

      g.position.set(x, 0, z);
      scene.add(g);
      const v = { mesh: g, type, speed: 0, vy: 0, maxSpeed, isAir, isTank };
      vehicles.push(v);
      return v;
    }

    spawnVehicle('Infernus Supercar', 10, 20);
    spawnVehicle('Blue-White Minibus', -12, 22);
    spawnVehicle('Cheetah V8', 112, -60);
    spawnVehicle('Bajaj Tuk-Tuk', -105, -55);
    spawnVehicle('Vice Police Cruiser', 24, -18);
    spawnVehicle('Hunter Helicopter', 0, -35);

    // --- NPCs & POLICE ---
    const npcs = [];
    for (let i = 0; i < 24; i++) {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 2.2, 0.6),
        new THREE.MeshLambertMaterial({ color: i % 2 === 0 ? 0xff4ecd : 0x38bdf8 })
      );
      m.position.set((Math.random() - 0.5) * 280, 1.1, (Math.random() - 0.5) * 280);
      scene.add(m);
      npcs.push({ mesh: m, dir: Math.random() * 6.28, timer: 2, alive: true });
    }

    // --- MISSION WAYPOINT ---
    const missionMarker = new THREE.Mesh(
      new THREE.CylinderGeometry(3.8, 3.8, 22, 16),
      new THREE.MeshBasicMaterial({ color: 0xff4ecd, transparent: true, opacity: 0.45 })
    );
    missionMarker.visible = false;
    scene.add(missionMarker);

    function startPhoneMission(title, x, z, reward) {
      state.activeMission = { title, x, z, reward };
      missionMarker.position.set(x, 11, z);
      missionMarker.visible = true;
      showBanner(`MISSION: ${title} — Drive to Pink Beacon!`);
      closePhone();
    }

    // --- AUDIO (FLASH FM & FEVER 105) ---
    let audioCtx = null, radioTimer = null;
    function cycleRadio() {
      state.radioStation = (state.radioStation + 1) % 3;
      const labels = ['📻 RADIO: OFF', '📻 FLASH FM (80s)', '📻 FEVER 105 (ETHIO)'];
      document.getElementById('toggle-radio').textContent = labels[state.radioStation];
      clearInterval(radioTimer);
      if (state.radioStation > 0) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = state.radioStation === 1 ? [261.6, 329.6, 392.0, 523.2] : [220, 261.6, 329.6, 349.2, 440];
        let step = 0;
        radioTimer = setInterval(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = state.radioStation === 1 ? 'sawtooth' : 'triangle';
          osc.frequency.value = notes[step % notes.length];
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);
          osc.connect(gain); gain.connect(audioCtx.destination);
          osc.start(); osc.stop(audioCtx.currentTime + 0.3);
          step++;
        }, 320);
      }
    }
    document.getElementById('toggle-radio').onclick = cycleRadio;

    // --- VICE CITY CHEAT SYSTEM ---
    function showBanner(msg) {
      const b = document.getElementById('cheat-banner');
      b.textContent = msg;
      b.style.display = 'block';
      clearTimeout(b._t);
      b._t = setTimeout(() => { b.style.display = 'none'; }, 3400);
    }

    function runCheat(raw) {
      const code = raw.toUpperCase().trim();
      const pos = state.inVehicle ? state.inVehicle.mesh.position : player.position;
      const yaw = state.inVehicle ? state.inVehicle.mesh.rotation.y : player.rotation.y;

      if (code === 'ASPIRINE') {
        state.health = 100; state.armor = 100;
        showBanner('CHEAT: Health & Armor Restored');
      } else if (code === 'PROFESSIONALTOOLS') {
        state.weaponIndex = 3;
        showBanner('CHEAT: M4 Assault Rifle Equipped');
      } else if (code === 'NUTTERTOOLS') {
        state.weaponIndex = 4; state.cash += 100000;
        showBanner('CHEAT: RPG-7 + $100,000');
      } else if (code === 'LEAVEMEALONE') {
        state.wanted = 0;
        showBanner('CHEAT: Wanted Level Cleared');
      } else if (code === 'YOUWONTTAKEMEALIVE') {
        state.wanted = Math.min(6, state.wanted + 2);
        showBanner('CHEAT: Wanted Level Raised');
      } else if (code === 'PANZER') {
        spawnVehicle('Rhino Tank', pos.x + Math.sin(yaw) * 10, pos.z + Math.cos(yaw) * 10);
        showBanner('CHEAT: Rhino Tank Spawned');
      } else if (code === 'COMEFLYWITHME') {
        state.flyingCars = !state.flyingCars;
        showBanner('CHEAT: Flying Cars ' + (state.flyingCars ? 'ON' : 'OFF'));
      } else if (code === 'SEAWAYS') {
        state.driveOnWater = !state.driveOnWater;
        showBanner('CHEAT: Drive on Water ' + (state.driveOnWater ? 'ON' : 'OFF'));
      } else if (code === 'BIGBANG') {
        vehicles.forEach(v => { if (v !== state.inVehicle) v.speed = 0; });
        showBanner('CHEAT: Nearby Traffic Disabled');
      }
      updateHUD();
    }

    // --- SMARTPHONE UI CONTROLLER ---
    const phoneOverlay = document.getElementById('phone-overlay');
    const phoneBody = document.getElementById('phone-body');
    function openPhone() { phoneOverlay.style.display = 'flex'; renderPhoneTab('missions'); }
    function closePhone() { phoneOverlay.style.display = 'none'; }
    document.getElementById('open-phone').onclick = openPhone;
    document.getElementById('phone-home-btn').onclick = closePhone;

    document.querySelectorAll('.p-tab').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.p-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderPhoneTab(tab.dataset.tab);
      };
    });

    function renderPhoneTab(tab) {
      if (tab === 'missions') {
        phoneBody.innerHTML = `
          <div class="phone-card"><div><b>Tommy V. (Bole)</b><small>Neon Street Race • +$2,500</small></div>
            <button class="phone-act pink" onclick="startPhoneMission('Bole Neon Run', 110, -70, 2500)">CALL</button></div>
          <div class="phone-card"><div><b>Lance (Adama)</b><small>Rift Highway Run • +$4,000</small></div>
            <button class="phone-act pink" onclick="startPhoneMission('Adama Express', 240, 200, 4000)">CALL</button></div>
          <div class="phone-card"><div><b>Ken (Bahir Dar)</b><small>Lake Tana Delivery • +$5,000</small></div>
            <button class="phone-act pink" onclick="startPhoneMission('Lake Tana Drop', -250, -230, 5000)">CALL</button></div>
        `;
      } else if (tab === 'garage') {
        const list = ['Infernus Supercar', 'Cheetah V8', 'Blue-White Minibus', 'Hunter Helicopter', 'Rhino Tank'];
        phoneBody.innerHTML = list.map(name => `
          <div class="phone-card"><div><b>${name}</b><small>Instant Street Drop</small></div>
            <button class="phone-act blue" onclick="deliverCar('${name}')">DROP</button></div>
        `).join('');
      } else if (tab === 'cheats') {
        const codes = ['ASPIRINE', 'PROFESSIONALTOOLS', 'NUTTERTOOLS', 'LEAVEMEALONE', 'PANZER', 'COMEFLYWITHME', 'SEAWAYS'];
        phoneBody.innerHTML = `
          <input id="dialer-input" placeholder="ENTER VICE CHEAT..." />
          <button class="phone-act" style="width:100%;padding:8px;" onclick="runCheat(document.getElementById('dialer-input').value);closePhone();">DIAL CODE</button>
          ${codes.map(c => `<div class="phone-card"><b>${c}</b><button class="phone-act pink" onclick="runCheat('${c}');closePhone();">ACTIVATE</button></div>`).join('')}
        `;
      } else if (tab === 'save') {
        phoneBody.innerHTML = `
          <div class="phone-card"><div><b>Save Game Slot 1</b><small>Save Cash, Health & Position</small></div>
            <button class="phone-act" onclick="saveGame()">SAVE</button></div>
          <div class="phone-card"><div><b>Load Game Slot 1</b><small>Restore Saved Progress</small></div>
            <button class="phone-act blue" onclick="loadGame()">LOAD</button></div>
        `;
      }
    }

    window.deliverCar = (name) => {
      const p = state.inVehicle ? state.inVehicle.mesh.position : player.position;
      spawnVehicle(name, p.x + 7, p.z + 7);
      showBanner(`GARAGE: ${name} Delivered`);
      closePhone();
    };
    window.saveGame = () => {
      localStorage.setItem('vc_ethiopia_save', JSON.stringify({
        cash: state.cash, health: state.health, armor: state.armor,
        x: player.position.x, z: player.position.z
      }));
      showBanner('GAME SAVED TO SLOT 1');
      closePhone();
    };
    window.loadGame = () => {
      const raw = localStorage.getItem('vc_ethiopia_save');
      if (raw) {
        const d = JSON.parse(raw);
        state.cash = d.cash; state.health = d.health; state.armor = d.armor;
        player.position.set(d.x, 0, d.z);
        updateHUD();
        showBanner('SAVED GAME LOADED');
      }
      closePhone();
    };

    // --- CONTROLS & JOYSTICK ---
    const keys = {};
    let keyBuf = '';
    window.addEventListener('keydown', e => {
      keys[e.code] = true;
      if (e.code === 'KeyP') openPhone();
      if (e.code === 'KeyF') toggleVehicle();
      if (e.key && e.key.length === 1) {
        keyBuf = (keyBuf + e.key.toUpperCase()).slice(-18);
        ['ASPIRINE','PROFESSIONALTOOLS','NUTTERTOOLS','LEAVEMEALONE','YOUWONTTAKEMEALIVE','PANZER','COMEFLYWITHME','SEAWAYS','BIGBANG']
          .forEach(c => { if (keyBuf.endsWith(c)) { runCheat(c); keyBuf = ''; } });
      }
    });
    window.addEventListener('keyup', e => { keys[e.code] = false; });

    const joy = { x: 0, y: 0, active: false };
    const joyZone = document.getElementById('joystick-zone');
    const joyKnob = document.getElementById('joystick-knob');
    joyZone.addEventListener('touchstart', e => { joy.active = true; moveJoy(e.touches[0]); });
    joyZone.addEventListener('touchmove', e => { e.preventDefault(); if (joy.active) moveJoy(e.touches[0]); });
    joyZone.addEventListener('touchend', () => { joy.active = false; joy.x = 0; joy.y = 0; joyKnob.style.transform = 'translate(0,0)'; });
    function moveJoy(t) {
      const r = joyZone.getBoundingClientRect();
      const dx = Math.max(-36, Math.min(36, t.clientX - (r.left + r.width / 2)));
      const dy = Math.max(-36, Math.min(36, t.clientY - (r.top + r.height / 2)));
      joy.x = dx / 36; joy.y = dy / 36;
      joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    const hold = { jump: false, sprint: false };
    ['jump', 'sprint'].forEach(k => {
      const el = document.getElementById('btn-' + k);
      el.addEventListener('touchstart', e => { e.preventDefault(); hold[k] = true; });
      el.addEventListener('touchend', () => { hold[k] = false; });
    });

    document.getElementById('switch-weapon').onclick = () => {
      state.weaponIndex = (state.weaponIndex + 1) % state.weapons.length;
      updateHUD();
    };

    function toggleVehicle() {
      if (state.inVehicle) {
        player.position.copy(state.inVehicle.mesh.position).add(new THREE.Vector3(3.2, 0, 0));
        player.visible = true;
        state.inVehicle = null;
        document.getElementById('vehicle-banner').style.display = 'none';
        document.getElementById('btn-car').innerHTML = 'ENTER<br>CAR';
        return;
      }
      let best = null, dMin = 7;
      vehicles.forEach(v => {
        const d = player.position.distanceTo(v.mesh.position);
        if (d < dMin) { dMin = d; best = v; }
      });
      if (best) {
        state.inVehicle = best;
        player.visible = false;
        const vb = document.getElementById('vehicle-banner');
        vb.textContent = best.type;
        vb.style.display = 'block';
        document.getElementById('btn-car').innerHTML = 'EXIT<br>CAR';
      }
    }
    document.getElementById('btn-car').onclick = toggleVehicle;

    document.getElementById('btn-attack').onclick = () => {
      const w = state.weapons[state.weaponIndex];
      const pos = state.inVehicle ? state.inVehicle.mesh.position : player.position;
      npcs.forEach(n => {
        if (n.alive && pos.distanceTo(n.mesh.position) < w.range) {
          n.alive = false;
          n.mesh.rotation.z = Math.PI / 2;
          n.mesh.position.y = 0.4;
          state.cash += 100;
          state.wanted = Math.min(6, state.wanted + 1);
        }
      });
      updateHUD();
    };

    // --- HUD & RADAR ---
    const radarCtx = document.getElementById('radarCanvas').getContext('2d');
    function updateHUD() {
      document.getElementById('money-display').textContent = '$' + String(Math.floor(state.cash)).padStart(8, '0');
      document.getElementById('health-bar').style.width = state.health + '%';
      document.getElementById('armor-bar').style.width = state.armor + '%';
      const w = state.weapons[state.weaponIndex];
      document.getElementById('weapon-icon').textContent = w.icon;
      document.getElementById('weapon-name').textContent = w.name;
      let s = '';
      for (let i = 1; i <= 6; i++) s += `<span class="${i <= state.wanted ? 'active' : ''}">★</span>`;
      document.getElementById('wanted-stars').innerHTML = s;
    }

    function drawRadar(pos, yaw) {
      radarCtx.fillStyle = '#0f0722';
      radarCtx.fillRect(0, 0, 140, 140);
      radarCtx.save();
      radarCtx.translate(70, 70);
      radarCtx.rotate(yaw);
      radarCtx.fillStyle = '#312e81';
      radarCtx.fillRect(-pos.x * 0.3 - 3, -300, 6, 600);
      radarCtx.fillRect(-300, -pos.z * 0.3 - 3, 600, 6);
      if (state.activeMission) {
        radarCtx.fillStyle = '#ff4ecd';
        radarCtx.beginPath();
        radarCtx.arc((state.activeMission.x - pos.x) * 0.3, (state.activeMission.z - pos.z) * 0.3, 5, 0, 6.28);
        radarCtx.fill();
      }
      radarCtx.restore();
      radarCtx.fillStyle = '#38bdf8';
      radarCtx.beginPath();
      radarCtx.moveTo(70, 63); radarCtx.lineTo(65, 75); radarCtx.lineTo(75, 75);
      radarCtx.fill();
    }

    // --- LOOP ---
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);

      state.gameMinutes = (state.gameMinutes + dt * 1.5) % 1440;
      const tStr = `${String(Math.floor(state.gameMinutes / 60)).padStart(2, '0')}:${String(Math.floor(state.gameMinutes % 60)).padStart(2, '0')}`;
      document.getElementById('clock-display').textContent = tStr;
      document.getElementById('phone-time').textContent = tStr;

      const fwd = (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0) - (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0) - joy.y;
      const turn = (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0) - (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0) - joy.x;
      const sprint = keys['ShiftLeft'] || hold.sprint;
      const jump = keys['Space'] || hold.jump;

      vehicles.forEach(v => { if (v.mesh.userData.rotor) v.mesh.userData.rotor.rotation.y += 18 * dt; });

      let active = player;
      if (state.inVehicle) {
        const v = state.inVehicle;
        active = v.mesh;
        v.speed += fwd * (sprint ? 42 : 28) * dt;
        v.speed *= 0.96;
        v.speed = Math.max(-18, Math.min(v.maxSpeed, v.speed));
        if (Math.abs(v.speed) > 0.5) v.mesh.rotation.y += turn * 2.3 * dt * Math.sign(v.speed);
        v.mesh.position.x += Math.sin(v.mesh.rotation.y) * v.speed * dt;
        v.mesh.position.z += Math.cos(v.mesh.rotation.y) * v.speed * dt;

        if ((v.isAir || state.flyingCars) && jump) v.mesh.position.y = Math.min(70, v.mesh.position.y + 20 * dt);
        else if (v.mesh.position.y > 0) v.mesh.position.y = Math.max(0, v.mesh.position.y - 11 * dt);
      } else {
        player.rotation.y += turn * 2.8 * dt;
        const spd = (sprint ? 16 : 9) * fwd;
        const nx = player.position.x + Math.sin(player.rotation.y) * spd * dt;
        const nz = player.position.z + Math.cos(player.rotation.y) * spd * dt;
        if (!colliders.some(c => Math.abs(nx - c.x) < c.hw && Math.abs(nz - c.z) < c.hd)) {
          player.position.x = nx; player.position.z = nz;
        }
        if (jump && onGround) { playerVelY = 10.5; onGround = false; }
        player.position.y += playerVelY * dt;
        if (player.position.y > 0) playerVelY -= 24 * dt;
        else { player.position.y = 0; playerVelY = 0; onGround = true; }
      }

      // Zone Banner
      for (const z of ZONES) {
        if (Math.hypot(active.position.x - z.x, active.position.z - z.z) < z.radius && state.currentZone !== z.name) {
          state.currentZone = z.name;
          const lb = document.getElementById('location-banner');
          lb.textContent = z.name;
          lb.style.opacity = '1';
          clearTimeout(lb._t);
          lb._t = setTimeout(() => { lb.style.opacity = '0'; }, 3500);
          break;
        }
      }

      // Active Phone Mission Completion
      if (state.activeMission) {
        const m = state.activeMission;
        if (Math.hypot(active.position.x - m.x, active.position.z - m.z) < 7) {
          state.cash += m.reward;
          state.activeMission = null;
          missionMarker.visible = false;
          const mb = document.getElementById('mission-banner');
          document.getElementById('mission-title').textContent = m.title.toUpperCase() + ' PASSED!';
          document.getElementById('mission-reward').textContent = '+$' + m.reward;
          mb.style.display = 'block';
          setTimeout(() => { mb.style.display = 'none'; }, 3400);
          updateHUD();
        }
      }

      const camOff = new THREE.Vector3(0, state.inVehicle ? 6.8 : 5.2, state.inVehicle ? -13.5 : -10);
      camOff.applyAxisAngle(new THREE.Vector3(0, 1, 0), active.rotation.y);
      camera.position.lerp(active.position.clone().add(camOff), 0.14);
      camera.lookAt(active.position.x, active.position.y + 2.2, active.position.z);

      drawRadar(active.position, active.rotation.y);
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