import { useDarkMode } from '../hooks/useDarkMode';

const INTERESTS = [
  '💻 Full Stack Dev', '🖥️ Building Computers', '🎨 Graphic Design',
  '⛺ Camping', '🥾 Hiking', '✈️ Travelling', '🏀 Basketball', '🏋️ Weight Lifting',
];

const LANGUAGES   = ['Python', 'Elixir', 'TypeScript', 'JavaScript', 'SQL', 'C', 'C#', 'Java'];
const BACKEND_FE  = ['Node.js', 'Express', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'gRPC', 'Kafka', 'Oban', 'React', 'Phoenix LiveView'];
const TOOLS       = ['Kubernetes', 'Docker', 'ArgoCD', 'GitHub Actions', 'CircleCI', 'Datadog', 'Splunk', 'Git', 'Atlassian'];

function Tags({ items, color }: { items: string[]; color: string }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
      {items.map(t => (
        <span
          key={t}
          className="btn-98"
          style={{ fontSize: 7, padding: '2px 5px', color, cursor: 'default' }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export default function AboutWindow() {
  const dark = useDarkMode();
  const blue = dark ? '#aac4ff' : '#000080';
  return (
    <div style={{ fontSize: 8, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <img
          src="/display_picture.jpg"
          alt="chewyapp1e"
          style={{ width: 56, height: 56, objectFit: 'cover', border: '2px solid #808080', flexShrink: 0 }}
        />
          <div style={{ lineHeight: 2 }}>
            <div style={{ fontSize: 11 }}>chewyapp1e</div>
            <div style={{ color: blue }}>Software Developer · Toronto, ON</div>
            <div style={{ color: '#808080', fontSize: 7 }}>3+ yrs · Penn Entertainment / theScore</div>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="inset-98" style={{ padding: '6px 8px', fontSize: 7, lineHeight: 2.2 }}>
        <div>🎓 BSc Computer Science · York University</div>
        <div>🎓 Advanced Diploma Computer Engineering · Seneca College</div>
      </div>

      {/* Bio */}
      <div style={{ lineHeight: 2.2 }}>
        <div style={{ color: blue, marginBottom: 2 }}>// bio</div>
        <div>▸ Care about clear comms, mentoring, and making life easier for users &amp; teammates.</div>
        <div>▸ Building reliable, user-focused systems in fast-paced product teams.</div>
        <div>▸ Designed an in-house CMS &amp; shipped tools that saved devs <span style={{ color: blue }}>50+ hrs/yr</span>.</div>
        <div>▸ Helped launch a standalone casino app that hit <span style={{ color: blue }}>#2 in category</span>.</div>
        <div>▸ Own problems end to end: scoping → shipping → on-call.</div>
      </div>

      {/* Interests */}
      <div>
        <div style={{ color: blue, marginBottom: 2 }}>// interests</div>
        <Tags items={INTERESTS} color={dark ? '#e0e0e0' : '#000'} />
      </div>

      {/* Skills */}
      <div>
        <div style={{ color: blue, marginBottom: 4 }}>// familiar with</div>

        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 7, color: '#808080', marginBottom: 2 }}>Languages</div>
          <Tags items={LANGUAGES} color={dark ? '#e0e0e0' : '#000'} />
        </div>

        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 7, color: '#808080', marginBottom: 2 }}>Backend &amp; Frontend</div>
          <Tags items={BACKEND_FE} color={dark ? '#e0e0e0' : '#000'} />
        </div>

        <div>
          <div style={{ fontSize: 7, color: '#808080', marginBottom: 2 }}>Monitoring &amp; Tools</div>
          <Tags items={TOOLS} color={dark ? '#e0e0e0' : '#000'} />
        </div>
      </div>
    </div>
  );
}
