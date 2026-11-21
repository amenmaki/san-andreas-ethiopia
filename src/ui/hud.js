import { ROAD_POSITIONS, ZONES } from '../world/ethiopiaMap.js';

export function createHUD(state) {
  const radarCtx = document.getElementById('radarCanvas').getContext('2d');
  const moneyEl = document.getElementById('money-display');
  const healthEl = document.getElementById('health-bar');
  const armorEl = document.getElementById('armor-bar');
  const weaponIconEl = document.getElementById('weapon-icon');
  const weaponAmmoEl = document.getElementById('weapon-ammo');
  const starsEl = document.getElementById('wanted-stars');
  const clockEl = document.getElementById('clock-display');
  const cheatBannerEl = document.getElementById('cheat-banner');
  const locationBannerEl = document.getElementById('location-banner');
  const missionBannerEl = document.getElementById('mission-banner');
  const missionTitleEl = document.getElementById('mission-title');
  const missionRewardEl = document.getElementById('mission-reward');

  function showCheatMsg(text) {
    cheatBannerEl.textContent = text;
    cheatBannerEl.style.display = 'block';
    clearTimeout(cheatBannerEl._t);
    cheatBannerEl._t = setTimeout(() => {
      cheatBannerEl.style.display = 'none';
    }, 3000);
  }

  function showMissionBanner(title, rewardText) {
    missionTitleEl.textContent = title;
    missionRewardEl.textContent = rewardText;
    missionBannerEl.style.display = 'block';
    clearTimeout(missionBannerEl._t);
    missionBannerEl._t = setTimeout(() => {
      missionBannerEl.style.display = 'none';
    }, 3000);
  }

  function updateClock(gameMinutes) {
    const hh = String(Math.floor(gameMinutes / 60)).padStart(2, '0');
    const mm = String(Math.floor(gameMinutes % 60)).padStart(2, '0');
    clockEl.textContent = `${hh}:${mm}`;
  }

  function updateZoneBanner(activeObj) {
    for (const z of ZONES) {
      const dist = Math.hypot(activeObj.position.x - z.x, activeObj.position.z - z.z);
      if (dist < z.radius && state.currentZone !== z.name) {
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
    healthEl.style.width = state.health + '%';
    armorEl.style.width = state.armor + '%';

    const w = state.weapons[state.weaponIndex];
    weaponIconEl.textContent = w.icon;
    weaponAmmoEl.textContent = w.name;

    let starsHTML = '';
    for (let i = 1; i <= 6; i++) {
      starsHTML += `<span class="${i <= state.wanted ? 'active' : ''}">★</span>`;
    }
    starsEl.innerHTML = starsHTML;
  }

  function drawRadar(targetPos, yaw, missions, vehicles) {
    radarCtx.clearRect(0, 0, 140, 140);
    radarCtx.fillStyle = '#1e293b';
    radarCtx.fillRect(0, 0, 140, 140);

    radarCtx.save();
    radarCtx.translate(70, 70);
    radarCtx.rotate(yaw);

    // Draw roads relative to player
    radarCtx.fillStyle = '#475569';
    ROAD_POSITIONS.forEach((r) => {
      radarCtx.fillRect((r - targetPos.x) * 0.45 - 3, -200, 6, 400);
      radarCtx.fillRect(-200, (r - targetPos.z) * 0.45 - 3, 400, 6);
    });

    // Mission blips
    radarCtx.fillStyle = '#ef4444';
    missions.forEach((m) => {
      radarCtx.beginPath();
      radarCtx.arc((m.x - targetPos.x) * 0.45, (m.z - targetPos.z) * 0.45, 4, 0, Math.PI * 2);
      radarCtx.fill();
    });

    // Vehicle blips
    radarCtx.fillStyle = '#38bdf8';
    vehicles.forEach((v) => {
      radarCtx.fillRect(
        (v.mesh.position.x - targetPos.x) * 0.45 - 2,
        (v.mesh.position.z - targetPos.z) * 0.45 - 2,
        4,
        4
      );
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

  return {
    showCheatMsg,
    showMissionBanner,
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

  joyZone.addEventListener('touchstart', (e) => {
    joy.active = true;
    handleJoy(e.touches[0]);
  });
  joyZone.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (joy.active) handleJoy(e.touches[0]);
  });
  joyZone.addEventListener('touchend', () => {
    joy.active = false;
    joy.x = 0;
    joy.y = 0;
    joyKnob.style.transform = 'translate(0px, 0px)';
  });

  const touchHold = { jump: false, sprint: false };
  function bindHold(id, prop) {
    const el = document.getElementById(id);
    el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      touchHold[prop] = true;
    });
    el.addEventListener('touchend', () => {
      touchHold[prop] = false;
    });
    el.addEventListener('mousedown', () => {
      touchHold[prop] = true;
    });
    el.addEventListener('mouseup', () => {
      touchHold[prop] = false;
    });
    el.addEventListener('mouseleave', () => {
      touchHold[prop] = false;
    });
  }
  bindHold('btn-jump', 'jump');
  bindHold('btn-sprint', 'sprint');

  document.getElementById('switch-weapon').onclick = onCycleWeapon;
  document.getElementById('btn-car').onclick = onToggleCar;
  document.getElementById('btn-attack').onclick = onAttack;

  return { joy, touchHold };
}
