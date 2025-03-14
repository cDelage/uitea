export interface DesignSystem {
  metadata: DesignSystemMetadata;
  palettes: Palette[];
  base: Base;
  themes: ThemeColor[];
  fonts: Fonts;
  typography: Typography;
  spaces: Space[];
  radius: Radius;
  effects: Effect[];
}

export interface DesignSystemCreationPayload {
  name: string;
  folderPath: string;
  darkMode: boolean;
  banner?: string;
  logo?:string;
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
  canUndo: boolean;
  canRedo: boolean;
  banner: string;
  logo: string;
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

export interface Fonts {
  default: string;
  additionals: AdditionalFont[];
}

export interface AdditionalFont {
  fontName: string;
  value: string;
}

export interface Typography {
  paragraph: TypographyScale;
  h1: TypographyScale;
  h2: TypographyScale;
  h3: TypographyScale;
  h4: TypographyScale;
  h5: TypographyScale;
  h6: TypographyScale;
  small: TypographyScale;
  strong: TypographyScale;
  additionalsScales: AdditionalTypographyScale[];
}

export interface AdditionalTypographyScale {
  scaleName: string;
  scale: TypographyScale;
}

export interface TypographyScale {
  fontSize: string;
  lineHeight: string;
  fontWeight: FontWeight;
  letterSpacing: TypographySpacing;
  wordSpacing: TypographySpacing;
  fontStyle: FontStyle;
  textTransform: TextTransform;
  textDecoration: TextDecoration;
  padding: string;
  margin: string;
}

export type DefaultTypography =
  | "paragraph"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "small"
  | "strong";

export type TypographyScaleFieldPath =
  | DefaultTypography
  | `additionalsScales.${number}.scale`;

export type FontStyle = "normal" | "italic" | "oblique";
export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";
export type TextDecoration = "none" | "underline" | "overline" | "line-through";
export type FontWeight =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";
export type TypographySpacing =
  | "-0.05em"
  | "-0.02em"
  | "0em"
  | "0.1em"
  | "0.2em"
  | "0.3em";

export interface Space {
  spaceKey: string;
  spaceValue: string;
}

export interface Radius {
  default: string;
  additionalsRadius: RadiusItem[];
}

export interface RadiusItem {
  radiusKey: string;
  radiusValue: string;
}

export interface Effect {
  effectName: string;
  items: EffectItem[];
  bg?: string;
}

export interface EffectItem {
  effectType: EffectType;
  effectValue: string;
}

export type EffectType = "BoxShadow" | "Blur" | "BackdropFilter";
