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
  SemanticColorTokensMapped,
  ColorCombinationMapped,
} from "../domain/DesignSystemDomain";
import { ColorResult } from "react-color";
import { PaletteBuilderMetadata } from "../domain/PaletteBuilderDomain";
import { getFilenameDate } from "./DateUtil";
import ColorIO from "colorjs.io";
import { ImageLocal } from "../domain/ImageDomain";
import ReadmePalette from "../features/design-system/readme/ReadmePalettes";
import ReactDOMServer from "react-dom/server";
import { invoke } from "@tauri-apps/api/core";
import ReadmeSemantic from "../features/design-system/readme/ReadmeSemantic";
import ReadmeFonts from "../features/design-system/readme/ReadmeFonts";
import ReadmeTypographies from "../features/design-system/readme/ReadmeTypographies";
import ReadmeRadius from "../features/design-system/readme/ReadmeRadius";
import ReadmeSpaces from "../features/design-system/readme/ReadmeSpaces";

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
  const paletteTokens: TokenFamily[] = designSystem.palettes.map(
    getPaletteTokenFamily
  );
  const independantColorTokens: TokenFamily = {
    label: "Independant",
    category: "color",
    tokens: [
      {
        label: "color-white",
        value: designSystem.independantColors.white,
      },
      ...designSystem.independantColors.independantColors.map((color) => {
        return {
          label: `color-${color.label}`,
          value: color.color,
        } as DesignToken;
      }),
    ],
  };
  const semanticTokens: TokenFamily[] = skipSemantic
    ? []
    : getSemanticColorTokens(designSystem.semanticColorTokens);
  return [...paletteTokens, independantColorTokens, ...semanticTokens];
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
  designSystem,
}: {
  shadowColor: string;
  element?: RefObject<HTMLDivElement | null>;
  designSystem?: DesignSystem;
}): string {
  if (shadowColor.startsWith("#")) return shadowColor;
  if (element) {
    const color = getCssVariableValue(shadowColor, element);
    if (color) return color;
  }
  if (designSystem) {
    const palettesTokens: DesignToken[] = designSystem.palettes.flatMap(
      (palette) => getPaletteTokenFamily(palette).tokens
    );
    const color = palettesTokens.find(
      (color) => color.label === shadowColor
    )?.value;
    if (color) return color;
  }
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
  try {
    const c = new ColorIO(color);
    c.alpha = opacity;
    return c.toString({ format: "css" });
  } catch {
    return "#DDDDDD";
  }
}

/**
 * Construit la valeur CSS pour box-shadow à partir d'un objet Shadows.
 */
export function buildBoxShadow(
  shadows: Shadows,
  styleRef?: RefObject<HTMLDivElement | null>,
  designSystem?: DesignSystem
): string {
  return shadows.shadowsArray
    .map((sh) => {
      const hexColor = styleRef?.current
        ? getShadowColor({
            shadowColor: sh.color,
            element: styleRef,
            designSystem,
          })
        : sh.color;
      const { shadowX, shadowY, blur, spread, colorOpacity, inset } = sh;
      const rgba = toRgba(hexColor, colorOpacity);
      return `${shadowX}px ${shadowY}px ${blur}px ${spread}px ${rgba} ${
        inset ? "inset" : ""
      }`;
    })
    .join(", ");
}

export function buildReadme(designSystem: DesignSystem) {
  return `# ${designSystem.metadata.designSystemName}

  ### Palettes
  ![palettes](./exports/preview_images/palettes.png)

  ### Semantic color tokens
  ![semantic](./exports/preview_images/semantic.png)

  ### Fonts
  ![fonts](./exports/preview_images/fonts.png)

  ### Typographies
  ![typographies](./exports/preview_images/typographies.png)
  
  ### Spaces
  ![spaces](./exports/preview_images/spaces.png)
  
  ### Radius
  ![radius](./exports/preview_images/radius.png)
  `;
}

export async function getImagesPreview(
  designSystem: DesignSystem
): Promise<ImageLocal[]> {
  const palettesSvg = ReactDOMServer.renderToStaticMarkup(
    ReadmePalette({ designSystem })
  );

  const palettesPng: string = await invoke<string>("svg_to_png_b64", {
    svg: palettesSvg,
  });

  const semanticSvg = ReactDOMServer.renderToStaticMarkup(
    ReadmeSemantic({ semantic: mapSemanticTokens(designSystem) })
  );

  const semanticPng: string = await invoke<string>("svg_to_png_b64", {
    svg: semanticSvg,
  });

  const fontsSvg = ReactDOMServer.renderToStaticMarkup(
    ReadmeFonts({ fonts: designSystem.fonts })
  );

  const fontsPng: string = await invoke<string>("svg_to_png_b64", {
    svg: fontsSvg,
    designSystemPath: designSystem.metadata.designSystemPath,
  });

  const typoSvg = ReactDOMServer.renderToStaticMarkup(
    ReadmeTypographies({ designSystem: designSystem })
  );

  const typoPng: string = await invoke<string>("svg_to_png_b64", {
    svg: typoSvg,
    designSystemPath: designSystem.metadata.designSystemPath,
  });

  const radiusSvg = ReactDOMServer.renderToStaticMarkup(
    ReadmeRadius({ designSystem: designSystem })
  );

  const radiusPng: string = await invoke<string>("svg_to_png_b64", {
    svg: radiusSvg,
  });

  const spacesSvg = ReactDOMServer.renderToStaticMarkup(
    ReadmeSpaces({ designSystem: designSystem })
  );

  const spacesPng: string = await invoke<string>("svg_to_png_b64", {
    svg: spacesSvg,
  });

  return [
    {
      path: "palettes.svg",
      binary: palettesSvg,
    },
    {
      path: "palettes.png",
      binary: palettesPng.split(",")[1],
    },
    {
      path: "semantic.svg",
      binary: semanticSvg,
    },
    {
      path: "semantic.png",
      binary: semanticPng.split(",")[1],
    },
    {
      path: "fonts.svg",
      binary: fontsSvg,
    },
    {
      path: "fonts.png",
      binary: fontsPng.split(",")[1],
    },
    {
      path: "typographies.svg",
      binary: typoSvg,
    },
    {
      path: "typographies.png",
      binary: typoPng.split(",")[1],
    },
    {
      path: "radius.svg",
      binary: radiusSvg,
    },
    {
      path: "radius.png",
      binary: radiusPng.split(",")[1],
    },
    {
      path: "spaces.svg",
      binary: spacesSvg,
    },
    {
      path: "spaces.png",
      binary: spacesPng.split(",")[1],
    },
  ];
}

export function mapSemanticTokens(
  designSystem: DesignSystem
): SemanticColorTokensMapped {
  const palettesTokens: DesignToken[] = designSystem.palettes.flatMap(
    (palette) => getPaletteTokenFamily(palette).tokens
  );
  const { semanticColorTokens } = designSystem;
  return {
    backgroundToken: semanticColorTokens.background,
    backgroundColor: palettesTokens.find(
      (token) => token.label === semanticColorTokens.background
    )?.value,
    textLightToken: semanticColorTokens.textLight,
    textLightColor: palettesTokens.find(
      (token) => token.label === semanticColorTokens.textLight
    )?.value,
    textDefaultToken: semanticColorTokens.textDefault,
    textDefaultColor: palettesTokens.find(
      (token) => token.label === semanticColorTokens.textDefault
    )?.value,
    textDarkToken: semanticColorTokens.textDark,
    textDarkColor: palettesTokens.find(
      (token) => token.label === semanticColorTokens.textDark
    )?.value,
    borderToken: semanticColorTokens.border,
    borderColor: palettesTokens.find(
      (token) => token.label === semanticColorTokens.border
    )?.value,
    colorCombinationCollections:
      semanticColorTokens.colorCombinationCollections.map(
        (colorCombinationCollection) => {
          return {
            combinationName: colorCombinationCollection.combinationName,
            default: colorCombinationCollection.default
              ? mapColorCombination(
                  colorCombinationCollection.default,
                  palettesTokens
                )
              : undefined,
            hover: colorCombinationCollection.hover
              ? mapColorCombination(
                  colorCombinationCollection.hover,
                  palettesTokens
                )
              : undefined,
            active: colorCombinationCollection.active
              ? mapColorCombination(
                  colorCombinationCollection.active,
                  palettesTokens
                )
              : undefined,
            focus: colorCombinationCollection.focus
              ? mapColorCombination(
                  colorCombinationCollection.focus,
                  palettesTokens
                )
              : undefined,
          };
        }
      ),
  };
}

export function mapColorCombination(
  colorCombination: ColorCombination,
  palettesTokens: DesignToken[]
): ColorCombinationMapped {
  return {
    backgroundToken: colorCombination.background,
    backgroundColor: palettesTokens.find(
      (token) => token.label === colorCombination.background
    )?.value,
    textToken: colorCombination.text,
    textColor: palettesTokens.find(
      (token) => token.label === colorCombination.text
    )?.value,
    borderToken: colorCombination.border,
    borderColor: palettesTokens.find(
      (token) => token.label === colorCombination.border
    )?.value,
  };
}

export function findMainColorCombination(
  designSystem: DesignSystem
): ColorCombinationMapped {
  const palettesTokens: DesignToken[] = designSystem.palettes.flatMap(
    (palette) => getPaletteTokenFamily(palette).tokens
  );
  const mainCombination: ColorCombinationCollection | undefined =
    designSystem.semanticColorTokens.colorCombinationCollections.find(
      (combination) => combination.default && combination.defaultCombination
    ) ||
    designSystem.semanticColorTokens.colorCombinationCollections.filter(
      (x) => x.default
    )[0];

  return mainCombination?.default
    ? mapColorCombination(mainCombination.default, palettesTokens)
    : {
        backgroundColor: "#1e40af",
        backgroundToken: "palette-primary-800",
        textColor: "#ffffff",
        textToken: "palette-white",
        borderColor: "#1e40af",
        borderToken: "palette-primary-800",
      };
}

export function findMainBackground(designSystem: DesignSystem) {
  const baseToken = designSystem.semanticColorTokens.background;

  if (!baseToken) return "#ffffff";

  const palettesTokens: DesignToken[] = designSystem.palettes.flatMap(
    (palette) => getPaletteTokenFamily(palette).tokens
  );

  return (
    palettesTokens.find(
      (token) => token.label === designSystem.semanticColorTokens.background
    )?.value ?? "#ffffff"
  );
}
