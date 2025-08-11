import { AdditionalFont, CustomTypographyScale, DesignSystem, Palette, RadiusItem, TokenFamily, Typographies, TypographyScale } from "../domain/DesignSystemDomain";
import { TokenGroup, TokenSet, TokensFile } from "../domain/ExportDomain";
import { buildBoxShadows, getPaletteTokenFamily, getSemanticColorTokens, measurementToCss } from "./DesignSystemUtils";
import { recolorPalettes as recolorTokens } from "./ThemeGenerator";
import cssbeautify from "cssbeautify";

export function generateTokenStudioFile(
  designSystem: DesignSystem
): TokensFile {
  // 1. On construit un OBJET et non un tableau
  const palettesThemes = designSystem.themes.otherThemes.reduce<
    Record<string, TokenSet>
  >((acc, theme) => {
    const recolorTokensResults = recolorTokens({
      palettes: designSystem.palettes,
      defaultBackground: designSystem.themes.mainTheme?.background ?? "#DDDDDD",
      newBackground: theme.background ?? "#DDDDDD",
      independantColors: designSystem.independantColors
    });

    acc[theme.name] = mapPalettesToTokenSet(recolorTokensResults.palettes);
    return acc;
  }, {});

  const mainThemeName = designSystem.themes.mainTheme?.name ?? "main-palettes";

  return {
    [mainThemeName]: mapPalettesToTokenSet(designSystem.palettes),
    ...palettesThemes,
    $metadata: { tokenSetOrder: [] },
  };
}

export function mapPalettesToTokenSet(
  palettes: Palette[]
): Record<string, TokenGroup> {
  return palettes.reduce<Record<string, TokenGroup>>(
    (acc, { paletteName, tints }) => {
      const group: TokenGroup = {};
      for (const { label, color } of tints) {
        group[`palette-${paletteName}-${label}`] = {
          type: "color",
          value: color,
        };
      }
      acc[paletteName] = group;
      return acc;
    },
    {}
  );
}

export function cssExport(designSystem: DesignSystem): string {
  const themesPalettes: string = getComplementaryThemeCss(designSystem);
  const semanticTokensCss: string = getSemanticColorTokensCss(designSystem);
  const bodyCss: string = getBodyCss(designSystem);
  const fontsTokenCss: string = getFontsVariableCss(designSystem);
  const typographiesCss: string = getTypographiesCss(designSystem);
  const spaceCss: string = getSpaceVariableCss(designSystem);
  const radiusCss: string = getRadiusVariableCss(designSystem);
  const shadowCss: string = getShadowsVariableCss(designSystem);
  const radiusClassCss: string = getRadiusClassCss(designSystem);
  const shadowClassCss: string = getShadowsClassCss(designSystem);

  return cssbeautify(
    `:root{
    ${designSystem.palettes.map(getPaletteCss).join("")}
    ${semanticTokensCss}
    ${fontsTokenCss}
    ${spaceCss}
    ${radiusCss}
    ${shadowCss}
    }
    ${bodyCss}
    ${themesPalettes}
    ${typographiesCss}
    ${radiusClassCss}
    ${shadowClassCss}

    `,
    {
      indent: "  ",
      openbrace: "end-of-line",
      autosemicolon: true,
    }
  );
}

export function getComplementaryThemeCss(designSystem: DesignSystem): string {
  return designSystem.themes.otherThemes.map((theme) => {
    return `
    [data-theme="${theme.name}"]{
      ${recolorTokens({
      palettes: designSystem.palettes,
      defaultBackground:
        designSystem.themes.mainTheme?.background ?? "#DDDDDD",
      newBackground: theme.background ?? "#DDDDDD",
      independantColors: designSystem.independantColors
    })
        .palettes
        .map(getPaletteCss)
        .join("")}
    }
    `;
  }).join("\n");
}

export function getPaletteCss(palette: Palette): string {
  const tokenFamily = getPaletteTokenFamily(palette);
  return `
    ${tokenFamily.tokens
      .map((token) => {
        return `--${token.label}:${token.value};`;
      })
      .join("")}
  `;
}

export function getSemanticColorTokensCss(designSystem: DesignSystem): string {
  const themeTokenFamilies: TokenFamily[] = getSemanticColorTokens(designSystem.semanticColorTokens);
  return `
   ${themeTokenFamilies.flatMap((tokenFamily) => {
    return tokenFamily.tokens.map(
      (token) => `
    --${token.label.toLowerCase()}:var(--${token.value});
  `
    );
  }).join("")}
  `;
}

function getBodyCss(designSystem: DesignSystem): string {
  const { semanticColorTokens: { background }, fonts: { default: defaultFont } } = designSystem;
  return `body {
    ${background ? "background: var(--base-background);" : ""}
    ${designSystem.typography.root.font ? "" : `font-family:${defaultFont};`}
    ${getTypographyCss(designSystem.typography.root)}
  }`;
}

function getTypographiesCss(designSystem: DesignSystem): string {
  const typographies: CustomTypographyScale[] = getAllCustomScalesExceptRoot(designSystem.typography);

  return typographies.map(typography => {
    return `
      ${typography.scaleName}{
        ${getTypographyCss(typography.scale)}
      }
    `
    }).join("\n");
}

export function getAllCustomScalesExceptRoot(typos: Typographies): CustomTypographyScale[] {
  const { root, customScales, ...others } = typos;

  // Transforme les clés restantes en CustomTypographyScale
  const builtInScales: CustomTypographyScale[] = Object.entries(others)
    .filter(([key]) => key !== "customScales")
    .map(([key, scale]) => ({
      scaleName: key === "paragraph" ? "p" : key,
      scale: scale as TypographyScale
    }));
  
  const transformCustomScale = customScales.map(scale => {
    return {
      ...scale,
      scaleName: `.${scale.scaleName.toLocaleLowerCase()}`
    }
  })

  // Concatène avec les customScales déjà existants
  return [
    ...builtInScales,
    ...transformCustomScale
  ];
}


function getTypographyCss(typography: TypographyScale): string {
  const cssLines: string[] = [];

  if (typography.fontSize) {
    cssLines.push(`font-size: ${measurementToCss(typography.fontSize)};`);
  }
  if (typography.lineHeight) {
    cssLines.push(`line-height: ${measurementToCss(typography.lineHeight)};`);
  }
  if (typography.fontWeight) {
    cssLines.push(`font-weight: ${typography.fontWeight};`);
  }
  if (typography.letterSpacing) {
    cssLines.push(`letter-spacing: ${typography.letterSpacing};`);
  }
  if (typography.wordSpacing) {
    cssLines.push(`word-spacing: ${typography.wordSpacing};`);
  }
  if (typography.fontStyle) {
    cssLines.push(`font-style: ${typography.fontStyle};`);
  }
  if (typography.textTransform) {
    cssLines.push(`text-transform: ${typography.textTransform};`);
  }
  if (typography.textDecoration) {
    cssLines.push(`text-decoration: ${typography.textDecoration};`);
  }
  if (typography.padding) {
    cssLines.push(`padding: ${measurementToCss(typography.padding)};`);
  }
  if (typography.margin) {
    cssLines.push(`margin: ${measurementToCss(typography.margin)};`);
  }


  if (typography.font) {
    cssLines.push(`font-family: var(--font-${typography.font.toLocaleLowerCase()});`);
  }
  if (typography.color) {
    cssLines.push(`color: var(--${typography.color});`);
  }

  return cssLines.join("\n");
}

function getFontsVariableCss(designSystem: DesignSystem): string {
  const allFonts: AdditionalFont[] = [
    ...designSystem.fonts.additionals,
    {
      value: designSystem.fonts.default,
      fontName: "default",
    }
  ]

  return allFonts.flatMap(font => {
    return `--font-${font.fontName.toLocaleLowerCase()}:${font.value};`
  }).join("\n");
}

function getSpaceVariableCss(designSystem: DesignSystem) : string {
  return designSystem.spaces.map(space => {
    return `--space-${space.spaceKey}:${measurementToCss(space.spaceValue)};`
  }).join("\n");
}

function getRadiusVariableCss(designSystem: DesignSystem) : string {
  const allRadius : RadiusItem[] = [
    ...designSystem.radius.additionalsRadius,
    {
      radiusKey: "default",
      radiusValue: designSystem.radius.default
    }
  ];
  return allRadius.map(radius => {
    return `--radius-${radius.radiusKey}:${measurementToCss(radius.radiusValue)};`
  }).join("\n");
}

function getRadiusClassCss(designSystem: DesignSystem) : string {
  const allRadius : RadiusItem[] = [
    ...designSystem.radius.additionalsRadius,
    {
      radiusKey: "default",
      radiusValue: designSystem.radius.default
    }
  ];
  return allRadius.map(radius => {
    return `.radius-${radius.radiusKey}{
    box-shadow:var(--radius-${radius.radiusKey});
  }`
  }).join("\n");
}

function getShadowsVariableCss(designSystem: DesignSystem) : string {
  return designSystem.shadows.map(shadow => {
    return `--shadow-${shadow.shadowName}:${buildBoxShadows(shadow,undefined, designSystem)};`
  }).join("\n");
}

function getShadowsClassCss(designSystem: DesignSystem) : string {
  return designSystem.shadows.map(shadow => {
    return `.shadow-${shadow.shadowName}{
    box-shadow:var(--shadow-${shadow.shadowName});
  }`
  }).join("\n");
}