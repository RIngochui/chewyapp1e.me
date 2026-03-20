import { useState } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

const DEFAULT_TEXT = `Notes
=======
TODO:
- [ ] finish the personal website
- [ ] deploy to chewyapp1e.me
- [ ] figure out why everything is broken
- [ ] order reps
- [ ] go to gym
- [ ] book basketball session
- [ ] call mum 
`;

export default function NotepadWindow() {
  const dark = useDarkMode();
  const [text, setText] = useState(DEFAULT_TEXT);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '2px 4px', borderBottom: '1px solid #808080', fontSize: 7, display: 'flex', gap: 8, flexShrink: 0 }}>
        <span>File</span>
        <span>Edit</span>
        <span>Help</span>
      </div>
      <textarea
        className="inset-98"
        style={{ flex: 1, resize: 'none', fontFamily: "'Press Start 2P', monospace", fontSize: 8, lineHeight: 2, padding: 6, border: 'none', outline: 'none', background: dark ? '#1a1a1a' : '#fff', color: dark ? '#e0e0e0' : '#000' }}
        value={text}
        onChange={e => setText(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}
