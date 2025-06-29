import ColorIO from "colorjs.io";

export interface Sample {
  name: string;
  colors: string[];
}

export interface ColorPickerStoreData {
  colors: string[];
  samples: Sample[];
}

export function formatPickerStore({
  samples,
  colors,
}: {
  colors: ColorIO[];
  samples: Sample[];
}): ColorPickerStoreData {
  return {
    colors: colors.map((color) => color.toString({ format: "hex" })),
    samples,
  };
}
