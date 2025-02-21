import {
  AdditionalTypographyScale,
  Base,
  DefaultTypography,
  Effect,
  EffectType,
  FontStyle,
  FontWeight,
  Palette,
  Space,
  TextDecoration,
  TextTransform,
  ThemeColor,
  TypographySpacing,
} from "../domain/DesignSystemDomain";

export const ICON_SIZE_SM = "16";
export const ICON_SIZE_MD = "20";
export const ICON_SIZE_LG = "24";
export const ICON_SIZE_XL = "32";
export const ICON_SIZE_XXL = "52";

export const DEFAULT_BASE: Base = {
  background: {
    default: "var(--palette-gray-50)",
    dark: "var(--palette-gray-950)",
  },
  border: {
    default: "var(--palette-gray-300)",
    dark: "var(--palette-gray-700)",
  },
  textLight: {
    default: "var(--palette-gray-500)",
    dark: "var(--palette-gray-500)",
  },
  textDefault: {
    default: "var(--palette-gray-700)",
    dark: "var(--palette-gray-400)",
  },
  textDark: {
    default: "var(--palette-gray-900)",
    dark: "var(--palette-gray-50)",
  },
  backgroundDisabled: {
    default: "var(--palette-gray-200)",
    dark: "var(--palette-gray-700)",
  },
  borderDisabled: {
    default: "var(--palette-gray-300)",
    dark: "var(--palette-gray-600)",
  },
  textDisabled: {
    default: "var(--palette-gray-500)",
    dark: "var(--palette-gray-400)",
  },
};

export const DEFAULT_PALETTE: Palette = {
  paletteName: "palette-1",
  shades: [
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

export const DEFAULT_THEME: ThemeColor = {
  themeName: "DEFAULT",
  default: {
    background: {
      default: "#F5F5F5",
      dark: "#F5F5F5",
    },
    border: {
      default: "#D4D4D4",
      dark: "#D4D4D4",
    },
    text: {
      default: "#525252",
      dark: "#525252",
    },
  },
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
  "-0.05em",
  "-0.02em",
  "0em",
  "0.1em",
  "0.2em",
  "0.3em",
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

export const DEFAULT_TYPOGRAPHY_SCALE: AdditionalTypographyScale = {
  scaleName: "additional-1",
  scale: {
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: "400",
    letterSpacing: "0em",
    wordSpacing: "0em",
    fontStyle: "normal",
    textTransform: "none",
    textDecoration: "none",
    padding: "0",
    margin: "0",
  },
};

export const DEFAULT_TYPOGRAPHIES: DefaultTypography[] = [
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

export const DEFAULT_SPACES: Space[] = [
  { spaceKey: "1", spaceValue: "2px" },
  { spaceKey: "2", spaceValue: "4px" },
  { spaceKey: "3", spaceValue: "8px" },
  { spaceKey: "4", spaceValue: "12px" },
  { spaceKey: "5", spaceValue: "16px" },
  { spaceKey: "6", spaceValue: "20px" },
  { spaceKey: "7", spaceValue: "24px" },
  { spaceKey: "8", spaceValue: "32px" },
  { spaceKey: "9", spaceValue: "52px" },
  { spaceKey: "10", spaceValue: "64px" },
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
