import { FC } from "react";
import { TintsNamingMode } from "../util/TintsNaming";
import ColorIO from "colorjs.io";
export type InterpolationColorSpace = "oklch" | "lch" | "hsl";

type InterpolationColorSpaceWithLabel = {
  label: string;
  interpolationColorSpace: InterpolationColorSpace;
};

export const INTERPOLATIONS_COLOR_SPACES: InterpolationColorSpaceWithLabel[] = [
  {
    label: "oklch (recommanded)",
    interpolationColorSpace: "oklch",
  },
  {
    label: "lch",
    interpolationColorSpace: "lch",
  },
  {
    label: "hsl (to avoid)",
    interpolationColorSpace: "hsl",
  },
];

export type PaletteAxeSetting =
  | "lightnessMax"
  | "lightnessMin"
  | "satChromaGapLeft"
  | "satChromaGapRight"
  | "hueGapLeft"
  | "hueGapRight";

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

export interface PaletteBuildFile {
  id: string;
  name: string;
  tints: TintBuildFile[];
  settings: PaletteSettings;
}

export interface TintBuildFile {
  name: string;
  isAnchor?: boolean;
  isCenter?: boolean;
  color: string;
}

export interface PaletteSettings {
  lightnessMax: number;
  lightnessMin: number;
  satChromaGapLeft: number;
  satChromaGapRight: number;
  hueGapLeft: number;
  hueGapRight: number;
}

export interface PalettesStoreSettings {
  steps: number;
  tintNamingMode: TintsNamingMode;
  interpolationColorSpace: InterpolationColorSpace;
  paletteSettings: PaletteSettings;
}

export interface PaletteBuilderMetadata {
  paletteBuilderName?: string;
  path?: string;
  mainColors: string[];
}

export interface PaletteBuilder {
  metadata: PaletteBuilderMetadata;
  palettes: PaletteBuildFile[];
  settings: PalettesStoreSettings;
}

export interface PaletteBuilderPayload {
  palettes: PaletteBuildFile[];
  settings: PalettesStoreSettings;
}

export interface PaletteBuilderLoad {
  palettes: PaletteBuild[];
  settings: PalettesStoreSettings;
}

export interface PaletteBuilderRenameMetadata {
  metadata: PaletteBuilderMetadata;
  designSystemPath: string;
  newName: string;
}

export function paletteBuildToFile(
  paletteBuild: PaletteBuild
): PaletteBuildFile {
  return {
    ...paletteBuild,
    tints: paletteBuild.tints.map((tint) => {
      return {
        ...tint,
        color: tint.color.toString({ format: "hex" }),
      } as TintBuildFile;
    }),
  };
}

export function paletteBuilderFromFile(
  file: PaletteBuilderPayload
): PaletteBuilderLoad {
  return {
    ...file,
    palettes: file.palettes.map((palette) => {
      return {
        ...palette,
        tints: palette.tints.map((tint) => {
          return {
            ...tint,
            color: new ColorIO(tint.color),
          };
        }),
      } as PaletteBuild;
    }),
  };
}

export type Aligner = "HWB" | "OKLCH" | "LCH" | "CONTRAST_COLOR" | "NONE";

export type AlignerDisplayMode = "SELECTED_COLOR" | "ALL_COLORS";

export type AlignerContrastMode = "PALETTE_STEP" | "CUSTOM_COLOR";

export type AlignerSettings = {
  aligner: Aligner;
  alignerContrastMode: AlignerContrastMode;
  alignerConstrastCustomColor: ColorIO;
  alignerContrastPaletteStep: number;
  isDisplay: boolean;
};

type AlignerOption = {
  label: string;
  value: Aligner;
};

export const ALIGNER_OPTIONS: AlignerOption[] = [
  {
    label: "Whiteness-Blackness from HWB",
    value: "HWB",
  },
  {
    label: "Lightness-Chroma from OKLCH",
    value: "OKLCH",
  },
  {
    label: "Lightness-Chroma from LCH",
    value: "LCH",
  },
  {
    label: "Contrast with other color",
    value: "CONTRAST_COLOR",
  },
  {
    label: "none",
    value: "NONE",
  },
];

type AlignerDisplayModeOption = {
  label: string;
  value: AlignerDisplayMode;
};

export const ALIGNER_DISPLAY_MODE_OPTIONS: AlignerDisplayModeOption[] = [
  {
    label: "Selected color",
    value: "SELECTED_COLOR",
  },
  {
    label: "All colors",
    value: "ALL_COLORS",
  },
];

type AlignerContrastModeOption = {
  label: string;
  value: AlignerContrastMode;
};

export const ALIGNER_CONTRAST_MODE_OPTIONS: AlignerContrastModeOption[] = [
  {
    label: "Contrast with palette step",
    value: "PALETTE_STEP",
  },
  {
    label: "Contrast with a custom color",
    value: "CUSTOM_COLOR",
  },
];


export type AlignerValue = {
  aligner: string;
  icon: FC;
  value: string;
}