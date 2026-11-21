export function createAudioSystem(state) {
  let audioCtx = null;
  let radioInterval = null;
  const radioBtn = document.getElementById('toggle-radio');

  function toggleRadio() {
    state.radioOn = !state.radioOn;
    radioBtn.textContent = state.radioOn ? 'RADIO: ON (ETHIO-JAZZ)' : 'RADIO: OFF';

    if (radioInterval) {
      clearInterval(radioInterval);
      radioInterval = null;
    }

    if (state.radioOn) {
      if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) audioCtx = new Ctx();
      }
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      // Ethio-jazz pentatonic-inspired synth groove
      const scale = [220, 246.94, 261.63, 329.63, 349.23, 440];
      let step = 0;
      radioInterval = setInterval(() => {
        if (!state.radioOn || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = scale[(step * 3) % scale.length];
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.36);
        step++;
      }, 380);
    }
  }

  radioBtn.onclick = toggleRadio;
  return { toggleRadio };
}
