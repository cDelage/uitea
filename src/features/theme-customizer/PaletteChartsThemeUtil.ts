import { Palette, PaletteThemeSetting, Theme } from "../../domain/DesignSystemDomain";
import { PaletteBuild, PaletteSettings } from "../../domain/PaletteBuilderDomain";
import { OKLCH } from "../../util/PickerUtil";
import { AxeData, ChartAxeData, computeChartAxeGradient } from "../palette-builder/PaletteChartsUtil";
import ColorIO from "colorjs.io";

export function useThemeCharts({ palette }: { palette: PaletteBuild }): [ChartAxeData, ChartAxeData, ChartAxeData] {

    const leftColor: ColorIO = palette.tints[0].color;
    const centerColor: ColorIO = palette.tints[Math.floor(palette.tints.length / 2)].color;
    const rightColor: ColorIO = palette.tints[palette.tints.length - 1].color;

    const colorCenterLeft = centerColor
        .mix("#ffffff", 1, {
            space: "oklch",
        })
        .set({
            [`oklch.h`]: leftColor.get(
                `oklch.h`
            ),
        });

    const colorCenterRight = centerColor
        .mix("#000000", 0, {
            space: "oklch",
        })
        .set({
            [`oklch.h`]: rightColor.get(
                `oklch.h`
            ),
        });

    const chromaAxe = OKLCH.axes[1];
    const hueAxe = OKLCH.axes[2];

    const leftSatChromaGradient = computeChartAxeGradient({
        centerColor: colorCenterLeft,
        axe: chromaAxe,
        interpolationColorSpace: "oklch",
    });

    const rightSatChromaGradient = computeChartAxeGradient({
        centerColor: colorCenterRight,
        axe: chromaAxe,
        interpolationColorSpace: "oklch",
    });

    const leftHueGradient = computeChartAxeGradient({
        centerColor: colorCenterLeft,
        axe: {
            ...hueAxe,
            min: colorCenterRight.get(`oklch.h`) - 20,
            max: colorCenterRight.get(`oklch.h`) + 20,
        },
        interpolationColorSpace: "oklch",
    });

    const rightHueGradient = computeChartAxeGradient({
        centerColor: colorCenterRight,
        axe: {
            ...hueAxe,
            min: colorCenterRight.get(`oklch.h`) - 20,
            max: colorCenterRight.get(`oklch.h`) + 20,
        },
        interpolationColorSpace: "oklch",
    });

    const leftLightnessAxe: AxeData = {
        value: 0.5,
        update: (value: number | number[]) => {
            //TO COMPLETE    
        },
        reset: () => {
            //TO COMPLETE    
        },
        min: 0,
        max: 1,
        gradient: ` #ffffff, ${centerColor.toString({
            format: "hex",
        })}`,
        step: 0.01,
    };

    const rightLightnessAxe: AxeData = {
        value: 0.5,
        update: (value: number | number[]) => {
            //TO COMPLETE    
        },
        reset: () => {
            //TO COMPLETE    
        },
        min: 0,
        max: 1,
        gradient: `${centerColor.toString({
            format: "hex",
        })}, #000000`,
        reverse: true,
        step: 0.01,
    };

    const leftChromaAxe: AxeData = {
        value: 0.5,
        update: (value: number | number[]) => {
            //TO COMPLETE    
        },
        reset: () => {
            //TO COMPLETE    
        },
        min: 0,
        max: 1,
        gradient: leftSatChromaGradient,
        step: 0.01,
    };

    const rightChromaAxe: AxeData = {
        value: 0.5,
        update: (value: number | number[]) => {
            //TO COMPLETE    
        },
        reset: () => {
            //TO COMPLETE    
        },
        min: 0,
        max: 1,
        gradient: rightSatChromaGradient,

        step: 0.01,
    };

    const leftHueAxe: AxeData = {
        value: 0.5,
        update: (value: number | number[]) => {
            //TO COMPLETE    
        },
        reset: () => {
            //TO COMPLETE    
        },
        min: 0,
        max: 1,
        gradient: leftHueGradient,
        step: 0.01,
    };

    const rightHueAxe: AxeData = {
        value: 0.5,
        update: (value: number | number[]) => {
            //TO COMPLETE    
        },
        reset: () => {
            //TO COMPLETE    
        },
        min: 0,
        max: 1,
        gradient: rightHueGradient,
        step: 0.01,
    };

    return [
        {
            axeName: "l",
            axeLabel: "lightness",
            leftAxeData: leftLightnessAxe,
            rightAxeData: rightLightnessAxe,
        },
        {
            axeName: chromaAxe.name,
            axeLabel: chromaAxe.label,
            leftAxeData: leftChromaAxe,
            rightAxeData: rightChromaAxe,
        },
        {
            axeName: "h",
            axeLabel: "hue",
            leftAxeData: leftHueAxe,
            rightAxeData: rightHueAxe,
        },
    ];
}

export function paletteToPaletteBuild(palette: Palette, theme: Theme): PaletteBuild {
    const {paletteThemeSettings} = theme;
    const {paletteName, tints} = palette;
    const settings = buildPaletteSettings({ paletteThemeSettings, paletteName })
    return {
        id: "",
        name: paletteName,
        tints: tints.map((tint, index) => {
            return {
                color: new ColorIO(tint.color),
                name: tint.label,
                isCenter: index === Math.floor(palette.tints.length / 2)
            }
        }),
        settings
    }
}

export const DEFAULT_PALETTE_THEME_SETTINGS: PaletteSettings = {
        hueGapCenter: 0,
        hueGapLeft: 0,
        hueGapRight: 0,
        lightnessCenter: 0.5,
        lightnessMax: 0.5,
        lightnessMin: 0.5,
        satChromaCenter: 0.5,
        satChromaGapLeft: 0.5,
        satChromaGapRight: 0.5,
    };

export function buildPaletteSettings(
    { paletteThemeSettings, paletteName }: {
        paletteThemeSettings: PaletteThemeSetting[],
        paletteName: string
    }
): PaletteSettings {
    // Appliquer les overrides si on trouve une valeur pour la palette donnée
    return paletteThemeSettings
        .filter((setting) => setting.paletteName === paletteName)
        .reduce((acc, setting) => {
            acc[setting.attribute] = setting.value;
            return acc;
        }, { ...DEFAULT_PALETTE_THEME_SETTINGS });
}

export function isPaletteThemeSettingEqual(a: PaletteThemeSetting, b: PaletteThemeSetting){
    return a.paletteName === b.paletteName && a.attribute === b.attribute
}