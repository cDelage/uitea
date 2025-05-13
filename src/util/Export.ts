import { DesignSystem, Palette } from "../domain/DesignSystemDomain";
import { TokenGroup, TokenSet, TokensFile } from "../domain/ExportDomain";
import { getPaletteTokenFamily } from "./DesignSystemUtils";
import { recolorPalettes } from "./ThemeGenerator";
import cssbeautify from "cssbeautify";

export function generateTokenStudioFile(
  designSystem: DesignSystem
): TokensFile {
  // 1. On construit un OBJET et non un tableau
  const palettesThemes = designSystem.themes.otherThemes.reduce<
    Record<string, TokenSet>
  >((acc, theme) => {
    const palettes = recolorPalettes({
      palettes: designSystem.palettes,
      defaultBackground: designSystem.themes.mainTheme?.background ?? "#DDDDDD",
      newBackground: theme.background ?? "#DDDDDD",
    });

    acc[theme.name] = mapPalettesToTokenSet(palettes);
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
  const themesPalettes = designSystem.themes.otherThemes.map((theme) => {
    return `
    [data-theme="${theme.name}"]{
      ${recolorPalettes({
        palettes: designSystem.palettes,
        defaultBackground:
          designSystem.themes.mainTheme?.background ?? "#DDDDDD",
        newBackground: theme.background ?? "#DDDDDD",
      })
        .map(getCssPaletteTokens)
        .join("")}
    }
    `;
  });

  return cssbeautify(
    `:root{
    ${designSystem.palettes.map(getCssPaletteTokens).join("")}
    }
    ${themesPalettes.join("")}
    `,
    {
      indent: "  ",
      openbrace: "end-of-line",
      autosemicolon: true,
    }
  );
}

export function getCssPaletteTokens(palette: Palette): string {
  const tokenFamily = getPaletteTokenFamily(palette);
  return `
    ${tokenFamily.tokens
      .map((token) => {
        return `--${token.label}:${token.value};`;
      })
      .join("")}
  `;
}
