import { useState, useCallback } from 'react';
import { asset } from './utils/asset';
import { useWindowStore } from './store';
import type { WindowId, IconData, TrashedItem } from './types';
import { ICON_W, ICON_H } from './components/DesktopIcons';
import BootScreen from './components/BootScreen';
import Taskbar from './components/Taskbar';
import DesktopIcons from './components/DesktopIcons';
import Window from './components/Window';
import MsnToast from './components/MsnToast';
import AboutWindow from './windows/AboutWindow';
import ProjectsWindow from './windows/ProjectsWindow';
import GamesWindow from './windows/GamesWindow';
import AppsWindow from './windows/AppsWindow';
import MsnWindow from './windows/MsnWindow';
import BrowserWindow from './windows/BrowserWindow';
import RecycleWindow from './windows/RecycleWindow';
import NotepadWindow from './windows/NotepadWindow';
import FileViewerWindow from './windows/FileViewerWindow';
import ResumeWindow from './windows/ResumeWindow';

const GRID_START_X = 8;
const GRID_START_Y = 8;
const GRID_COL_STEP = ICON_W + 10;  // 82
const GRID_ROW_STEP = ICON_H + 4;   // 94
const GRID_MAX_ROWS = 8;

// ── Desktop icon config ──────────────────────────────────────────────────────
// Set hidden: true to hide an icon without removing it.
// Order here determines grid placement (top-to-bottom, then next column).
interface IconDef {
  id: WindowId;
  label: string;
  icon: string;
  iconImg?: string;
  externalUrl?: string;
  hidden?: boolean;
}

const DESKTOP_ICONS: IconDef[] = [
  { id: 'about',    label: 'About Me',        icon: '🪪' },
  { id: 'linkedIn', label: 'LinkedIn',        icon: '💼', iconImg: asset('/desktop_icons/linkedIn.png'), externalUrl: 'https://www.linkedin.com/in/ringo-chui-6603a3209/' },
  { id: 'github',   label: 'GitHub',          icon: '🐙', iconImg: asset('/desktop_icons/github.svg'),          externalUrl: 'https://github.com/RIngochui' },
  { id: 'projects', label: 'My Projects',     icon: '💾' },
  { id: 'games',    label: 'Games',           icon: '🎮', externalUrl: 'https://chewyapp1e.games', hidden: true },
  { id: 'apps',     label: 'Apps',            icon: '📦', externalUrl: 'https://chewyapp1e.apps', hidden: true },
  { id: 'browser',  label: 'Apple\nBrowser',  icon: '🌐', iconImg: asset('/desktop_icons/apple_browser.png') },
  { id: 'msn',      label: 'MSN\nMessenger',  icon: '💬', iconImg: asset('/desktop_icons/msn.png') },
  { id: 'resume',   label: 'Resume',          icon: '📄' },
  { id: 'notes',  label: 'Notes',         icon: '📝' },
];

const HIDDEN_ICON_IDS = new Set(DESKTOP_ICONS.filter(d => d.hidden).map(d => d.id));
const ICON_IMG_MAP = Object.fromEntries(
  DESKTOP_ICONS.filter(d => d.iconImg).map(d => [d.id, d.iconImg!])
) as Partial<Record<WindowId, string>>;
const EXTERNAL_URL_MAP = Object.fromEntries(
  DESKTOP_ICONS.filter(d => d.externalUrl).map(d => [d.id, d.externalUrl!])
) as Partial<Record<WindowId, string>>;

function makeInitialIcons(): IconData[] {
  const icons: IconData[] = [];
  let col = 0, row = 0;

  for (const def of DESKTOP_ICONS) {
    if (def.hidden) continue;
    icons.push({
      id: def.id,
      label: def.label,
      icon: def.icon,
      x: GRID_START_X + col * GRID_COL_STEP,
      y: GRID_START_Y + row * GRID_ROW_STEP,
      ...(def.iconImg    ? { iconImg: def.iconImg }          : {}),
      ...(def.externalUrl ? { externalUrl: def.externalUrl } : {}),
    });
    row++;
    if (row >= GRID_MAX_ROWS) { row = 0; col++; }
  }

  // Recycle bin is always pinned top-right
  icons.push({ id: 'recycle', label: 'Recycle Bin', icon: '🗑️', x: window.innerWidth - ICON_W - 16, y: GRID_START_Y });

  return icons;
}

const INITIAL_TRASHED: TrashedItem[] = [
  { id: 'file1', label: 'three_js_portfolio_v1.html', icon: '📄', originalX: 8, originalY: 8,   trashedAt: Date.now() - 900000 },
  { id: 'file2', label: 'old_resume_2019.doc',        icon: '📄', originalX: 8, originalY: 102, trashedAt: Date.now() - 600000 },
];

function findNextAvailableSlot(icons: IconData[]): { x: number; y: number } {
  for (let col = 0; col < 10; col++) {
    for (let row = 0; row < GRID_MAX_ROWS; row++) {
      const x = GRID_START_X + col * GRID_COL_STEP;
      const y = GRID_START_Y + row * GRID_ROW_STEP;
      const taken = icons.some(
        ic => Math.abs(ic.x - x) < ICON_W && Math.abs(ic.y - y) < ICON_H
      );
      if (!taken) return { x, y };
    }
  }
  return { x: GRID_START_X, y: GRID_START_Y };
}

const WALLPAPER_STYLE: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
};

interface WindowContentProps {
  id: WindowId;
  trashedItems: TrashedItem[];
  onRestore: (id: WindowId) => void;
  onEmpty: () => void;
}

function WindowContent({ id, trashedItems, onRestore, onEmpty }: WindowContentProps) {
  switch (id) {
    case 'about':    return <AboutWindow />;
    case 'projects': return <ProjectsWindow />;
    case 'games':    return <GamesWindow />;
    case 'apps':     return <AppsWindow />;
    case 'msn':      return <MsnWindow />;
    case 'browser':  return <BrowserWindow />;
    case 'recycle':  return <RecycleWindow trashedItems={trashedItems} onRestore={onRestore} onEmpty={onEmpty} />;
    case 'notes':  return <NotepadWindow />;
    case 'resume':   return <ResumeWindow />;
    case 'file1':
    case 'file2':    return <FileViewerWindow id={id} />;
    default:         return <div style={{ padding: 8 }}>Window not found</div>;
  }
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [icons, setIcons] = useState<IconData[]>(makeInitialIcons);
  const [trashedItems, setTrashedItems] = useState<TrashedItem[]>(INITIAL_TRASHED);
  const { windows, openWindow, closeWindow, minimizeWindow, focusWindow } = useWindowStore();

  const activeId = windows
    .filter(w => w.isOpen && !w.isMinimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null;

  const handleTaskbarClick = useCallback(
    (id: WindowId) => {
      const win = windows.find(w => w.id === id);
      if (!win) return;
      if (win.isMinimized || id !== activeId) focusWindow(id);
      else minimizeWindow(id);
    },
    [windows, activeId, focusWindow, minimizeWindow]
  );

  const handleTrash = useCallback((items: TrashedItem[]) => {
    setTrashedItems(prev => [...prev, ...items]);
  }, []);

  const handleRestore = useCallback((id: WindowId) => {
    const item = trashedItems.find(t => t.id === id);
    if (!item) return;
    setIcons(prev => {
      const slot = findNextAvailableSlot(prev);
      const def = DESKTOP_ICONS.find(d => d.id === item.id);
      return [...prev, { id: item.id, label: item.label, icon: item.icon, ...slot, ...(def?.iconImg ? { iconImg: def.iconImg } : {}), ...(def?.externalUrl ? { externalUrl: def.externalUrl } : {}) }];
    });
    setTrashedItems(prev => prev.filter(t => t.id !== id));
  }, [trashedItems]);

  const handleEmpty = useCallback(() => {
    setTrashedItems([]);
  }, []);

  if (!booted) {
    return <BootScreen onComplete={() => setBooted(true)} />;
  }

  return (
    <div className="desktop-wallpaper" style={{ width: '100vw', height: '100vh', ...WALLPAPER_STYLE }}>
      <div style={{ position: 'absolute', inset: '0 0 32px 0', overflow: 'hidden', touchAction: 'none' }} id="desktop">
        <DesktopIcons
          icons={icons}
          onIconsChange={setIcons}
          onTrash={handleTrash}
          onOpen={openWindow}
        />

        {windows.map(win => (
          <Window
            key={win.id}
            {...win}
            iconImg={ICON_IMG_MAP[win.id]}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
          >
            <WindowContent
              id={win.id}
              trashedItems={trashedItems}
              onRestore={handleRestore}
              onEmpty={handleEmpty}
            />
          </Window>
        ))}
      </div>

      <Taskbar windows={windows} onTaskbarClick={handleTaskbarClick} activeId={activeId} onOpen={openWindow} hiddenIds={HIDDEN_ICON_IDS} iconImgMap={ICON_IMG_MAP} externalUrlMap={EXTERNAL_URL_MAP} desktopIconIds={new Set(icons.map(i => i.id))} iconOrder={DESKTOP_ICONS.map(d => d.id)} />
      <MsnToast />
      <div id="crt-overlay" />
    </div>
  );
}
