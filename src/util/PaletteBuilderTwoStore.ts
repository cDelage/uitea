import { ChartData, ChartOptions } from "chart.js";
import {
  formatHex,
  okhsl,
  parseHex,
  wcagLuminance,
  hsl,
  oklch,
  okhsv,
  lch,
  hwb,
  lab65,
  lch65,
  luv,
  lchuv,
  dlab,
  dlch,
  Hsl,
  converter,
} from "culori";
import { create } from "zustand";
import {
  DEFAULT_OKHSL,
  DEFAULT_PALETTE_BUILDER,
  PALETTE_BUILDER_DEFAULT_SETTINGS,
} from "../ui/UiConstants";
import { getTintName, TintsNamingMode } from "./TintsNaming";
import { getClosestThree } from "./FindClosestPoints";
import Color from "colorjs.io";

export interface PaletteBuilder {
  name: string;
  mainColorHex: string;
  tints: TintBuilder[];
}

interface ScaleColorPayload {
  tint: TintBuilder;
  index: number;
  tints: TintBuilder[];
}

export type HueConversionAlgorithm =
  | "oklch"
  | "lch"
  | "okhsl"
  | "okhsv"
  | "hsl"
  | "cam16"
  | "hct"
  | "hpluv"
  | "oklchRatio";

export const HUE_CONVERSIONS_ALGORITHM: HueConversionAlgorithm[] = [
  "okhsl",
  "oklch",
  "lch",
  "okhsv",
  "hsl",
  "cam16",
  "hct",
  "hpluv",
  "oklchRatio",
];

interface ScaleSaturationPayload {
  tint: TintBuilder;
  index: number;
  tints: TintBuilder[];
  points: (Point | undefined)[];
}

interface Point {
  x: number;
  y: number;
}

interface ColorRecommanded {
  color: string;
  name: string;
  flag: string;
}

export interface ColorPickerProposition {
  colorName: string;
  minSaturation: number;
  maxSaturation: number;
  fixedPosition: number;
}

export type PASTE_COLOR_MODE = "HUE_BASED" | "FIX_COLOR";

export interface ColorOkhsl {
  hex: string;
  h: number;
  s: number;
  l: number;
}

export interface TintBuilder {
  name: string;
  color: ColorOkhsl;
  isFixed?: boolean;
}

interface NormalizedValues {
  startLuminance: number;
  endLuminance: number;
  minSaturation: number;
  maxSaturation: number;
}

export type SaturationMode =
  | "curve adaptive"
  | "curve fixed"
  | "constants"
  | "linear";

export const SATURATION_MODES: SaturationMode[] = [
  "curve adaptive",
  "curve fixed",
  "constants",
  "linear",
];

interface PaletteBuilderStore {
  steps: number;
  startLuminance: number;
  endLuminance: number;
  minSaturation: number;
  maxSaturation: number;
  hueCorrectionActive: boolean;
  hueCorrectionFactor: number;
  mainPalette: PaletteBuilder;
  additionalPalettes: PaletteBuilder[];
  tintNamingMode: TintsNamingMode;
  saturationMode: SaturationMode;
  colorsRecommanded: ColorRecommanded[];
  tmpHue?: number;
  hueConversionAlgorithm: HueConversionAlgorithm;
  setSteps: (steps: number) => void;
  setTintNamingMode: (tintNamingMode: TintsNamingMode) => void;
  setRangeLuminance: (range: [number, number]) => void;
  setRangeSaturation: (range: [number, number]) => void;
  updatePrimaryPalette: () => void;
  getNormalizedValues: () => NormalizedValues;
  getCharts: () => {
    saturation: ChartData<"line">;
    hue: ChartData<"line">;
    lightness: ChartData<"line">;
    options: ChartOptions<"line">;
    hueOptions: ChartOptions<"line">;
  };
  toggleHueCorrection: () => void;
  setHueCorrectionFactor: (value: number) => void;
  resetLightness: () => void;
  resetSaturation: () => void;
  resetPalette: () => void;
  resetHueCorrection: () => void;
  setMainPaletteColor: (
    mainPalette: PaletteBuilder,
    minSaturation: number,
    maxSaturation: number
  ) => void;
  getColorPropositions: (
    color: string,
    minSaturation: number,
    maxSaturation: number
  ) => ColorPickerProposition;
  scaleLightness: (payload: ScaleColorPayload) => TintBuilder;
  scaleHue: (payload: ScaleColorPayload) => TintBuilder;
  scaleSaturation: (payload: ScaleSaturationPayload) => TintBuilder;
  setSaturationMode: (saturationMode: SaturationMode) => void;
  setMaxSaturation: (maxSaturation: number) => void;
  updateAdditionalPalettes: () => void;
  appendAdditionalPalette: (
    tints: TintBuilder[],
    hue: string,
    name: string
  ) => void;
  setHueConversionAlgorithm: (
    hueConversionAlgorithm: HueConversionAlgorithm
  ) => void;
  getTintsToSynchronize: () => TintBuilder[];
}

export const usePaletteBuilderTwoStore = create<PaletteBuilderStore>(
  (set, get) => ({
    steps: 11,
    startLuminance: PALETTE_BUILDER_DEFAULT_SETTINGS.startLuminance,
    endLuminance: PALETTE_BUILDER_DEFAULT_SETTINGS.endLuminance,
    minSaturation: PALETTE_BUILDER_DEFAULT_SETTINGS.minSaturation,
    maxSaturation: PALETTE_BUILDER_DEFAULT_SETTINGS.maxSaturation,
    hueCorrectionActive: PALETTE_BUILDER_DEFAULT_SETTINGS.hueCorrectionActive,
    hueCorrectionFactor: PALETTE_BUILDER_DEFAULT_SETTINGS.hueCorrectionGap,
    additionalPalettes: [],
    colorsRecommanded: [],
    mainPalette: DEFAULT_PALETTE_BUILDER,
    tintNamingMode: "50,100,200...900,950",
    saturationMode: "curve adaptive",
    hueConversionAlgorithm: "oklch",
    setSteps: (steps: number) => {
      set((state) => {
        return { ...state, steps: Math.min(20, Math.max(3, steps)) };
      });
      get().updatePrimaryPalette();
    },
    setRangeLuminance: (range: [number, number]) => {
      set((state) => {
        return {
          ...state,
          startLuminance: range[0],
          endLuminance: range[1],
        };
      });
      get().updatePrimaryPalette();
    },
    setRangeSaturation: (range: [number, number]) => {
      set((state) => {
        return {
          ...state,
          minSaturation: range[0],
          maxSaturation: range[1],
        };
      });
      get().updatePrimaryPalette();
    },
    updatePrimaryPalette: () => {
      const {
        steps,
        mainPalette,
        tintNamingMode,
        scaleLightness,
        scaleHue,
        scaleSaturation,
        getNormalizedValues,
      } = get();

      const initialHue = okhsl(mainPalette.mainColorHex)?.h ?? 0;

      //Generate tint object
      const initialTints: TintBuilder[] = Array.from(
        { length: steps },
        (_, i) => i
      ).map((i) => {
        const existing: TintBuilder | undefined = mainPalette.tints[i];
        const name = getTintName({
          index: i,
          length: steps,
          mode: tintNamingMode,
          existingName: existing?.name,
        });

        return {
          name,
          isFixed: existing?.isFixed,
          color: existing?.isFixed
            ? { ...existing.color }
            : {
                hex: "",
                h: initialHue,
                s: 1,
                l: 0.5,
              },
        };
      });

      //Apply the lightness
      const tintsWithLightness: TintBuilder[] = initialTints.map(
        (tint, index) =>
          scaleLightness({
            tint,
            index,
            tints: initialTints,
          })
      );

      const { minSaturation, maxSaturation } = getNormalizedValues();

      const points: (Point | undefined)[] = tintsWithLightness.map(
        (tint, index) => {
          if (
            index === 0 ||
            (index === tintsWithLightness.length - 1 && !tint.isFixed)
          ) {
            return {
              x: index,
              y: minSaturation,
            } as Point;
          } else if (
            index === Math.floor(tintsWithLightness.length / 2) &&
            !tint.isFixed
          ) {
            return {
              x: index,
              y: maxSaturation,
            } as Point;
          } else {
            return tint.isFixed
              ? ({ x: index, y: tint.color.s } as Point)
              : undefined;
          }
        }
      );

      const tintsColorized: TintBuilder[] = tintsWithLightness
        .map((tint, index) =>
          scaleHue({
            tints: tintsWithLightness,
            tint,
            index,
          })
        )
        .map((tint, index) =>
          scaleSaturation({
            tint,
            tints: tintsWithLightness,
            index,
            points,
          })
        )
        .map((tint) => {
          return {
            ...tint,
            color: {
              ...tint.color,
              hex: formatHex({
                mode: "okhsl",
                h: tint.color.h,
                s: tint.color.s,
                l: tint.color.l,
              }),
            },
          };
        });

      set((state) => {
        return {
          ...state,
          mainPalette: {
            ...state.mainPalette,
            tints: tintsColorized,
          },
        };
      });

      get().updateAdditionalPalettes();
    },
    scaleLightness: ({ tint, index, tints }) => {
      if (tint.isFixed) {
        return tint;
      }
      const { startLuminance, endLuminance } = get().getNormalizedValues();
      let previousValue: number = startLuminance;
      let nextValue: number = endLuminance;
      let indexPrevious: number = 0;
      let lengthToNext: number = tints.length;

      // Chercher le nombre précédent non undefined
      for (let i = index - 1; i >= 0; i--) {
        if (tints[i]?.isFixed) {
          previousValue = tints[i].color.l;
          indexPrevious = i;
          break;
        }
      }

      // Chercher le nombre suivant non undefined
      for (let i = index + 1; i < tints.length; i++) {
        if (tints[i].isFixed) {
          nextValue = tints[i].color.l;
          lengthToNext = i + 1;
          break;
        }
      }

      return {
        ...tint,
        color: {
          ...tint.color,
          l: linearValue(
            index - indexPrevious,
            lengthToNext - indexPrevious,
            previousValue,
            nextValue
          ),
        },
      };
    },
    scaleHue: ({ index, tint, tints }) => {
      if (tint.isFixed) {
        return tint;
      }

      const { hueCorrectionFactor, hueCorrectionActive } = get();
      const tintsFixed = tints.filter((t) => t.isFixed);

      let h = tint.color.h;

      if (tintsFixed.length <= 1) {
        if (hueCorrectionActive) {
          //Define the lightness to centered the hue correction around
          const centerLightness: number =
            tintsFixed.length === 1
              ? tintsFixed[0].color.l
              : tints[Math.floor(tints.length / 2)].color.l;
          h = correctHue(
            tint.color.h,
            tint.color.l,
            hueCorrectionFactor,
            centerLightness
          );
        }
      } else {
        h = interpolateLinearArray(
          tints.map((tint) => {
            return tint.isFixed ? tint.color.h : undefined;
          }),
          index
        );
      }

      return {
        ...tint,
        color: {
          ...tint.color,
          h,
        },
      };
    },
    scaleSaturation: ({ index, tint, points }) => {
      if (tint.isFixed) {
        return tint;
      }
      const { saturationMode, getNormalizedValues } = get();
      const { maxSaturation, minSaturation } = getNormalizedValues();
      if (saturationMode === "constants") {
        return {
          ...tint,
          color: {
            ...tint.color,
            s: maxSaturation,
          },
        };
      } else if (saturationMode === "curve adaptive") {
        const point = points[index];
        if (point !== undefined) {
          return {
            ...tint,
            color: {
              ...tint.color,
              s: point.y,
            },
          };
        }

        const [a, b, c] = getClosestThree(points, index);

        const s = quadraticInterpolation(a, b, c, index);

        return {
          ...tint,
          color: {
            ...tint.color,
            s,
          },
        };
      } else if (saturationMode === "curve fixed") {
        return {
          ...tint,
          color: {
            ...tint.color,
            s: parabolaValue(
              index,
              points.length,
              minSaturation,
              maxSaturation
            ),
          },
        };
      } else if (saturationMode === "linear") {
        return {
          ...tint,
          color: {
            ...tint.color,
            s: linearValue(index, points.length, minSaturation, maxSaturation),
          },
        };
      }
      return tint;
    },
    getNormalizedValues: () => {
      const { startLuminance, endLuminance, minSaturation, maxSaturation } =
        get();
      return {
        startLuminance: normalizeNumber(startLuminance),
        endLuminance: normalizeNumber(endLuminance),
        maxSaturation: normalizeNumber(maxSaturation),
        minSaturation: normalizeNumber(minSaturation),
      };
    },
    getCharts: () => {
      const { mainPalette } = get();
      return {
        saturation: {
          labels: mainPalette.tints.map((tint) => tint.name), // X : de 0 à 11
          datasets: [
            {
              label: "Saturation",
              data: mainPalette.tints.map((tint) => tint.color.s), // Deuxième jeu de données
              borderColor: "#1e40af",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              tension: 0.4,
              pointRadius: 3,
            },
          ],
        },
        hue: {
          labels: mainPalette.tints.map((tint) => tint.name), // X : de 0 à 11
          datasets: [
            {
              label: "Hue",
              data: mainPalette.tints.map((tint) => tint.color.h), // Deuxième jeu de données
              borderColor: "#1e40af",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              tension: 0.4,
              pointRadius: 3,
            },
          ],
        },
        lightness: {
          labels: mainPalette.tints.map((tint) => tint.name), // X : de 0 à 11
          datasets: [
            {
              label: "Lightness",
              data: mainPalette.tints.map((tint) => tint.color.l), // Deuxième jeu de données
              borderColor: "#1e40af",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              tension: 0.4,
              pointRadius: 3,
            },
          ],
        },
        options: {
          responsive: false, // Désactiver la responsivité pour fixer la taille
          maintainAspectRatio: true,
          animation: false, // Désactiver l'animation au chargement
          scales: {
            x: { min: 0, max: mainPalette.tints.length },
            y: { min: 0, max: 1 },
          },
        },
        hueOptions: {
          responsive: false, // Désactiver la responsivité pour fixer la taille
          maintainAspectRatio: true,
          animation: false, // Désactiver l'animation au chargement
        },
      };
    },
    setTintNamingMode: (tintNamingMode: TintsNamingMode) => {
      set((state) => {
        return {
          ...state,
          tintNamingMode,
        };
      });
      get().updatePrimaryPalette();
    },
    toggleHueCorrection: () => {
      set((state) => {
        return {
          ...state,
          hueCorrectionActive: !state.hueCorrectionActive,
        };
      });
      get().updatePrimaryPalette();
    },
    setHueCorrectionFactor(value: number) {
      set((state) => {
        return {
          ...state,
          hueCorrectionFactor: Math.max(1, Math.min(359, value)),
        };
      });
      get().updatePrimaryPalette();
    },
    resetLightness() {
      set((state) => {
        return {
          ...state,
          startLuminance: PALETTE_BUILDER_DEFAULT_SETTINGS.startLuminance,
          endLuminance: PALETTE_BUILDER_DEFAULT_SETTINGS.endLuminance,
        };
      });
      get().updatePrimaryPalette();
    },
    resetSaturation() {
      set((state) => {
        return {
          ...state,
          minSaturation: PALETTE_BUILDER_DEFAULT_SETTINGS.minSaturation,
          maxSaturation: PALETTE_BUILDER_DEFAULT_SETTINGS.maxSaturation,
        };
      });
      get().updatePrimaryPalette();
    },
    resetPalette() {
      set((state) => {
        return {
          ...state,
          mainPalette: DEFAULT_PALETTE_BUILDER,
          minSaturation: PALETTE_BUILDER_DEFAULT_SETTINGS.minSaturation,
          maxSaturation: PALETTE_BUILDER_DEFAULT_SETTINGS.maxSaturation,
          startLuminance: PALETTE_BUILDER_DEFAULT_SETTINGS.startLuminance,
          endLuminance: PALETTE_BUILDER_DEFAULT_SETTINGS.endLuminance,
          hueCorrectionActive:
            PALETTE_BUILDER_DEFAULT_SETTINGS.hueCorrectionActive,
          hueCorrectionFactor:
            PALETTE_BUILDER_DEFAULT_SETTINGS.hueCorrectionGap,
          additionalPalettes: [],
        };
      });
      get().updatePrimaryPalette();
    },
    resetHueCorrection() {
      set((state) => {
        return {
          ...state,
          hueCorrectionActive:
            PALETTE_BUILDER_DEFAULT_SETTINGS.hueCorrectionActive,
          hueCorrectionFactor:
            PALETTE_BUILDER_DEFAULT_SETTINGS.hueCorrectionGap,
        };
      });
      get().updatePrimaryPalette();
    },
    setMainPaletteColor: (
      mainPalette: PaletteBuilder,
      minSaturation: number,
      maxSaturation: number
    ) => {
      set((state) => {
        return {
          ...state,
          mainPalette,
          minSaturation,
          maxSaturation,
        };
      });
      get().updatePrimaryPalette();
    },
    getColorPropositions: (
      color: string,
      minSaturation: number,
      maxSaturation: number
    ) => {
      //Min & Max are passed in parameters to conserve the original saturation ratio
      const { mainPalette, steps, startLuminance, endLuminance } = get();
      const colorHSL = okhsl(color);
      if (!colorHSL) {
        return {
          colorName: mainPalette.name,
          fixedPosition: 0,
          maxSaturation: maxSaturation,
          minSaturation: minSaturation,
        };
      }
      const lightnessArray = Array.from({ length: steps }, (_, i) => i).map(
        (i) => {
          return linearValue(i, steps, startLuminance, endLuminance);
        }
      );
      const fixedPosition = findClosestIndex(
        Math.floor(colorHSL.l * 100),
        lightnessArray
      );
      const newSaturation = computeParaboleNewPosition({
        index: fixedPosition,
        length: steps,
        min: normalizeNumber(minSaturation),
        max: normalizeNumber(maxSaturation),
        saturation: colorHSL.s,
      });
      const colorName = huesName.includes(mainPalette.name)
        ? getHueName(colorHSL.h ?? 0)
        : mainPalette.name;

      return {
        colorName,
        fixedPosition,
        maxSaturation: Math.floor(newSaturation.max * 100),
        minSaturation: Math.floor(newSaturation.min * 100),
      };
    },
    setSaturationMode: (saturationMode: SaturationMode) => {
      const {
        getColorPropositions,
        mainPalette: { mainColorHex: hue },
      } = get();
      const proposition = getColorPropositions(hue, 50, 100);
      set((state) => {
        return {
          ...state,
          saturationMode,
          minSaturation: proposition.minSaturation,
          maxSaturation: proposition.maxSaturation,
        };
      });
      get().updatePrimaryPalette();
    },
    setMaxSaturation: (maxSaturation: number) => {
      set((state) => {
        return {
          ...state,
          maxSaturation,
        };
      });
      get().updatePrimaryPalette();
    },
    updateAdditionalPalettes: () => {
      const { mainPalette, additionalPalettes, tmpHue } = get();

      const usedColors = additionalPalettes.map(
        (additional) => additional.mainColorHex
      );
      const h = okhsl(mainPalette.mainColorHex)?.h ?? 0;
      if (h !== undefined && tmpHue !== h) {
        const baseColorRecommandation = formatHex({
          mode: "okhsl",
          h,
          l: 0.5,
          s: 1,
        });
        set((state) => {
          return {
            ...state,
            colorsRecommanded: getColorsRecommanded(
              baseColorRecommandation
            ).filter(
              (colorRecommanded) => !usedColors.includes(colorRecommanded.color)
            ),
            tmpHue: h,
          };
        });
      }
    },
    appendAdditionalPalette: (
      appendPaletteTints: TintBuilder[],
      hue: string,
      name: string
    ) => {
      const {
        mainPalette,
        additionalPalettes,
        scaleHue,
        scaleLightness,
        scaleSaturation,
        getNormalizedValues,
      } = get();
      const usedColors = additionalPalettes.map(
        (additional) => additional.mainColorHex
      );
      usedColors.push(hue);
      const initialTints = mainPalette.tints.map((mainTint) => {
        const newTint = appendPaletteTints.find(
          (tint) => tint.name === mainTint.name
        );
        if (newTint) {
          return {
            ...newTint,
            isFixed: true,
          } as TintBuilder;
        }
        return {
          ...mainTint,
          isFixed: false,
          color: DEFAULT_OKHSL,
        };
      });

      const tintsWithLightness = initialTints.map((tint, index) =>
        scaleLightness({
          tint,
          index,
          tints: initialTints,
        })
      );

      const { minSaturation, maxSaturation } = getNormalizedValues();

      const points: (Point | undefined)[] = tintsWithLightness.map(
        (tint, index) => {
          if (
            index === 0 ||
            (index === tintsWithLightness.length - 1 && !tint.isFixed)
          ) {
            return {
              x: index,
              y: minSaturation,
            } as Point;
          } else if (
            index === Math.floor(tintsWithLightness.length / 2) &&
            !tint.isFixed
          ) {
            return {
              x: index,
              y: maxSaturation,
            } as Point;
          } else {
            return tint.isFixed
              ? ({ x: index, y: tint.color.s } as Point)
              : undefined;
          }
        }
      );

      const tintsColorized: TintBuilder[] = tintsWithLightness
        .map((tint, index) =>
          scaleHue({
            tints: tintsWithLightness,
            tint,
            index,
          })
        )
        .map((tint, index) =>
          scaleSaturation({
            tint,
            tints: tintsWithLightness,
            index,
            points,
          })
        )
        .map((tint) => {
          return {
            ...tint,
            color: {
              ...tint.color,
              hex: formatHex({
                mode: "okhsl",
                h: tint.color.h,
                s: tint.color.s,
                l: tint.color.l,
              }),
            },
          };
        });

      const newPalette: PaletteBuilder = {
        name,
        mainColorHex: hue,
        tints: tintsColorized,
      };
      set((state) => {
        return {
          ...state,
          additionalPalettes: [...state.additionalPalettes, newPalette],
          colorsRecommanded: state.colorsRecommanded.filter(
            (colorReco) => !usedColors.includes(colorReco.color)
          ),
        };
      });
    },
    setHueConversionAlgorithm: (
      hueConversionAlgorithm: HueConversionAlgorithm
    ) => {
      set((state) => {
        return {
          ...state,
          hueConversionAlgorithm,
        };
      });
      get().updateAdditionalPalettes();
    },
    getTintsToSynchronize: (): TintBuilder[] => {
      const {
        mainPalette: { tints },
      } = get();
      const tintsToSync: TintBuilder[] = [];
      tintsToSync.push(tints[Math.floor(tints.length / 2)]);
      tintsToSync.push(tints[0]);
      tintsToSync.push(tints[tints.length - 1]);
      const tintsId: string[] = tintsToSync.map((tint) => tint.name);

      return [
        ...tintsToSync,
        ...tints.filter((tint) => tint.isFixed && !tintsId.includes(tint.name)),
      ];
    },
  })
);

function interpolateLinearArray(
  arr: (number | undefined)[],
  index: number
): number {
  // If the value at the index is already defined, return it.
  if (arr[index] !== undefined) {
    return arr[index]!;
  }

  // Find the nearest defined index to the left.
  let leftIndex: number | null = null;
  for (let i = index - 1; i >= 0; i--) {
    if (arr[i] !== undefined) {
      leftIndex = i;
      break;
    }
  }

  // Find the nearest defined index to the right.
  let rightIndex: number | null = null;
  for (let i = index + 1; i < arr.length; i++) {
    if (arr[i] !== undefined) {
      rightIndex = i;
      break;
    }
  }

  // Case 1: Interpolate between a defined left and right value.
  if (leftIndex !== null && rightIndex !== null) {
    const leftValue = arr[leftIndex]!;
    const rightValue = arr[rightIndex]!;
    const slope = (rightValue - leftValue) / (rightIndex - leftIndex);
    return leftValue + slope * (index - leftIndex);
  }

  // Case 2: Extrapolate to the left (no defined value on the left).
  if (leftIndex === null && rightIndex !== null) {
    // Find the second defined value on the right.
    let rightIndex2: number | null = null;
    for (let i = rightIndex + 1; i < arr.length; i++) {
      if (arr[i] !== undefined) {
        rightIndex2 = i;
        break;
      }
    }
    if (rightIndex2 !== null) {
      const firstValue = arr[rightIndex]!;
      const secondValue = arr[rightIndex2]!;
      const slope = (secondValue - firstValue) / (rightIndex2 - rightIndex);
      // Extrapolate leftwards by "rewinding" the slope from the first defined value.
      return firstValue - slope * (rightIndex - index);
    } else {
      // Only one defined value exists on the right.
      return arr[rightIndex]!;
    }
  }

  // Case 3: Extrapolate to the right (no defined value on the right).
  if (rightIndex === null && leftIndex !== null) {
    // Find the second defined value on the left.
    let leftIndex2: number | null = null;
    for (let i = leftIndex - 1; i >= 0; i--) {
      if (arr[i] !== undefined) {
        leftIndex2 = i;
        break;
      }
    }
    if (leftIndex2 !== null) {
      const lastValue = arr[leftIndex]!;
      const previousValue = arr[leftIndex2]!;
      const slope = (lastValue - previousValue) / (leftIndex - leftIndex2);
      // Extrapolate rightwards by extending the slope from the last defined value.
      return lastValue + slope * (index - leftIndex);
    } else {
      // Only one defined value exists on the left.
      return arr[leftIndex]!;
    }
  }

  // No defined value in the array; interpolation is impossible.
  throw new Error("No defined value in the array.");
}

function computeParaboleNewPosition({
  index,
  length,
  max,
  min,
  saturation,
}: {
  min: number;
  max: number;
  length: number;
  index: number;
  saturation: number;
}) {
  const originalSaturation = parabolaValue(index, length, min, max);

  const gap = saturation - originalSaturation;
  return {
    min: betweenZeroOne(min + gap),
    max: betweenZeroOne(max + gap),
  };
}

function linearValue(
  index: number,
  length: number,
  min: number,
  max: number
): number {
  if (length <= 1) return max; // Cas particulier pour un tableau d'un seul élément.

  // Normalisation de l'index dans l'intervalle [0, 1]
  const normalized = index / (length - 1);

  // Interpolation linéaire entre min et max
  return min + (max - min) * normalized;
}

function parabolaValue(
  index: number,
  length: number,
  min: number,
  max: number
): number {
  if (length <= 1) return max; // Cas particulier pour un tableau d'un seul élément.

  // Calcul du centre et normalisation de l’index sur [-1, 1]
  const center = (length - 1) / 2;
  const normalized = (index - center) / center;

  // Calcul de la parabole : 1 au centre, 0 aux extrémités
  const parabola = 1 - normalized * normalized;

  // Mise à l'échelle : quand parabola vaut 0, on obtient min; quand elle vaut 1, on obtient max.
  return betweenZeroOne(min + (max - min) * parabola);
}

function normalizeNumber(n: number) {
  return n / 100;
}

// Fonction de correction de la teinte
//Center ligthness = 0 correction
function correctHue(
  hue: number,
  lightness: number,
  hueCorrectionFactor: number,
  centerLightness: number
): number {
  const t = lightness - centerLightness;
  return (hue + hueCorrectionFactor * -(-t * t + 2 * t)) % 360; // Assurer que la teinte reste dans [0, 360]
}

function findClosestIndex(initial: number, numbers: number[]): number {
  let closestIndex = 0;
  let minDiff = Math.abs(numbers[0] - initial);

  for (let i = 1; i < numbers.length; i++) {
    const diff = Math.abs(numbers[i] - initial);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }

  return closestIndex;
}

const huesName: string[] = [
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "purple",
  "pink",
];

export function getHueName(angle: number): string {
  if (angle < 15 || angle >= 345) return "red";
  if (angle < 45) return "orange";
  if (angle < 75) return "yellow";
  if (angle < 105) return "lime";
  if (angle < 135) return "green";
  if (angle < 165) return "teal";
  if (angle < 195) return "cyan";
  if (angle < 225) return "blue";
  if (angle < 255) return "indigo";
  if (angle < 285) return "violet";
  if (angle < 315) return "purple";
  return "pink";
}

export function getColorOkhsl(colorCode: string): ColorOkhsl {
  const okhslColor = okhsl(colorCode);
  if (!okhslColor)
    return {
      hex: colorCode,
      h: 0,
      s: 0,
      l: 0,
    };

  return {
    hex: formatHex(colorCode) ?? "",
    h: okhslColor.h ?? 0,
    s: okhslColor.s,
    l: okhslColor.l,
  };
}

export function getContrastColor(hex: string) {
  const color = parseHex(hex);
  const lum = wcagLuminance(color);
  // Si la luminance est supérieure à 0.5, la couleur est plutôt claire : optez pour du noir.
  return lum > 0.5 ? "black" : "white";
}

function betweenZeroOne(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * Calculates the y-value for a given x based on three points (a, b, c)
 * using quadratic interpolation (Lagrange formula).
 *
 * @param a - First point with x and y properties.
 * @param b - Second point with x and y properties.
 * @param c - Third point with x and y properties.
 * @param x - The x value for which the y value is to be determined.
 * @returns The interpolated y value.
 */
function quadraticInterpolation(
  a: Point,
  b: Point,
  c: Point,
  x: number
): number {
  // Calculate the Lagrange coefficients
  const L0 = ((x - b.x) * (x - c.x)) / ((a.x - b.x) * (a.x - c.x));
  const L1 = ((x - a.x) * (x - c.x)) / ((b.x - a.x) * (b.x - c.x));
  const L2 = ((x - a.x) * (x - b.x)) / ((c.x - a.x) * (c.x - b.x));

  // Return the interpolated value
  return betweenZeroOne(a.y * L0 + b.y * L1 + c.y * L2);
}

export function getColorsRecommanded(initialColor: string): ColorRecommanded[] {
  const initialColorOkhsl = hsl(initialColor, "hsl");
  const hue = initialColorOkhsl?.h;
  if (hue === undefined || initialColorOkhsl === undefined) return [];
  const lightInitialColor: Hsl = {
    ...initialColorOkhsl,
    l: 0.5,
    s: 1,
  };
  return COLOR_TO_RECOMMAND.map((toRecomand) => {
    return getColorRecommanded({
      ...toRecomand,
      initialColorOkhsl: lightInitialColor,
      hue,
    });
  });
}

interface ColorToRecommand {
  flag: string;
  gap: number;
}

const COLOR_TO_RECOMMAND: ColorToRecommand[] = [
  {
    flag: "complementary",
    gap: 180,
  },
  {
    flag: "square",
    gap: 270,
  },
  {
    flag: "triad",
    gap: 120,
  },
  {
    flag: "triad",
    gap: 240,
  },
  {
    flag: "square",
    gap: 90,
  },
  {
    flag: "dozen",
    gap: 30,
  },
  {
    flag: "dozen",
    gap: 60,
  },
  {
    flag: "dozen",
    gap: 150,
  },
  {
    flag: "dozen",
    gap: 210,
  },
  {
    flag: "dozen",
    gap: 300,
  },
  {
    flag: "dozen",
    gap: 330,
  },
];

function getColorRecommanded({
  flag,
  gap,
  hue,
  initialColorOkhsl,
}: {
  gap: number;
  flag: string;
  initialColorOkhsl: Hsl;
  hue: number;
}): ColorRecommanded {
  const newColor = { ...initialColorOkhsl, h: (hue + gap) % 360 };
  formatHex(newColor);
  return {
    color: formatHex(newColor),
    name: getHueName(newColor.h),
    flag: flag,
  };
}

export function applyColorHue(
  color: string,
  algorithm: HueConversionAlgorithm,
  targetHueHex: string
): string {
  switch (algorithm) {
    case "okhsl":
      return convertOkhsl(color, targetHueHex);
    case "lch":
      return convertLch(color, targetHueHex);
    case "okhsv":
      return convertOkhsv(color, targetHueHex);
    case "oklch":
      return convertOklch(color, targetHueHex);
    case "hsl":
      return convertHsl(color, targetHueHex);
    case "cam16":
      return convertCam16(color, targetHueHex);
    case "hct":
      return convertHct(color, targetHueHex);
    case "hpluv":
      return convertHpluv(color, targetHueHex);
    case "oklchRatio":
      return convertOklchRatio(color, targetHueHex);
  }
}

function convertHsl(color: string, hue: string) {
  const h = hsl(hue)?.h;
  const colorHsl = hsl(color);
  return formatHex({
    mode: "hsl",
    h,
    s: colorHsl?.s ?? 0,
    l: colorHsl?.l ?? 0,
  });
}

// Crée un convertisseur depuis OKLCH vers sRGB.
const toSrgb = converter("rgb");
/**
 * Convertit une couleur définie en OKLCH vers une représentation sRGB.
 * @param color - Objet contenant les propriétés l (luminosité), c (chroma) et h (teinte, en degrés)
 * @returns Un objet avec les composantes r, g, b (entre 0 et 1)
 * @throws Une erreur si la conversion échoue (ex. couleur hors gamut)
 */
export function oklchToSrgb({ l, c, h }: { l: number; c: number; h: number }): {
  r: number;
  g: number;
  b: number;
} {
  const rgb = toSrgb(
    formatHex({
      mode: "oklch",
      l,
      c,
      h,
    }),
    "rgb"
  );
  if (
    !rgb ||
    typeof rgb.r !== "number" ||
    typeof rgb.g !== "number" ||
    typeof rgb.b !== "number"
  ) {
    throw new Error("La conversion vers sRGB a échoué pour la couleur donnée.");
  }
  const { r, g, b } = rgb;
  return { r, g, b };
}

// Vérifie si la couleur est dans le gamut sRGB (les composantes r, g, b sont entre 0 et 1).
function isWithinGamut(color: { l: number; c: number; h: number }): boolean {
  const { r, g, b } = oklchToSrgb(color);
  return r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1;
}

// Calcule le chroma maximal atteignable pour une teinte (h) et une luminosité (l)
// en utilisant une recherche dichotomique dans l'espace OKLCH.
function getMaxChromaForHueAndLuminance(h: number, l: number): number {
  let low = 0;
  let high = 1;

  // Augmente "high" jusqu'à sortir du gamut.
  while (isWithinGamut({ l, c: high, h })) {
    high *= 2;
    if (high > 100) break; // sécurité pour éviter une boucle infinie
  }

  // Recherche dichotomique pour trouver le maximum précis.
  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    if (isWithinGamut({ l, c: mid, h })) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return low;
}

// Calcule la chroma ajustée en fonction de la teinte de base et de la teinte cible.
// originalChroma : chroma de la couleur de base
// baseHue : teinte de la couleur de base (en degrés)
// targetHue : teinte souhaitée (en degrés)
// l : luminosité (entre 0 et 1 ou 0 et 100 selon votre convention)
function scaleChroma(
  originalChroma: number,
  baseHue: number,
  targetHue: number,
  l: number
): number {
  const maxChromaBase = getMaxChromaForHueAndLuminance(baseHue, l);
  const maxChromaTarget = getMaxChromaForHueAndLuminance(targetHue, l);
  const scalingFactor = maxChromaTarget / maxChromaBase;
  return originalChroma * scalingFactor;
}

function convertOklch(color: string, hue: string) {
  const h = oklch(hue)?.h;
  const colorOklch = oklch(color);
  const c = scaleChroma(
    colorOklch?.c ?? 0,
    colorOklch?.h ?? 0,
    h ?? 0,
    colorOklch?.l ?? 0
  );
  return formatHex({
    mode: "oklch",
    l: colorOklch?.l ?? 0,
    c,
    h,
  });
}

function convertOkhsl(color: string, hue: string) {
  const h = okhsl(hue)?.h;
  const colorOkhsl = okhsl(color);

  return formatHex({
    mode: "okhsl",
    h,
    s: colorOkhsl?.s ?? 0,
    l: colorOkhsl?.l ?? 0,
  });
}

function convertLch(color: string, hue: string) {
  const h = lch(hue)?.h;
  const colorLch = lch(color);
  return formatHex({
    mode: "lch",
    l: colorLch?.l ?? 0,
    c: colorLch?.c ?? 0,
    h,
  });
}

function convertOkhsv(color: string, hue: string) {
  const h = okhsv(hue)?.h;
  const colorOkhsv = okhsv(color);
  return formatHex({
    mode: "okhsv",
    h,
    s: colorOkhsv?.s ?? 0,
    v: colorOkhsv?.v ?? 0,
  });
}

export function convertHwb(color: string, hue: string) {
  const h = hwb(hue)?.h;
  const colorHwb = hwb(color);
  return formatHex({
    mode: "hwb",
    h,
    w: colorHwb?.w ?? 0,
    b: colorHwb?.b ?? 0,
  });
}

export function convertLab65(color: string, hue: string) {
  const hueLab65 = lab65(hue);
  const newHue = hueLab65
    ? (Math.atan2(hueLab65.b, hueLab65.a) * 180) / Math.PI
    : 0;
  const colorLab65 = lab65(color);
  const L = colorLab65?.l ?? 0;
  const a = colorLab65?.a ?? 0;
  const b = colorLab65?.b ?? 0;
  const chroma = Math.sqrt(a * a + b * b);
  const newHueRadians = newHue * (Math.PI / 180);
  const newA = chroma * Math.cos(newHueRadians);
  const newB = chroma * Math.sin(newHueRadians);
  return formatHex({
    mode: "lab65",
    l: L,
    a: newA,
    b: newB,
  });
}

export function convertLch65(color: string, hue: string) {
  const h = lch65(hue)?.h;
  const colorLch65 = lch65(color);
  return formatHex({
    mode: "lch65",
    l: colorLch65?.l ?? 0,
    c: colorLch65?.c ?? 0,
    h,
  });
}

export function convertLuv(color: string, hue: string) {
  const hueLuv = luv(hue);
  const newHue = hueLuv ? (Math.atan2(hueLuv.v, hueLuv.u) * 180) / Math.PI : 0;
  const colorLuv = luv(color);
  const L = colorLuv?.l ?? 0;
  const u = colorLuv?.u ?? 0;
  const v = colorLuv?.v ?? 0;
  const chroma = Math.sqrt(u * u + v * v);
  const newHueRadians = newHue * (Math.PI / 180);
  const newU = chroma * Math.cos(newHueRadians);
  const newV = chroma * Math.sin(newHueRadians);
  return formatHex({
    mode: "luv",
    l: L,
    u: newU,
    v: newV,
  });
}

export function convertLchuv(color: string, hue: string) {
  const h = lchuv(hue)?.h;
  const colorLchuv = lchuv(color);
  return formatHex({
    mode: "lchuv",
    l: colorLchuv?.l ?? 0,
    c: colorLchuv?.c ?? 0,
    h,
  });
}

export function convertDlab(color: string, hue: string) {
  const hueDlab = dlab(hue);
  const newHue = hueDlab
    ? (Math.atan2(hueDlab.b, hueDlab.a) * 180) / Math.PI
    : 0;
  const colorDlab = dlab(color);
  const L = colorDlab?.l ?? 0;
  const a = colorDlab?.a ?? 0;
  const b = colorDlab?.b ?? 0;
  const chroma = Math.sqrt(a * a + b * b);
  const newHueRadians = newHue * (Math.PI / 180);
  const newA = chroma * Math.cos(newHueRadians);
  const newB = chroma * Math.sin(newHueRadians);
  return formatHex({
    mode: "dlab",
    l: L,
    a: newA,
    b: newB,
  });
}

export function convertDlch(color: string, hue: string) {
  const h = dlch(hue)?.h;
  const colorDlch = dlch(color);
  return formatHex({
    mode: "dlch",
    l: colorDlch?.l ?? 0,
    c: colorDlch?.c ?? 0,
    h,
  });
}

function convertCam16(color: string, hue: string): string {
  // Conversion de la couleur d'origine dans l'espace CAM16
  const cam16Color = new Color(color).to("cam16-jmh");

  const newHue = new Color(hue).to("cam16-jmh").h;

  // Modification de la teinte (propriété "h" dans CAM16)
  cam16Color.h = newHue;

  // Reconversion de la couleur modifiée en sRGB pour obtenir un résultat affichable
  const newColor = new Color(cam16Color).to("srgb");

  // Retourner la représentation hexadécimale de la nouvelle couleur
  return newColor.toString({ format: "hex" });
}

function convertHct(color: string, hue: string): string {
  // Conversion de la couleur d'origine dans l'espace CAM16
  const hctColor = new Color(color).to("hct");

  const newHue = new Color(hue).to("hct").h;

  // Modification de la teinte (propriété "h" dans CAM16)
  hctColor.h = newHue;

  // Reconversion de la couleur modifiée en sRGB pour obtenir un résultat affichable
  const newColor = new Color(hctColor).to("srgb");

  // Retourner la représentation hexadécimale de la nouvelle couleur
  return newColor.toString({ format: "hex" });
}

function convertHpluv(color: string, hue: string): string {
  // Conversion de la couleur d'origine dans l'espace CAM16
  const hctColor = new Color(color).to("hpluv");

  const newHue = new Color(hue).to("hpluv").h;

  // Modification de la teinte (propriété "h" dans CAM16)
  hctColor.h = newHue;

  // Reconversion de la couleur modifiée en sRGB pour obtenir un résultat affichable
  const newColor = new Color(hctColor).to("srgb");

  // Retourner la représentation hexadécimale de la nouvelle couleur
  return newColor.toString({ format: "hex" });
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Vérifie que la couleur sRGB reste dans le gamut [0,1] pour chaque composante.
 */
function isInGamut(rgb: RGB): boolean {
  return (
    rgb.r >= 0 &&
    rgb.r <= 1 &&
    rgb.g >= 0 &&
    rgb.g <= 1 &&
    rgb.b >= 0 &&
    rgb.b <= 1
  );
}

/**
 * Retourne le chroma maximal pour une luminosité (L) et une teinte (h) donnés,
 * de sorte que la conversion OKLCH → sRGB reste dans le gamut.
 */
function maxChromaForLh(L: number, h: number): number {
  // Prépare la fonction de conversion depuis OKLCH vers sRGB
  // Ici, on indique que l'entrée est en OKLCH avec {mode: 'oklch'}
  const toSRGB = converter("rgb");

  let low = 0;
  let high = 1;

  // On augmente la valeur de c jusqu'à ce que la couleur sorte du gamut sRGB
  while (isInGamut(toSRGB({ mode: "oklch", l: L, c: high, h }))) {
    high *= 2;
    if (high > 100) break; // Sécurité pour éviter une boucle infinie
  }

  // Recherche binaire pour raffiner la valeur maximale de chroma
  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    const rgb = toSRGB({ mode: "oklch", l: L, c: mid, h });
    if (isInGamut(rgb)) {
      low = mid; // La valeur mid est valide, on peut tenter d'augmenter c
    } else {
      high = mid; // mid est hors gamut, on réduit c
    }
  }
  return low;
}

function adaptRatio(initialValue: number, initialMax: number, newMax: number) {
  return (initialValue / initialMax) * newMax;
}

function convertOklchRatio(color: string, hue: string) {
  const h = oklch(hue)?.h ?? 0;
  const colorOklch = oklch(color);
  const initialMax = maxChromaForLh(colorOklch?.l ?? 0, colorOklch?.h ?? 0);
  const newMax = maxChromaForLh(colorOklch?.l ?? 0, h);

  const c = adaptRatio(colorOklch?.c ?? 0, initialMax, newMax);

  return formatHex({
    mode: "oklch",
    l: colorOklch?.l ?? 0,
    c,
    h,
  });
}
