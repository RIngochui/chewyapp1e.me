import type { TrashedItem, WindowId } from '../types';
import { useTheme } from '../hooks/useTheme';

interface RecycleWindowProps {
  trashedItems: TrashedItem[];
  onRestore: (id: WindowId) => void;
  onEmpty: () => void;
}

export default function RecycleWindow({ trashedItems, onRestore, onEmpty }: RecycleWindowProps) {
  const { bg, bgAlt, border } = useTheme();
  return (
    <div style={{ fontSize: 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 8, padding: 4, flexShrink: 0 }}>
        <button className="btn-98" onClick={onEmpty} disabled={trashedItems.length === 0}>
          Empty Recycle Bin
        </button>
        <span style={{ fontSize: 7, color: '#808080', display: 'flex', alignItems: 'center' }}>
          {trashedItems.length} item(s)
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px', gap: 4, padding: '2px 4px', borderBottom: '1px solid #808080', fontSize: 7, color: '#404040', flexShrink: 0 }}>
        <span>Name</span>
        <span>Type</span>
        <span>Action</span>
      </div>

      <div className="inset-98" style={{ flex: 1, overflow: 'auto', padding: 2 }}>
        {trashedItems.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, color: '#808080' }}>
            <span style={{ fontSize: 32 }}>🗑️</span>
            <div>Recycle Bin is empty</div>
          </div>
        ) : (
          trashedItems.map((item, i) => (
            <div
              key={`${item.id}-${item.trashedAt}`}
              style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px', gap: 4, alignItems: 'center', padding: '4px', borderBottom: `1px solid ${border}`, background: i % 2 === 0 ? bg : bgAlt }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                <span>{item.icon}</span>
                <span style={{ fontSize: 7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.label.split('\n')[0]}
                </span>
              </div>
              <span style={{ fontSize: 6, color: '#808080' }}>
                {item.label.includes('.') ? item.label.split('.').pop()?.toUpperCase() : 'Item'}
              </span>
              <button className="btn-98" style={{ fontSize: 6, padding: '2px 4px' }} onClick={() => onRestore(item.id)}>
                Restore
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '2px 6px', fontSize: 7, color: '#808080', flexShrink: 0 }}>
        Recycle Bin
      </div>
    </div>
  );
}
