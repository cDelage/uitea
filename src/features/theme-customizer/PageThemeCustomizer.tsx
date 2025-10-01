import { useParams } from 'react-router-dom';
import { useFindDesignSystem, useSaveDesignSystem } from '../design-system/DesignSystemQueries';
import ThemeCustomizerComponent from './ThemeCustomizerComponent';
import { useEffect, useMemo, useState } from 'react';
import { ThemeCustomizerContext } from './ThemeCustomizerContext';
import { PaletteThemeSetting, Theme, Tint, TokenFamily } from '../../domain/DesignSystemDomain';
import { recolorPalettes } from '../../util/ThemeGenerator';
import SidePanel from '../../ui/kit/SidePanel';
import { isPaletteThemeSettingEqual, usePalettesBuildForContext } from './PaletteChartsThemeUtil';
import ColorIO from 'colorjs.io';
import { getDesignSystemTokens } from '../../util/DesignSystemUtils';

function PageThemeCustomizer() {
  const { designSystemPath } = useParams();
  const { designSystem } = useFindDesignSystem(designSystemPath);
  const [activeThemeIndex, setActiveThemeIndex] = useState<number | undefined>(undefined);
  const [activePaletteIndex, setActivePaletteIndex] = useState<number | undefined>(undefined);
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);

  const tokenFamilies: TokenFamily[] = useMemo(
    () => getDesignSystemTokens(designSystem, true),
    [designSystem],
  );

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

  function createTheme(color: string) {
    if (!designSystem) return;

    saveDesignSystem(
      {
        designSystem: {
          ...designSystem,
          themes: {
            ...designSystem.themes,
            otherThemes: [
              ...designSystem.themes.otherThemes,
              {
                name: `theme-${designSystem.themes.otherThemes.length + 1}`,
                background: color,
                paletteThemeSettings: [],
              },
            ],
          },
        },
        isTmp: true,
      },
      {
        onSuccess: () => {
          setActiveThemeIndex(designSystem.themes.otherThemes.length + 1);
          setActivePaletteIndex(undefined);
        },
      },
    );
  }

  function removeTheme(index: number) {
    if (!designSystem) return;

    saveDesignSystem({
      designSystem: {
        ...designSystem,
        themes: {
          ...designSystem.themes,
          otherThemes: designSystem.themes.otherThemes.filter((_theme, i) => i + 1 !== index),
        },
      },
      isTmp: true,
    });
    setActiveThemeIndex(undefined);
    setActivePaletteIndex(undefined);
  }

  function updateTheme(updatedTheme: Theme, index: number) {
    if (!designSystem) return;
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        themes: {
          ...designSystem.themes,
          otherThemes: designSystem.themes.otherThemes.map((theme, i) => {
            return i + 1 !== index ? theme : updatedTheme;
          }),
        },
      },
      isTmp: true,
    });
  }

  useEffect(() => {
    if (activeThemeIndex === undefined && designSystem?.themes.mainTheme) {
      setActiveThemeIndex(0);
    }
  }, [designSystem, activeThemeIndex]);

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
        removeTheme,
        createTheme,
        tokenFamilies,
        updateTheme,
      }}
    >
      <div className="h-full w-full relative">
        <SidePanel>
          <ThemeCustomizerComponent />
        </SidePanel>
      </div>
    </ThemeCustomizerContext>
  );
}

export default PageThemeCustomizer;
