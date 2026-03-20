import type { WindowId } from '../types';

const FILE_CONTENT: Partial<Record<WindowId, string>> = {
  file1: `three_js_portfolio_v1.html
==========================

<!-- my first attempt at a 3D portfolio -->
<!-- 2020 - never shipped -->

STATUS: Abandoned. Moved to Recycle Bin.

NOTES:
  - Spent 3 weeks fighting OrbitControls
  - THREE.OrbitControls is not a constructor (x47)
  - outputEncoding removed in r155 ??
  - Custom orbit controls written from scratch
  - Room looked "off"
  - Lighting "off"
  - Everything "off"
  - Started over

RIP three_js_portfolio_v1.html
You tried your best.
It was not enough.`,

  file2: `old_resume_2019.doc
====================

Ringo Chui
ringochewyis@gmail.com  |  MSN: chewyapp1e

OBJECTIVE
  To obtain employment in the field of computers
  and/or internet-related technologies.

SKILLS
  - Microsoft Word (advanced)
  - Microsoft Excel (intermediate)
  - Can type 105 WPM
  - Nasty 3pt jumper
  - Good at Mario Kart
  - Super Smash Brothers (melee) - Available for local tournaments

EXPERIENCE
  2018-2019  Tim Hortons, Toronto ON
    - Made coffee
    - Sometimes made tea
    - Never made matcha (they didn't have it)

EDUCATION
  Currently enrolled. Ask later.

REFERENCES
  Available upon request (please don't ask)

---
NOTE: This resume has been superseded.
Please see LinkedIn for current version.`,
};

export default function FileViewerWindow({ id }: { id: WindowId }) {
  const content = FILE_CONTENT[id] ?? '(file contents missing)';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '2px 4px', borderBottom: '1px solid #808080', fontSize: 7, display: 'flex', gap: 8, flexShrink: 0 }}>
        <span>File</span>
        <span>Edit</span>
        <span>Help</span>
      </div>
      <textarea
        className="inset-98"
        readOnly
        style={{
          flex: 1,
          resize: 'none',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          lineHeight: 2,
          padding: 6,
          border: 'none',
          outline: 'none',
          background: '#fff',
        }}
        value={content}
        spellCheck={false}
      />
    </div>
  );
}
