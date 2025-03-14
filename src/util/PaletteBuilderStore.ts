import { create } from "zustand";
import chroma from "chroma-js";

interface TintBuilder {
  name: string;
  luminance: number;
  saturation: number;
}

interface HueProposed {
  hex: string;
  name: string;
  flag?: string;
  saturation: number;
}

export interface PaletteBuild {
  name: string;
  hue: string;
  tints: string[];
  active: boolean;
  saturation: number;
}

interface PaletteBuilderStore {
  steps: number;
  startLuminance: number;
  endLuminance: number;
  startSaturation: number;
  endSaturation: number;
  tints: TintBuilder[];
  mainPalette: PaletteBuild | undefined;
  additionalPalettes: PaletteBuild[];
  huesProposed: HueProposed[];
  generateTintsArray: () => void;
  setSteps: (steps: number) => void;
  setTints: (tints: TintBuilder[]) => void;
  setRangeLuminance: (range: [number, number]) => void;
  setRangeSaturation: (range: [number, number]) => void;
  setMainPalette: (mainColor: string) => void;
  updatePalettesColors: () => void;
  appendAdditionalPalette: (
    hex: string,
    saturation: number,
    name?: string
  ) => void;
  updateAdditionalPalette: (index: number, palette: PaletteBuild) => void;
  updateMainPalette: (palette: PaletteBuild) => void;
  generateMainPalette: (hue: string) => string[];
  generateAdditionalPalette: (hue: string) => string[];
}

export const usePaletteBuilderStore = create<PaletteBuilderStore>(
  (set, get) => ({
    steps: 11,
    endLuminance: 5,
    startLuminance: 92,
    mainPalette: undefined,
    additionalPalettes: [],
    huesProposed: [],
    startSaturation: 5,
    endSaturation: 95,
    tints: [
      { name: "50", luminance: 92, saturation: 0 },
      { name: "100", luminance: 83, saturation: 10 },
      { name: "200", luminance: 75, saturation: 20 },
      { name: "300", luminance: 66, saturation: 30 },
      { name: "400", luminance: 57, saturation: 40 },
      { name: "500", luminance: 48, saturation: 50 },
      { name: "600", luminance: 40, saturation: 60 },
      { name: "700", luminance: 31, saturation: 70 },
      { name: "800", luminance: 22, saturation: 80 },
      { name: "900", luminance: 14, saturation: 90 },
      { name: "950", luminance: 5, saturation: 100 },
    ],
    generateTintsArray: () => {
      const {
        steps,
        endLuminance,
        startLuminance,
        startSaturation,
        endSaturation,
        tints,
      } = get();
      let tintsLuminances: TintBuilder[] = [];
      if (steps === 1) {
        tintsLuminances.push({
          name: "500",
          luminance: 1,
          saturation: 1,
        });
      } else {
        const stepLumSize = (startLuminance - endLuminance) / (steps - 1);
        const stepSatSize = (startSaturation - endSaturation) / (steps - 1);
        //Calc all tints luminance with 2 numbers after dot (example 0.54, 0.63, 0.72...)
        tintsLuminances = Array.from({ length: steps }, (_, i) => {
          return {
            name: tints[i]?.name ?? `${i + 1}00`,
            luminance: Math.round(startLuminance - i * stepLumSize),
            saturation: Math.round(startSaturation - i * stepSatSize),
          };
        });
      }
      set((state) => {
        return {
          ...state,
          tints: tintsLuminances,
        };
      });
      get().updatePalettesColors();
    },
    setSteps: (steps: number) => {
      set((state) => {
        return {
          ...state,
          steps,
        };
      });
      get().generateTintsArray();
    },
    setTints: (tints: TintBuilder[]) => {
      set((state) => {
        return {
          ...state,
          tints,
        };
      });
    },
    setRangeLuminance: (range: [number, number]) => {
      set((state) => {
        return {
          ...state,
          startLuminance: range[0],
          endLuminance: range[1],
        };
      });
      get().generateTintsArray();
    },
    setRangeSaturation: (range: [number, number]) => {
      set((state) => {
        return {
          ...state,
          startSaturation: range[0],
          endSaturation: range[1],
        };
      });
      get().generateTintsArray();
    },
    setMainPalette: (mainColor: string) => {
      const { generateMainPalette } = get();
      const name = getHueName(mainColor);
      const paletteTints = generateMainPalette(mainColor);
      const newHuesProposed = getComplementaryHues(mainColor);
      set((state) => {
        return {
          ...state,
          mainPalette: {
            hue: mainColor,
            name,
            tints: paletteTints,
            active: true,
            saturation: 1,
          },
          huesProposed: newHuesProposed,
        };
      });
    },
    updatePalettesColors: () => {
      const {
        mainPalette,
        additionalPalettes,
        generateAdditionalPalette,
        generateMainPalette,
      } = get();
      if (mainPalette) {
        const mainName = huesName.includes(mainPalette.name)
          ? getHueName(mainPalette.hue)
          : mainPalette.name;
        const mainTints = generateMainPalette(mainPalette.hue);
        const main: PaletteBuild = {
          name: mainName,
          tints: mainTints,
          hue: mainPalette.hue,
          active: mainPalette.active,
          saturation: mainPalette.saturation,
        };
        const newAdditionalPalettes: PaletteBuild[] = additionalPalettes.map(
          (palette) => {
            const paletteName = huesName.includes(palette.name)
              ? getHueName(palette.hue)
              : palette.name;
            const paletteTints: string[] = generateAdditionalPalette(
              palette.hue
            );
            return {
              name: paletteName,
              tints: paletteTints,
              hue: palette.hue,
              active: palette.active,
              saturation: palette.saturation,
            } as PaletteBuild;
          }
        );
        set((state) => {
          return {
            ...state,
            mainPalette: main,
            additionalPalettes: newAdditionalPalettes,
          };
        });
      }
    },
    appendAdditionalPalette: (
      hex: string,
      saturation: number,
      name?: string
    ) => {
      const finalName = name ?? getHueName(hex);
      const { generateAdditionalPalette } = get();
      const paletteTints: string[] = generateAdditionalPalette(hex);
      set((state) => {
        return {
          ...state,
          additionalPalettes: [
            ...state.additionalPalettes,
            {
              hue: hex,
              name: finalName,
              tints: paletteTints,
              active: true,
              saturation: saturation,
            },
          ],
        };
      });
    },
    updateAdditionalPalette(index: number, palette: PaletteBuild) {
      const { additionalPalettes } = get();
      const newPalette = { ...palette };
      newPalette.tints = this.generateAdditionalPalette(palette.hue);
      additionalPalettes[index] = newPalette;
      set((state) => {
        return {
          ...state,
          additionalPalettes,
        };
      });
    },
    updateMainPalette(palette: PaletteBuild) {
      set((state) => {
        return {
          ...state,
          mainPalette: palette,
        };
      });
    },
    generateMainPalette(hue: string) {
      const { tints } = get();
      const computedTints = tints
        .map((tint) => {
          return {
            lum: normalizeNumber(tint.luminance),
            sat: normalizeNumber(tint.saturation),
          };
        })
        .map((tint) => {
          const lumHsl = chroma("#ff0042").luminance(tint.lum).hsl();
          const hueHsl = chroma(hue).hsl();
          return chroma.hsl(hueHsl[0], lumHsl[1] * tint.sat, lumHsl[2]);
        });
      return chroma
        .scale(computedTints)
        .correctLightness()
        .colors(computedTints.length);
    },
    generateAdditionalPalette(hue: string) {
      const { mainPalette } = get();
      return (
        mainPalette?.tints.map((tint) => {
          const additionalPaletteLch = chroma(hue).hsl();
          const mainLch = chroma(tint).hsl();
          return chroma
            .hsl(additionalPaletteLch[0], mainLch[1], mainLch[2])
            .hex();
        }) ?? []
      );
    },
  })
);

export function isValidColor(color: string) {
  const hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/; // Validation pour hex (short et long)
  const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/; // Validation pour RGB
  const hslRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/; // Validation pour HSL

  return hexRegex.test(color) || rgbRegex.test(color) || hslRegex.test(color);
}

//hueStep = 360 / 12 -> 12 couleurs proposées
const hueStep = 30;

export function getComplementaryHues(mainColor: string): HueProposed[] {
  const mainHsl = chroma(mainColor).hsl();
  const base = mainHsl[0];
  const complementaryHue = Math.floor((base + 180) % 360);
  const grayHex: string = chroma
    .hsl(mainHsl[0], mainHsl[1] * 0.125, mainHsl[2])
    .hex();
  return [
    ...Array.from({ length: 11 }, (_, i) => i + 1)
      .map((n) => Math.floor((base + n * hueStep) % 360))
      .map((hueNumber) => {
        const hex = chroma.hsl(hueNumber, 1, 0.5).hex();

        return {
          hex,
          flag: complementaryHue === hueNumber ? "complementary" : undefined,
          name: getHueName(hex),
          saturation: 1,
        } as HueProposed;
      })
      .sort((a, b) => {
        if (a.flag === "complementary") return -1;
        if (b.flag === "complementary") return 1;
        return 0;
      }),
    {
      name: "gray",
      hex: grayHex,
      saturation: 0.125,
    },
  ];
}

export function getProximateHues(centerHue: string, step = 10): string[] {
  const leftColors = [];
  const rightColors = [];
  const hsl = chroma(centerHue).hsl();
  const hue = hsl[0];
  const centerColor = chroma.hsl(hue, 1, 0.5).hex();

  // Générer 5 couleurs à gauche (teintes décroissantes)
  for (let i = 1; i <= 5; i++) {
    // On soustrait i*step en s'assurant de rester dans l'intervalle [0, 360]
    const leftHue = (hue - i * step + 360) % 360;
    // On insère au début pour que la couleur la plus proche du centre soit la dernière du tableau leftColors
    leftColors.unshift(chroma.hsl(leftHue, 1, 0.5).hex());
  }

  // Générer 5 couleurs à droite (teintes croissantes)
  for (let i = 1; i <= 5; i++) {
    const rightHue = (hue + i * step) % 360;
    rightColors.push(chroma.hsl(rightHue, 1, 0.5).hex());
  }

  // Retourne un tableau combiné : couleurs de gauche, couleur centrale, couleurs de droite
  return [...leftColors, centerColor, ...rightColors];
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
];

function getHueName(hex: string): string {
  const hsl = chroma(hex).hsl();
  const hue = hsl[0];
  const angle = ((hue % 360) + 360) % 360;
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

function normalizeNumber(n: number) {
  return n / 100;
}
