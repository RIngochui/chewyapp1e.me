import { useState, useEffect, useRef } from 'react';
import { asset } from '../utils/asset';
import type { WindowState, WindowId } from '../types';

interface TaskbarProps {
  windows: WindowState[];
  onTaskbarClick: (id: WindowId) => void;
  activeId: WindowId | null;
  onOpen: (id: WindowId) => void;
  hiddenIds: Set<WindowId>;
  iconImgMap: Partial<Record<WindowId, string>>;
  externalUrlMap: Partial<Record<WindowId, string>>;
  desktopIconIds: Set<WindowId>;
  iconOrder: WindowId[];
}

export default function Taskbar({ windows, onTaskbarClick, activeId, onOpen, hiddenIds, iconImgMap, externalUrlMap, desktopIconIds, iconOrder }: TaskbarProps) {
  const [time, setTime] = useState(() => new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Focus search input when menu opens
  useEffect(() => {
    if (menuOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [menuOpen]);

  const openWindows = windows.filter(w => w.isOpen);

  const timeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // All searchable items (exclude recycle bin)
  const searchable = iconOrder
    .map(id => windows.find(w => w.id === id))
    .filter((w): w is WindowState => !!w && w.id !== 'recycle' && w.id !== 'file1' && w.id !== 'file2' && !hiddenIds.has(w.id) && desktopIconIds.has(w.id));
  const results = query.trim()
    ? searchable.filter(w => w.title.toLowerCase().includes(query.toLowerCase()))
    : searchable;

  const handleResultClick = (id: WindowId) => {
    const ext = externalUrlMap[id];
    if (ext) { window.open(ext, '_blank'); }
    else { onOpen(id); }
    setMenuOpen(false);
    setQuery('');
  };

  return (
    <div className="taskbar">
      {/* Start menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            bottom: 32,
            left: 0,
            width: 220,
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            boxShadow: '2px 2px 0 #000',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header strip */}
          <div style={{
            background: 'linear-gradient(to bottom, #000080, #1084d0)',
            color: '#fff',
            padding: '8px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 9,
          }}>
            <img src={asset('/display_picture.jpg')} alt="" style={{ width: 28, height: 28, objectFit: 'cover', border: '1px solid #aad4ff' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <span>chewyapp1e</span>
          </div>

          {/* Search box */}
          <div style={{ padding: '6px 8px', borderBottom: '1px solid #808080' }}>
            <div className="inset-98" style={{ display: 'flex', alignItems: 'center', padding: '2px 4px', gap: 4 }}>
              <span style={{ fontSize: 8 }}>🔍</span>
              <input
                ref={inputRef}
                className="input-98"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                style={{ fontSize: 7 }}
              />
            </div>
          </div>

          {/* Results */}
          <div style={{ maxHeight: 260, overflowY: 'auto' }}>
            {results.length === 0 && (
              <div style={{ padding: '8px', fontSize: 7, color: '#808080', textAlign: 'center' }}>
                No results
              </div>
            )}
            {results.map(w => (
              <div
                key={w.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 10px',
                  fontSize: 8,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#000080'; (e.currentTarget as HTMLDivElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.color = '#000'; }}
                onClick={() => handleResultClick(w.id)}
              >
                {iconImgMap[w.id]
                  ? <img src={iconImgMap[w.id]} alt="" style={{ width: 16, height: 16, imageRendering: 'pixelated', objectFit: 'contain' }} />
                  : <span style={{ fontSize: 14 }}>{w.icon}</span>
                }
                <span>{w.title}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid #808080', padding: '4px 8px', fontSize: 7, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn-98"
              style={{ fontSize: 7, padding: '2px 6px' }}
              onClick={() => setDarkMode(d => !d)}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <span style={{ color: '#808080' }}>ChewyOS v1.0</span>
          </div>
        </div>
      )}

      <button
        className={`start-btn ${menuOpen ? 'active' : ''}`}
        onClick={() => { setMenuOpen(v => !v); setQuery(''); }}
      >
        <img src={asset('/chewyOS.png')} alt="ChewyOS" style={{ width: 16, height: 16, imageRendering: 'pixelated' }} />
        <span>Start</span>
      </button>

      <div className="taskbar-divider" />

      {openWindows.map(w => (
        <button
          key={w.id}
          className={`taskbar-btn ${activeId === w.id && !w.isMinimized ? 'active' : ''}`}
          onClick={() => onTaskbarClick(w.id)}
          title={w.title}
        >
          <span>{w.icon}</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
            {w.title}
          </span>
        </button>
      ))}

      <div className="taskbar-clock" title={time.toLocaleDateString()}>
        {timeStr}
      </div>
    </div>
  );
}
