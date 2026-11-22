export function createPhoneSystem({
  state,
  playerObj,
  scene,
  vehicles,
  spawnVehicle,
  startPhoneMission,
  runCheat,
  showBanner,
  updateHUD,
  onOpen
}) {
  const phoneOverlay = document.getElementById('phone-overlay');
  const phoneBody = document.getElementById('phone-body');
  const tabs = document.querySelectorAll('.p-tab');

  // In-memory checkpoint slot (no browser/disk storage used)
  let savedSlot = null;

  function isPhoneOpen() {
    return phoneOverlay.style.display === 'flex';
  }

  function openPhone() {
    if (onOpen) onOpen();
    phoneOverlay.style.display = 'flex';
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === 'missions'));
    renderPhoneTab('missions');
  }

  function closePhone() {
    phoneOverlay.style.display = 'none';
  }

  function deliverCar(name) {
    const p = state.inVehicle ? state.inVehicle.mesh.position : playerObj.mesh.position;
    spawnVehicle(scene, vehicles, name, p.x + 7, p.z + 7);
    showBanner(`GARAGE: ${name} Delivered`);
    closePhone();
  }

  function saveGame() {
    const pos = state.inVehicle ? state.inVehicle.mesh.position : playerObj.mesh.position;
    savedSlot = {
      cash: state.cash,
      health: state.health,
      armor: state.armor,
      wanted: state.wanted,
      x: pos.x,
      z: pos.z
    };
    showBanner('CHECKPOINT SAVED TO SLOT 1');
    closePhone();
  }

  function loadGame() {
    if (!savedSlot) {
      showBanner('NO CHECKPOINT SAVED YET');
      return;
    }
    state.cash = savedSlot.cash;
    state.health = savedSlot.health;
    state.armor = savedSlot.armor;
    state.wanted = savedSlot.wanted;
    if (state.inVehicle) {
      state.inVehicle = null;
      playerObj.mesh.visible = true;
      document.getElementById('vehicle-banner').style.display = 'none';
      document.getElementById('btn-car').innerHTML = 'ENTER<br>CAR';
    }
    playerObj.mesh.position.set(savedSlot.x, 0, savedSlot.z);
    updateHUD();
    showBanner('CHECKPOINT LOADED');
    closePhone();
  }

  function renderPhoneTab(tab) {
    phoneBody.innerHTML = '';

    if (tab === 'missions') {
      const jobs = [
        { contact: 'Tommy V. (Bole)', desc: 'Neon Street Race • +$2,500', title: 'Bole Neon Run', x: 110, z: -70, reward: 2500 },
        { contact: 'Lance (Adama)', desc: 'Rift Highway Run • +$4,000', title: 'Adama Express', x: 240, z: 200, reward: 4000 },
        { contact: 'Ken (Bahir Dar)', desc: 'Lake Tana Delivery • +$5,000', title: 'Lake Tana Drop', x: -250, z: -230, reward: 5000 }
      ];
      jobs.forEach((j) => {
        const card = document.createElement('div');
        card.className = 'phone-card';
        card.innerHTML = `<div><b>${j.contact}</b><small>${j.desc}</small></div>`;
        const btn = document.createElement('button');
        btn.className = 'phone-act pink';
        btn.textContent = 'CALL';
        btn.onclick = () => startPhoneMission(state, j.title, j.x, j.z, j.reward, showBanner, closePhone);
        card.appendChild(btn);
        phoneBody.appendChild(card);
      });
    } else if (tab === 'garage') {
      const list = [
        'Infernus Supercar',
        'Cheetah V8',
        'Blue-White Minibus',
        'Bajaj Tuk-Tuk',
        'Hunter Helicopter',
        'Rhino Tank'
      ];
      list.forEach((name) => {
        const card = document.createElement('div');
        card.className = 'phone-card';
        card.innerHTML = `<div><b>${name}</b><small>Instant Street Drop</small></div>`;
        const btn = document.createElement('button');
        btn.className = 'phone-act blue';
        btn.textContent = 'DROP';
        btn.onclick = () => deliverCar(name);
        card.appendChild(btn);
        phoneBody.appendChild(card);
      });
    } else if (tab === 'cheats') {
      const input = document.createElement('input');
      input.id = 'dialer-input';
      input.placeholder = 'ENTER VICE / SA CHEAT...';
      phoneBody.appendChild(input);

      const dialBtn = document.createElement('button');
      dialBtn.className = 'phone-act';
      dialBtn.style.width = '100%';
      dialBtn.style.padding = '8px';
      dialBtn.textContent = 'DIAL CODE';
      dialBtn.onclick = () => {
        if (input.value.trim()) {
          runCheat(input.value);
          closePhone();
        }
      };
      phoneBody.appendChild(dialBtn);

      const codes = [
        'ASPIRINE',
        'PROFESSIONALTOOLS',
        'NUTTERTOOLS',
        'LEAVEMEALONE',
        'PANZER',
        'COMEFLYWITHME',
        'SEAWAYS',
        'BIGBANG',
        'HESOYAM',
        'ROCKETMAN',
        'JUMPJET'
      ];
      codes.forEach((c) => {
        const card = document.createElement('div');
        card.className = 'phone-card';
        card.innerHTML = `<b>${c}</b>`;
        const btn = document.createElement('button');
        btn.className = 'phone-act pink';
        btn.textContent = 'ACTIVATE';
        btn.onclick = () => {
          runCheat(c);
          closePhone();
        };
        card.appendChild(btn);
        phoneBody.appendChild(card);
      });
    } else if (tab === 'save') {
      const saveCard = document.createElement('div');
      saveCard.className = 'phone-card';
      saveCard.innerHTML = `<div><b>Checkpoint Slot 1</b><small>In-memory snapshot (no storage)</small></div>`;
      const saveBtn = document.createElement('button');
      saveBtn.className = 'phone-act';
      saveBtn.textContent = 'SAVE';
      saveBtn.onclick = saveGame;
      saveCard.appendChild(saveBtn);
      phoneBody.appendChild(saveCard);

      const loadCard = document.createElement('div');
      loadCard.className = 'phone-card';
      loadCard.innerHTML = `<div><b>Restore Slot 1</b><small>${savedSlot ? `Cash $${Math.floor(savedSlot.cash)}` : 'Empty slot'}</small></div>`;
      const loadBtn = document.createElement('button');
      loadBtn.className = 'phone-act blue';
      loadBtn.textContent = 'LOAD';
      loadBtn.onclick = loadGame;
      loadCard.appendChild(loadBtn);
      phoneBody.appendChild(loadCard);
    }
  }

  document.getElementById('open-phone').onclick = openPhone;
  document.getElementById('phone-home-btn').onclick = closePhone;
  phoneOverlay.addEventListener('click', (e) => {
    if (e.target === phoneOverlay) closePhone();
  });

  tabs.forEach((tab) => {
    tab.onclick = () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      renderPhoneTab(tab.dataset.tab);
    };
  });

  return { openPhone, closePhone, isPhoneOpen };
}
