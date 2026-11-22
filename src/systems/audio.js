export function createAudioSystem(state) {
  let audioCtx = null;
  let radioTimer = null;
  const radioBtn = document.getElementById('toggle-radio');

  const LABELS = [
    '📻 RADIO: OFF',
    '📻 FLASH FM (80s)',
    '📻 FEVER 105 (ETHIO)'
  ];

  function cycleRadio() {
    state.radioStation = (state.radioStation + 1) % 3;
    radioBtn.textContent = LABELS[state.radioStation];

    if (radioTimer) {
      clearInterval(radioTimer);
      radioTimer = null;
    }

    if (state.radioStation > 0) {
      if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) audioCtx = new Ctx();
      }
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const notes =
        state.radioStation === 1
          ? [261.6, 329.6, 392.0, 523.2]
          : [220, 261.6, 329.6, 349.2, 440];
      let step = 0;

      radioTimer = setInterval(() => {
        if (state.radioStation === 0 || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = state.radioStation === 1 ? 'sawtooth' : 'triangle';
        osc.frequency.value = notes[step % notes.length];
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
        step++;
      }, 320);
    }
  }

  radioBtn.onclick = cycleRadio;
  return { cycleRadio };
}
