import { create } from "zustand";
import { getTintName, TintsNamingMode } from "../../../util/TintsNaming";
import { hsl } from "culori";
import { Color as ChromaColor } from "chroma-js";
import { ChartData, ChartOptions } from "chart.js";
import ColorIO from "colorjs.io";
import { v4 } from "uuid";
import { Palette } from "../../../domain/DesignSystemDomain";
import { PICKER_MODES, ColorSpace, PickerAxe } from "../../../util/PickerUtil";
import { moveItem } from "../../../util/ArrayMove";
import { linearPieceInterpolation } from "../../../util/Interpolation";

export interface HslStore {
  h: number;
  s: number;
  l: number;
}

export interface OklchStore {
  l: number;
  c: number;
  h: number;
}

export type PaletteColor = ChromaColor & {
  hslStore?: HslStore;
  oklchStore?: OklchStore;
};

export type InterpolationColorSpace = "oklch" | "lch" | "hsl";

export type HueGapMode = "accurate" | "large";

export const HUE_GAP_MODES: HueGapMode[] = ["accurate", "large"];

export const INTERPOLATIONS_COLOR_SPACES: InterpolationColorSpace[] = [
  "oklch",
  "lch",
  "hsl",
];

export type PaletteAxeSetting =
  | "lightnessMax"
  | "lightnessMin"
  | "satChromaGapLeft"
  | "satChromaGapRight"
  | "hueGapLeft"
  | "hueGapRight";

export interface PaletteSettings {
  lightnessMax: number;
  lightnessMin: number;
  satChromaGapLeft: number;
  satChromaGapRight: number;
  hueGapLeft: number;
  hueGapRight: number;
  hueGapModeLeft: HueGapMode;
  hueGapModeRight: HueGapMode;
}

interface ColorPositionIndex {
  color?: ColorIO;
  index: number;
}

interface ReduceColors {
  colors: ColorIO[];
  previousColor: ColorPositionIndex;
}

export interface PaletteBuild {
  id: string;
  name: string;
  tints: TintBuild[];
  settings: PaletteSettings;
}

export interface TintBuild {
  name: string;
  isAnchor?: boolean;
  isCenter?: boolean;
  color: ColorIO;
}

interface PalettesStoreSettings {
  steps: number;
  tintNamingMode: TintsNamingMode;
  interpolationColorSpace: InterpolationColorSpace;
  paletteSettings: PaletteSettings;
}

export interface Point {
  x: number;
  y: number;
}

interface PaletteBuilderStore {
  palettes: PaletteBuild[];
  settings: PalettesStoreSettings;
  createPalette: (tint?: ColorIO) => void;
  createPaletteFromExisting: (
    palette: PaletteBuild,
    color: ColorRecommanded
  ) => void;
  updatePalettes: () => void;
  updatePalette: (index: number, palette: PaletteBuild) => void;
  setSettings: (settings: PalettesStoreSettings) => void;
  reset: () => void;
  deletePalette: (id: string) => void;
  movePalette: (fromIndex: number, toIndex: number) => void;
}

export const usePaletteBuilder3Store = create<PaletteBuilderStore>(
  (set, get) => ({
    palettes: [],
    settings: {
      steps: 11,
      tintNamingMode: "50,100,200...900,950",
      interpolationColorSpace: "oklch",
      paletteSettings: {
        lightnessMax: 0.9,
        lightnessMin: 0.1,
        satChromaGapRight: 0.5,
        satChromaGapLeft: 0.5,
        hueGapLeft: 0.5,
        hueGapRight: 0.5,
        hueGapModeLeft: "accurate",
        hueGapModeRight: "accurate",
      },
    },
    createPalette(tint?: ColorIO) {
      const { settings } = get();
      const paletteTint = new ColorIO(tint ?? "#DDDDDD");
      const [startColor, endColor] = getEndsTints({
        color: paletteTint,
        settings: settings.paletteSettings,
        interpolationColorSpace: settings.interpolationColorSpace,
      });
      const tintPrebuild: TintBuild[] = [startColor, paletteTint, endColor].map(
        (color, index) => {
          return {
            name: getTintName({
              index,
              length: 3,
              mode: settings.tintNamingMode,
            }),
            color,
            isCenter: index === 1,
          };
        }
      );
      const tints: TintBuild[] = constructTints(tintPrebuild, settings);
      set((state) => {
        return {
          ...state,
          palettes: [
            ...state.palettes,
            {
              id: v4(),
              name: getHueName(paletteTint.toString({ format: "hex" })),
              tints,
              settings: settings.paletteSettings,
            },
          ],
        };
      });
    },
    createPaletteFromExisting(
      palette: PaletteBuild,
      colorRecommanded: ColorRecommanded
    ) {
      const { settings } = get();
      const [startColor, endColor] = getEndsTints({
        color: colorRecommanded.color,
        settings: palette.settings,
        interpolationColorSpace: settings.interpolationColorSpace,
      });
      const tints: TintBuild[] = palette.tints.map((tint, index) => {
        let color = tint.color;
        if (index === 0) {
          color = startColor;
        }
        if (index === palette.tints.length - 1) {
          color = endColor;
        }
        if (tint.isCenter) {
          color = colorRecommanded.color;
        }
        if (tint.isAnchor) {
          const newColor = new ColorIO("oklch", [
            tint.color.oklch[0],
            tint.color.oklch[1],
            colorRecommanded.color.oklch[2],
          ]);
          color = hwbHueAligner({
            newColor: newColor,
            colorToAlign: tint.color,
          });
        }

        return {
          ...tint,
          color,
        };
      });
      set((state) => {
        return {
          ...state,
          palettes: [
            ...state.palettes,
            {
              ...palette,
              id: v4(),
              name: colorRecommanded.name,
              tints: constructTints(tints, settings),
            },
          ],
        };
      });
    },
    updatePalettes() {
      const { settings } = get();
      set((state) => {
        return {
          ...state,
          palettes: state.palettes.map((palette) => {
            return {
              ...palette,
              tints: constructTints(palette.tints, settings),
            };
          }),
        };
      });
    },
    updatePalette(index: number, newPalette: PaletteBuild) {
      const { settings } = get();
      const centerTint = newPalette.tints.find((tint) => tint.isCenter);
      if (centerTint) {
        const [startColor, endColor] = getEndsTints({
          color: centerTint.color,
          settings: newPalette.settings,
          existingTints: newPalette.tints,
          interpolationColorSpace: settings.interpolationColorSpace,
        });
        const tints = constructTints(
          newPalette.tints.map((tint, index) => {
            if (index === 0 && !tint.isAnchor) {
              tint.color = startColor;
            }
            if (index === newPalette.tints.length - 1 && !tint.isAnchor) {
              tint.color = endColor;
            }
            return tint;
          }),
          settings
        );
        set((state) => {
          return {
            ...state,
            palettes: state.palettes.map((palette, i) =>
              index === i ? { ...newPalette, tints } : palette
            ),
          };
        });
      }
    },
    setSettings(settings: PalettesStoreSettings) {
      set((state) => {
        return {
          ...state,
          settings: {
            ...settings,
            steps: autoRangeNumber(settings.steps, 3, 20),
          },
        };
      });
      get().updatePalettes();
    },
    reset() {
      set((state) => {
        return {
          ...state,
          palettes: [],
        };
      });
    },
    deletePalette(id: string) {
      set((state) => {
        return {
          ...state,
          palettes: state.palettes.filter((palette) => palette.id !== id),
        };
      });
    },
    movePalette(fromIndex: number, toIndex: number) {
      set((state) => {
        return {
          ...state,
          palettes: moveItem(state.palettes, fromIndex, toIndex),
        };
      });
    },
  })
);

export function getProportionalValue({
  initialMax,
  initialMin,
  initialValue,
  newMax,
  newMin,
}: {
  initialValue: number;
  initialMin: number;
  initialMax: number;
  newMin: number;
  newMax: number;
}): number {
  return (
    newMin +
    ((initialValue - initialMin) * (newMax - newMin)) /
      (initialMax - initialMin)
  );
}

export const huesName: string[] = [
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

export function getHueName(color: string): string {
  const angle = hsl(color)?.h ?? 0;
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

export function getEndsTints({
  color,
  existingTints,
  settings,
  interpolationColorSpace,
}: {
  color: ColorIO;
  settings: PaletteSettings;
  existingTints?: TintBuild[];
  interpolationColorSpace: InterpolationColorSpace;
}): [ColorIO, ColorIO] {
  const startColor = color.mix("#ffffff", settings.lightnessMax, {
    space: "oklch",
  });
  const endColor = color.mix("#000000", 1 - settings.lightnessMin, {
    space: "oklch",
  });
  const centerTintIndex = existingTints?.findIndex((tint) => tint.isCenter);
  if (centerTintIndex !== undefined && centerTintIndex !== -1) {
    const leftAnchor = existingTints?.find(
      (tint, index) => tint.isAnchor && index < centerTintIndex
    );
    const rightAnchor = existingTints
      ? [...existingTints]
          ?.reverse()
          .find((tint, index) => tint.isAnchor && index < centerTintIndex)
      : undefined;
    if (leftAnchor) {
      startColor.set({
        "oklch.h": leftAnchor.color.get("oklch.h"),
      });
    }
    if (rightAnchor) {
      endColor.set({
        "oklch.h": rightAnchor.color.get("oklch.h"),
      });
    }

    const picker: ColorSpace | undefined = PICKER_MODES.find(
      (mode) => mode.space === interpolationColorSpace
    );
    const satChromaAxe: PickerAxe | undefined = picker?.axes.find(
      (axe) => axe.axe === "s" || axe.axe === "c"
    );
    const hueAxe: PickerAxe | undefined = picker?.axes.find(
      (axe) => axe.axe === "h"
    );

    if (settings.satChromaGapLeft !== 0.5 && satChromaAxe) {
      const colorPoints = getColorAxeToPoints({
        axe: satChromaAxe,
        centerColor: startColor,
        interpolationColorSpace,
        positionX: settings.satChromaGapLeft,
      });
      const newSatChroma = linearPieceInterpolation(colorPoints);
      startColor.set(
        `${interpolationColorSpace}.${satChromaAxe.axe}`,
        newSatChroma
      );
    }

    if (settings.satChromaGapRight !== 0.5 && satChromaAxe) {
      const colorPoints = getColorAxeToPoints({
        axe: satChromaAxe,
        centerColor: endColor,
        interpolationColorSpace,
        positionX: settings.satChromaGapRight,
      });
      const newSatChroma = linearPieceInterpolation(colorPoints);
      endColor.set(
        `${interpolationColorSpace}.${satChromaAxe.axe}`,
        newSatChroma
      );
    }

    if (settings.hueGapLeft !== 0.5 && hueAxe) {
      const startHue = startColor.get(`${interpolationColorSpace}.h`);
      const colorPoints = getColorAxeToPoints({
        axe: {
          ...hueAxe,
          min:
            settings.hueGapModeLeft === "accurate" ? startHue - 20 : hueAxe.min,
          max:
            settings.hueGapModeLeft === "accurate" ? startHue + 20 : hueAxe.max,
        },
        centerColor: startColor,
        interpolationColorSpace,
        positionX: settings.hueGapLeft,
      });
      const newHue = linearPieceInterpolation(colorPoints);
      startColor.set(`${interpolationColorSpace}.${hueAxe.axe}`, newHue);
    }

    if (settings.hueGapRight !== 0.5 && hueAxe) {
      const endHue = endColor.get(`${interpolationColorSpace}.h`);
      const colorPoints = getColorAxeToPoints({
        axe: {
          ...hueAxe,
          min:
            settings.hueGapModeLeft === "accurate" ? endHue - 20 : hueAxe.min,
          max:
            settings.hueGapModeLeft === "accurate" ? endHue + 20 : hueAxe.max,
        },
        centerColor: endColor,
        interpolationColorSpace,
        positionX: settings.hueGapRight,
      });
      const newHue = linearPieceInterpolation(colorPoints);
      endColor.set(`${interpolationColorSpace}.${hueAxe.axe}`, newHue);
    }
  }
  return [startColor, endColor];
}

function getColorAxeToPoints({
  axe,
  positionX,
  centerColor,
  interpolationColorSpace,
}: {
  axe: PickerAxe;
  positionX: number;
  centerColor: ColorIO;
  interpolationColorSpace: InterpolationColorSpace;
}): {
  min: Point;
  max: Point;
  center: Point;
  positionX: number;
} {
  return {
    min: {
      x: 0,
      y: axe.min,
    },
    center: {
      x: 0.5,
      y: centerColor.get(`${interpolationColorSpace}.${axe.axe}`),
    },
    max: {
      x: 1,
      y: axe.max,
    },
    positionX,
  };
}

export function autoRangeNumber(
  value: number,
  min: number,
  max: number,
  modulo?: boolean
) {
  if (modulo) {
    return Math.max(min, value % max);
  }
  return Math.min(max, Math.max(min, value));
}

function constructTints(
  originalTints: TintBuild[],
  settings: PalettesStoreSettings
): TintBuild[] {
  const { interpolationColorSpace, tintNamingMode, steps } = settings;
  //Step 1 : construct an array with the fixed colors : [Color, undefined, undefined, Color...]
  const anchorTints: (TintBuild | undefined)[] = Array.from(
    { length: steps },
    (_, i) => {
      if (i === 0) {
        return originalTints[0];
      }
      if (i === Math.floor(steps / 2)) {
        return (
          originalTints.find((tint) => tint.isCenter) ?? {
            ...originalTints[Math.floor(originalTints.length / 2)],
            isCenter: true,
          }
        );
      }
      if (i === steps - 1) {
        return originalTints[originalTints.length - 1];
      }
      if (
        originalTints[i]?.isAnchor &&
        i !== steps - 1 &&
        !originalTints[i]?.isCenter
      ) {
        return originalTints[i];
      }
      return undefined;
    }
  );

  //Step 2 : Reduce the array to calc the undefined entries (and conserve the existing colors)
  const reducedTints = anchorTints.reduce<ReduceColors>(
    (acc, tint, index) => {
      if (acc.colors[index]) {
        return {
          ...acc,
          previousColor: tint
            ? {
                color: tint.color,
                index,
              }
            : acc.previousColor,
        };
      } else if (tint) {
        return {
          ...acc,
          previousColor: { color: tint.color, index },
          colors: [...acc.colors, tint.color],
        };
      } else {
        const nextColor: ColorPositionIndex = anchorTints
          .map((e, i) => {
            return {
              color: e?.color,
              index: i,
            };
          })
          .find(
            (e) => e.index > index && e?.color !== undefined
          ) as ColorPositionIndex;
        const subSteps = nextColor.index + 1 - acc.previousColor.index;

        if (!acc.previousColor?.color || !nextColor.color) {
          return acc;
        }
        const colors = acc.previousColor.color.steps(nextColor.color, {
          space: interpolationColorSpace,
          steps: subSteps,
        });
        colors.shift();
        colors.pop();
        return {
          colors: [...acc.colors, ...colors],
          previousColor: nextColor,
        };
      }
    },
    {
      colors: [],
      previousColor: { index: 0, color: anchorTints[0]?.color },
    }
  );

  //Step 3: Transform into tint object
  return reducedTints.colors.map((step, index) => {
    step.to("sRgb");
    return {
      name: getTintName({
        index,
        length: steps,
        mode: tintNamingMode,
      }),
      isCenter: anchorTints[index]?.isCenter,
      isAnchor: anchorTints[index]?.isAnchor,
      color: step.clone().toGamut(),
    };
  });
}

export function hwbHueAligner({
  newColor,
  colorToAlign,
}: {
  newColor: ColorIO;
  colorToAlign: ColorIO;
}): ColorIO {
  return new ColorIO("hwb", [
    newColor.hwb[0],
    colorToAlign.hwb[1],
    colorToAlign.hwb[2],
  ]);
}

export type ColorRecommandedFlag =
  | "complementary"
  | "square"
  | "triad"
  | "others"
  | "gray";

export const COLOR_FLAGS: ColorRecommandedFlag[] = [
  "complementary",
  "square",
  "triad",
  "others",
  "gray",
];

export interface ColorRecommanded {
  name: string;
  color: ColorIO;
}

export interface FlagColors {
  flag: ColorRecommandedFlag;
  colors: ColorRecommanded[];
}

interface FlagColorsToRecommand {
  flag: ColorRecommandedFlag;
  gap: number[];
}

const COLOR_FLAGS_TO_RECOMMAND: FlagColorsToRecommand[] = [
  {
    flag: "complementary",
    gap: [180],
  },
  {
    flag: "triad",
    gap: [120, 240],
  },
  {
    flag: "square",
    gap: [90, 270],
  },
  {
    flag: "others",
    gap: [30, 60, 150, 210, 300, 330],
  },
  {
    flag: "gray",
    gap: [0, 90, 180, 270],
  },
];

export function getColorRecommanded({
  flag,
  gap,
  color,
}: {
  gap: number;
  flag: string;
  color: ColorIO;
}): ColorRecommanded {
  const colorRecommanded = new ColorIO(color);
  colorRecommanded.set({
    "oklch.l": colorRecommanded.oklch[0],
    "oklch.c": colorRecommanded.oklch[1],
    "oklch.h": (colorRecommanded.oklch[2] + gap) % 360,
  });
  colorRecommanded.set({
    "hwb.h": colorRecommanded.hwb[0],
    "hwb.w": color.hwb[1],
    "hwb.b": color.hwb[2],
  });
  if (flag === "gray") {
    colorRecommanded.set({
      "hsl.h": colorRecommanded.hsl[0],
      "hsl.s": 0.08,
      "hsl.l": colorRecommanded.hsl[2],
    });
  }
  return {
    color: colorRecommanded,
    name: `${flag === "gray" ? "gray-" : ""}${getHueName(
      colorRecommanded.toString({ format: "hex" })
    )}`,
  };
}

export function getColorsRecommanded(color?: ColorIO): FlagColors[] {
  const hue = color?.get("oklch.h");
  if (color && hue && !Number.isNaN(hue)) {
    return COLOR_FLAGS_TO_RECOMMAND.map((toRecomand) => {
      return {
        flag: toRecomand.flag,
        colors: toRecomand.gap.map((gap) => {
          return getColorRecommanded({
            gap,
            flag: toRecomand.flag,
            color,
          });
        }),
      };
    });
  } else {
    return [];
  }
}

export interface PaletteChartsData {
  lightness: ChartData<"line">;
  saturation?: ChartData<"line">;
  chroma?: ChartData<"line">;
  hue: ChartData<"line">;
  ligSatOptions: ChartOptions<"line">;
  chromaOptions: ChartOptions<"line">;
  hueOptions: ChartOptions<"line">;
}

export const CHROMATIC_COLOR_SPACES: InterpolationColorSpace[] = [
  "oklch",
  "lch",
];
export const SATURED_COLOR_SPACES: InterpolationColorSpace[] = ["hsl"];

export function paletteBuildToDesignSystemPalette(
  palette: PaletteBuild
): Palette {
  return {
    paletteName: palette.name,
    shades: palette.tints.map((tint) => {
      return {
        label: tint.name,
        color: tint.color.toString({ format: "hex" }),
      };
    }),
  };
}
