import { useState, useCallback } from 'react';
import type { WindowId, WindowState } from './types';

const INITIAL_WINDOWS: WindowState[] = [
  { id: 'projects', title: 'My Projects',    icon: '💾', isOpen: false, isMinimized: false, zIndex: 1, defaultPosition: { x: 80,  y: 60  }, defaultSize: { width: 520, height: 380 } },
  { id: 'about',    title: 'About Me',       icon: '🪪', isOpen: false, isMinimized: false, zIndex: 1, defaultPosition: { x: 120, y: 80  }, defaultSize: { width: 460, height: 340 } },
  { id: 'linkedIn', title: 'LinkedIn',       icon: '💼', isOpen: false, isMinimized: false, zIndex: 1, defaultPosition: { x: 160, y: 100 }, defaultSize: { width: 400, height: 300 } },
  { id: 'github',   title: 'GitHub',         icon: '🐙', isOpen: false, isMinimized: false, zIndex: 1, defaultPosition: { x: 160, y: 100 }, defaultSize: { width: 400, height: 300 } },
  { id: 'games',    title: 'Games',          icon: '🎮', isOpen: false, isMinimized: false, zIndex: 1, defaultPosition: { x: 160, y: 100 }, defaultSize: { width: 400, height: 300 } },
  { id: 'apps',     title: 'Apps',           icon: '📦', isOpen: false, isMinimized: false, zIndex: 1, defaultPosition: { x: 200, y: 80  }, defaultSize: { width: 400, height: 300 } },
  { id: 'msn',      title: 'MSN Messenger',  icon: '💬', isOpen: false, isMinimized: false, zIndex: 1, defaultPosition: { x: 300, y: 60  }, defaultSize: { width: 280, height: 420 } },
  { id: 'browser',  title: 'Apple Browser',  icon: '🌐', isOpen: false, isMinimized: false, zIndex: 1, defaultPosition: { x: 100, y: 40  }, defaultSize: { width: 640, height: 460 } },
  { id: 'recycle',  title: 'Recycle Bin',    icon: '🗑️', isOpen: false, isMinimized: false, zIndex: 1, defaultPosition: { x: 250, y: 120 }, defaultSize: { width: 380, height: 280 } },
  { id: 'notes',  title: 'Notes',        icon: '📝', isOpen: false, isMinimized: false, zIndex: 1, defaultPosition: { x: 180, y: 70  }, defaultSize: { width: 400, height: 300 } },
  { id: 'resume',   title: 'Resume',                    icon: '📄', isOpen: false, isMinimized: false, zIndex: 1, defaultPosition: { x: 100, y: 60  }, defaultSize: { width: 600, height: 520 } },
  { id: 'file1',    title: 'three_js_portfolio_v1.html', icon: '📄', isOpen: false, isMinimized: false, zIndex: 1, defaultPosition: { x: 140, y: 90  }, defaultSize: { width: 420, height: 300 } },
  { id: 'file2',    title: 'old_resume_2019.doc',        icon: '📄', isOpen: false, isMinimized: false, zIndex: 1, defaultPosition: { x: 160, y: 110 }, defaultSize: { width: 420, height: 320 } },
];

let topZIndex = 10;

export function useWindowStore() {
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);

  const openWindow = useCallback((id: WindowId) => {
    topZIndex += 1;
    const z = topZIndex;
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: z } : w)
    );
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isOpen: false } : w)));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w)));
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    topZIndex += 1;
    const z = topZIndex;
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: z } : w)
    );
  }, []);

  return { windows, openWindow, closeWindow, minimizeWindow, focusWindow };
}
