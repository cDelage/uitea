import { Base } from "../domain/DesignSystemDomain";

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

