import { asset } from '../utils/asset';

export default function ResumeWindow() {
  return (
    <iframe
      src={asset('/Resume 2026.docx.pdf')}
      style={{ width: '100%', height: '100%', border: 'none' }}
      title="Resume"
    />
  );
}
