import { useRef, useEffect } from 'react';

interface SoundConfig {
  bgm: boolean;
  sfx: boolean;
  volume: number;
}

export const useSound = (config: SoundConfig = { bgm: true, sfx: true, volume: 0.5 }) => {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const placeRef = useRef<HTMLAudioElement | null>(null);
  const overlapRef = useRef<HTMLAudioElement | null>(null);
  const selectRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio elements
    bgmRef.current = new Audio();
    bgmRef.current.loop = true;
    bgmRef.current.volume = config.volume * 0.3;
    
    placeRef.current = new Audio();
    placeRef.current.volume = config.volume;
    
    overlapRef.current = new Audio();
    overlapRef.current.volume = config.volume;
    
    selectRef.current = new Audio();
    selectRef.current.volume = config.volume * 0.6;

    // Generate synthetic sounds using Web Audio API
    generateSyntheticSounds();

    return () => {
      bgmRef.current?.pause();
      placeRef.current?.pause();
      overlapRef.current?.pause();
      selectRef.current?.pause();
    };
  }, []);

  const generateSyntheticSounds = () => {
    const audioContext = new AudioContext();

    // Generate place sound (soft click)
    const placeBuffer = createPlaceSound(audioContext);
    const placeBlob = audioBufferToWav(placeBuffer);
    if (placeRef.current) placeRef.current.src = URL.createObjectURL(placeBlob);

    // Generate overlap sound (higher pitched click)
    const overlapBuffer = createOverlapSound(audioContext);
    const overlapBlob = audioBufferToWav(overlapBuffer);
    if (overlapRef.current) overlapRef.current.src = URL.createObjectURL(overlapBlob);

    // Generate select sound (soft beep)
    const selectBuffer = createSelectSound(audioContext);
    const selectBlob = audioBufferToWav(selectBuffer);
    if (selectRef.current) selectRef.current.src = URL.createObjectURL(selectBlob);

    // Generate BGM (ambient synth)
    const bgmBuffer = createBGM(audioContext);
    const bgmBlob = audioBufferToWav(bgmBuffer);
    if (bgmRef.current) bgmRef.current.src = URL.createObjectURL(bgmBlob);
  };

  const createPlaceSound = (ctx: AudioContext) => {
    const duration = 0.15;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 20);
      data[i] = Math.sin(2 * Math.PI * 200 * t) * envelope * 0.3;
    }
    return buffer;
  };

  const createOverlapSound = (ctx: AudioContext) => {
    const duration = 0.2;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 15);
      data[i] = (Math.sin(2 * Math.PI * 400 * t) + Math.sin(2 * Math.PI * 600 * t)) * envelope * 0.2;
    }
    return buffer;
  };

  const createSelectSound = (ctx: AudioContext) => {
    const duration = 0.1;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 30);
      data[i] = Math.sin(2 * Math.PI * 800 * t) * envelope * 0.2;
    }
    return buffer;
  };

  const createBGM = (ctx: AudioContext) => {
    const duration = 8;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(2, duration * sampleRate, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        const note1 = Math.sin(2 * Math.PI * 220 * t) * 0.1;
        const note2 = Math.sin(2 * Math.PI * 330 * t) * 0.08;
        const note3 = Math.sin(2 * Math.PI * 440 * t) * 0.06;
        data[i] = (note1 + note2 + note3) * (0.5 + 0.5 * Math.sin(t * 0.5));
      }
    }
    return buffer;
  };

  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numberOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const floatTo16BitPCM = (offset: number, input: Float32Array) => {
      for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length, true);

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = buffer.getChannelData(channel)[i];
        const s = Math.max(-1, Math.min(1, sample));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const playBGM = () => {
    if (config.bgm && bgmRef.current) {
      bgmRef.current.play().catch(e => console.log('BGM play failed:', e));
    }
  };

  const stopBGM = () => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
  };

  const playPlace = () => {
    if (config.sfx && placeRef.current) {
      placeRef.current.currentTime = 0;
      placeRef.current.play().catch(e => console.log('Place sound failed:', e));
    }
  };

  const playOverlap = () => {
    if (config.sfx && overlapRef.current) {
      overlapRef.current.currentTime = 0;
      overlapRef.current.play().catch(e => console.log('Overlap sound failed:', e));
    }
  };

  const playSelect = () => {
    if (config.sfx && selectRef.current) {
      selectRef.current.currentTime = 0;
      selectRef.current.play().catch(e => console.log('Select sound failed:', e));
    }
  };

  return {
    playBGM,
    stopBGM,
    playPlace,
    playOverlap,
    playSelect
  };
};
