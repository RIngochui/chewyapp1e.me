import { useTheme } from '../hooks/useTheme';

const PROJECTS = [
  { name: 'chewyapp1e.me',      desc: 'You are here',                      icon: '🖥️', url: '#',                                                          status: '🟢 LIVE' },
  { name: 'chewyapp1e.games',   desc: 'Homemade games',                    icon: '🎮', url: 'https://chewyapp1e.games',                                 status: '🟡 WIP' },
  { name: 'chewyapp1e.apps',    desc: 'Tools & Apps',                      icon: '📦', url: 'https://chewyapp1e.apps',                                   status: '🟡 WIP'  },
  { name: 'Self Driving Car', desc: 'Self-driving car school project',        icon: '🚗', url: 'https://www.youtube.com/watch?v=nwk44ECAk_A',               status: '🟢 LIVE' },
  { name: 'AI Battleship',      desc: 'Simple AI Battleship · Python',     icon: '🚢', url: 'https://github.com/RIngochui/BattleShipPython',             status: '🟢 LIVE' },
  { name: 'Squirrel Glider',    desc: 'Flappy Bird clone · JS/HTML/CSS',                 icon: '🐿️', url: 'https://github.com/ArmyaAli/Squirrel-Glider1012',           status: '🟢 LIVE' },
  { name: 'Music Higher Lower', desc: 'Music higher/lower guessing game · React + Typescript',  icon: '🎵', url: 'https://github.com/ArmyaAli/music-quiz',                    status: '🟢 LIVE' },
];

export default function ProjectsWindow() {
  const { blue } = useTheme();
  return (
    <div style={{ fontSize: 8 }}>
      <div className="inset-98" style={{ padding: 4, marginBottom: 8, fontSize: 7, color: blue }}>
        C:\Users\chewyapp1e\Projects\
      </div>
      {PROJECTS.map(p => (
        <div
          key={p.name}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px', borderBottom: '1px solid #808080', cursor: p.url !== '#' ? 'pointer' : 'default' }}
          onClick={() => p.url !== '#' && window.open(p.url, '_blank')}
        >
          <span style={{ fontSize: 20 }}>{p.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 2 }}>{p.name}</div>
            <div style={{ color: '#808080', fontSize: 7 }}>{p.desc}</div>
          </div>
          <div style={{ fontSize: 7 }}>{p.status}</div>
        </div>
      ))}
      <div style={{ marginTop: 8, fontSize: 7, color: '#808080' }}>
        {PROJECTS.length} object(s)
      </div>
    </div>
  );
}
