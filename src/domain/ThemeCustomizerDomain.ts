import ColorIO from 'colorjs.io';

export interface ThemePaletteBuild {
  id: string;
  name: string;
  tints: ThemeTintBuild[];
  settings: ThemePaletteSettings;
}

export interface ThemePaletteSettings {
  lightnessLeft: number;
  lightnessCenter: number;
  lightnessRight: number;
  saturationGapLeft: number;
  saturationCenter: number;
  saturationGapRight: number;
  hueGapLeft: number;
  hueGapCenter: number;
  hueGapRight: number;
}

export interface ThemeTintBuild {
  name: string;
  color: ColorIO;
}
