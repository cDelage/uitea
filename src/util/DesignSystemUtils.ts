import { CSSProperties, MouseEvent } from "react";
import {
  Base,
  Palette,
  Tint,
  ThemeColor,
  ThemeItem,
  ThemeStateCategory,
  AdditionalFont,
  AdditionalTypographyScale,
  Space,
  RadiusItem,
  Effect,
  DesignToken,
} from "../domain/DesignSystemDomain";
import { useDesignSystemContext } from "../features/design-system/DesignSystemContext";
import { DEFAULT_BASE } from "../ui/UiConstants";
import { ColorResult } from "react-color";
import { PaletteBuilderMetadata } from "../domain/PaletteBuilderDomain";
import { getFilenameDate } from "./DateUtil";

/**
 * Génère un nom unique pour une clé en vérifiant si elle existe déjà dans la liste de shades.
 * @param shades - Le tableau contenant les shades existants.
 * @param baseKey - Le nom de la clé à insérer.
 * @returns Un nom unique pour la clé.
 */
export const generateUniqueTintKey = (
  shades: Tint[],
  baseKey: string
): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  // Tant que la clé existe déjà (on compare avec le premier élément du tuple),
  // on incrémente le "counter" pour générer une nouvelle clé.
  while (shades.filter((shade) => shade.label === uniqueKey).length) {
    uniqueKey = `${baseKey}-${counter}`;
    counter++;
  }

  return uniqueKey;
};

/**
 * Génère un nom unique pour une clé en vérifiant si elle existe déjà dans la liste de shades.
 * @param shades - Le tableau contenant les shades existants.
 * @param baseKey - Le nom de la clé à insérer.
 * @returns Un nom unique pour la clé.
 */
export const generateUniqueEffectsKey = (
  shades: Effect[],
  baseKey: string
): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  // Tant que la clé existe déjà (on compare avec le premier élément du tuple),
  // on incrémente le "counter" pour générer une nouvelle clé.
  while (shades.filter((shade) => shade.effectName === uniqueKey).length) {
    uniqueKey = `${baseKey}-${counter}`;
    counter++;
  }

  return uniqueKey;
};

export const generateUniquePaletteKey = (
  colorPalettes: Palette[],
  baseKey: string
): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  while (colorPalettes.find((palette) => palette.paletteName === uniqueKey)) {
    uniqueKey = `${baseKey}-${counter}`;
    counter++;
  }

  return uniqueKey;
};

export function objectToMap(obj: Map<string, string>): Map<string, string> {
  return new Map(Object.entries(obj));
}

/**
 * Vérifie si la chaîne `value` est interprétée comme un code couleur ou un gradient CSS valide
 * par le navigateur.
 */
export function isValidCssColorOrGradient(value?: string): string | undefined {
  if (!value) return undefined;

  // On crée un élément DOM fictif
  const element = document.createElement("div");

  // On tente de lui attribuer 'value' en background
  element.style.background = value;

  // Si après l'attribution, la propriété `background` n'est plus vide,
  // c'est que le navigateur a reconnu la syntaxe comme valide.
  return element.style.background.length > 0 ? value : undefined;
}

export const getDefaultTheme = (themeName: string): ThemeColor => {
  return {
    default: {
      background: {
        default: "#f4f4f5",
        dark: "#18181b",
      },
      border: {
        default: "#d4d4d8",
        dark: "#3f3f46",
      },
      text: {
        default: "#27272a",
        dark: "#e4e4e7",
      },
    },
    themeName,
  };
};

export const generateUniqueThemesKey = (
  themes: ThemeColor[],
  baseKey: string
): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  while (themes.find((theme) => theme.themeName === uniqueKey)) {
    uniqueKey = `${baseKey}-${counter}`;
    counter++;
  }

  return uniqueKey;
};

export const generateUniqueFontKey = (
  fonts: AdditionalFont[],
  baseKey: string
): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  while (fonts.find((typo) => typo.fontName === uniqueKey)) {
    uniqueKey = `${baseKey}-${counter}`;
    counter++;
  }

  return uniqueKey;
};

export const generateUniqueTypographyKey = (
  fonts: AdditionalTypographyScale[],
  baseKey: string
): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  while (fonts.find((typo) => typo.scaleName === uniqueKey)) {
    uniqueKey = `${baseKey}-${counter}`;
    counter++;
  }

  return uniqueKey;
};

export const generateUniqueSpacesKey = (
  spaces: Space[],
  baseKey: string
): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  while (spaces.find((space) => space.spaceKey === uniqueKey)) {
    uniqueKey = `${baseKey}-${counter}`;
    counter++;
  }

  return uniqueKey;
};

export const generateUniquePaletteBuilder = (
  existing: PaletteBuilderMetadata[] | undefined
): string => {
  const baseKey = `palette-builder_${getFilenameDate()}`;
  let uniqueKey = baseKey;
  let counter = 1;

  while (existing?.find((pal) => pal.paletteBuilderName === uniqueKey)) {
    uniqueKey = `${baseKey}-${counter}`;
    counter++;
  }

  return uniqueKey;
};

export const generateUniqueRadiusKey = (
  radius: RadiusItem[],
  baseKey: string
): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  while (radius.find((rad) => rad.radiusKey === uniqueKey)) {
    uniqueKey = `${baseKey}-${counter}`;
    counter++;
  }

  return uniqueKey;
};

export function getThemeToken({
  themeName,
  themeStateCategory,
  themeItem,
}: {
  themeStateCategory: ThemeStateCategory;
  themeName: string;
  themeItem: ThemeItem;
}): string | undefined {
  if (!themeName) return undefined;
  return (
    `theme-${themeName.toLowerCase()}` +
    (themeStateCategory !== "default" ? `-${themeStateCategory}-` : "-") +
    themeItem
  );
}

export function getClosestToPercentage<T>({
  array,
  defaultValue,
  percentage,
}: {
  array: T[];
  defaultValue: T;
  percentage: number;
}): T {
  if (array.length === 0) return defaultValue;

  // Calculer l'index cible basé sur le pourcentage
  const targetIndex = Math.round((array.length - 1) * percentage);

  // Retourner l'élément correspondant
  return array[targetIndex];
}

export function useBaseColors() {
  const {
    designSystem: { base },
    findDesignSystemColor,
  } = useDesignSystemContext();

  const background = findDesignSystemColor({
    label: base.background.default,
    defaultValue: DEFAULT_BASE.background.default,
  });
  const border = findDesignSystemColor({
    label: base.border.default,
    defaultValue: DEFAULT_BASE.border.default,
  });
  const textLight = findDesignSystemColor({
    label: base.textLight.default,
    defaultValue: DEFAULT_BASE.textLight.default,
  });
  const textDefault = findDesignSystemColor({
    label: base.textDefault.default,
    defaultValue: DEFAULT_BASE.textDefault.default,
  });
  const textDark = findDesignSystemColor({
    label: base.textDark.default,
    defaultValue: DEFAULT_BASE.textDark.default,
  });

  const computedBase: Base = {
    background: {
      default: background,
    },
    border: {
      default: border,
    },
    textDefault: {
      default: textDefault,
    },
    textLight: {
      default: textLight,
    },
    textDark: {
      default: textDark,
    },
    backgroundDisabled: {},
    borderDisabled: {},
    textDisabled: {},
  };

  return computedBase;
}

export function useThemeColors({ theme }: { theme: ThemeColor }) {
  const { findDesignSystemColor } = useDesignSystemContext();

  const background = findDesignSystemColor({
    label: theme.default.background.default,
    defaultValue: DEFAULT_BASE.background.default,
  });
  const border = findDesignSystemColor({
    label: theme.default.border.default,
    defaultValue: DEFAULT_BASE.border.default,
  });
  const text = findDesignSystemColor({
    label: theme.default.text.default,
    defaultValue: DEFAULT_BASE.textLight.default,
  });

  const computedTheme: ThemeColor = {
    default: {
      background: {
        default: background,
      },
      border: {
        default: border,
      },
      text: {
        default: text,
      },
    },
    themeName: theme.themeName,
  };

  return computedTheme;
}

export function getEffectCss(effect: Effect): CSSProperties {
  const cssProps: CSSProperties = {};
  const boxShadows = effect.items.filter(
    (item) => item.effectType === "BoxShadow"
  );
  const backdropFilter = effect.items.filter(
    (item) => item.effectType === "BackdropFilter"
  );
  const blur = effect.items.filter((item) => item.effectType === "Blur");

  if (boxShadows.length) {
    cssProps.boxShadow = boxShadows.map((e) => e.effectValue).join(",");
  }
  if (backdropFilter.length) {
    cssProps.backdropFilter = `${backdropFilter[0].effectValue}`;
  }
  if (blur.length) {
    cssProps.filter = `blur(${blur[0].effectValue})`;
  }

  if (effect.bg) {
    cssProps.background = effect.bg;
  }

  return cssProps;
}

export function stopPropagation(e: MouseEvent) {
  e.stopPropagation();
}

export function inputSelectDisabled(e: MouseEvent<HTMLInputElement>) {
  e.preventDefault();
}

export function colorToString(color: ColorResult): string {
  const { hex, rgb, hsl } = color;
  let colorString = hex; // Par défaut, on utilise l'hex

  // Si l'alpha est défini, on préfère un format RGBA ou HSLA
  if (rgb.a !== undefined && rgb.a !== 1) {
    colorString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
  } else if (hsl.a !== undefined && hsl.a !== 1) {
    colorString = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${hsl.a})`;
  }

  return colorString;
}

export const KEYBOARD_ACTIONS = ["i", "d"];

export function getPaletteTokens(palette: Palette): DesignToken[] {
  return palette.shades.map((token) => {
    return {
      label: `palette-${palette.paletteName}-${token.label}`,
      value: token.color,
    };
  });
}
