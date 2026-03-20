const GAMES = [
  { name: 'Frogger 2003 HK Edition', icon: '🐸', status: 'PLAYABLE' },
  { name: 'Mahjong',                  icon: '🀄', status: 'PLAYABLE' },
  { name: 'Snake (Nokia Version)',    icon: '🐍', status: 'COMING SOON' },
  { name: 'Neopets Clone (WIP)',      icon: '🐾', status: 'WIP' },
  { name: 'ICQ Pong',                 icon: '🏓', status: 'BROKEN' },
];

export default function GamesWindow() {
  return (
    <div style={{ fontSize: 8 }}>
      <div className="inset-98" style={{ padding: 4, marginBottom: 8, fontSize: 7, color: '#000080' }}>
        C:\Games\
      </div>
      {GAMES.map(g => (
        <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 4px', borderBottom: '1px solid #c0c0c0', cursor: 'pointer' }}>
          <span style={{ fontSize: 18 }}>{g.icon}</span>
          <span style={{ flex: 1 }}>{g.name}</span>
          <span style={{ fontSize: 7, color: g.status === 'PLAYABLE' ? '#008000' : g.status === 'BROKEN' ? '#cc0000' : '#808000' }}>
            {g.status}
          </span>
        </div>
      ))}
      <div style={{ marginTop: 10, padding: 4, background: '#ffffcc', border: '1px solid #808000', fontSize: 7 }}>
        ⚠️ Some games may be corrupted
      </div>
    </div>
  );
}
