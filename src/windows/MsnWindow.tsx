import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { asset } from '../utils/asset';


const CONTACTS = [
  { name: 'dandannyg',       status: 'online',  msg: 'gamingg 🎮', url: null },
  { name: 'pedro_garcia_04', status: 'dnd',     msg: 'eating 🥣', url: null },
  { name: 'hakuna_matata_',  status: 'offline', msg: '話唔關心嘅人，係最關心嘅', url: null },
  { name: 'abel',      status: 'offline', msg: '"I ain\'t scared of the fall I felt the ground before"',  url: 'https://www.instagram.com/gene.hackerman/' },
];

type MyStatus = 'online' | 'away' | 'dnd' | 'offline';

const STATUS_OPTIONS: { value: MyStatus; label: string; icon: string; color: string }[] = [
  { value: 'online',  label: 'Online',         icon: '🟢', color: '#00aa00' },
  { value: 'away',    label: 'Away',           icon: '🟡', color: '#cc8800' },
  { value: 'dnd',     label: 'Do Not Disturb', icon: '🔴', color: '#cc0000' },
  { value: 'offline', label: 'Appear Offline', icon: '⚫', color: '#808080' },
];

const contactStatusIcon: Record<string, string> = {
  online: '🟢',
  away: '🟡',
  dnd: '🔴',
  offline: '⚫',
};

export default function MsnWindow() {
  const { dark, blue, text, bgChrome, bgDeep, border, borderChrome } = useTheme();
  const [myStatus, setMyStatus] = useState<MyStatus>('away');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const current = STATUS_OPTIONS.find(s => s.value === myStatus)!;

  return (
    <div style={{ fontSize: 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* My status header */}
      <div
        style={{
          background: 'linear-gradient(to right, #1a4aaa, #3070d0)',
          color: '#fff',
          padding: '8px',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <img
          src={asset('/display_picture.jpg')}
          alt="chewyapp1e"
          style={{ width: 32, height: 32, objectFit: 'cover', border: '1px solid #aad4ff', flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold' }}>chewyapp1e</div>
          {/* Clickable status */}
          <div
            style={{ fontSize: 7, color: '#aad4ff', marginTop: 2, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            onClick={() => setShowStatusMenu(v => !v)}
          >
            <span>{current.icon}</span>
            <span style={{ color: current.value === 'dnd' ? '#ff8888' : '#aad4ff' }}>
              {current.label}
            </span>
            <span style={{ fontSize: 6 }}>▼</span>
          </div>
        </div>

        {/* Status dropdown */}
        {showStatusMenu && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 8,
              background: '#c0c0c0',
              border: '1px solid #404040',
              borderTop: '1px solid #ffffff',
              borderLeft: '1px solid #ffffff',
              zIndex: 100,
              minWidth: 160,
            }}
          >
            {STATUS_OPTIONS.map(opt => (
              <div
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 8px',
                  cursor: 'pointer',
                  background: myStatus === opt.value ? '#000080' : 'transparent',
                  color: myStatus === opt.value ? '#fff' : '#000',
                  fontSize: 7,
                }}
                onMouseEnter={e => { if (myStatus !== opt.value) (e.currentTarget as HTMLDivElement).style.background = '#0000aa'; (e.currentTarget as HTMLDivElement).style.color = '#fff'; }}
                onMouseLeave={e => { if (myStatus !== opt.value) { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.color = '#000'; } }}
                onClick={() => { setMyStatus(opt.value); setShowStatusMenu(false); }}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status message */}
      <div
        style={{
          background: dark
            ? (myStatus === 'dnd' ? '#3a1a1a' : '#2a2a1a')
            : (myStatus === 'dnd' ? '#ffe0e0' : '#ffffcc'),
          border: `1px solid ${myStatus === 'dnd' ? '#cc0000' : (dark ? '#666600' : '#cccc00')}`,
          padding: '6px',
          fontSize: 7,
          flexShrink: 0,
          fontStyle: 'italic',
          color: myStatus === 'dnd' ? (dark ? '#ff8888' : '#880000') : (dark ? '#d0d0a0' : undefined),
        }}
      >
        {myStatus === 'dnd'
          ? '🔴 Do Not Disturb'
          : '"Trying hard pushes others to try harder — nonchalance kills growth."'}
      </div>

      {/* Contacts */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div
          style={{
            padding: '4px 6px',
            background: bgChrome,
            fontSize: 7,
            borderBottom: `1px solid ${borderChrome}`,
          }}
        >
          Contacts ({CONTACTS.filter(c => c.status === 'online').length} online)
        </div>
        {CONTACTS.map(c => (
          <div
            key={c.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 6px',
              borderBottom: `1px solid ${border}`,
              cursor: c.url ? 'pointer' : 'default',
            }}
            onClick={() => c.url && window.open(c.url, '_blank')}
          >
            <span>{contactStatusIcon[c.status]}</span>
            <div>
              <div style={{ color: c.url ? blue : text, fontSize: 8, textDecoration: c.url ? 'underline' : 'none' }}>{c.name}</div>
              {c.msg && (
                <div style={{ color: '#808080', fontSize: 7 }}>{c.msg}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: '4px 6px',
          background: bgDeep,
          fontSize: 7,
          color: '#808080',
          flexShrink: 0,
        }}
      >
        MSN Messenger 6.7
      </div>
    </div>
  );
}
