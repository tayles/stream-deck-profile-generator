export interface HotkeyDescriptor {
  id: string;
  label: string;
  hotkey: string;
  color?: string;
  index: number;
}

export const BUTTON_STYLES = ['basic', 'border', 'rainbow'] as const;
export type ButtonStyle = typeof BUTTON_STYLES[number];

export const LABEL_STYLES = ['none', 'label', 'hotkey', 'both'] as const;
export type LabelStyle = typeof LABEL_STYLES[number];

export const LABEL_POSITIONS = ['top', 'middle', 'bottom'] as const;
export type LabelPosition = typeof LABEL_POSITIONS[number];
