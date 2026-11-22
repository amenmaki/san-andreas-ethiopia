import { LAKES, ZONES } from '../world/ethiopiaMap.js';

export function createHUD(state) {
  const radarCtx = document.getElementById('radarCanvas').getContext('2d');
  const moneyEl = document.getElementById('money-display');
  const healthEl = document.getElementById('health-bar');
  const armorEl = document.getElementById('armor-bar');
  const weaponIconEl = document.getElementById('weapon-icon');
  const weaponNameEl = document.getElementById('weapon-name');
  const starsEl = document.getElementById('wanted-stars');
  const clockEl = document.getElementById('clock-display');
  const phoneTimeEl = document.getElementById('phone-time');
  const cheatBannerEl = document.getElementById('cheat-banner');
  const locationBannerEl = document.getElementById('location-banner');
  const vehicleBannerEl = document.getElementById('vehicle-banner');
  const missionBannerEl = document.getElementById('mission-banner');
  const missionTitleEl = document.getElementById('mission-title');
  const missionRewardEl = document.getElementById('mission-reward');

  function showBanner(msg) {
    cheatBannerEl.textContent = msg;
    cheatBannerEl.style.display = 'block';
    clearTimeout(cheatBannerEl._t);
    cheatBannerEl._t = setTimeout(() => {
      cheatBannerEl.style.display = 'none';
    }, 3400);
  }

  function showMissionBanner(title, rewardText) {
    missionTitleEl.textContent = title;
    missionRewardEl.textContent = rewardText;
    missionBannerEl.style.display = 'block';
    clearTimeout(missionBannerEl._t);
    missionBannerEl._t = setTimeout(() => {
      missionBannerEl.style.display = 'none';
    }, 3400);
  }

  function showVehicleBanner(name) {
    if (!name) {
      vehicleBannerEl.style.display = 'none';
      return;
    }
    vehicleBannerEl.textContent = name;
    vehicleBannerEl.style.display = 'block';
  }

  function updateClock(gameMinutes) {
    const tStr = `${String(Math.floor(gameMinutes / 60)).padStart(2, '0')}:${String(
      Math.floor(gameMinutes % 60)
    ).padStart(2, '0')}`;
    clockEl.textContent = tStr;
    if (phoneTimeEl) phoneTimeEl.textContent = tStr;
  }

  function updateZoneBanner(activeObj) {
    for (const z of ZONES) {
      if (Math.hypot(activeObj.position.x - z.x, activeObj.position.z - z.z) < z.radius && state.currentZone !== z.name) {
        state.currentZone = z.name;
        locationBannerEl.textContent = z.name;
        locationBannerEl.style.opacity = '1';
        clearTimeout(locationBannerEl._t);
        locationBannerEl._t = setTimeout(() => {
          locationBannerEl.style.opacity = '0';
        }, 3500);
        break;
      }
    }
  }

  function updateHUD() {
    moneyEl.textContent = '$' + String(Math.floor(state.cash)).padStart(8, '0');
    healthEl.style.width = Math.max(0, Math.min(100, state.health)) + '%';
    armorEl.style.width = Math.max(0, Math.min(100, state.armor)) + '%';

    const w = state.weapons[state.weaponIndex];
    weaponIconEl.textContent = w.icon;
    weaponNameEl.textContent = w.name;

    let s = '';
    for (let i = 1; i <= 6; i++) {
      s += `<span class="${i <= state.wanted ? 'active' : ''}">★</span>`;
    }
    starsEl.innerHTML = s;
  }

  function drawRadar(pos, yaw, streetMissions, vehicles) {
    radarCtx.fillStyle = '#0f0722';
    radarCtx.fillRect(0, 0, 140, 140);

    radarCtx.save();
    radarCtx.translate(70, 70);
    radarCtx.rotate(yaw);

    // Lakes
    radarCtx.fillStyle = '#0369a1';
    for (const lake of LAKES) {
      radarCtx.beginPath();
      radarCtx.arc((lake.x - pos.x) * 0.3, (lake.z - pos.z) * 0.3, lake.radius * 0.3, 0, Math.PI * 2);
      radarCtx.fill();
    }

    // Main cross-city highways
    radarCtx.fillStyle = '#312e81';
    radarCtx.fillRect(-pos.x * 0.3 - 3, -300, 6, 600);
    radarCtx.fillRect(-300, -pos.z * 0.3 - 3, 600, 6);

    // Nearby vehicles
    radarCtx.fillStyle = '#38bdf8';
    for (const v of vehicles) {
      radarCtx.fillRect(
        (v.mesh.position.x - pos.x) * 0.3 - 2,
        (v.mesh.position.z - pos.z) * 0.3 - 2,
        4,
        4
      );
    }

    // Street mission blips
    radarCtx.fillStyle = '#facc15';
    for (const m of streetMissions) {
      radarCtx.beginPath();
      radarCtx.arc((m.x - pos.x) * 0.3, (m.z - pos.z) * 0.3, 3.5, 0, Math.PI * 2);
      radarCtx.fill();
    }

    // Active phone mission pink beacon
    if (state.activeMission) {
      radarCtx.fillStyle = '#ff4ecd';
      radarCtx.beginPath();
      radarCtx.arc(
        (state.activeMission.x - pos.x) * 0.3,
        (state.activeMission.z - pos.z) * 0.3,
        5,
        0,
        Math.PI * 2
      );
      radarCtx.fill();
    }
    radarCtx.restore();

    // Player indicator triangle
    radarCtx.fillStyle = '#38bdf8';
    radarCtx.beginPath();
    radarCtx.moveTo(70, 63);
    radarCtx.lineTo(65, 75);
    radarCtx.lineTo(75, 75);
    radarCtx.closePath();
    radarCtx.fill();
  }

  return {
    showBanner,
    showMissionBanner,
    showVehicleBanner,
    updateClock,
    updateZoneBanner,
    updateHUD,
    drawRadar
  };
}

export function initTouchControls({ onToggleCar, onAttack, onCycleWeapon }) {
  const joy = { x: 0, y: 0, active: false };
  const joyZone = document.getElementById('joystick-zone');
  const joyKnob = document.getElementById('joystick-knob');

  function moveJoy(t) {
    const r = joyZone.getBoundingClientRect();
    const dx = Math.max(-36, Math.min(36, t.clientX - (r.left + r.width / 2)));
    const dy = Math.max(-36, Math.min(36, t.clientY - (r.top + r.height / 2)));
    joy.x = dx / 36;
    joy.y = dy / 36;
    joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  joyZone.addEventListener('touchstart', (e) => {
    joy.active = true;
    moveJoy(e.touches[0]);
  });
  joyZone.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (joy.active) moveJoy(e.touches[0]);
  });
  joyZone.addEventListener('touchend', () => {
    joy.active = false;
    joy.x = 0;
    joy.y = 0;
    joyKnob.style.transform = 'translate(0,0)';
  });

  const hold = { jump: false, sprint: false };
  ['jump', 'sprint'].forEach((k) => {
    const el = document.getElementById('btn-' + k);
    el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      hold[k] = true;
    });
    el.addEventListener('touchend', () => {
      hold[k] = false;
    });
    el.addEventListener('mousedown', () => {
      hold[k] = true;
    });
    el.addEventListener('mouseup', () => {
      hold[k] = false;
    });
    el.addEventListener('mouseleave', () => {
      hold[k] = false;
    });
  });

  document.getElementById('switch-weapon').onclick = onCycleWeapon;
  document.getElementById('btn-car').onclick = onToggleCar;
  document.getElementById('btn-attack').onclick = onAttack;

  return { joy, hold };
}
