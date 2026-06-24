// Notification sounds - all synthesized with AudioContext
export interface NotificationSound {
  id: string;
  name: string;
  play: (ctx: AudioContext) => void;
}

const createOscillator = (ctx: AudioContext, type: OscillatorType, freq: number, startTime: number, duration: number, volume: number = 0.6) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  osc.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const NOTIFICATION_SOUNDS: NotificationSound[] = [
  {
    id: 'beep-classic',
    name: 'Beep Classic',
    play: (ctx) => {
      const now = ctx.currentTime;
      // Louder, more present than original
      createOscillator(ctx, 'sine', 880, now, 0.4, 0.8);
      createOscillator(ctx, 'sine', 880, now + 0.5, 0.4, 0.8);
    }
  },
  {
    id: 'triple-beep',
    name: 'Triple Beep',
    play: (ctx) => {
      const now = ctx.currentTime;
      createOscillator(ctx, 'sine', 1000, now, 0.2, 0.7);
      createOscillator(ctx, 'sine', 1000, now + 0.25, 0.2, 0.7);
      createOscillator(ctx, 'sine', 1000, now + 0.5, 0.3, 0.7);
    }
  },
  {
    id: 'rising-tone',
    name: 'Tono Crescente',
    play: (ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.7, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  },
  {
    id: 'chime',
    name: 'Campanella',
    play: (ctx) => {
      const now = ctx.currentTime;
      createOscillator(ctx, 'sine', 800, now, 0.8, 0.5);
      createOscillator(ctx, 'sine', 1000, now + 0.15, 0.6, 0.5);
    }
  },
  {
    id: 'alarm',
    name: 'Allarme',
    play: (ctx) => {
      const now = ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const freq = i % 2 === 0 ? 900 : 700;
        createOscillator(ctx, 'square', freq, now + i * 0.15, 0.12, 0.4);
      }
    }
  },
  {
    id: 'bell',
    name: 'Campana',
    play: (ctx) => {
      const now = ctx.currentTime;
      createOscillator(ctx, 'sine', 523, now, 1.2, 0.6);
      createOscillator(ctx, 'sine', 659, now, 1.0, 0.3);
      createOscillator(ctx, 'sine', 784, now, 0.8, 0.2);
    }
  },
  {
    id: 'notification-soft',
    name: 'Notifica Soft',
    play: (ctx) => {
      const now = ctx.currentTime;
      createOscillator(ctx, 'sine', 660, now, 0.3, 0.4);
      createOscillator(ctx, 'sine', 880, now + 0.35, 0.4, 0.4);
    }
  },
  {
    id: 'alert',
    name: 'Alert',
    play: (ctx) => {
      const now = ctx.currentTime;
      createOscillator(ctx, 'sawtooth', 600, now, 0.1, 0.5);
      createOscillator(ctx, 'sawtooth', 800, now + 0.12, 0.1, 0.5);
      createOscillator(ctx, 'sawtooth', 600, now + 0.24, 0.15, 0.5);
    }
  },
  {
    id: 'success',
    name: 'Successo',
    play: (ctx) => {
      const now = ctx.currentTime;
      createOscillator(ctx, 'sine', 523, now, 0.25, 0.5);
      createOscillator(ctx, 'sine', 659, now + 0.2, 0.25, 0.5);
      createOscillator(ctx, 'sine', 784, now + 0.4, 0.35, 0.5);
    }
  },
  {
    id: 'gong',
    name: 'Gong',
    play: (ctx) => {
      const now = ctx.currentTime;
      createOscillator(ctx, 'sine', 120, now, 1.5, 0.7);
      createOscillator(ctx, 'sine', 240, now, 1.2, 0.3);
      createOscillator(ctx, 'sine', 360, now, 0.8, 0.15);
    }
  }
];

export const getSoundById = (id: string): NotificationSound | undefined => {
  return NOTIFICATION_SOUNDS.find(s => s.id === id);
};

export const playNotificationSound = (soundId: string) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const sound = getSoundById(soundId);
    if (sound) {
      sound.play(ctx);
    } else {
      // Fallback to classic beep
      NOTIFICATION_SOUNDS[0].play(ctx);
    }
  } catch (e) {
    console.warn('Notification sound failed', e);
  }
};
