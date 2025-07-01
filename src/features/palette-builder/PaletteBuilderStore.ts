import { create } from "zustand";
import { getTintName } from "../../util/TintsNaming";
import { ChartData, ChartOptions } from "chart.js";
import ColorIO from "colorjs.io";
import { v4 } from "uuid";
import { Palette } from "../../domain/DesignSystemDomain";
import { PICKER_MODES, ColorSpace, PickerAxe } from "../../util/PickerUtil";
import { moveItem } from "../../util/ArrayMove";
import { linearPieceInterpolation } from "../../util/Interpolation";
import {
  PalettesStoreSettings,
  TintBuild,
  PaletteBuild,
  PaletteSettings,
  InterpolationColorSpace,
  AlignerSettings,
  PaletteBuilderPayload,
  paletteBuildToFile,
  paletteBuilderFromFile,
} from "../../domain/PaletteBuilderDomain";
import { invoke } from "@tauri-apps/api/core";
import { CanUndoRedo } from "../../util/UndoRedo";

export interface Point {
  x: number;
  y: number;
}

interface PaletteBuilderStore {
  palettes: PaletteBuild[];
  settings: PalettesStoreSettings;
  alignerSettings: AlignerSettings;
  canUndoRedo: CanUndoRedo;
  createPalette: (tint?: ColorIO) => PaletteBuild;
  createPaletteFromExisting: (
    palette: PaletteBuild,
    color: ColorRecommanded
  ) => void;
  updatePalettes: () => void;
  updatePalette: (
    index: number,
    palette: PaletteBuild,
    stopUndoRedo?: boolean
  ) => void;
  setSettings: (settings: PalettesStoreSettings) => void;
  reset: () => void;
  deletePalette: (id: string) => void;
  movePalette: (fromIndex: number, toIndex: number) => void;
  loadPaletteBuilder: (
    palettes: PaletteBuild[],
    settings: PalettesStoreSettings
  ) => void;
  setAlignerSettings: (alignerSettings: AlignerSettings) => void;
  doPaletteBuilder: () => void;
  undoPaletteBuilder: () => void;
  redoPaletteBuilder: () => void;
}

export const usePaletteBuilderStore = create<PaletteBuilderStore>(
  (set, get) => ({
    palettes: [],
    settings: {
      steps: 11,
      tintNamingMode: "50,100,200...900,950",
      interpolationColorSpace: "oklch",
      paletteSettings: {
        lightnessMax: 0.9,
        lightnessMin: 0.3,
        satChromaGapRight: 0.5,
        satChromaGapLeft: 0.5,
        hueGapLeft: 0.5,
        hueGapRight: 0.5,
      },
    },
    alignerSettings: {
      aligner: "HWB",
      alignerContrastMode: "PALETTE_STEP",
      alignerConstrastCustomColor: new ColorIO("#000000"),
      alignerContrastPaletteStep: 0,
      isDisplay: false,
    },
    canUndoRedo: {
      canUndo: false,
      canRedo: false,
    },
    createPalette(tint?: ColorIO) {
      const { settings, doPaletteBuilder } = get();
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
      const palette: PaletteBuild = {
        id: v4(),
        name: getHueName(paletteTint),
        tints,
        settings: settings.paletteSettings,
      };

      set((state) => {
        return {
          ...state,
          palettes: [...state.palettes, palette],
        };
      });
      doPaletteBuilder();
      return palette;
    },
    createPaletteFromExisting(
      palette: PaletteBuild,
      colorRecommanded: ColorRecommanded
    ) {
      const { settings, doPaletteBuilder } = get();
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
      doPaletteBuilder();
    },
    updatePalettes() {
      const { settings, doPaletteBuilder } = get();
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
      doPaletteBuilder();
    },
    updatePalette(
      index: number,
      newPalette: PaletteBuild,
      stopUndoRedo?: boolean
    ) {
      const { settings, doPaletteBuilder } = get();
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
      if (!stopUndoRedo) {
        doPaletteBuilder();
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
      get().doPaletteBuilder();
    },
    deletePalette(id: string) {
      set((state) => {
        return {
          ...state,
          palettes: state.palettes.filter((palette) => palette.id !== id),
        };
      });
      get().doPaletteBuilder();
    },
    movePalette(fromIndex: number, toIndex: number) {
      set((state) => {
        return {
          ...state,
          palettes: moveItem(state.palettes, fromIndex, toIndex),
        };
      });
      get().doPaletteBuilder();
    },
    loadPaletteBuilder(
      palettes: PaletteBuild[],
      settings: PalettesStoreSettings
    ) {
      set((state) => {
        return {
          ...state,
          palettes,
          settings,
        };
      });
      get().doPaletteBuilder();
    },
    setAlignerSettings(alignerSettings) {
      set((state) => {
        return {
          ...state,
          alignerSettings,
        };
      });
    },
    doPaletteBuilder: async () => {
      const { palettes, settings } = get();
      await invoke("do_palette_builder", {
        paletteBuilder: {
          palettes: palettes.map(paletteBuildToFile),
          settings,
        },
      });
      const canUndoRedo = await invoke<CanUndoRedo>(
        "can_undo_redo_palette_builder"
      );
      set((state) => {
        return {
          ...state,
          canUndoRedo,
        };
      });
    },
    undoPaletteBuilder: async () => {
      const paletteBuilder = await invoke<PaletteBuilderPayload>(
        "undo_palette_builder"
      );
      const canUndoRedo = await invoke<CanUndoRedo>(
        "can_undo_redo_palette_builder"
      );
      set((state) => {
        return {
          ...state,
          ...paletteBuilderFromFile(paletteBuilder),
          canUndoRedo,
        };
      });
    },
    redoPaletteBuilder: async () => {
      const paletteBuilder = await invoke<PaletteBuilderPayload>(
        "redo_palette_builder"
      );
      const canUndoRedo = await invoke<CanUndoRedo>(
        "can_undo_redo_palette_builder"
      );
      set((state) => {
        return {
          ...state,
          ...paletteBuilderFromFile(paletteBuilder),
          canUndoRedo,
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
  "gray-red",
  "gray-orange",
  "gray-yellow",
  "gray-lime",
  "gray-green",
  "gray-teal",
  "gray-cyan",
  "gray-blue",
  "gray-indigo",
  "gray-violet",
  "gray-purple",
  "gray-pink",
];

export function getHueName(color: ColorIO): string {
  const angle: number = color.hsl[0];
  const saturation: number = color.hsl[1];
  const preColor = saturation < 15 ? "gray-" : "";
  if (angle < 15 || angle >= 345) return `${preColor}red`;
  if (angle < 45) return `${preColor}orange`;
  if (angle < 75) return `${preColor}yellow`;
  if (angle < 105) return `${preColor}lime`;
  if (angle < 135) return `${preColor}green`;
  if (angle < 165) return `${preColor}teal`;
  if (angle < 195) return `${preColor}cyan`;
  if (angle < 225) return `${preColor}blue`;
  if (angle < 255) return `${preColor}indigo`;
  if (angle < 285) return `${preColor}violet`;
  if (angle < 315) return `${preColor}purple`;
  return `${preColor}pink`;
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
      (axe) => axe.name === "s" || axe.name === "c"
    );
    const hueAxe: PickerAxe | undefined = picker?.axes.find(
      (axe) => axe.name === "h"
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
        `${interpolationColorSpace}.${satChromaAxe.name}`,
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
        `${interpolationColorSpace}.${satChromaAxe.name}`,
        newSatChroma
      );
    }

    if (settings.hueGapLeft !== 0.5 && hueAxe) {
      const startHue = startColor.get(`${interpolationColorSpace}.h`);
      const colorPoints = getColorAxeToPoints({
        axe: {
          ...hueAxe,
          min: startHue - 30,
          max: startHue + 30,
        },
        centerColor: startColor,
        interpolationColorSpace,
        positionX: settings.hueGapLeft,
      });
      const newHue = linearPieceInterpolation(colorPoints);
      startColor.set(`${interpolationColorSpace}.${hueAxe.name}`, newHue);
    }

    if (settings.hueGapRight !== 0.5 && hueAxe) {
      const endHue = endColor.get(`${interpolationColorSpace}.h`);
      const colorPoints = getColorAxeToPoints({
        axe: {
          ...hueAxe,
          min: endHue - 20,
          max: endHue + 20,
        },
        centerColor: endColor,
        interpolationColorSpace,
        positionX: settings.hueGapRight,
      });
      const newHue = linearPieceInterpolation(colorPoints);
      endColor.set(`${interpolationColorSpace}.${hueAxe.name}`, newHue);
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
      y: centerColor.get(`${interpolationColorSpace}.${axe.name}`),
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
  min?: number,
  max?: number,
  modulo?: boolean
) {
  if (modulo) {
    return Math.max(min ?? value, value % (max ?? value));
  }
  return Math.min(max ?? value, Math.max(min ?? value, value));
}

interface ColorPositionIndex {
  color?: ColorIO;
  index: number;
}

interface ReduceColors {
  colors: ColorIO[];
  previousColor: ColorPositionIndex;
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
    const hsl = [...colorRecommanded.hsl];
    colorRecommanded.set({
      "hsl.h": hsl[0],
      "hsl.s": 8,
      "hsl.l": hsl[2],
    });
  }
  return {
    color: colorRecommanded,
    name: getHueName(colorRecommanded),
  };
}

export function getColorsRecommanded(
  palettes: PaletteBuild[],
  color?: ColorIO
): FlagColors[] {
  const hue = color?.get("oklch.h");
  if (color && hue && !Number.isNaN(hue)) {
    const existingTints: string[] = palettes.map((palette) => {
      const tint = palette.tints.find(
        (tint, index) =>
          tint.isCenter || index === Math.floor(palette.tints.length / 2)
      ) as TintBuild;
      return tint.color.toString({ format: "hex" });
    });

    return COLOR_FLAGS_TO_RECOMMAND.map((toRecomand) => {
      const colorToRecommand = {
        flag: toRecomand.flag,
        colors: toRecomand.gap.map((gap) => {
          return getColorRecommanded({
            gap,
            flag: toRecomand.flag,
            color,
          });
        }),
      };
      return {
        ...colorToRecommand,
        colors: colorToRecommand.colors.filter(
          (color) =>
            !existingTints.includes(color.color.toString({ format: "hex" }))
        ),
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
    tints: palette.tints.map((tint) => {
      return {
        label: tint.name,
        color: tint.color.toString({ format: "hex" }),
      };
    }),
  };
}
