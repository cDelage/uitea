import chromajs from "chroma-js";
import {
  HslStore,
  OklchStore,
  PaletteColor,
} from "../features/design-system/PaletteBuilder3/PaletteBuilder3Store";

export interface PickerData {
  lightnessGradient: string;
  lightness: number;
  hueGradient: string;
  hue: number;
  saturationChromaGradient: string;
  saturationChroma: number;
}

export type PickerMode = "hsl" | "oklch";

export function getPickerData({
  color,
  pickerMode,
}: {
  color: PaletteColor;
  pickerMode: PickerMode;
}): PickerData {
  if (pickerMode === "hsl") {
    const [hue, saturation, lightness] = color.hsl();
    const hueGradientColors = Array.from({ length: 13 }, (_, i) => {
      const step = (i * 30) % 360;
      const color = chromajs.hsl(step, saturation, lightness);
      return color.hex();
    }).join(", ");
    const saturationGradientColors = Array.from({ length: 11 }, (_, i) => {
      const step = i * 0.1;
      const color = chromajs.hsl(hue, step, lightness);
      return color.hex();
    }).join(", ");
    const lightnessGradientColors = Array.from({ length: 11 }, (_, i) => {
      const step = i * 0.1;
      const color = chromajs.hsl(hue, saturation, step);
      return color.hex();
    }).join(", ");
    return {
      hue: color.hslStore?.h ?? hue,
      saturationChroma: color.hslStore?.s ?? saturation,
      lightness: color.hslStore?.l ?? lightness,
      hueGradient: `linear-gradient(to right, ${hueGradientColors})`,
      lightnessGradient: `linear-gradient(to right, ${lightnessGradientColors})`,
      saturationChromaGradient: `linear-gradient(to right, ${saturationGradientColors})`,
    };
  } else {
    //Mode OKLCH
    const [lightness, chroma, hue] = color.oklch();
    const lightnessGradientColors = Array.from({ length: 11 }, (_, i) => {
      const step = i * 0.1;
      const color = chromajs.oklch(step, chroma, hue);
      return color.hex();
    }).join(", ");
    const saturationGradientColors = Array.from({ length: 11 }, (_, i) => {
      const step = i * 0.1;
      const color = chromajs.oklch(lightness, step, hue);
      return color.hex();
    }).join(", ");
    const hueGradientColors = Array.from({ length: 13 }, (_, i) => {
      const step = (i * 30) % 360;
      const color = chromajs.oklch(lightness, chroma, step);
      return color.hex();
    }).join(", ");
    return {
      hue: color.oklchStore?.h ?? hue,
      saturationChroma: color.oklchStore?.c ?? chroma,
      lightness: color.oklchStore?.l ?? lightness,
      hueGradient: `linear-gradient(to right, ${hueGradientColors})`,
      lightnessGradient: `linear-gradient(to right, ${lightnessGradientColors})`,
      saturationChromaGradient: `linear-gradient(to right, ${saturationGradientColors})`,
    };
  }
}

type ColorAxe = "h" | "c" | "s" | "l";

export function updateColor({
  axe,
  color,
  pickerMode,
  value,
}: {
  color: PaletteColor;
  pickerMode: PickerMode;
  value: number;
  axe: ColorAxe;
}): PaletteColor {
  const newColor = chromajs(color).set(
    `${pickerMode}.${axe}`,
    value
  ) as PaletteColor;
  if (!color[`${pickerMode}Store`]) {
    if (pickerMode === "hsl") {
      const hsl = getColorOrOldColor({
        oldColor: color,
        newColor,
        pickerMode,
      }) as HslStore;
      newColor.hslStore = hsl;
    } else {
      const oklch = getColorOrOldColor({
        oldColor: color,
        newColor,
        pickerMode,
      }) as OklchStore;
      newColor.oklchStore = oklch;
    }
  } else if (pickerMode === "hsl" && axe !== "c") {
    newColor.hslStore = color.hslStore as HslStore;
    newColor.hslStore[axe] = value;
  } else if (pickerMode === "oklch" && axe !== "s") {
    newColor.oklchStore = color.oklchStore as OklchStore;
    newColor.oklchStore[axe] = value;
  }

  if (pickerMode === "hsl" && newColor.hslStore !== undefined) {
    const colorPalette = chromajs.hsl(
      newColor.hslStore.h,
      newColor.hslStore.s,
      newColor.hslStore.l
    ) as PaletteColor;
    colorPalette.hslStore = newColor.hslStore;
    colorPalette.oklchStore = newColor.oklchStore;
    return colorPalette;
  } else if (pickerMode === "oklch" && newColor.oklchStore !== undefined) {
    const colorPalette = chromajs.oklch(
      newColor.oklchStore.l,
      newColor.oklchStore.c,
      newColor.oklchStore.h
    ) as PaletteColor;
    colorPalette.hslStore = newColor.hslStore;
    colorPalette.oklchStore = newColor.oklchStore;
    return colorPalette;
  }

  return newColor;
}

export function updateColorFromString({
  color,
  value,
}: {
  color: PaletteColor;
  value: string;
}): PaletteColor {
  const newColor = chromajs(value) as PaletteColor;

  newColor.oklchStore = getColorOrOldColor({
    oldColor: color,
    newColor,
    pickerMode: "oklch",
  }) as OklchStore;
  newColor.hslStore = getColorOrOldColor({
    oldColor: color,
    newColor,
    pickerMode: "hsl",
  }) as HslStore;

  return newColor;
}

function getColorOrOldColor({
  oldColor,
  newColor,
  pickerMode,
}: {
  oldColor: PaletteColor;
  newColor: PaletteColor;
  pickerMode: PickerMode;
}): HslStore | OklchStore {
  const newH = newColor.get(`${pickerMode}.h`);
  if (pickerMode === "hsl") {
    if (Number.isNaN(newH)) {
      return {
        h: oldColor.get("hsl.h"),
        s: oldColor.get("hsl.s"),
        l: oldColor.get("hsl.l"),
      };
    } else {
      return {
        h: newH,
        s: newColor.get("hsl.s"),
        l: newColor.get("hsl.l"),
      };
    }
  } else {
    //Mode oklch
    if (Number.isNaN(newH)) {
      return {
        l: oldColor.get("oklch.l"),
        c: oldColor.get("oklch.c"),
        h: oldColor.get("oklch.h"),
      };
    } else {
      return {
        l: newColor.get("oklch.l"),
        c: newColor.get("oklch.c"),
        h: newColor.get("oklch.h"),
      };
    }
  }
}
