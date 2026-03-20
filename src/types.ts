export type WindowId =
  | 'projects'
  | 'about'
  | 'games'
  | 'apps'
  | 'msn'
  | 'browser'
  | 'recycle'
  | 'notes'
  | 'linkedIn'
  | 'github'
  | 'resume'
  | 'file1'
  | 'file2';

export interface WindowState {
  id: WindowId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  defaultPosition: { x: number; y: number };
  defaultSize?: { width: number; height: number };
}

export interface DesktopIconDef {
  id: WindowId;
  label: string;
  icon: string;
}

export interface IconData {
  id: WindowId;
  label: string;
  icon: string;
  x: number;
  y: number;
  iconImg?: string;
  externalUrl?: string;
  downloadUrl?: string;
}

export interface TrashedItem {
  id: WindowId;
  label: string;
  icon: string;
  originalX: number;
  originalY: number;
  trashedAt: number;
}
