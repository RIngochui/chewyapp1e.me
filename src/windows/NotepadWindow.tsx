import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

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
  const { bg, text: fgText } = useTheme();
  const [text, setText] = useState(DEFAULT_TEXT);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="menubar-98">
        <span>File</span>
        <span>Edit</span>
        <span>Help</span>
      </div>
      <textarea
        className="inset-98"
        style={{ flex: 1, resize: 'none', fontSize: 8, lineHeight: 2, padding: 6, border: 'none', outline: 'none', background: bg, color: fgText }}
        value={text}
        onChange={e => setText(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}
