import { SliderStyles } from "rc-slider/lib/interface";
import {
  CustomTypographyScale,
  DefaultTypography,
  Effect,
  EffectType,
  FontStyle,
  FontWeight,
  Palette,
  PresetSpaces,
  RecommandationContrastPayload,
  TextDecoration,
  TextTransform,
  TypographySpacing,
} from "../domain/DesignSystemDomain";
import { CSSProperties } from "styled-components";

export const ICON_SIZE_XS = "12";
export const ICON_SIZE_SM = "16";
export const ICON_SIZE_MD = "20";
export const ICON_SIZE_LG = "24";
export const ICON_SIZE_XL = "32";
export const ICON_SIZE_XXL = "52";

export const DEFAULT_PALETTE: Palette = {
  paletteName: "palette-1",
  tints: [
    {
      label: "50",
      color: "#DDDDDD",
    },
    {
      label: "100",
      color: "#DDDDDD",
    },
    {
      label: "200",
      color: "#DDDDDD",
    },
    {
      label: "300",
      color: "#DDDDDD",
    },
    {
      label: "400",
      color: "#DDDDDD",
    },
    {
      label: "500",
      color: "#DDDDDD",
    },
    {
      label: "600",
      color: "#DDDDDD",
    },
    {
      label: "700",
      color: "#DDDDDD",
    },
    {
      label: "800",
      color: "#DDDDDD",
    },
    {
      label: "900",
      color: "#DDDDDD",
    },
    {
      label: "950",
      color: "#DDDDDD",
    },
  ],
};

export const FONT_WEIGHTS: FontWeight[] = [
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
];

export const TYPOGRAPHY_SPACING: TypographySpacing[] = [
  "-1em",
  "-0.9em",
  "-0.8em",
  "-0.7em",
  "-0.6em",
  "-0.5em",
  "-0.4em",
  "-0.3em",
  "-0.2em",
  "-0.1em",
  "-0.09em",
  "-0.08em",
  "-0.07em",
  "-0.06em",
  "-0.05em",
  "-0.02em",
  "0em",
  "0.02em",
  "0.05em",
  "0.06em",
  "0.07em",
  "0.08em",
  "0.09em",
  "0.1em",
  "0.2em",
  "0.3em",
  "0.4em",
  "0.5em",
  "0.6em",
  "0.7em",
  "0.8em",
  "0.9em",
  "1em",
];

export const FONT_STYLES: FontStyle[] = ["normal", "italic", "oblique"];

export const TEXT_TRANSFORMS: TextTransform[] = [
  "none",
  "lowercase",
  "uppercase",
  "capitalize",
];

export const TEXT_DECORATIONS: TextDecoration[] = [
  "none",
  "overline",
  "underline",
  "line-through",
];

export const DEFAULT_TYPOGRAPHY_SCALE: CustomTypographyScale = {
  scaleName: "additional-1",
  scale: {
    fontSize: {
      value: 16,
      unit: "PX",
    },
    lineHeight: {
      value: 16,
      unit: "PX",
    },
    fontWeight: "400",
    letterSpacing: "0em",
    wordSpacing: "0em",
    fontStyle: "normal",
    textTransform: "none",
    textDecoration: "none",
    padding: {
      value: 0,
      unit: "PX",
    },
    margin: {
      value: 0,
      unit: "PX",
    },
  },
};

export const DEFAULT_TYPOGRAPHIES: DefaultTypography[] = [
  "root",
  "paragraph",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "small",
];

export const DEFAULT_EFFECT: Effect = {
  effectName: "shadow",
  items: [
    {
      effectType: "BoxShadow",
      effectValue: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px",
    },
    {
      effectType: "BoxShadow",
      effectValue: "rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
    },
  ],
};

export const EFFECT_TYPES: EffectType[] = [
  "BoxShadow",
  "BackdropFilter",
  "Blur",
];

export const WEB_SAFE_FONTS: string[] = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Times",
  "Courier New",
  "Courier",
  "Verdana",
  "Georgia",
  "Palatino",
  "Garamond",
  "Bookman",
  "Trebuchet MS",
  "Arial Black",
  "Impact",
  "Comic Sans MS",
  "ui-sans-serif",
  "system-ui",
  "sans-serif",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
  "Noto Color Emoji",
  "Droid Sans",
  "Chilanka",
  "Roboto",
];

export const SLIDER_STYLE: SliderStyles = {
  handle: {
    backgroundColor: "var(--uidt-palette-primary-800)",
    border: "white 2px solid",
    boxShadow: "var(--uidt-shadow-md)",
  },
  rail: {
    backgroundColor: "var(--uidt-palette-gray-300)",
  },
  track: {
    backgroundColor: "var(--uidt-palette-primary-300)",
  },
};

export const PALETTE_BUILDER_DEFAULT_SETTINGS = {
  startLuminance: 95,
  endLuminance: 5,
  minSaturation: 50,
  maxSaturation: 100,
  hueCorrectionGap: 5,
  hueCorrectionActive: true,
  steps: 11,
};

export const HANDLE_SLIDER_HORIZONTAL: CSSProperties = {
  opacity: 1,
  borderRadius: "2px",
  height: "24px",
  width: "10px",
  boxShadow: "var(--uidt-shadow-md)",
  border: "var(--uidt-base-border) 1px solid",
  bottom: 0,
};

export const RAIL_SLIDER_HORIZONTAL: CSSProperties = {
  height: "16px",
  borderRadius: "4px",
  boxShadow: "var(--uidt-shadow-md)",
  bottom: 4,
};

export const HANDLE_SLIDER_LIST: CSSProperties = {
  boxShadow: "var(--uidt-shadow-md)",
  border: "var(--uidt-primary-outline-light-border) 1px solid",
  backgroundColor: "var(--uidt-primary-outline-bg)",
};

export const RAIL_SLIDER_LIST: CSSProperties = {
  borderRadius: "12px",
  backgroundColor: "var(--uidt-base-border)",
  boxShadow: "var(--uidt-shadow-md)",
};

export const TRACK_SLIDER_LIST: CSSProperties = {
  backgroundColor: "var(--uidt-primary-outline-light-border)",
};

export const HANDLE_SLIDER_VERTICAL: CSSProperties = {
  opacity: 1,
  border: "1px solid var(--uidt-base-border)",
  boxShadow: "var(--uidt-shadow-md)",
  borderRadius: "4px",
  height: "12px",
  width: "24px",
};

export const RAIL_SLIDER_VERTICAL: CSSProperties = {
  width: "12px",
  borderRadius: "4px",
  boxShadow: "var(--uidt-shadow-md)",
  left: "6px",
};

export function getRectSize({
  height,
  flex,
  width,
}: {
  height: string;
  width?: string;
  flex?: boolean;
}): CSSProperties {
  return {
    minHeight: height,
    height: height,
    maxHeight: height,
    minWidth: width ?? (!flex ? height : undefined),
    width: width ?? (!flex ? height : undefined),
    maxWidth: width ?? (!flex ? height : undefined),
    flex: flex ? 1 : 0,
  };
}

export const DEFAULT_RECOMMANDATIONS: RecommandationContrastPayload[] = [
  {
    text: 6,
    border: 3,
  },
  {
    text: 9,
    border: 5,
  },
  {
    text: 14,
    border: 5,
  },
];

export interface ResponsiveDimensionDevice {
  width: number;
  height: number;
  name: string;
}

export const RESPONSIVE_DIMENSIONS: ResponsiveDimensionDevice[] = [
  // --- Mobiles ----------------------------------------------------------------
  { width: 320, height: 568, name: "Mobile XS  - iPhone SE (2022)" },
  { width: 360, height: 640, name: "Mobile S  - Android 5″ (ex. Pixel 3a)" },
  { width: 375, height: 667, name: "Mobile M  - iPhone 8" },
  { width: 414, height: 896, name: "Mobile L  - iPhone 11 Pro Max" },
  { width: 480, height: 800, name: "Phablet  - Android 6″/6.5″" },

  // --- Tablettes --------------------------------------------------------------
  { width: 600, height: 960, name: "Tablet XS  - petite tablette 7″" },
  { width: 768, height: 1024, name: "Tablet S  - iPad 9,7″ portrait" },
  { width: 834, height: 1112, name: "Tablet M  - iPad Air 10,9″ portrait" },
  { width: 1024, height: 1366, name: "Tablet L  - iPad Pro 12,9″ portrait" },

  // --- Laptops / Desktops -----------------------------------------------------
  { width: 1280, height: 800, name: "Laptop S  - 13″ (MacBook Air)" },
  { width: 1366, height: 768, name: "Laptop M  - PC 14″/15″ courant" },
  { width: 1440, height: 900, name: "Desktop S  - 15″ Retina / 1440p" },
  { width: 1680, height: 1050, name: "Desktop M  - 20″ Widescreen" },
  { width: 1920, height: 1080, name: "Desktop L  - Full HD 1080p" },
  { width: 2560, height: 1440, name: "Desktop XL  - 2K/QHD" },
  { width: 3840, height: 2160, name: "Desktop XXL  - 4K/UHD" },
];

export const SPACES_PRESETS: PresetSpaces[] = [
  /* default */
  {
    presetName: "default (0,2,4,8,...,80)",
    spaces: [
      { spaceKey: "0", spaceValue: { unit: "PX", value: 0 } },
      { spaceKey: "1", spaceValue: { unit: "PX", value: 2 } },
      { spaceKey: "2", spaceValue: { unit: "PX", value: 4 } },
      { spaceKey: "3", spaceValue: { unit: "PX", value: 8 } },
      { spaceKey: "4", spaceValue: { unit: "PX", value: 12 } },
      { spaceKey: "5", spaceValue: { unit: "PX", value: 16 } },
      { spaceKey: "6", spaceValue: { unit: "PX", value: 20 } },
      { spaceKey: "7", spaceValue: { unit: "PX", value: 28 } },
      { spaceKey: "8", spaceValue: { unit: "PX", value: 32 } },
      { spaceKey: "9", spaceValue: { unit: "PX", value: 40 } },
      { spaceKey: "10", spaceValue: { unit: "PX", value: 52 } },
      { spaceKey: "11", spaceValue: { unit: "PX", value: 64 } },
      { spaceKey: "12", spaceValue: { unit: "PX", value: 80 } },
    ],
  },
  /* 1. Pas de 4 px */
  {
    presetName: "step-4px (0,4,8,...,40)",
    spaces: [
      { spaceKey: "0", spaceValue: { unit: "PX", value: 0 } },
      { spaceKey: "1", spaceValue: { unit: "PX", value: 4 } },
      { spaceKey: "2", spaceValue: { unit: "PX", value: 8 } },
      { spaceKey: "3", spaceValue: { unit: "PX", value: 12 } },
      { spaceKey: "4", spaceValue: { unit: "PX", value: 16 } },
      { spaceKey: "5", spaceValue: { unit: "PX", value: 20 } },
      { spaceKey: "6", spaceValue: { unit: "PX", value: 24 } },
      { spaceKey: "7", spaceValue: { unit: "PX", value: 28 } },
      { spaceKey: "8", spaceValue: { unit: "PX", value: 32 } },
      { spaceKey: "9", spaceValue: { unit: "PX", value: 36 } },
      { spaceKey: "10", spaceValue: { unit: "PX", value: 40 } },
    ],
  },

  /* 2. Pas de 8 px */
  {
    presetName: "step-8px (0,8,16,...,80)",
    spaces: [
      { spaceKey: "0", spaceValue: { unit: "PX", value: 0 } },
      { spaceKey: "1", spaceValue: { unit: "PX", value: 8 } },
      { spaceKey: "2", spaceValue: { unit: "PX", value: 16 } },
      { spaceKey: "3", spaceValue: { unit: "PX", value: 24 } },
      { spaceKey: "4", spaceValue: { unit: "PX", value: 32 } },
      { spaceKey: "5", spaceValue: { unit: "PX", value: 40 } },
      { spaceKey: "6", spaceValue: { unit: "PX", value: 48 } },
      { spaceKey: "7", spaceValue: { unit: "PX", value: 56 } },
      { spaceKey: "8", spaceValue: { unit: "PX", value: 64 } },
      { spaceKey: "9", spaceValue: { unit: "PX", value: 72 } },
      { spaceKey: "10", spaceValue: { unit: "PX", value: 80 } },
    ],
  },

  /* 3. Puissances de 2 */
  {
    presetName: "powers-of-two (0,2,4,8,16,...,1028)",
    spaces: [
      { spaceKey: "0", spaceValue: { unit: "PX", value: 0 } },
      { spaceKey: "1", spaceValue: { unit: "PX", value: 2 } },
      { spaceKey: "2", spaceValue: { unit: "PX", value: 4 } },
      { spaceKey: "3", spaceValue: { unit: "PX", value: 8 } },
      { spaceKey: "4", spaceValue: { unit: "PX", value: 16 } },
      { spaceKey: "5", spaceValue: { unit: "PX", value: 32 } },
      { spaceKey: "6", spaceValue: { unit: "PX", value: 64 } },
      { spaceKey: "7", spaceValue: { unit: "PX", value: 128 } },
      { spaceKey: "8", spaceValue: { unit: "PX", value: 256 } },
      { spaceKey: "9", spaceValue: { unit: "PX", value: 512 } },
      { spaceKey: "10", spaceValue: { unit: "PX", value: 1028 } },
    ],
  },

  /* 5. Fibonacci / ratio φ */
  {
    presetName: "fibonacci-phi (0,4,6,10,16,...,288)",
    spaces: [
      { spaceKey: "0", spaceValue: { unit: "PX", value: 0 } },
      { spaceKey: "1", spaceValue: { unit: "PX", value: 4 } },
      { spaceKey: "2", spaceValue: { unit: "PX", value: 6 } },
      { spaceKey: "3", spaceValue: { unit: "PX", value: 10 } },
      { spaceKey: "4", spaceValue: { unit: "PX", value: 16 } },
      { spaceKey: "5", spaceValue: { unit: "PX", value: 26 } },
      { spaceKey: "6", spaceValue: { unit: "PX", value: 42 } },
      { spaceKey: "7", spaceValue: { unit: "PX", value: 68 } },
      { spaceKey: "8", spaceValue: { unit: "PX", value: 110 } },
      { spaceKey: "9", spaceValue: { unit: "PX", value: 178 } },
      { spaceKey: "10", spaceValue: { unit: "PX", value: 288 } },
    ],
  },
];
