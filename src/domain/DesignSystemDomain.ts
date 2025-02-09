export interface DesignSystemCreationPayload {
  name: string;
  folderPath: string;
  darkMode: boolean;
}

export type DesignSystemMetadataHome = DesignSystemMetadata & {
  editMode: boolean;
};

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
  base: Base;
  themes: ThemeColor[];
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

export interface Base {
  background: ColorDarkable;
  border: ColorDarkable;
  textLight: ColorDarkable;
  textDefault: ColorDarkable;
  textDark: ColorDarkable;
  backgroundDisabled: ColorDarkable;
  borderDisabled: ColorDarkable;
  textDisabled: ColorDarkable;
}

export interface DesignToken {
  label: string;
  value: string;
}

export interface ThemeColor {
  themeName: string;
  default: ThemeColorState;
  hover?: ThemeColorState;
  active?: ThemeColorState;
  focus?: ThemeColorState;
}

export type ThemeStateCategory = "default" | "hover" | "active" | "focus";

export interface ThemeColorState {
  background: ColorDarkable;
  border: ColorDarkable;
  text: ColorDarkable;
}

export type ThemeItem = "background" | "border" | "text";

export interface ColorDarkable {
  default?: string;
  dark?: string;
}

export type DarkableCategory = "default" | "dark";
