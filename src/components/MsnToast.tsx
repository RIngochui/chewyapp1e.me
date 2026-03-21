import { useState, useEffect, useRef } from 'react';
import { asset } from '../utils/asset';

const MESSAGES = [
  { from: 'dandannyg', msg: 'aoe2 with the boys?? 🕹️' },
  { from: 'pedro_garcia_04', msg: 'Long time no see!' },
  { from: 'hakuna_matata_', msg: '你返屋企？🏠' },
  { from: 'abel', msg: 'yo thanks for the lambo' },
];

interface Toast {
  id: number;
  from: string;
  msg: string;
}

export default function MsnToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const msgIndex = useRef(0);

  useEffect(() => {
    const scheduleNext = (delay: number) => {
      return setTimeout(() => {
        const msg = MESSAGES[msgIndex.current % MESSAGES.length];
        msgIndex.current += 1;
        const id = Date.now();
        setToasts(prev => [...prev, { id, ...msg }]);

        // Remove after 5s
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);

        scheduleNext(8000 + Math.random() * 12000);
      }, delay);
    };

    const t = scheduleNext(4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {toasts.map((toast, i) => (
        <div
          key={toast.id}
          className="msn-toast"
          style={{ bottom: 40 + i * 90 }}
          onClick={() =>
            setToasts(prev => prev.filter(t => t.id !== toast.id))
          }
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 4,
              background: 'linear-gradient(to right, #1a4aaa, #3070d0)',
              color: '#fff',
              padding: '4px 6px',
              margin: '-8px -8px 6px -8px',
            }}
          >
            <img src={asset('/desktop_icons/msn.png')} alt="MSN" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
            <span style={{ fontSize: 7 }}>MSN Messenger</span>
            <span
              style={{ marginLeft: 'auto', cursor: 'pointer', fontSize: 10 }}
              onClick={e => {
                e.stopPropagation();
                setToasts(prev => prev.filter(t => t.id !== toast.id));
              }}
            >
              ✕
            </span>
          </div>
          <div style={{ fontSize: 8, marginBottom: 2, color: '#000080' }}>
            {toast.from}
          </div>
          <div style={{ fontSize: 7 }}>{toast.msg}</div>
        </div>
      ))}
    </>
  );
}
