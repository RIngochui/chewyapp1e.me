import { useState, useRef, useCallback, useEffect } from 'react';
import Draggable from 'react-draggable';
import type { WindowId, IconData, TrashedItem } from '../types';

export const ICON_W = 72;
export const ICON_H = 90;

const RECYCLE_ID: WindowId = 'recycle';

// Module-level nodeRef cache — avoids accessing ref.current during render
const nodeRefCache = new Map<WindowId, { current: HTMLElement | null }>();
function getNodeRef(id: WindowId) {
  if (!nodeRefCache.has(id)) nodeRefCache.set(id, { current: null });
  return nodeRefCache.get(id)!;
}

interface RubberBand {
  startX: number;
  startY: number;
  curX: number;
  curY: number;
}

interface DesktopIconsProps {
  icons: IconData[];
  onIconsChange: (icons: IconData[]) => void;
  onTrash: (items: TrashedItem[]) => void;
  onOpen: (id: WindowId) => void;
}

function rectsOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export default function DesktopIcons({ icons, onIconsChange, onTrash, onOpen }: DesktopIconsProps) {
  const [selected, setSelected] = useState<Set<WindowId>>(new Set());
  const [rubberBand, setRubberBand] = useState<RubberBand | null>(null);
  const [binHovered, setBinHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingIcon = useRef(false);
  const lastClickTime = useRef<Partial<Record<WindowId, number>>>({});
  const draggedId = useRef<WindowId | null>(null);


  // ---------- icon drag ----------
  const handleDragStart = useCallback((id: WindowId) => {
    isDraggingIcon.current = false;
    draggedId.current = id;
    setSelected(prev => (prev.has(id) ? prev : new Set([id])));
  }, []);

  const handleDrag = useCallback(
    (id: WindowId, deltaX: number, deltaY: number) => {
      isDraggingIcon.current = true;

      const updated = icons.map(ic =>
        (selected.has(ic.id) || ic.id === id) && ic.id !== RECYCLE_ID
          ? { ...ic, x: ic.x + deltaX, y: ic.y + deltaY }
          : ic
      );
      onIconsChange(updated);

      // Check if dragged icon(s) are hovering the bin
      const bin = icons.find(ic => ic.id === RECYCLE_ID);
      if (bin) {
        const moving = updated.filter(ic => (selected.has(ic.id) || ic.id === id) && ic.id !== RECYCLE_ID);
        const hovering = moving.some(ic =>
          rectsOverlap(ic.x, ic.y, ICON_W, ICON_H, bin.x, bin.y, ICON_W, ICON_H)
        );
        setBinHovered(hovering);
      }
    },
    [icons, onIconsChange, selected]
  );

  const handleDragStop = useCallback(
    (id: WindowId, finalX: number, finalY: number) => {
      setTimeout(() => { isDraggingIcon.current = false; }, 30);
      draggedId.current = null;
      setBinHovered(false);

      // Commit the definitive final position (guards against last onDrag not firing)
      const committed = icons.map(ic =>
        ic.id === id ? { ...ic, x: finalX, y: finalY } : ic
      );
      onIconsChange(committed);

      const bin = committed.find(ic => ic.id === RECYCLE_ID);
      if (!bin) return;

      const draggedIcon = committed.find(ic => ic.id === id);
      const droppedOnBin = draggedIcon && rectsOverlap(
        draggedIcon.x, draggedIcon.y, ICON_W, ICON_H,
        bin.x, bin.y, ICON_W, ICON_H
      );

      if (!droppedOnBin) return;

      const toTrash = committed.filter(
        ic => (selected.has(ic.id) || ic.id === id) && ic.id !== RECYCLE_ID
      );

      if (toTrash.length > 0) {
        const now = Date.now();
        const trashItems: TrashedItem[] = toTrash.map(ic => ({
          id: ic.id,
          label: ic.label,
          icon: ic.icon,
          originalX: ic.x,
          originalY: ic.y,
          trashedAt: now,
        }));
        const trashedIds = new Set(toTrash.map(ic => ic.id));
        onIconsChange(committed.filter(ic => !trashedIds.has(ic.id)));
        setSelected(prev => {
          const next = new Set(prev);
          trashedIds.forEach(tid => next.delete(tid));
          return next;
        });
        onTrash(trashItems);
      }
    },
    [icons, onIconsChange, onTrash, selected]
  );

  // ---------- icon click ----------
  const handleIconClick = useCallback(
    (id: WindowId, e: React.MouseEvent) => {
      if (isDraggingIcon.current) return;
      e.stopPropagation();
      const now = Date.now();
      const last = lastClickTime.current[id] ?? 0;
      if (now - last < 400) {
        lastClickTime.current[id] = 0;
        const ic = icons.find(i => i.id === id);
        if (ic?.downloadUrl) {
          const a = document.createElement('a');
          a.href = ic.downloadUrl;
          a.download = ic.downloadUrl.split('/').pop() ?? ic.label;
          a.click();
        } else if (ic?.externalUrl) {
          window.open(ic.externalUrl, '_blank');
        } else {
          onOpen(id);
        }
        return;
      }
      lastClickTime.current[id] = now;
      if (e.ctrlKey || e.metaKey) {
        setSelected(prev => {
          const next = new Set(prev);
          if (next.has(id)) { next.delete(id); } else { next.add(id); }
          return next;
        });
      } else {
        setSelected(new Set([id]));
      }
    },
    [onOpen, icons]
  );

  // ---------- rubber band ----------
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== containerRef.current) return;
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRubberBand({ startX: x, startY: y, curX: x, curY: y });
    if (!e.ctrlKey && !e.metaKey) setSelected(new Set());
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!rubberBand) return;
    const rect = containerRef.current!.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    setRubberBand(prev => prev ? { ...prev, curX, curY } : null);

    const rx = Math.min(rubberBand.startX, curX);
    const ry = Math.min(rubberBand.startY, curY);
    const rw = Math.abs(curX - rubberBand.startX);
    const rh = Math.abs(curY - rubberBand.startY);
    if (rw > 4 || rh > 4) {
      setSelected(() => {
        const next = new Set<WindowId>();
        icons.forEach(ic => {
          if (rectsOverlap(ic.x, ic.y, ICON_W, ICON_H, rx, ry, rw, rh)) next.add(ic.id);
        });
        return next;
      });
    }
  }, [rubberBand, icons]);

  const handleMouseUp = useCallback(() => {
    setRubberBand(null);
  }, []);

  useEffect(() => {
    if (!rubberBand) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [rubberBand, handleMouseMove, handleMouseUp]);

  const rbRect = rubberBand
    ? {
        left: Math.min(rubberBand.startX, rubberBand.curX),
        top: Math.min(rubberBand.startY, rubberBand.curY),
        width: Math.abs(rubberBand.curX - rubberBand.startX),
        height: Math.abs(rubberBand.curY - rubberBand.startY),
      }
    : null;

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, userSelect: 'none' }}
      onMouseDown={handleMouseDown}
    >
      {icons.map(ic => {
        const nodeRef = getNodeRef(ic.id);

        const isRecycle = ic.id === RECYCLE_ID;
        const displayIcon = isRecycle && binHovered ? '📂' : ic.icon;

        return (
          <Draggable
            key={ic.id}
            nodeRef={nodeRef}
            position={{ x: ic.x, y: ic.y }}
            onStart={() => handleDragStart(ic.id)}
            onDrag={(_, data) => handleDrag(ic.id, data.deltaX, data.deltaY)}
            onStop={(_, data) => handleDragStop(ic.id, data.x, data.y)}
            disabled={isRecycle}
          >
            <div
              ref={nodeRef as React.RefObject<HTMLDivElement>}
              className={`desktop-icon ${selected.has(ic.id) ? 'selected' : ''} ${isRecycle && binHovered ? 'bin-hover' : ''}`}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                outline: isRecycle && binHovered ? '2px solid #ff4444' : undefined,
                borderRadius: 4,
              }}
              onClick={e => handleIconClick(ic.id, e)}
              onTouchEnd={e => {
                e.preventDefault();
                if (isDraggingIcon.current) return;
                if (ic.downloadUrl) {
                  const a = document.createElement('a');
                  a.href = ic.downloadUrl;
                  a.download = ic.downloadUrl.split('/').pop() ?? ic.label;
                  a.click();
                } else if (ic.externalUrl) {
                  window.open(ic.externalUrl, '_blank');
                } else {
                  onOpen(ic.id);
                }
              }}
            >
              {ic.iconImg
                ? <img src={ic.iconImg} alt={ic.label} className="icon-img" draggable={false} style={{ width: 32, height: 32, imageRendering: 'pixelated', objectFit: 'contain' }} />
                : <span className="icon-img">{displayIcon}</span>
              }
              <span className="icon-label" style={{ whiteSpace: 'pre-line' }}>
                {ic.label}
              </span>
            </div>
          </Draggable>
        );
      })}

      {rbRect && rbRect.width > 2 && rbRect.height > 2 && (
        <div
          style={{
            position: 'absolute',
            left: rbRect.left,
            top: rbRect.top,
            width: rbRect.width,
            height: rbRect.height,
            border: '1px dashed rgba(255,255,255,0.8)',
            background: 'rgba(0, 80, 200, 0.15)',
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        />
      )}
    </div>
  );
}
