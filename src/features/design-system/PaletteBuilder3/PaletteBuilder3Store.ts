import { create } from "zustand";
import { getTintName, TintsNamingMode } from "../../../util/TintsNaming";
import { formatHex, hsl, hwb } from "culori";
import chroma from "chroma-js";
import { Color as ChromaColor } from "chroma-js";
import { ChartData, ChartOptions } from "chart.js";

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

export const INTERPOLATIONS_COLOR_SPACES: InterpolationColorSpace[] = [
  "oklch",
  "lch",
  "hsl",
];

export interface PaletteSettings {
  lightnessMax: number;
  lightnessMin: number;
}

interface ColorPositionIndex {
  color?: ChromaColor;
  index: number;
}

interface ReduceColors {
  colors: ChromaColor[];
  previousColor: ColorPositionIndex;
}

export interface PaletteBuild {
  name: string;
  tints: TintBuild[];
  settings: PaletteSettings;
}

export interface TintBuild {
  name: string;
  isAnchor?: boolean;
  isCenter?: boolean;
  color: PaletteColor;
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
  createPalette: (tint?: ChromaColor) => void;
  createPaletteFromExisting: (
    palette: PaletteBuild,
    color: ColorRecommanded
  ) => void;
  updatePalettes: () => void;
  updatePalette: (index: number, palette: PaletteBuild) => void;
  setSettings: (settings: PalettesStoreSettings) => void;
  reset: () => void;
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
      },
    },
    createPalette(tint?: ChromaColor) {
      const {
        settings: {
          steps,
          tintNamingMode,
          paletteSettings,
          interpolationColorSpace,
        },
      } = get();
      const paletteTint: ChromaColor = chroma(tint ?? "#e24");
      const [startColor, endColor] = getEndsTints(paletteTint, paletteSettings);
      const tints: TintBuild[] = chroma
        .scale([startColor, paletteTint, endColor])
        .domain([0, Math.floor(steps / 2) / steps])
        .mode(interpolationColorSpace)
        .colors(steps, null)
        .map((step, index) => {
          return {
            name: getTintName({
              index,
              length: steps,
              mode: tintNamingMode,
            }),
            isCenter: index === Math.floor(steps / 2),
            color: step as PaletteColor,
          };
        });
      set((state) => {
        return {
          ...state,
          palettes: [
            ...state.palettes,
            {
              name: getHueName(paletteTint.hex()),
              tints,
              settings: paletteSettings,
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
      const [startColor, endColor] = getEndsTints(
        colorRecommanded.color,
        palette.settings
      );
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
          const newH = colorRecommanded.color.get("oklch.h");
          if (newH && Number.isNaN(newH)) {
            const newColor = chroma(tint.color).set("oklch.h", newH);
            color = hwbHueAligner({
              newColor: newColor,
              colorToAlign: tint.color,
            });
          }
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
      console.log(newPalette);
      const { settings } = get();
      const centerTint = newPalette.tints.find((tint) => tint.isCenter);
      if (centerTint) {
        const [startColor, endColor] = getEndsTints(
          centerTint.color,
          newPalette.settings
        );
        const tints = constructTints(
          newPalette.tints.map((tint, index) => {
            if (index === 0) {
              tint.color = startColor;
            }
            if (index === newPalette.tints.length - 1) {
              tint.color = endColor;
            }
            return tint;
          }),
          settings
        );
        console.log("tintres", tints);
        set((state) => {
          return {
            ...state,
            palettes: state.palettes.map((palette, i) =>
              index === i ? { ...newPalette, tints } : palette
            ),
          };
        });
        console.log(
          "tints after",
          get().palettes.find((_p, i) => i === index)
        );
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

export function getEndsTints(
  color: ChromaColor,
  settings: PaletteSettings
): [ChromaColor, ChromaColor] {
  const startColor = chroma(color).tint(settings.lightnessMax);
  const endColor = chroma(color).shade(1 - settings.lightnessMin);
  return [startColor, endColor];
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
        originalTints[i].isAnchor &&
        i !== steps - 1 &&
        !originalTints[i].isCenter
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
        const colors = chroma
          .scale([
            acc.previousColor.color as ChromaColor,
            nextColor.color as ChromaColor,
          ])
          .mode(interpolationColorSpace)
          .colors(subSteps, null);
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
      previousColor: { index: 0, color: anchorTints[0]?.color as ChromaColor },
    }
  );

  console.log("reduced", reducedTints);

  //Step 3: Transform into tint object
  return reducedTints.colors.map((step, index) => {
    return {
      name: getTintName({
        index,
        length: steps,
        mode: tintNamingMode,
      }),
      isCenter: anchorTints[index]?.isCenter,
      isAnchor: anchorTints[index]?.isAnchor,
      color: step as PaletteColor,
    };
  });
}

export function hwbHueAligner({
  newColor,
  colorToAlign,
}: {
  newColor: ChromaColor;
  colorToAlign: ChromaColor;
}): ChromaColor {
  const newColorHwb = hwb(newColor.hex());
  const colorToAlignHwb = hwb(colorToAlign.hex());
  if (newColorHwb && colorToAlignHwb) {
    const newHex = formatHex({
      mode: "hwb",
      h: newColorHwb.h,
      w: colorToAlignHwb.w,
      b: colorToAlignHwb.b,
    });

    return chroma(newHex);
  }
  return newColor;
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
  color: ChromaColor;
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
  hue,
  color,
}: {
  gap: number;
  flag: string;
  color: ChromaColor;
  hue: number;
}): ColorRecommanded {
  let newColor = chroma(color);
  newColor = newColor.set("oklch.h", (hue + gap) % 360);
  if (flag === "gray") {
    newColor = newColor.set("hsl.s", 0.08);
  } else {
    newColor = hwbHueAligner({
      newColor,
      colorToAlign: color,
    });
  }

  return {
    color: newColor,
    name: getHueName(newColor.hex()),
  };
}

export function getColorsRecommanded(color?: ChromaColor): FlagColors[] {
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
            hue,
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

export function getPaletteCharts(
  palette: PaletteBuild,
  interpolationColorSpace: InterpolationColorSpace
): PaletteChartsData {
  const hues = palette.tints.map((tint) =>
    tint.color.get(`${interpolationColorSpace}.h`)
  );
  return {
    lightness: getChartLineData({
      palette,
      interpolationColorSpace,
      axe: "l",
      label: "Lightness",
    }),
    chroma: CHROMATIC_COLOR_SPACES.includes(interpolationColorSpace)
      ? getChartLineData({
          palette,
          interpolationColorSpace,
          axe: "c",
          label: "Chroma",
        })
      : undefined,
    saturation: SATURED_COLOR_SPACES.includes(interpolationColorSpace)
      ? getChartLineData({
          palette,
          interpolationColorSpace,
          axe: "s",
          label: "Saturation",
        })
      : undefined,
    hue: getChartLineData({
      palette,
      interpolationColorSpace,
      axe: "h",
      label: "Hue",
    }),
    ligSatOptions: getOptions({
      minX: 0,
      maxX: palette.tints.length,
      minY: 0,
      maxY: 1,
    }),
    chromaOptions: getOptions({
      minX: 0,
      maxX: palette.tints.length,
      minY: 0,
      maxY: 0.4,
    }),
    hueOptions: getOptions({
      minX: 0,
      maxX: palette.tints.length,
      minY: Math.floor(Math.min(...hues) - 5),
      maxY: Math.floor(Math.max(...hues) + 5),
    }),
  };
}

function getOptions({
  minX,
  maxX,
  minY,
  maxY,
}: {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}): ChartOptions<"line"> {
  return {
    responsive: false,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: { min: minX, max: maxX },
      y: { min: minY, max: maxY },
    },
  };
}

function getChartLineData({
  palette,
  interpolationColorSpace,
  axe,
  label,
}: {
  palette: PaletteBuild;
  interpolationColorSpace: InterpolationColorSpace;
  axe: "h" | "s" | "c" | "l";
  label: string;
}): ChartData<"line"> {
  return {
    labels: palette.tints.map((tint) => tint.name),
    datasets: [
      {
        label,
        data: palette.tints.map((tint) =>
          tint.color.get(`${interpolationColorSpace}.${axe}`)
        ),
        borderColor: "#1e40af",
        backgroundColor: "#dbeafe",
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };
}
