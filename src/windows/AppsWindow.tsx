const APPS = [
  { name: 'Calculator',        icon: '🔢', status: 'STABLE' },
  { name: 'Paint (HK Edition)', icon: '🎨', status: 'STABLE' },
  { name: 'WinAmp',            icon: '🎵', status: 'STABLE' },
  { name: 'ICQ Lite 2003',     icon: '📟', status: 'DEPRECATED' },
  { name: 'KazaA Lite',        icon: '📂', status: 'USE AT OWN RISK' },
];

export default function AppsWindow() {
  return (
    <div style={{ fontSize: 8 }}>
      <div className="inset-98" style={{ padding: 4, marginBottom: 8, fontSize: 7, color: '#000080' }}>
        C:\Program Files\
      </div>
      {APPS.map(a => (
        <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 4px', borderBottom: '1px solid #c0c0c0', cursor: 'pointer' }}>
          <span style={{ fontSize: 18 }}>{a.icon}</span>
          <span style={{ flex: 1 }}>{a.name}</span>
          <span style={{ fontSize: 7, color: a.status === 'STABLE' ? '#008000' : a.status === 'DEPRECATED' ? '#808080' : '#cc0000' }}>
            {a.status}
          </span>
        </div>
      ))}
    </div>
  );
}
