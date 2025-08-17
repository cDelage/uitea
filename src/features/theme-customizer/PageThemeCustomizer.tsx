import { useParams } from "react-router-dom";
import { useFindDesignSystem, useSaveDesignSystem } from "../design-system/DesignSystemQueries";
import ThemeCustomizerComponent from "./ThemeCustomizerComponent";
import { useMemo, useState } from "react";
import { ThemeCustomizerContext } from "./ThemeCustomizerContext";
import { PaletteThemeSetting, Theme, Tint } from "../../domain/DesignSystemDomain";
import { recolorPalettes } from "../../util/ThemeGenerator";
import SidePanel from "../../ui/kit/SidePanel";
import { DEFAULT_PALETTE_THEME_SETTINGS, isPaletteThemeSettingEqual, paletteToPaletteBuild } from "./PaletteChartsThemeUtil";
import { PaletteBuild } from "../../domain/PaletteBuilderDomain";

function PageThemeCustomizer() {
    const { designSystemPath } = useParams();
    const { designSystem } = useFindDesignSystem(
        designSystemPath
    );
    const [activeThemeIndex, setActiveThemeIndex] = useState<number | undefined>(undefined);
    const [activePaletteIndex, setActivePaletteIndex] = useState<number | undefined>(undefined);
    const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);

    const activeTheme: Theme | undefined = designSystem && activeThemeIndex !== undefined
        ? [designSystem.themes.mainTheme, ...designSystem.themes.otherThemes][activeThemeIndex]
        : undefined;

    const referencePalette = useMemo<Tint[]>(() => designSystem?.palettes.reduce((palette, current) => {
        return palette.length > current.tints.length ? palette : current.tints
    }, [] as Tint[]) ?? [], [designSystem]);

    const isMain = activeThemeIndex === 0;

    const palettes = useMemo(() => {
        if (!designSystem || !activeTheme) return [];
        const { themes: { mainTheme } } = designSystem;
        return isMain || !mainTheme
            ? designSystem.palettes
            : recolorPalettes({
                palettes: designSystem.palettes,
                defaultBackground: mainTheme.background,
                newBackground: activeTheme.background,
                independantColors: designSystem.independantColors
            }).palettes;
    }, [
        isMain,
        activeTheme,
        designSystem
    ]);

    const activePalette: PaletteBuild | undefined = (activePaletteIndex !== undefined
        && activeTheme !== undefined)
        ? paletteToPaletteBuild(palettes[activePaletteIndex], activeTheme)
        : undefined;



    function applyThemePaletteSetting({ paletteThemeSetting, themeName }: 
        { paletteThemeSetting: PaletteThemeSetting, themeName: string }) {
        if (designSystem) {
            saveDesignSystem({
                designSystem: {
                    ...designSystem,
                    themes: {
                        ...designSystem.themes,
                        otherThemes: designSystem.themes.otherThemes.map(theme => {
                            return {
                                ...theme,
                                paletteThemeSettings: themeName === theme.name ?
                                    [...theme.paletteThemeSettings.filter(theme => !isPaletteThemeSettingEqual(theme, paletteThemeSetting)),
                                        paletteThemeSetting
                                    ].filter(setting => {
                                        //Don't save the default value (for example, lightness 0.5)
                                        DEFAULT_PALETTE_THEME_SETTINGS[setting.attribute] !== setting.value
                                    })
                                    : theme.paletteThemeSettings
                            }
                        })
                    }
                }, isTmp: true
            })
        }

    }

    if (!designSystem) return null;

    return (
        <ThemeCustomizerContext value={{
            activeThemeIndex, setActiveThemeIndex, designSystem, activeTheme,
            referencePalette, activePaletteIndex, setActivePaletteIndex,
            activePalette, isMain, palettes, applyThemePaletteSetting
        }}>
            <div className="h-full w-full">
                <SidePanel>
                    <ThemeCustomizerComponent />
                </SidePanel>
            </div>
        </ThemeCustomizerContext>
    )
}

export default PageThemeCustomizer