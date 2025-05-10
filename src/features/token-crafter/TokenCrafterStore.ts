import { create } from "zustand";
import {
  ColorCombination,
  ColorCombinationCollection,
  ColorCombinationState,
  CombinationContrasts,
  DesignSystem,
  Palette,
  PaletteAndColor,
  RecommandationContrastPayload,
  RecommandationMetadata,
  RecommandationRow,
  Tint,
} from "../../domain/DesignSystemDomain";
import ColorIO from "colorjs.io";
import { DEFAULT_RECOMMANDATIONS } from "../../ui/UiConstants";
import { CanUndoRedo } from "../../util/UndoRedo";
import { invoke } from "@tauri-apps/api";

interface TokenDragTools {
  dragIndex?: number;
  recommandation?: RecommandationMetadata;
  rowDragIndex?: number;
  hoverIndex?: ColorCombinationState;
}

interface CustomRowRecommandation {
  indexPaletteA?: number;
  indexPaletteB?: number;
  recommandationRow?: RecommandationRow;
}

interface TokenCrafterStore {
  collection: ColorCombinationCollection;
  recommandations: RecommandationRow[];
  dragTools: TokenDragTools;
  palettesAndColors: PaletteAndColor[];
  isLoadingRecommandation: boolean;
  customRowRecommandation: CustomRowRecommandation;
  applyBorder: boolean;
  canUndoRedo: CanUndoRedo;
  setCustomRowRecommandation: (customRowReco: CustomRowRecommandation) => void;
  setCollection: (collection: ColorCombinationCollection) => void;
  applyCollection: () => void;
  setDragTools: (dragTools: TokenDragTools) => void;
  generateRecommandations: (designSystem: DesignSystem) => void;
  generateMonochromeRecommandation: (designSystem: DesignSystem) => void;
  generateMultipalettesRecommandation: (designSystem: DesignSystem) => void;
  setApplyBorder: (applyBorder: boolean) => void;
  undoTokenCrafter: () => void;
  redoTokenCrafter: () => void;
}

export const useTokenCrafterStore = create<TokenCrafterStore>((set, get) => ({
  collection: {},
  dragTools: {},
  recommandations: [],
  palettesAndColors: [],
  isLoadingRecommandation: false,
  customRowRecommandation: {},
  applyBorder: true,
  canUndoRedo: {
    canUndo: false,
    canRedo: false,
  },
  setCollection: async (collection) => {
    set((state) => {
      return {
        ...state,
        collection,
      };
    });
    await invoke("do_token_crafter", {
      tokenCrafter: collection,
    });
    const canUndoRedo = await invoke<CanUndoRedo>(
      "can_undo_redo_token_crafter"
    );
    set((state) => {
      return {
        ...state,
        canUndoRedo,
      };
    });
  },
  applyCollection: async () => {
    set((state) => {
      return {
        ...state,
        collection: {
          group: state.collection.group,
          previewComponent: state.collection.previewComponent,
        },
      };
    });
    const { collection } = get();
    await invoke("do_token_crafter", {
      tokenCrafter: collection,
    });
    const canUndoRedo = await invoke<CanUndoRedo>(
      "can_undo_redo_token_crafter"
    );
    set((state) => {
      return {
        ...state,
        canUndoRedo,
      };
    });
  },
  setDragTools(dragTools: TokenDragTools) {
    set((state) => {
      return {
        ...state,
        dragTools,
      };
    });
  },
  generateRecommandations: async (designSystem) => {
    set((state) => {
      return {
        ...state,
        recommandations: [],
        isLoadingRecommandation: true,
        palettesAndColors: [],
      };
    });
    const {
      generateMonochromeRecommandation,
      generateMultipalettesRecommandation,
    } = get();
    generateMonochromeRecommandation(designSystem);
    generateMultipalettesRecommandation(designSystem);
  },
  generateMonochromeRecommandation: async (designSystem: DesignSystem) => {
    const palettesRecommandation: RecommandationRow[] = designSystem.palettes
      .map((palette) => {
        return {
          label: palette.paletteName,
          combinations: palette.tints.flatMap((tint, index) =>
            getMonochromeTintRecommandations(
              tint,
              index,
              palette.tints,
              palette.paletteName,
              DEFAULT_RECOMMANDATIONS
            )
          ),
        } as RecommandationRow;
      })
      .filter((row) => row.combinations.length);
    set((state) => {
      return {
        ...state,
        recommandations: [...state.recommandations, ...palettesRecommandation],
      };
    });
  },
  generateMultipalettesRecommandation: async (designSystem: DesignSystem) => {
    const palettesAndColors = getPaletteAndColor(designSystem.palettes);
    const duos = getColorPaletteDuos(palettesAndColors);
    const complementaryRecommandations = duos.map((duo) =>
      getComplementaryRecommandations({
        duo,
        recommandationContrastPayload: DEFAULT_RECOMMANDATIONS,
      })
    );
    set((state) => {
      return {
        ...state,
        palettesAndColors,
        recommandations: [
          ...state.recommandations,
          ...complementaryRecommandations,
        ],
        isLoadingRecommandation: false,
      };
    });
  },
  setCustomRowRecommandation(newCustomParams: CustomRowRecommandation) {
    const { palettesAndColors } = get();
    const applyParams = { ...newCustomParams };
    if (
      applyParams.indexPaletteA !== undefined &&
      applyParams.indexPaletteB !== undefined
    ) {
      applyParams.recommandationRow = getComplementaryRecommandations({
        duo: [
          palettesAndColors[applyParams.indexPaletteA].palette,
          palettesAndColors[applyParams.indexPaletteB].palette,
        ],
        recommandationContrastPayload: DEFAULT_RECOMMANDATIONS,
      });
    } else {
      applyParams.recommandationRow = undefined;
    }
    set((state) => {
      return {
        ...state,
        customRowRecommandation: applyParams,
      };
    });
  },
  setApplyBorder(applyBorder: boolean) {
    set((state) => {
      return {
        ...state,
        applyBorder,
      };
    });
  },
  undoTokenCrafter: async () => {
    const collection = await invoke<ColorCombinationCollection>(
      "undo_token_crafter"
    );
    const canUndoRedo = await invoke<CanUndoRedo>(
      "can_undo_redo_token_crafter"
    );
    set((state) => {
      return {
        ...state,
        canUndoRedo,
        collection,
      };
    });
  },
  redoTokenCrafter: async () => {
    const collection = await invoke<ColorCombinationCollection>(
      "redo_token_crafter"
    );
    const canUndoRedo = await invoke<CanUndoRedo>(
      "can_undo_redo_token_crafter"
    );
    set((state) => {
      return {
        ...state,
        canUndoRedo,
        collection,
      };
    });
  },
}));

export function getMonochromeTintRecommandations(
  tint: Tint,
  index: number,
  palette: Tint[],
  paletteName: string,
  recommandationContrastPayload: RecommandationContrastPayload[]
): RecommandationMetadata[] {
  const beforeArray = palette.slice(0, Math.max(index - 1, 0)).reverse();
  const afterArray = palette.slice(index + 1, palette.length - 1);
  return [
    ...getRecommandationContrastByArray({
      array: beforeArray,
      tint,
      paletteName,
      recommandationContrastPayload,
    }),
    ...getRecommandationContrastByArray({
      array: afterArray,
      tint,
      paletteName,
      recommandationContrastPayload,
    }),
  ];
}

export function getPaletteAndColor(
  originalPalettes: Palette[]
): PaletteAndColor[] {
  return originalPalettes
    .filter((palette) => palette.tints.length)
    .map((palette) => {
      const mainTint = palette.tints[Math.floor(palette.tints.length / 2)];
      return {
        mainColor: new ColorIO(mainTint.color),
        palette,
      };
    });
}

export function getColorPaletteDuos(
  palettes: PaletteAndColor[]
): [Palette, Palette][] {
  const compatiblePalettes: [Palette, Palette][] = [];

  // Complementary colors
  palettes.forEach((palette) => {
    //Skip for grey
    if ((palette.mainColor.oklch[1] ?? 0) > 0.04) {
      palettes
        .filter(
          (complementary) =>
            isHueGapInRange({
              defaultColor: palette.mainColor,
              comparedColor: complementary.mainColor,
              minGap: 150,
              maxGap: 210,
            }) && !isGray(complementary.mainColor)
        )
        .forEach((complementary) => {
          compatiblePalettes.push([palette.palette, complementary.palette]);
        });
    }
  });

  // Gray + other colors
  palettes.forEach((palette, index) => {
    //Skip colorized
    if (isGray(palette.mainColor)) {
      //First equals hues
      palettes
        .filter(
          (complementary, compIndex) =>
            isHueGapInRange({
              defaultColor: palette.mainColor,
              comparedColor: complementary.mainColor,
              minGap: -30,
              maxGap: 30,
            }) &&
            !isGray(complementary.mainColor) &&
            compIndex !== index
        )
        .forEach((analogue) => {
          compatiblePalettes.push([palette.palette, analogue.palette]);
        });

      //Second complementary hues
      palettes
        .filter(
          (complementary, compIndex) =>
            isHueGapInRange({
              defaultColor: palette.mainColor,
              comparedColor: complementary.mainColor,
              minGap: 150,
              maxGap: 210,
            }) &&
            !isGray(complementary.mainColor) &&
            compIndex !== index
        )
        .forEach((complementary) => {
          compatiblePalettes.push([palette.palette, complementary.palette]);
        });

      palettes
        .filter(
          (complementary, compIndex) =>
            isHueGapInRange({
              defaultColor: palette.mainColor,
              comparedColor: complementary.mainColor,
              minGap: 90,
              maxGap: 150,
            }) &&
            !isGray(complementary.mainColor) &&
            compIndex !== index
        )
        .forEach((complementary) => {
          compatiblePalettes.push([palette.palette, complementary.palette]);
        });

      palettes
        .filter(
          (complementary, compIndex) =>
            isHueGapInRange({
              defaultColor: palette.mainColor,
              comparedColor: complementary.mainColor,
              minGap: 210,
              maxGap: 270,
            }) &&
            !isGray(complementary.mainColor) &&
            compIndex !== index
        )
        .forEach((complementary) => {
          compatiblePalettes.push([palette.palette, complementary.palette]);
        });
    }
  });

  return compatiblePalettes;
}

/**
 * Indique si l'écart de teinte entre `defaultColor` et `comparedColor`
 * se trouve entre `minGap` et `maxGap`, en tenant compte du
 *
 * @param defaultColor - Couleur de référence (ColorIO).
 * @param comparedColor - Couleur à tester (ColorIO).
 * @param minGap - Borne inférieure (en degrés, 0‑360).
 * @param maxGap - Borne supérieure (en degrés, 0‑360).
 * @returns `true` si l'écart est inclus dans l'intervalle, sinon `false`.
 */
export function isHueGapInRange({
  defaultColor,
  comparedColor,
  maxGap,
  minGap,
}: {
  defaultColor: ColorIO;
  comparedColor: ColorIO;
  minGap: number;
  maxGap: number;
}): boolean {
  const h1 = defaultColor.hsl.h % 360;
  const h2 = comparedColor.hsl.h % 360;

  let diff = Math.abs(h1 - h2);
  if (diff > 180) diff = 360 - diff;

  return diff >= minGap && diff <= maxGap;
}

function isGray(color: ColorIO): boolean {
  return (color.oklch[1] ?? 0) < 0.04;
}

export function getComplementaryRecommandations({
  duo,
  recommandationContrastPayload,
}: {
  duo: [Palette, Palette];
  recommandationContrastPayload: RecommandationContrastPayload[];
}): RecommandationRow {
  const mainPalette = duo[0];
  const complementaryPalette = duo[1];

  return {
    label: `${mainPalette.paletteName}-${complementaryPalette.paletteName}`,
    combinations: mainPalette.tints.flatMap((tint, index) => {
      const beforeArray = complementaryPalette.tints
        .slice(0, Math.max(index - 1, 0))
        .reverse();
      const afterArray = complementaryPalette.tints.slice(
        index + 1,
        complementaryPalette.tints.length - 1
      );
      return [
        ...getRecommandationContrastByArray({
          tint,
          array: beforeArray,
          paletteName: mainPalette.paletteName,
          complementaryName: complementaryPalette.paletteName,
          recommandationContrastPayload,
        }),
        ...getRecommandationContrastByArray({
          tint,
          array: afterArray,
          paletteName: mainPalette.paletteName,
          complementaryName: complementaryPalette.paletteName,
          recommandationContrastPayload,
        }),
      ];
    }),
  };
}

function getRecommandationContrastByArray({
  tint,
  array,
  paletteName,
  recommandationContrastPayload,
  complementaryName,
}: {
  tint: Tint;
  array: Tint[];
  paletteName: string;
  complementaryName?: string;
  recommandationContrastPayload: RecommandationContrastPayload[];
}): RecommandationMetadata[] {
  const result: RecommandationMetadata[] = [];

  recommandationContrastPayload.forEach((recommandation) => {
    const text = findTargetContrast({
      array: array,
      contrast: recommandation.text,
      tint,
    });
    const border = findTargetContrast({
      array: array,
      contrast: recommandation.border,
      tint,
    });
    if (text && border) {
      const combination: ColorCombination = {
        background: `${paletteName}-${tint.label}`,
        text: `${complementaryName || paletteName}-${text.label}`,
        border: `${complementaryName || paletteName}-${border.label}`,
      };
      const combinationTokens: ColorCombination = {
        background: `palette-${paletteName}-${tint.label}`,
        text: `palette-${complementaryName || paletteName}-${text.label}`,
        border: `palette-${complementaryName || paletteName}-${border.label}`,
      };
      const bg = new ColorIO(tint.color);
      const ligthness = bg.get("okhsl.l");
      const bgShadow = new ColorIO(
        ligthness < 0.8 ? bg : border?.color ?? text?.color
      );
      bgShadow.alpha = 0.2;

      result.push({
        combinationName: combination,
        combinationTokens,
        backgroundRgba: bgShadow.toString({ format: "srgb" }),
        contrasts: {
          backgroundText: bg.contrastWCAG21(text.color),
          backgroundBorder: bg.contrastWCAG21(border.color),
        },
      });
    }
  });

  return result;
}

function findTargetContrast({
  tint,
  array,
  contrast,
}: {
  tint: Tint;
  array: Tint[];
  contrast: number;
}): Tint | undefined {
  return array.find(
    (compareTint) =>
      new ColorIO(compareTint.color).contrastWCAG21(new ColorIO(tint.color)) >=
      contrast
  );
}

export function getCombinationContrasts(
  combination: ColorCombination
): CombinationContrasts {
  if (!combination.background) return {};
  const background = new ColorIO(combination.background);
  const text = combination.text ? new ColorIO(combination.text) : undefined;
  const border = combination.border
    ? new ColorIO(combination.border)
    : undefined;
  return {
    backgroundText: text ? background.contrastWCAG21(text) : undefined,
    backgroundBorder: border ? background.contrastWCAG21(border) : undefined,
  };
}
