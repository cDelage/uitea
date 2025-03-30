import { create } from "zustand";
import { getTintName, TintsNamingMode } from "../../../util/TintsNaming";
import { formatHex, hsl, hwb } from "culori";
import chroma from "chroma-js";
import { Color as ChromaColor } from "chroma-js";

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
  isFixed?: boolean;
  isCenter?: boolean;
  color: PaletteColor;
}

interface PalettesStoreSettings {
  steps: number;
  tintNamingMode: TintsNamingMode;
  paletteSettings: PaletteSettings;
}

export interface Point {
  x: number;
  y: number;
}

interface PaletteBuilderStore {
  palettes: PaletteBuild[];
  settings: PalettesStoreSettings;
  createPalette: (tint?: string) => void;
  buildPaletteTints: (tints: TintBuild[]) => TintBuild[];
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
      paletteSettings: {
        lightnessMax: 0.9,
        lightnessMin: 0.1,
      },
    },
    createPalette(tint?: string) {
      const {
        settings: { steps, tintNamingMode, paletteSettings },
      } = get();
      const paletteTint: ChromaColor = chroma(tint ?? "#e24");
      const [startColor, endColor] = getEndsTints(paletteTint, paletteSettings);
      const tints: TintBuild[] = chroma
        .scale([startColor, paletteTint, endColor])
        .domain([0, Math.floor(steps / 2) / steps])
        .mode("oklch")
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
    updatePalettes() {
      const { buildPaletteTints } = get();
      set((state) => {
        return {
          ...state,
          palettes: state.palettes.map((palette) => {
            return {
              ...palette,
              tints: buildPaletteTints(palette.tints),
            };
          }),
        };
      });
    },
    updatePalette(index: number, newPalette: PaletteBuild) {
      const { buildPaletteTints } = get();
      const tints = buildPaletteTints(newPalette.tints);
      set((state) => {
        return {
          ...state,
          palettes: state.palettes.map((palette, i) =>
            index === i ? { ...newPalette, tints } : palette
          ),
        };
      });
    },
    buildPaletteTints(originalTints: TintBuild[]): TintBuild[] {
      const {
        settings: { steps, tintNamingMode },
      } = get();

      return constructTints(originalTints, steps, tintNamingMode);
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

export function getEndsTints(
  color: ChromaColor,
  settings: PaletteSettings
): [ChromaColor, ChromaColor] {
  const startColor = chroma(color).tint(0.9);
  const endColor = chroma.mix(
    color,
    "#000000",
    1 - settings.lightnessMin,
    "oklch"
  );
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
  steps: number,
  tintNamingMode: TintsNamingMode
): TintBuild[] {
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
        originalTints[i].isFixed &&
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
        return acc;
      } else if (tint) {
        return {
          ...acc,
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
          .mode("oklch")
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

  //Step 3: Transform into tint object
  return reducedTints.colors.map((step, index) => {
    return {
      name: getTintName({
        index,
        length: steps,
        mode: tintNamingMode,
      }),
      isCenter: anchorTints[index]?.isCenter,
      isFixed: anchorTints[index]?.isFixed,
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
  return colorToAlign;
}
