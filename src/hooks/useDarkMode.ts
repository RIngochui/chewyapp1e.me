import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [dark, setDark] = useState(() => document.body.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setDark(document.body.classList.contains('dark'));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}
