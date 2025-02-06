export interface DesignSystemCreationPayload {
  name: string;
  folderPath: string;
}

export interface DesignSystemMetadata {
  designSystemId: string;
  designSystemName: string;
  darkMode: boolean;
  designSystemPath: string;
  isTmp: boolean;
}

export interface DesignSystem {
  metadata: DesignSystemMetadata;
  palettes: Palette[];
  base: ThemeDarkable<Base>;
}

export interface Palette {
  paletteName: string;
  palettePath?: string;
  shades: Shade[];
}

export interface Shade {
  label: string;
  color: string;
}

//Used when a darkmode can exist
export interface ThemeDarkable<T> {
  default: T;
  dark?: T;
}

export interface Base {
  background: string;
  border: string;
  textLight: string;
  textDefault: string;
  textDark: string;
  backgroundDisabled: string;
  borderDisabled: string;
  textDisabled: string;
}

export interface DesignToken {
  label: string;
  value: string;
}
