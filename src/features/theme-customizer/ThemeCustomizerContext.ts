import { createContext, useContext } from 'react';
import {
  DesignSystem,
  Palette,
  PaletteThemeSetting,
  Theme,
  Tint,
} from '../../domain/DesignSystemDomain';
import { PaletteBuild } from '../../domain/PaletteBuilderDomain';
import ColorIO from 'colorjs.io';

type ThemeCustomizerContextType = {
  designSystem: DesignSystem;
  activeThemeIndex: number | undefined;
  activeTheme: Theme | undefined;
  setActiveThemeIndex: (index: number | undefined) => void;
  referencePalette: Tint[];
  activePaletteIndex: number | undefined;
  setActivePaletteIndex: (index: number | undefined) => void;
  activePaletteWithoutSettings: PaletteBuild | undefined;
  activePalette: PaletteBuild | undefined;
  isMain: boolean;
  palettes: Palette[];
  applyThemePaletteSetting: (params: {
    paletteThemeSetting: PaletteThemeSetting;
    themeName: string;
  }) => void;
  centerColor?: ColorIO;
  activePaletteWithoutEndSettings: PaletteBuild | undefined;
};

export const ThemeCustomizerContext = createContext<ThemeCustomizerContextType | undefined>(
  undefined,
);

export function useThemeCustomizerContext() {
  const context = useContext(ThemeCustomizerContext);
  if (context === undefined)
    throw new Error('Theme customizer context was used outside of his scope');
  return context;
}
