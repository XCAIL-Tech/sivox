let audioCtx: AudioContext | null = null;

export function startSiren(): void {
  stopSiren();
  try {
    audioCtx = new AudioContext();

    const gain = audioCtx.createGain();
    gain.gain.value = 0.35;
    gain.connect(audioCtx.destination);

    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 880;
    osc.connect(gain);

    // LFO que barre la frecuencia ±440 Hz a 1.5 ciclos/segundo = sirena
    const lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 1.5;

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 440;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    lfo.start();
    osc.start();
  } catch {
    // AudioContext puede fallar en algunos navegadores/contextos
  }
}

export function stopSiren(): void {
  try {
    audioCtx?.close();
  } catch {
    // ignorar errores de cierre
  }
  audioCtx = null;
}
