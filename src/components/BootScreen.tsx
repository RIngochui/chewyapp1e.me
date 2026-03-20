import { useState, useEffect } from 'react';
import { asset } from '../utils/asset';

interface BootScreenProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  'CHEWYOS v2.0.3 (c) 1999–2003.',
  '徐譽聰科技有限公司 · Chewyapp1e Technology Co., Ltd.',
  '',
  'Checking memory... 640K OK',
  'Loading CONFIG.SYS...',
  'Loading AUTOEXEC.BAT...',
  'Initializing Sound Blaster 67 Pro...',
  'Mounting C:\\ ... OK',
  'Loading ChewyOS 99 xP...',
  '',
  'Welcome to CHEWYOS',
  '歡迎使用 CHEWYOS',
];

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'text' | 'bar' | 'xp'>('text');
  const [xpProgress, setXpProgress] = useState(0);

  useEffect(() => {
    if (phase !== 'text') return;

    if (visibleLines < BOOT_LINES.length) {
      const delay = BOOT_LINES[visibleLines] === '' ? 80 : 120 + Math.random() * 80;
      const t = setTimeout(() => setVisibleLines(v => v + 1), delay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase('bar'), 400);
      return () => clearTimeout(t);
    }
  }, [visibleLines, phase]);

  useEffect(() => {
    if (phase !== 'bar') return;
    if (progress < 100) {
      const t = setTimeout(() => setProgress(p => Math.min(100, p + 4)), 60);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase('xp'), 300);
      return () => clearTimeout(t);
    }
  }, [progress, phase]);

  useEffect(() => {
    if (phase !== 'xp') return;
    if (xpProgress < 100) {
      const t = setTimeout(() => setXpProgress(p => Math.min(100, p + 2)), 40);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(onComplete, 300);
      return () => clearTimeout(t);
    }
  }, [xpProgress, phase, onComplete]);

  if (phase === 'xp') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#1c44a3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          fontFamily: "'Press Start 2P', monospace",
          color: '#fff',
        }}
      >
        <img src={asset('/chewyOS.png')} alt="ChewyOS" style={{ width: 80, height: 80, marginBottom: 12, imageRendering: 'pixelated' }} />
        <div style={{ fontSize: 18, marginBottom: 4, letterSpacing: 2 }}>ChewyOS</div>
        <div style={{ fontSize: 10, color: '#aad4ff', marginBottom: 32 }}>99 xP Professional</div>
        <div
          style={{
            width: 200,
            height: 12,
            background: '#0a2860',
            borderRadius: 6,
            overflow: 'hidden',
            border: '1px solid #4488cc',
          }}
        >
          <div
            style={{
              width: `${xpProgress}%`,
              height: '100%',
              background: 'linear-gradient(to right, #2a6cc4, #5599dd)',
              borderRadius: 6,
              transition: 'width 0.04s linear',
            }}
          />
        </div>
        <div style={{ fontSize: 7, marginTop: 16, color: '#aad4ff' }}>
          Starting up...
        </div>
      </div>
    );
  }

  return (
    <div className="boot-screen">
      <div className="boot-text">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} style={{ minHeight: '1.2em' }}>
            {line || '\u00a0'}
          </div>
        ))}
        {phase === 'text' && visibleLines < BOOT_LINES.length && (
          <span style={{ animation: 'none' }}>▌</span>
        )}
      </div>
      {phase === 'bar' && (
        <div className="boot-bar-container">
          <div className="boot-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
