import { ChartData, ChartOptions } from "chart.js";
import { formatHex, okhsl } from "culori";
import { create } from "zustand";
import {
  DEFAULT_PALETTE_BUILDER,
  PALETTE_BUILDER_DEFAULT_SETTINGS,
} from "../ui/UiConstants";
import { getTintName, TintsNamingMode } from "./TintsNaming";

export interface MainPaletteBuilder {
  name: string;
  hue: string;
  tints: TintBuilder[];
}

interface TintBuilder {
  name: string;
  color: {
    hex: string;
    h: number;
    s: number;
    l: number;
  };
}

interface NormalizedValues {
  startLuminance: number;
  endLuminance: number;
  minSaturation: number;
  maxSaturation: number;
}

interface PaletteBuilderStore {
  steps: number;
  startLuminance: number;
  endLuminance: number;
  minSaturation: number;
  maxSaturation: number;
  bezoldBruckeActive: boolean;
  bezoldBruckeGap: number;
  mainPalette: MainPaletteBuilder;
  tintNamingMode: TintsNamingMode;
  setSteps: (steps: number) => void;
  setTintNamingMode: (tintNamingMode: TintsNamingMode) => void;
  setRangeLuminance: (range: [number, number]) => void;
  setRangeSaturation: (range: [number, number]) => void;
  updatePalettes: () => void;
  getNormalizedValues: () => NormalizedValues;
  getCharts: () => {
    saturation: ChartData<"line">;
    lightness: ChartData<"line">;
    options: ChartOptions<"line">;
  };
  toggleCorrectBezoldBrucke: () => void;
  setBezoldBruckeGap: (value: number) => void;
  resetLightness: () => void;
  resetSaturation: () => void;
  resetPalette: () => void;
  resetBezoldBrucke: () => void;
}

export const usePaletteBuilderTwoStore = create<PaletteBuilderStore>(
  (set, get) => ({
    steps: 11,
    startLuminance: PALETTE_BUILDER_DEFAULT_SETTINGS.startLuminance,
    endLuminance: PALETTE_BUILDER_DEFAULT_SETTINGS.endLuminance,
    minSaturation: PALETTE_BUILDER_DEFAULT_SETTINGS.minSaturation,
    maxSaturation: PALETTE_BUILDER_DEFAULT_SETTINGS.maxSaturation,
    bezoldBruckeActive: PALETTE_BUILDER_DEFAULT_SETTINGS.bezoldBruckeActive,
    bezoldBruckeGap: PALETTE_BUILDER_DEFAULT_SETTINGS.bezoldBruckeGap,
    mainPalette: DEFAULT_PALETTE_BUILDER,
    tintNamingMode: "50,100,200...900,950",
    setSteps: (steps: number) => {
      set((state) => {
        return { ...state, steps: Math.min(20, Math.max(1, steps)) };
      });
      get().updatePalettes();
    },
    setRangeLuminance: (range: [number, number]) => {
      set((state) => {
        return {
          ...state,
          startLuminance: range[0],
          endLuminance: range[1],
        };
      });
      get().updatePalettes();
    },
    setRangeSaturation: (range: [number, number]) => {
      set((state) => {
        return {
          ...state,
          minSaturation: range[0],
          maxSaturation: range[1],
        };
      });
      get().updatePalettes();
    },
    updatePalettes: () => {
      const {
        steps,
        mainPalette,
        getNormalizedValues,
        tintNamingMode,
        bezoldBruckeActive,
        bezoldBruckeGap,
      } = get();
      const { endLuminance, maxSaturation, minSaturation, startLuminance } =
        getNormalizedValues();

      //MAIN PALETTE
      const hueTint = okhsl(mainPalette.hue)?.h ?? 0;

      //Calc tints
      const tints: TintBuilder[] = Array.from(
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
        const l = linearValue(i, steps, startLuminance, endLuminance);
        const h = bezoldBruckeActive
          ? correctBezoldBrucke(hueTint, l, bezoldBruckeGap)
          : hueTint;
        const s = parabolaValue(i, steps, minSaturation, maxSaturation);
        const tint: TintBuilder = {
          name,
          color: {
            hex: formatHex({
              mode: "okhsl",
              h,
              s,
              l,
            }),
            h,
            s,
            l,
          },
        };

        return tint;
      });

      set((state) => {
        return {
          ...state,
          mainPalette: {
            ...state.mainPalette,
            tints,
          },
        };
      });
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
        lightness: {
          labels: mainPalette.tints.map((tint) => tint.name), // X : de 0 à 11
          datasets: [
            {
              label: "Saturation",
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
      };
    },
    setTintNamingMode: (tintNamingMode: TintsNamingMode) => {
      set((state) => {
        return {
          ...state,
          tintNamingMode,
        };
      });
      get().updatePalettes();
    },
    toggleCorrectBezoldBrucke: () => {
      set((state) => {
        return {
          ...state,
          bezoldBruckeActive: !state.bezoldBruckeActive,
        };
      });
      get().updatePalettes();
    },
    setBezoldBruckeGap(value: number) {
      set((state) => {
        return { ...state, bezoldBruckeGap: Math.max(1, Math.min(359, value)) };
      });
      get().updatePalettes();
    },
    resetLightness() {
      set((state) => {
        return {
          ...state,
          startLuminance: PALETTE_BUILDER_DEFAULT_SETTINGS.startLuminance,
          endLuminance: PALETTE_BUILDER_DEFAULT_SETTINGS.endLuminance,
        };
      });
      get().updatePalettes();
    },
    resetSaturation() {
      set((state) => {
        return {
          ...state,
          minSaturation: PALETTE_BUILDER_DEFAULT_SETTINGS.minSaturation,
          maxSaturation: PALETTE_BUILDER_DEFAULT_SETTINGS.maxSaturation,
        };
      });
      get().updatePalettes();
    },
    resetPalette() {
      set((state) => {
        return {
          ...state,
          mainPalette: DEFAULT_PALETTE_BUILDER,
        };
      });
      get().updatePalettes();
    },
    resetBezoldBrucke() {
      set((state) => {
        return {
          ...state,
          bezoldBruckeActive:
            PALETTE_BUILDER_DEFAULT_SETTINGS.bezoldBruckeActive,
          bezoldBruckeGap: PALETTE_BUILDER_DEFAULT_SETTINGS.bezoldBruckeGap,
        };
      });
      get().updatePalettes();
    },
  })
);

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
  return min + (max - min) * parabola;
}

function normalizeNumber(n: number) {
  return n / 100;
}

// Fonction de correction de la teinte
const correctBezoldBrucke = (
  hue: number,
  luminance: number,
  k = 15,
  epsilon = 0.01
): number => {
  const hueShift = k * Math.log(luminance + epsilon);
  return (hue + hueShift) % 360; // Assurer que la teinte reste dans [0, 360]
};
