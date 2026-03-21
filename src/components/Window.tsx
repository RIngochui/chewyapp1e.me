import { useRef, useEffect, useState, memo, type ReactNode } from 'react';
import Draggable from 'react-draggable';
import type { WindowId } from '../types';

interface WindowProps {
  id: WindowId;
  title: string;
  icon: string;
  iconImg?: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  defaultPosition: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  onClose: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onFocus: (id: WindowId) => void;
  children: ReactNode;
}

const MIN_W = 200;
const MIN_H = 120;

const Window = memo(function Window({
  id,
  title,
  icon,
  iconImg,
  isOpen,
  isMinimized,
  zIndex,
  defaultPosition,
  defaultSize,
  onClose,
  onMinimize,
  onFocus,
  children,
}: WindowProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(() => defaultSize ?? { width: 400, height: 300 });
  const [isMaximized, setIsMaximized] = useState(false);
  const preMaxSize = useRef(size);
  const resizing = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);

  // Global move/up listeners for resize drag
  useEffect(() => {
    const onMove = (clientX: number, clientY: number) => {
      if (!resizing.current) return;
      const { startX, startY, startW, startH } = resizing.current;
      setSize({
        width:  Math.max(MIN_W, startW + clientX - startX),
        height: Math.max(MIN_H, startH + clientY - startY),
      });
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (!resizing.current) return;
      e.preventDefault();
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onUp = () => { resizing.current = null; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  if (!isOpen || isMinimized) return null;

  const handleMaximize = () => {
    preMaxSize.current = size;
    setIsMaximized(true);
  };

  const handleRestore = () => {
    setSize(preMaxSize.current);
    setIsMaximized(false);
  };

  const onResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    resizing.current = { startX: clientX, startY: clientY, startW: size.width, startH: size.height };
  };

  const windowDiv = (
    <div
      ref={nodeRef}
      className="window-98"
      style={
        isMaximized
          ? { zIndex, position: 'fixed', inset: '0 0 32px 0', width: '100%', height: 'calc(100vh - 32px)' }
          : { zIndex, width: size.width, height: size.height }
      }
      onMouseDown={() => onFocus(id)}
    >
      <div className="title-bar">
        <span className="title-bar-title">
          {iconImg
            ? <img src={iconImg} alt="" draggable={false} style={{ width: 14, height: 14, imageRendering: 'pixelated', objectFit: 'contain' }} />
            : <span>{icon}</span>
          }
          <span>{title}</span>
        </span>
        <div className="title-bar-controls">
          <button
            className="title-btn"
            onClick={() => onMinimize(id)}
            onTouchEnd={e => { e.preventDefault(); onMinimize(id); }}
            title="Minimize"
          >
            _
          </button>
          <button
            className="title-btn"
            onClick={isMaximized ? handleRestore : handleMaximize}
            onTouchEnd={e => { e.preventDefault(); isMaximized ? handleRestore() : handleMaximize(); }}
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button
            className="title-btn"
            onClick={() => onClose(id)}
            onTouchEnd={e => { e.preventDefault(); onClose(id); }}
            title="Close"
            style={{ fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      </div>
      <div className="window-body" style={{ padding: '8px' }}>
        {children}
      </div>
      {!isMaximized && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 16,
            height: 16,
            cursor: 'se-resize',
            // Win98-style resize grip: two diagonal lines in corner
            background: 'linear-gradient(135deg, transparent 30%, #808080 30%, #808080 40%, transparent 40%, transparent 60%, #808080 60%, #808080 70%, transparent 70%)',
          }}
          onMouseDown={onResizeStart}
          onTouchStart={onResizeStart}
        />
      )}
    </div>
  );

  if (isMaximized) return windowDiv;

  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      handle=".title-bar"
      defaultPosition={defaultPosition}
      bounds="parent"
    >
      {windowDiv}
    </Draggable>
  );
});

export default Window;
