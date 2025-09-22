import { useEffect, useState } from 'react';
import {
  EndSettingAttribute,
  Palette,
  PaletteThemeSetting,
  Theme,
} from '../../domain/DesignSystemDomain';
import { PaletteBuild, PaletteSettings } from '../../domain/PaletteBuilderDomain';
import { getGradient, OKHSL, PickerAxe } from '../../util/PickerUtil';
import { AxeData, ChartAxeData } from '../palette-builder/PaletteChartsUtil';
import ColorIO from 'colorjs.io';
import { useThemeCustomizerContext } from './ThemeCustomizerContext';
import { mapRange, midpoint } from '../../util/Interpolation';

export interface ThemeAxesPayload {
  centerAxesOkhsl: CenterAxeData[];
  paletteBuild: PaletteBuild;
  setPaletteBuild: (paletteBuild: PaletteBuild) => void;
}

export interface CenterAxesOkhsl {
  hue: AxeData;
  saturation: AxeData;
  lightness: AxeData;
}

export type CenterAxeData = AxeData & {
  axeName: string;
};

export function useThemeCenterAxes({
  palette,
  theme,
  centerColor,
}: {
  palette: PaletteBuild;
  theme: Theme;
  centerColor: ColorIO;
}): ThemeAxesPayload {
  const { name } = palette;
  const [paletteBuild, setPaletteBuild] = useState(palette);
  const { applyThemePaletteSetting } = useThemeCustomizerContext();

  const paletteBuildCenterColor = new ColorIO(
    palette.tints.find((tint) => tint.isCenter)?.color ?? '#dddddd',
  );

  const hueGradient = getGradient({ color: centerColor, space: 'okhsl', pickerAxe: OKHSL.axes[0] });
  const saturationGradient = getGradient({
    color: centerColor,
    space: 'okhsl',
    pickerAxe: OKHSL.axes[1],
  });
  const lightnessGradient = getGradient({
    color: centerColor,
    space: 'okhsl',
    pickerAxe: OKHSL.axes[2],
  });

  useEffect(() => {
    if (paletteBuild.name !== name) {
      setPaletteBuild(palette);
    }
  }, [name, paletteBuild, palette]);

  return {
    paletteBuild,
    setPaletteBuild,
    centerAxesOkhsl: [
      {
        axeName: 'hue',
        value: (paletteBuild.settings.hueGapCenter ?? 0) + paletteBuildCenterColor.okhsl[0],
        min: 0,
        max: 360,
        step: 0.01,
        update: (value: number | number[]) =>
          setPaletteBuild({
            ...paletteBuild,
            settings: {
              ...paletteBuild.settings,
              hueGapCenter: (value as number) - paletteBuildCenterColor.okhsl[0],
            },
          }),
        reset: () => {
          setPaletteBuild({
            ...paletteBuild,
            settings: {
              ...paletteBuild.settings,
              hueGapCenter: 0,
            },
          });
          applyThemePaletteSetting({
            themeName: theme.name,
            paletteThemeSetting: {
              attribute: 'hueGapCenter',
              paletteName: palette.name,
              value: 0,
            },
          });
        },
        onComplete: () => {
          if (paletteBuild.settings.hueGapCenter !== undefined) {
            applyThemePaletteSetting({
              themeName: theme.name,
              paletteThemeSetting: {
                attribute: 'hueGapCenter',
                paletteName: palette.name,
                value: paletteBuild.settings.hueGapCenter,
              },
            });
          }
        },
        gradient: hueGradient,
      },
      {
        axeName: 'saturation',
        value: (paletteBuild.settings.satChromaCenter ?? 0) + paletteBuildCenterColor.okhsl[1],
        min: 0,
        max: 1,
        step: 0.01,
        update: (value: number | number[]) =>
          setPaletteBuild({
            ...paletteBuild,
            settings: {
              ...paletteBuild.settings,
              satChromaCenter: (value as number) - paletteBuildCenterColor.okhsl[1],
            },
          }),
        reset: () => {
          setPaletteBuild({
            ...paletteBuild,
            settings: {
              ...paletteBuild.settings,
              satChromaCenter: 0,
            },
          });
          applyThemePaletteSetting({
            themeName: theme.name,
            paletteThemeSetting: {
              attribute: 'satChromaCenter',
              paletteName: palette.name,
              value: 0,
            },
          });
        },
        onComplete: () => {
          if (paletteBuild.settings.satChromaCenter !== undefined) {
            applyThemePaletteSetting({
              themeName: theme.name,
              paletteThemeSetting: {
                attribute: 'satChromaCenter',
                paletteName: palette.name,
                value: paletteBuild.settings.satChromaCenter,
              },
            });
          }
        },
        gradient: saturationGradient,
      },
      {
        axeName: 'lightness',
        value: (paletteBuild.settings.lightnessCenter ?? 0) + paletteBuildCenterColor.okhsl[2],
        min: 0,
        max: 1,
        step: 0.01,
        update: (value: number | number[]) => {
          setPaletteBuild({
            ...paletteBuild,
            settings: {
              ...paletteBuild.settings,
              lightnessCenter: (value as number) - paletteBuildCenterColor.okhsl[2],
            },
          });
        },
        reset: () => {
          setPaletteBuild({
            ...paletteBuild,
            settings: {
              ...paletteBuild.settings,
              lightnessCenter: 0,
            },
          });
          applyThemePaletteSetting({
            themeName: theme.name,
            paletteThemeSetting: {
              attribute: 'lightnessCenter',
              paletteName: palette.name,
              value: 0,
            },
          });
        },
        onComplete: () => {
          if (paletteBuild.settings.lightnessCenter !== undefined) {
            applyThemePaletteSetting({
              themeName: theme.name,
              paletteThemeSetting: {
                attribute: 'lightnessCenter',
                paletteName: palette.name,
                value: paletteBuild.settings.lightnessCenter,
              },
            });
          }
        },
        gradient: lightnessGradient,
      },
    ],
  };
}

export function useThemeCharts({
  palette,
  theme,
}: {
  palette: PaletteBuild;
  theme: Theme;
}): [ChartAxeData, ChartAxeData, ChartAxeData] {
  const [paletteBuild, setPaletteBuild] = useState(palette);
  const { name } = palette;

  const { applyThemePaletteSetting } = useThemeCustomizerContext();

  const leftColor: ColorIO = paletteBuild.tints[0].color;
  const centerColor: ColorIO = paletteBuild.tints[Math.floor(paletteBuild.tints.length / 2)].color;
  const rightColor: ColorIO = paletteBuild.tints[paletteBuild.tints.length - 1].color;

  const leftLightestColor: boolean = leftColor.okhsl[2] >= rightColor.okhsl[2];

  const lightnessAxe = { ...OKHSL.axes[2] };
  const saturationAxe = { ...OKHSL.axes[1] };

  const leftLightnessGradient = computeChartThemeAxeGradient({
    paletteCenterColor: centerColor,
    axe: lightnessAxe,
    direction: leftLightestColor ? 'max' : 'min',
  });

  const rightLightnessGradient = computeChartThemeAxeGradient({
    paletteCenterColor: centerColor,
    axe: lightnessAxe,
    direction: leftLightestColor ? 'min' : 'max',
  });

  const leftSatChromaGradient = computeChartThemeAxeGradient({
    paletteCenterColor: centerColor,
    axe: saturationAxe,
    direction: leftLightestColor ? 'max' : 'min',
  });

  const rightSatChromaGradient = computeChartThemeAxeGradient({
    paletteCenterColor: centerColor,
    axe: saturationAxe,
    direction: leftLightestColor ? 'min' : 'max',
  });

  const leftHueGradient = computeChartThemeAxeHueGradient({ centerColor: leftColor });

  const rightHueGradient = computeChartThemeAxeHueGradient({ centerColor: rightColor });

  //On chart, the value between 0 & 1 of the lightest color
  const lightestColorValue: number = mapRange({
    min: lightnessAxe.max,
    max: centerColor.get('okhsl.l'),
    value: leftLightestColor ? leftColor.get('okhsl.l') : rightColor.get('okhsl.l'),
    newMin: 0,
    newMax: 1,
  });

  //On chart, the value between 0 & 1 of the darkest color
  const darkestColorValue: number = mapRange({
    min: centerColor.get('okhsl.l'),
    max: lightnessAxe.min,
    value: leftLightestColor ? rightColor.get('okhsl.l') : leftColor.get('okhsl.l'),
    newMin: 1,
    newMax: 0,
  });

  const leftLightnessValue: number = leftLightestColor ? lightestColorValue : darkestColorValue;

  const rightLightnessValue: number = leftLightestColor ? darkestColorValue : lightestColorValue;

  const leftLightnessAxe: AxeData = getChartAxeData({
    attribute: 'lightnessLeft',
    gradient: leftLightnessGradient,
    paletteBuild,
    reverse: leftLightestColor,
    setPaletteBuild,
    theme,
    value: leftLightnessValue,
  });

  const rightLightnessAxe: AxeData = getChartAxeData({
    attribute: 'lightnessRight',
    gradient: rightLightnessGradient,
    paletteBuild,
    reverse: !leftLightestColor,
    setPaletteBuild,
    theme,
    value: rightLightnessValue,
  });

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

  useEffect(() => {
    if (paletteBuild.name !== name) {
      setPaletteBuild(palette);
    }
  }, [name, paletteBuild, palette]);

  return [
    {
      axeName: 'l',
      axeLabel: 'lightness',
      leftAxeData: leftLightnessAxe,
      rightAxeData: rightLightnessAxe,
    },
    {
      axeName: saturationAxe.name,
      axeLabel: saturationAxe.label,
      leftAxeData: leftChromaAxe,
      rightAxeData: rightChromaAxe,
    },
    {
      axeName: 'h',
      axeLabel: 'hue',
      leftAxeData: leftHueAxe,
      rightAxeData: rightHueAxe,
    },
  ];
}

function computeChartThemeAxeGradient({
  paletteCenterColor,
  axe,
  direction,
}: {
  paletteCenterColor: ColorIO;
  axe: PickerAxe;
  direction: 'max' | 'min';
}): string {
  const startColor = new ColorIO(paletteCenterColor);
  const centerColor = new ColorIO(paletteCenterColor);
  const endColor = new ColorIO(paletteCenterColor);
  endColor.set(`okhsl.${axe.name}`, axe[direction]);
  const centerAxeValue = midpoint(
    startColor.get(`okhsl.${axe.name}`),
    endColor.get(`okhsl.${axe.name}`),
  );
  centerColor.set(`okhsl.${axe.name}`, centerAxeValue);

  return `${(direction === 'min' ? startColor : endColor).toString({
    format: 'hex',
  })},${centerColor.toString({
    format: 'hex',
  })},${(direction === 'min' ? endColor : startColor).toString({ format: 'hex' })}`;
}

function computeChartThemeAxeHueGradient({ centerColor }: { centerColor: ColorIO }): string {
  const centerColorHue: number = centerColor.get('okhsl.h');
  const startColor = new ColorIO(centerColor);
  const endColor = new ColorIO(centerColor);
  endColor.set('okhsl.h', centerColorHue - 20);
  startColor.set('okhsl.h', centerColorHue + 20);
  return `${startColor.toString({
    format: 'hex',
  })},${centerColor.toString({
    format: 'hex',
  })},${endColor.toString({ format: 'hex' })}`;
}

export function paletteToPaletteBuild(palette: Palette, theme: Theme): PaletteBuild {
  const { paletteThemeSettings } = theme;
  const { paletteName, tints } = palette;
  const settings = buildPaletteSettings({ paletteThemeSettings, paletteName });
  return {
    id: '',
    name: paletteName,
    tints: tints.map((tint, index) => {
      return {
        color: new ColorIO(tint.color),
        name: tint.label,
        isCenter: index === Math.floor(palette.tints.length / 2),
      };
    }),
    settings,
  };
}

export const DEFAULT_PALETTE_THEME_SETTINGS: PaletteSettings = {
  hueGapCenter: 0,
  hueGapLeft: 0,
  hueGapRight: 0,
  lightnessCenter: 0,
  lightnessLeft: 0,
  lightnessRight: 0,
  satChromaCenter: 0,
  satChromaGapLeft: 0,
  satChromaGapRight: 0,
};

export function buildPaletteSettings({
  paletteThemeSettings,
  paletteName,
}: {
  paletteThemeSettings: PaletteThemeSetting[];
  paletteName: string;
}): PaletteSettings {
  // Appliquer les overrides si on trouve une valeur pour la palette donnée
  return paletteThemeSettings
    .filter((setting) => setting.paletteName === paletteName)
    .reduce(
      (acc, setting) => {
        acc[setting.attribute] = setting.value;
        return acc;
      },
      { ...DEFAULT_PALETTE_THEME_SETTINGS },
    );
}

export function isPaletteThemeSettingEqual(a: PaletteThemeSetting, b: PaletteThemeSetting) {
  return a.paletteName === b.paletteName && a.attribute === b.attribute;
}

function getChartAxeData({
  paletteBuild,
  attribute,
  value,
  setPaletteBuild,
  theme,
  gradient,
  reverse,
}: {
  paletteBuild: PaletteBuild;
  attribute: EndSettingAttribute;
  value: number;
  setPaletteBuild: React.Dispatch<React.SetStateAction<PaletteBuild>>;
  theme: Theme;
  gradient: string;
  reverse: boolean;
}): AxeData {
  const { applyThemePaletteSetting } = useThemeCustomizerContext();

  return {
    value: value + (paletteBuild.settings[attribute] ?? 0),
    update: (additionalValue: number | number[]) => {
      setPaletteBuild((pal) => {
        return {
          ...pal,
          settings: {
            ...pal.settings,
            [attribute]: (additionalValue as number) - value,
          },
        };
      });
    },
    reset: () => {
      setPaletteBuild((pal) => {
        return {
          ...pal,
          settings: {
            ...pal.settings,
            [attribute]: 0,
          },
        };
      });
      applyThemePaletteSetting({
        themeName: theme.name,
        paletteThemeSetting: {
          attribute,
          paletteName: paletteBuild.name,
          value: 0,
        },
      });
    },
    onComplete: () => {
      applyThemePaletteSetting({
        themeName: theme.name,
        paletteThemeSetting: {
          attribute,
          paletteName: paletteBuild.name,
          value: paletteBuild.settings[attribute] ?? 0,
        },
      });
    },
    min: 0,
    max: 1,
    gradient,
    step: 0.01,
    reverse,
  };
}
