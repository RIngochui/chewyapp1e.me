import { useRef, memo, type ReactNode } from 'react';
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

  if (!isOpen || isMinimized) return null;

  const width = defaultSize?.width ?? 400;
  const height = defaultSize?.height ?? 300;

  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      handle=".title-bar"
      defaultPosition={defaultPosition}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className="window-98"
        style={{ zIndex, width, height }}
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
              title="Minimize"
            >
              _
            </button>
            <button
              className="title-btn"
              title="Maximize"
            >
              □
            </button>
            <button
              className="title-btn"
              onClick={() => onClose(id)}
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
      </div>
    </Draggable>
  );
});

export default Window;
