import { CSSProperties, MouseEvent, RefObject } from "react";
import {
  Palette,
  Tint,
  ThemeItem,
  ThemeStateCategory,
  AdditionalFont,
  CustomTypographyScale,
  Space,
  RadiusItem,
  Shadows,
  DesignToken,
  SemanticColorTokens,
  TokenFamily,
  ColorCombinationCollection,
  ColorCombination,
  DesignSystem,
  ColorCombinationCollectionGroup,
  TypographyScale,
  Measurement,
} from "../domain/DesignSystemDomain";
import { ColorResult } from "react-color";
import { PaletteBuilderMetadata } from "../domain/PaletteBuilderDomain";
import { getFilenameDate } from "./DateUtil";
import ColorIO from "colorjs.io";

/**
 * Génère un nom unique pour une clé en vérifiant si elle existe déjà dans la liste de shades.
 * @param tints - Le tableau contenant les shades existants.
 * @param baseKey - Le nom de la clé à insérer.
 * @returns Un nom unique pour la clé.
 */
export const generateUniqueTintKey = (
  tints: Tint[],
  baseKey: string
): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  // Tant que la clé existe déjà (on compare avec le premier élément du tuple),
  // on incrémente le "counter" pour générer une nouvelle clé.
  while (tints.filter((shade) => shade.label === uniqueKey).length) {
    uniqueKey = `${baseKey}-${counter}`;
    counter++;
  }

  return uniqueKey;
};

/**
 * Génère un nom unique pour une clé en vérifiant si elle existe déjà dans la liste de shades.
 * @param effects - Le tableau contenant les shades existants.
 * @param baseKey - Le nom de la clé à insérer.
 * @returns Un nom unique pour la clé.
 */
export const generateUniqueEffectsKey = (
  effects: Shadows[],
  baseKey: string
): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  // Tant que la clé existe déjà (on compare avec le premier élément du tuple),
  // on incrémente le "counter" pour générer une nouvelle clé.
  while (effects.filter((shade) => shade.shadowName === uniqueKey).length) {
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
  fonts: CustomTypographyScale[],
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
  return palette.tints.map((token) => {
    return {
      label: `palette-${palette.paletteName}-${token.label}`,
      value: token.color,
      category: "color",
    };
  });
}

export function getPaletteTokenFamily(palette: Palette): TokenFamily {
  return {
    label: `palette-${palette.paletteName}`,
    tokens: getPaletteTokens(palette),
    category: "color",
  };
}

export function getSemanticColorTokens(
  semantic: SemanticColorTokens
): TokenFamily[] {
  return [
    {
      label: "base",
      tokens: (
        [
          {
            label: "base-background",
            value: semantic.background,
          },
          {
            label: "base-text-light",
            value: semantic.textLight,
          },
          {
            label: "base-text-default",
            value: semantic.textDefault,
          },
          {
            label: "base-text-dark",
            value: semantic.textDark,
          },
          {
            label: "base-border",
            value: semantic.border,
          },
        ] as DesignToken[]
      ).filter((token) => token.value),
      colorPreview: `var(--${semantic.background})`,
      category: "semantic",
    },
    ...semantic.colorCombinationCollections.flatMap((collection) =>
      getCollectionToken(collection)
    ),
  ];
}

function getCollectionToken(
  collection: ColorCombinationCollection
): TokenFamily {
  return {
    label: collection.combinationName ?? "collection",
    tokens: [
      ...getColorCombinationTokens(
        `${collection.combinationName}`,
        collection.default
      ),
      ...getColorCombinationTokens(
        `${collection.combinationName}-hover`,
        collection.hover
      ),
      ...getColorCombinationTokens(
        `${collection.combinationName}-focus`,
        collection.focus
      ),
      ...getColorCombinationTokens(
        `${collection.combinationName}-active`,
        collection.active
      ),
    ],
    category: "semantic",
  };
}

function getColorCombinationTokens(
  label: string,
  colorCombination?: ColorCombination
): DesignToken[] {
  if (!colorCombination) return [];

  return (
    [
      {
        label: `${label}-background`,
        value: colorCombination.background,
      },
      {
        label: `${label}-text`,
        value: colorCombination.text,
      },
      {
        label: `${label}-border`,
        value: colorCombination.border,
      },
    ] as DesignToken[]
  ).filter((token) => token.value);
}

export function getDesignSystemTokens(
  designSystem?: DesignSystem,
  skipSemantic?: boolean
): TokenFamily[] {
  if (!designSystem) return [];
  const paletteTokens = designSystem.palettes.map(getPaletteTokenFamily);
  const semanticTokens = skipSemantic
    ? []
    : getSemanticColorTokens(designSystem.semanticColorTokens);
  return [...paletteTokens, ...semanticTokens];
}

export function findDesignSystemColor({
  label,
  tokenFamilies,
  defaultValue,
}: {
  label?: string;
  tokenFamilies: TokenFamily[];
  defaultValue?: string;
}): string | undefined {
  return (
    tokenFamilies
      ?.flatMap((token) => token.tokens)
      .find((token) => token.label === label)?.value ??
    defaultValue ??
    label
  );
}

// Les clés de ColorCombinationCollection qu'on veut vraiment tester.
const COMBINATION_KEYS = ["default", "hover", "active", "focus"] as const;

type CombinationKey = (typeof COMBINATION_KEYS)[number];

/**
 * Renvoie true si l'une des quatre combinaisons possède
 * un background, border ou text défini.
 */
export function hasAnyColor(collection: ColorCombinationCollection): boolean {
  return COMBINATION_KEYS.some((key: CombinationKey) => {
    const combo = collection[key];
    // combo peut être undefined : d'où l'optional chaining
    return (
      !!combo?.background?.trim() ||
      !!combo?.border?.trim() ||
      !!combo?.text?.trim()
    );
  });
}

/**
 * Renvoie true si l'une des quatre combinaisons possède
 * un background, border ou text défini.
 */
export function combinationHasAnyColor(
  combination?: ColorCombination
): boolean {
  return (
    (combination?.background || combination?.text || combination?.border) !==
    undefined
  );
}

export function getShadowColor({
  shadowColor,
  element,
}: {
  shadowColor: string;
  element?: RefObject<HTMLDivElement | null>;
}): string {
  if (shadowColor.startsWith("#")) return shadowColor;
  const color = getCssVariableValue(shadowColor, element);
  if (color) return color;
  try {
    return new ColorIO(shadowColor).toString({ format: "hex" });
  } catch {
    return "#DDDDDD";
  }
}

export function getCssVariableValue(
  variableName: string,
  element?: RefObject<HTMLDivElement | null>
): string | undefined {
  const root = element?.current ?? document.body;
  return getComputedStyle(root).getPropertyValue(`--${variableName}`).trim();
}

/**
 * Construit l’arborescence des ColorCombinationCollectionGroup
 * @param collections la liste plate d’éléments
 * @returns tableau des racines, chacun avec son champ `childs` (récursif)
 */
export function buildCombinationHierarchy(
  collections: ColorCombinationCollection[]
): ColorCombinationCollectionGroup[] {
  // fonction récursive qui trouve les enfants d’un parent donné
  const findChildren = (
    parentName?: string
  ): ColorCombinationCollectionGroup[] =>
    collections
      // on ne garde que ceux dont c.group === parentName
      .filter((c) => c.group === parentName)
      // et pour chacun on étend l’élément avec ses propres childs
      .map((c) => ({
        ...c,
        childs: findChildren(c.combinationName),
      }));

  // on démarre sur les racines : ceux qui n’ont pas de parent défini
  return collections
    .filter((c) => c.group == null)
    .map((root) => ({
      ...root,
      childs: findChildren(root.combinationName),
    }));
}

export function getTokenAvailableGroups({
  combinationName,
  collections,
}: {
  combinationName: string | undefined;
  collections: ColorCombinationCollection[];
}) {
  const toExcludes = combinationName
    ? findCollectionTree(combinationName, collections)
    : [];
  return collections.filter(
    (combination) =>
      !toExcludes.includes(combination.combinationName) &&
      combination.default?.background
  );
}

export function findCollectionTree(
  rootName: string,
  collections: ColorCombinationCollection[]
): (string | undefined)[] {
  const result = new Set<ColorCombinationCollection>();
  const visitedNames = new Set<string>();

  function recurse(currentName: string) {
    // On évite de repasser plusieurs fois sur le même nom
    if (visitedNames.has(currentName)) return;
    visitedNames.add(currentName);

    for (const col of collections) {
      // 1) Si c’est le nœud « racine », on l’ajoute
      if (col.combinationName === currentName) {
        result.add(col);
      }
      // 2) Si c’est un enfant direct, on l’ajoute et on parcourt ses enfants
      if (col.group === currentName) {
        result.add(col);
        if (col.combinationName) {
          recurse(col.combinationName);
        }
      }
    }
  }

  recurse(rootName);
  return Array.from(result).map((result) => result.combinationName);
}

export function getTypoCssProperties(typo: TypographyScale): CSSProperties {
  return {
    fontSize: measurementToCss(typo.fontSize),
    lineHeight: measurementToCss(typo.lineHeight),
    fontWeight: typo.fontWeight,
    letterSpacing: typo.letterSpacing,
    wordSpacing: typo.wordSpacing,
    fontStyle: typo.fontStyle,
    textTransform: typo.textTransform,
    textDecoration: typo.textDecoration,
    padding: measurementToCss(typo.padding),
    margin: measurementToCss(typo.margin),
    fontFamily: typo.font ? `var(--font-${typo.font})` : undefined,
    color: `var(--${typo.color})`,
  };
}

export function measurementToCss(measurement: Measurement): string {
  return `${measurement.value}${measurement.unit.toLocaleLowerCase()}`;
}

/**
 * Utilise colorjs.io pour convertir une couleur CSS et une opacité en chaîne compatible RGBA.
 */
function toRgba(color: string, opacity: number): string {
  try{
    const c = new ColorIO(color);
    c.alpha = opacity;
    return c.toString({ format: "css" });
  } catch{
    return "#DDDDDD"
  }
}

/**
 * Construit la valeur CSS pour box-shadow à partir d'un objet Shadows.
 */
export function buildBoxShadow(
  shadows: Shadows,
  styleRef?: RefObject<HTMLDivElement | null>
): string {
  return shadows.shadowsArray
    .map((sh) => {
      const hexColor = styleRef?.current ? getShadowColor({
        shadowColor: sh.color,
        element: styleRef,
      }) : sh.color;
      const { shadowX, shadowY, blur, spread, colorOpacity, inset } = sh;
      const rgba = toRgba(hexColor, colorOpacity);
      return `${shadowX}px ${shadowY}px ${blur}px ${spread}px ${rgba} ${
        inset ? "inset" : ""
      }`;
    })
    .join(", ");
}
