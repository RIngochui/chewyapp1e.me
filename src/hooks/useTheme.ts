import { useDarkMode } from './useDarkMode';

export function useTheme() {
  const dark = useDarkMode();

  return {
    dark,
    bg:           dark ? '#1a1a1a' : '#fff',
    bgAlt:        dark ? '#222'    : '#f8f8f8',
    bgChrome:     dark ? '#2a2a2a' : '#c0c0c0',
    bgDeep:       dark ? '#1e1e1e' : '#e8e8e8',
    bgMuted:      dark ? '#222'    : '#d4d4d4',
    text:         dark ? '#e0e0e0' : '#000',
    blue:         dark ? '#aac4ff' : '#000080',
    border:       dark ? '#333'    : '#e0e0e0',
    borderChrome: dark ? '#404040' : '#c0c0c0',
  };
}
