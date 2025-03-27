import { create } from "zustand";
import { getTintName, TintsNamingMode } from "../../../util/TintsNaming";
import { formatHex, hsl, okhsl } from "culori";
import {
  getClosestThree,
  getClosestTwo,
} from "../../../util/FindClosestPoints";
import { ColorOkhsl } from "../../../util/PaletteBuilderTwoStore";
import chroma from "chroma-js";
export type InterpolationMode = "curve" | "linear";

export interface PaletteSettings {
  lightnessMax: number;
  lightnessMin: number;
  saturationMin: number;
  saturationMax: number;
  lightnessInterpolationMode: InterpolationMode;
  saturationInterpolationMode: InterpolationMode;
}

const DEFAULT_SETTINGS: PaletteSettings = {
  lightnessMax: 0.9,
  lightnessMin: 0.1,
  lightnessInterpolationMode: "linear",
  saturationMin: 0.8,
  saturationMax: 1,
  saturationInterpolationMode: "curve",
};

export interface PaletteBuild {
  name: string;
  tints: TintBuild[];
}

export interface OkhslColor {
  hex: string;
  h: number;
  s: number;
  l: number;
}

export interface TintBuild {
  name: string;
  isFixed?: boolean;
  color: OkhslColor;
}

interface PalettesStoreSettings {
  steps: number;
  lightnessInterpolationMode: InterpolationMode;
  saturationInterpolationMode: InterpolationMode;
  hueInterpolationMode: InterpolationMode;
  tintNamingMode: TintsNamingMode;
}

export interface Point {
  x: number;
  y: number;
}

interface PaletteBuilderStore {
  palettes: PaletteBuild[];
  settings: PalettesStoreSettings;
  createPalette: (tint?: string) => void;
  buildPaletteTints: (fixedTints: (TintBuild | undefined)[]) => TintBuild[];
  updatePalettes: () => void;
  updatePalette: (index: number, palette: PaletteBuild) => void;
  setSettings: (settings: PalettesStoreSettings) => void;
}

export const usePaletteBuilder3Store = create<PaletteBuilderStore>(
  (set, get) => ({
    palettes: [],
    settings: {
      steps: 11,
      lightnessInterpolationMode: "linear",
      saturationInterpolationMode: "curve",
      hueInterpolationMode: "curve",
      tintNamingMode: "50,100,200...900,950",
    },
    createPalette(tint?: string) {
      const {
        settings: { steps, tintNamingMode },
        buildPaletteTints,
      } = get();
      const paletteTint: string = tint ?? "#00ff44";
      const [startColor, centerColor, endColor] = buildStartingTints(
        paletteTint,
        DEFAULT_SETTINGS
      );
      const tints: (TintBuild | undefined)[] = Array.from(
        { length: steps },
        (_, i) => {
          if (i === 0) {
            return {
              name: getTintName({
                index: i,
                length: steps,
                mode: tintNamingMode,
              }),
              color: startColor,
            } as TintBuild;
          }
          if (i === Math.floor(steps / 2)) {
            return {
              name: getTintName({
                index: i,
                length: steps,
                mode: tintNamingMode,
              }),
              color: centerColor,
            } as TintBuild;
          }
          if (i === steps - 1) {
            return {
              name: getTintName({
                index: i,
                length: steps,
                mode: tintNamingMode,
              }),
              color: endColor,
            } as TintBuild;
          }
          return undefined;
        }
      );
      const tintsBuilded = buildPaletteTints(tints);
      set((state) => {
        return {
          ...state,
          palettes: [
            ...state.palettes,
            {
              name: getHueName(paletteTint),
              tints: tintsBuilded,
            },
          ],
        };
      });
    },
    updatePalettes() {
      const {
        settings: { steps },
        buildPaletteTints,
      } = get();
      set((state) => {
        return {
          ...state,
          palettes: state.palettes.map((palette) => {
            const fixedTints: (TintBuild | undefined)[] = Array.from(
              { length: steps },
              (_, i) => {
                if (i === 0) {
                  return palette.tints[0];
                } else if (i === Math.floor(steps / 2)) {
                  return palette.tints[Math.floor(palette.tints.length / 2)];
                } else if (i === steps - 1) {
                  return palette.tints[palette.tints.length - 1];
                } else if (
                  palette.tints[i]?.isFixed &&
                  i !== palette.tints.length - 1 &&
                  i !== Math.floor(palette.tints.length / 2)
                ) {
                  return palette.tints[i];
                } else {
                  return undefined;
                }
              }
            );
            const paletteBuild = buildPaletteTints(fixedTints);
            return {
              ...palette,
              tints: paletteBuild,
            };
          }),
        };
      });
    },
    updatePalette(index: number, newPalette: PaletteBuild) {
      set((state) => {
        return {
          ...state,
          palettes: state.palettes.map((palette, i) =>
            index === i ? newPalette : palette
          ),
        };
      });
    },
    buildPaletteTints(fixedTints: (TintBuild | undefined)[]): TintBuild[] {
      const {
        settings: {
          steps,
          lightnessInterpolationMode,
          saturationInterpolationMode,
          hueInterpolationMode,
          tintNamingMode,
        },
      } = get();
      const tints = Array.from({ length: steps }, (_, i) => {
        const name = getTintName({
          index: i,
          mode: tintNamingMode,
          length: steps,
        });
        const existing = fixedTints[i];
        if (existing) return { ...existing, name };
        const huePoints = fixedTints.map((tint, index) =>
          paletteTintToPoint({ tint, key: "h", index })
        );
        const saturationPoints = fixedTints.map((tint, index) =>
          paletteTintToPoint({ tint, key: "s", index })
        );
        const lightnessPoints = fixedTints.map((tint, index) =>
          paletteTintToPoint({ tint, key: "l", index })
        );

        const h: number = interpolate(huePoints, i, hueInterpolationMode, {
          min: 0,
          max: 360,
          modulo: true,
        });

        const s: number = interpolate(
          saturationPoints,
          i,
          saturationInterpolationMode,
          {
            min: 0,
            max: 1,
          }
        );

        const l: number = interpolate(
          lightnessPoints,
          i,
          lightnessInterpolationMode,
          {
            min: 0,
            max: 1,
          }
        );

        return {
          name,
          color: computeOkhslColor({
            hex: "",
            h,
            s,
            l,
          }),
        } as TintBuild;
      });
      return tints;
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
  })
);

function interpolate(
  points: (Point | undefined)[],
  index: number,
  interpolationMode: InterpolationMode,
  range?: {
    min: number;
    max: number;
    modulo?: boolean;
  }
): number {
  return interpolationMode === "curve"
    ? quadraticInterpolation(
        getClosestThree<Point>(points, index),
        index,
        range
      )
    : linearInterpolation(getClosestTwo(points, index), index, range);
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

function paletteTintToPoint({
  tint,
  key,
  index,
}: {
  tint?: TintBuild;
  key: "h" | "s" | "l";
  index: number;
}): Point | undefined {
  if (!tint) return undefined;
  return { x: index, y: tint.color[key] };
}

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

function getHueName(color: string): string {
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

function buildStartingTints(
  color: string,
  settings: PaletteSettings
): OkhslColor[] {
  const centerColor = colorToOkhsl(color);
  const startColor: OkhslColor = computeOkhslColor({
    ...centerColor,
    s:
      settings.saturationInterpolationMode === "curve"
        ? settings.saturationMin
        : centerColor.s,
    l: settings.lightnessMax,
  });
  const endColor: OkhslColor = computeOkhslColor({
    ...centerColor,
    s:
      settings.saturationInterpolationMode === "curve"
        ? settings.saturationMin
        : centerColor.s,
    l: settings.lightnessMin,
  });
  return [startColor, centerColor, endColor];
}

function colorToOkhsl(color: string): OkhslColor {
  const colOk = okhsl(color);

  if (!colOk) throw new Error("Fail to convert color");

  return {
    hex: formatHex({
      mode: "okhsl",
      h: colOk.h ?? 0,
      s: colOk.s,
      l: colOk.l,
    }),
    h: colOk.h ?? 0,
    s: colOk.s,
    l: colOk.l,
  };
}

function computeOkhslColor(okhslColor: OkhslColor): OkhslColor {
  return {
    ...okhslColor,
    hex: formatHex({
      mode: "okhsl",
      h: okhslColor.h,
      s: okhslColor.s,
      l: okhslColor.l,
    }),
  };
}

function linearInterpolation(
  points: [Point, Point],
  x: number,
  range?: {
    min: number;
    max: number;
    modulo?: boolean;
  }
): number {
  const [p1, p2] = points;

  if (p2.x - p1.x === 0) {
    return range
      ? autoRangeNumber(p1.y, range.min, range.max, range.modulo)
      : p1.y;
  }

  // Compute y by using linear interpolation
  // y = y1 + ((y2 - y1) / (x2 - x1)) * (x - x1)
  const y = p1.y + ((p2.y - p1.y) / (p2.x - p1.x)) * (x - p1.x);

  return range ? autoRangeNumber(y, range.min, range.max, range.modulo) : y;
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
  points: [Point, Point, Point],
  x: number,
  range?: {
    min: number;
    max: number;
    modulo?: boolean;
  }
): number {
  const [a, b, c] = points;
  // Calculate the Lagrange coefficients
  const L0 = ((x - b.x) * (x - c.x)) / ((a.x - b.x) * (a.x - c.x));
  const L1 = ((x - a.x) * (x - c.x)) / ((b.x - a.x) * (b.x - c.x));
  const L2 = ((x - a.x) * (x - b.x)) / ((c.x - a.x) * (c.x - b.x));

  const interpolatedValue = a.y * L0 + b.y * L1 + c.y * L2;

  return range
    ? autoRangeNumber(interpolatedValue, range.min, range.max, range.modulo)
    : interpolatedValue;
}

export function findCenterColor(palette: PaletteBuild): ColorOkhsl {
  return palette.tints[Math.floor(palette.tints.length / 2)].color;
}
