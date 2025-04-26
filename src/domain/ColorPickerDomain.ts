import ColorIO from "colorjs.io";

export interface Sample {
  name: string;
  colors: string[];
}

export interface ColorPickerStoreData {
  colors: string[];
  currentColorSample?: string;
  colorSamples: Sample[];
}

export function formatPickerStore({
  colorSamples,
  colors,
  currentColorSample,
}: {
  colors: ColorIO[];
  currentColorSample?: string;
  colorSamples: Sample[];
}): ColorPickerStoreData {
  return {
    colors: colors.map((color) => color.toString({ format: "hex" })),
    colorSamples,
    currentColorSample,
  };
}
