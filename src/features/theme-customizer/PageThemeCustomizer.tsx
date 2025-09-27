import { useParams } from 'react-router-dom';
import { useFindDesignSystem, useSaveDesignSystem } from '../design-system/DesignSystemQueries';
import ThemeCustomizerComponent from './ThemeCustomizerComponent';
import { useMemo, useState } from 'react';
import { ThemeCustomizerContext } from './ThemeCustomizerContext';
import { PaletteThemeSetting, Theme, Tint } from '../../domain/DesignSystemDomain';
import { recolorPalettes } from '../../util/ThemeGenerator';
import SidePanel from '../../ui/kit/SidePanel';
import { isPaletteThemeSettingEqual, usePalettesBuildForContext } from './PaletteChartsThemeUtil';
import ColorIO from 'colorjs.io';

function PageThemeCustomizer() {
  const { designSystemPath } = useParams();
  const { designSystem } = useFindDesignSystem(designSystemPath);
  const [activeThemeIndex, setActiveThemeIndex] = useState<number | undefined>(undefined);
  const [activePaletteIndex, setActivePaletteIndex] = useState<number | undefined>(undefined);
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);

  const activeTheme: Theme | undefined =
    designSystem && activeThemeIndex !== undefined
      ? [designSystem.themes.mainTheme, ...designSystem.themes.otherThemes][activeThemeIndex]
      : undefined;

  const referencePalette = useMemo<Tint[]>(
    () =>
      designSystem?.palettes.reduce((palette, current) => {
        return palette.length > current.tints.length ? palette : current.tints;
      }, [] as Tint[]) ?? [],
    [designSystem],
  );

  const isMain = activeThemeIndex === 0;

  const palettes = useMemo(() => {
    if (!designSystem || !activeTheme) return [];
    const {
      themes: { mainTheme },
    } = designSystem;
    return isMain || !mainTheme
      ? designSystem.palettes
      : recolorPalettes({
          palettes: designSystem.palettes,
          defaultBackground: mainTheme.background,
          theme: activeTheme,
          independantColors: designSystem.independantColors,
        }).palettes;
  }, [isMain, activeTheme, designSystem]);

  const centerColor: ColorIO | undefined = useMemo(() => {
    if (activePaletteIndex === undefined) return activePaletteIndex;
    const palette = palettes[activePaletteIndex];
    const centerTint = palette.tints[Math.floor(palette.tints.length / 2)];
    return new ColorIO(centerTint.color);
  }, [palettes, activePaletteIndex, activeThemeIndex]);

  const { activePalette, activePaletteWithoutEndSettings, activePaletteWithoutSettings } =
    usePalettesBuildForContext({ designSystem, activePaletteIndex, activeTheme, isMain });

  function applyThemePaletteSetting({
    paletteThemeSetting,
    themeName,
  }: {
    paletteThemeSetting: PaletteThemeSetting;
    themeName: string;
  }) {
    if (designSystem) {
      saveDesignSystem({
        designSystem: {
          ...designSystem,
          themes: {
            ...designSystem.themes,
            otherThemes: designSystem.themes.otherThemes.map((theme) => {
              return {
                ...theme,
                paletteThemeSettings:
                  themeName === theme.name
                    ? [
                        ...theme.paletteThemeSettings.filter(
                          (theme) => !isPaletteThemeSettingEqual(theme, paletteThemeSetting),
                        ),
                        paletteThemeSetting,
                      ].filter((setting) => setting.value !== 0)
                    : theme.paletteThemeSettings,
              };
            }),
          },
        },
        isTmp: true,
      });
    }
  }

  if (!designSystem) return null;

  return (
    <ThemeCustomizerContext
      value={{
        activeThemeIndex,
        setActiveThemeIndex,
        designSystem,
        activeTheme,
        referencePalette,
        activePaletteIndex,
        setActivePaletteIndex,
        activePalette,
        isMain,
        palettes,
        applyThemePaletteSetting,
        centerColor,
        activePaletteWithoutEndSettings,
        activePaletteWithoutSettings,
      }}
    >
      <div className="h-full w-full">
        <SidePanel>
          <ThemeCustomizerComponent />
        </SidePanel>
      </div>
    </ThemeCustomizerContext>
  );
}

export default PageThemeCustomizer;
