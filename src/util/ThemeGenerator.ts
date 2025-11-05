import {
  EndSettingAttributes as END_SETTINGS_ATTRIBUTES,
  EndSettingAttribute,
  IndependantColors,
  LeftEndSettingsAttributes,
  Palette,
  PaletteSettingAttribute,
  PaletteThemeSetting,
  Theme,
} from '../domain/DesignSystemDomain';
import ColorIO from 'colorjs.io';
import {
  computeValueByCenter,
  interpolateBetweenIndices,
  interpolateHueRelative,
} from './Interpolation';

interface EndsSettingsUtil {
  centerIndex: number;
  maxIndexPalette: number;
  index: number;
  centerColor: ColorIO;
  palette: Palette;
}

export function recolorPaletteColor({
  defaultColor,
  newCenter,
  defaultCenter,
  paletteSettingsPayload,
  endPaletteSettings,
  endSettingsUtils,
}: {
  defaultColor: ColorIO;
  defaultCenter: ColorIO;
  newCenter: ColorIO;
  paletteSettingsPayload?: PaletteCenterSettingsPayload;
  endPaletteSettings?: PaletteThemeSetting[];
  endSettingsUtils?: EndsSettingsUtil;
}): ColorIO {
  let centerColor = new ColorIO(defaultCenter);
  let recolor = recolorWithNewBackground({
    newCenter,
    defaultCenter,
    defaultColor,
  });

  //Recolor palette center color
  if (paletteSettingsPayload) {
    const [h, s, l] = centerColor.okhsl;
    centerColor = new ColorIO('okhsl', [
      h + (paletteSettingsPayload.hueGapCenter ?? 0),
      s + (paletteSettingsPayload.saturationCenter ?? 0),
      l + (paletteSettingsPayload.lightnessCenter ?? 0),
    ]);

    recolor = recolorWithNewBackground({
      defaultColor: recolor,
      defaultCenter: defaultCenter,
      newCenter: centerColor,
    });
  }

  //Recolor ends of palette (between 0 and center or center end max, add lightness, saturation or hue)
  if (endPaletteSettings?.length && endSettingsUtils) {
    recolor = endPaletteSettings.reduce((acc, cur) => {
      return applyPaletteEndsSetting({
        color: acc,
        endSetting: cur,
        endSettingsUtils,
      });
    }, recolor);
  }

  return recolor;
}

export function recolorWithNewBackground({
  defaultColor,
  newCenter,
  defaultCenter,
}: {
  defaultColor: ColorIO;
  defaultCenter: ColorIO;
  newCenter: ColorIO;
}): ColorIO {
  const h = interpolateHueRelative({
    initialCenter: defaultCenter.okhsl[0],
    initialValue: defaultColor.okhsl[0],
    newCenter: newCenter.okhsl[0],
  });

  const s = computeValueByCenter({
    min: 0,
    max: 1,
    initialCenter: defaultCenter.okhsl[1],
    initialValue: defaultColor.okhsl[1],
    newCenter: newCenter.okhsl[1],
  });

  const l = computeValueByCenter({
    min: 0,
    max: 1,
    initialCenter: defaultCenter.okhsl[2],
    initialValue: defaultColor.okhsl[2],
    newCenter: newCenter.okhsl[2],
  });

  const result = new ColorIO('okhsl', [h, s, l]);

  return result;
}

export interface RecolorPaletteResult {
  palettes: Palette[];
  independantColors: IndependantColors;
}

/**
 * Compute a new color theme from original palette, with a default background, to new background.
 * @param param0
 * @returns
 */
export function recolorPalettes({
  palettes,
  defaultBackground,
  theme,
  independantColors,
  clearCenterSettings,
  clearEndsSettings,
}: {
  palettes: Palette[];
  defaultBackground: string;
  theme: Theme;
  independantColors: IndependantColors;
  clearCenterSettings?: boolean;
  clearEndsSettings?: boolean;
}): RecolorPaletteResult {
  const palettesToUpdate = [...palettes];
  let defaultBgColor = new ColorIO(defaultBackground);
  const newBgColor = new ColorIO(theme.background);
  const isReversed: boolean = defaultBgColor.okhsl[2] >= 0.5 !== newBgColor.okhsl[2] >= 0.5;

  //Reverse manipulation: when pass from a light theme to dark theme, then compute differently the background
  if (isReversed) {
    const [paletteMin, paletteMax] = palettes.reduce<ColorIO[]>((acc, current) => {
      const paletteMin = new ColorIO(current.tints[0].color);
      if (
        !acc.length ||
        defaultBgColor.deltaE2000(acc[0]) > defaultBgColor.deltaE2000(paletteMin)
      ) {
        return [
          new ColorIO(current.tints[0].color),
          new ColorIO(current.tints[current.tints.length - 1].color),
        ];
      } else {
        return acc;
      }
    }, []);
    defaultBgColor = recolorWithNewBackground({
      defaultColor: defaultBgColor,
      newCenter: paletteMax,
      defaultCenter: paletteMin,
    });
  }

  const palettesRecolor: Palette[] = palettesToUpdate.map((palette) => {
    const paletteCenterSettingsPayload = getPaletteCenterSettings({
      palette,
      theme,
      clearCenterSettings,
    });

    let newTints = [...palette.tints];
    if (isReversed) {
      newTints.reverse();
      newTints = newTints.map((tint, index) => {
        return {
          ...tint,
          label: palette.tints[index].label,
        };
      });
    }

    const endPaletteSettings: PaletteThemeSetting[] = getPaletteEndsSettings({
      palette,
      theme,
      clearEndsSettings,
    });

    const endSettingsUtils: EndsSettingsUtil | undefined = getEndsSettingsUtils({
      palette: {
        ...palette,
        tints: newTints,
      },
      endPaletteSettings,
      defaultBgColor,
      newBgColor,
    });

    return {
      ...palette,
      tints: newTints.map((tint, index) => {
        return {
          ...tint,
          color: recolorPaletteColor({
            defaultCenter: defaultBgColor,
            defaultColor: new ColorIO(tint.color),
            newCenter: newBgColor,
            paletteSettingsPayload: paletteCenterSettingsPayload,
            endSettingsUtils: endSettingsUtils && {
              ...endSettingsUtils,
              index,
            },
            endPaletteSettings,
          }).toString({ format: 'hex' }),
        };
      }),
    };
  });
  const independantRecolor: IndependantColors = {
    white: recolorWithNewBackground({
      defaultCenter: new ColorIO(defaultBackground),
      defaultColor: new ColorIO(independantColors.white),
      newCenter: newBgColor,
    }).toString({ format: 'hex' }),
    independantColors: independantColors.independantColors.map((tint) => {
      return {
        label: tint.label,
        color: recolorWithNewBackground({
          defaultCenter: new ColorIO(defaultBackground),
          defaultColor: new ColorIO(tint.color),
          newCenter: newBgColor,
        }).toString({ format: 'hex' }),
      };
    }),
  };
  return {
    palettes: palettesRecolor,
    independantColors: independantRecolor,
  };
}

interface PaletteCenterSettingsPayload {
  hueGapCenter?: number;
  saturationCenter?: number;
  lightnessCenter?: number;
}

export function getPaletteCenterSettings({
  palette,
  theme,
  clearCenterSettings,
}: {
  palette: Palette;
  theme: Theme;
  clearCenterSettings?: boolean;
}): PaletteCenterSettingsPayload | undefined {
  const paletteSettingsArray = theme.paletteThemeSettings
    .filter((settings) => settings.paletteName === palette.paletteName)
    .filter((_x) => !clearCenterSettings)
    .filter((setting) => !END_SETTINGS_ATTRIBUTES.includes(setting.attribute));
  if (!paletteSettingsArray.length) return undefined;
  return {
    hueGapCenter: paletteSettingsArray.find((setting) => setting.attribute === 'hueGapCenter')
      ?.value,
    saturationCenter: paletteSettingsArray.find(
      (setting) => setting.attribute === 'saturationCenter',
    )?.value,
    lightnessCenter: paletteSettingsArray.find((setting) => setting.attribute === 'lightnessCenter')
      ?.value,
  };
}

export function isEndSettingAttribute(attr: PaletteSettingAttribute): attr is EndSettingAttribute {
  return END_SETTINGS_ATTRIBUTES.includes(attr as EndSettingAttribute);
}

export function getPaletteEndsSettings({
  palette,
  theme,
  clearEndsSettings,
}: {
  palette: Palette;
  theme: Theme;
  clearEndsSettings?: boolean;
}): PaletteThemeSetting[] {
  return theme.paletteThemeSettings
    .filter((settings) => settings.paletteName === palette.paletteName)
    .filter((_x) => !clearEndsSettings)
    .filter((x) => isEndSettingAttribute(x.attribute));
}

const ATTRIBUTE_AXE = {
  lightnessLeft: 'l',
  lightnessRight: 'l',
  saturationGapLeft: 's',
  saturationGapRight: 's',
  hueGapLeft: 'h',
  hueGapRight: 'h',
};

export function applyPaletteEndsSetting({
  endSetting,
  color,
  endSettingsUtils: { centerIndex, index, maxIndexPalette },
}: {
  endSetting: PaletteThemeSetting;
  color: ColorIO;
  endSettingsUtils: EndsSettingsUtil;
}): ColorIO {
  const result = new ColorIO(color);
  const { attribute, value } = endSetting;
  if (!isEndSettingAttribute(attribute)) return result;

  const axe: string = ATTRIBUTE_AXE[attribute];

  const initialValue = result.get(`okhsl.${axe}`);

  const isLeftSetting: boolean = LeftEndSettingsAttributes.includes(attribute);
  const endIndex = isLeftSetting ? 0 : maxIndexPalette;

  const coefficient = interpolateBetweenIndices({
    centerIndex,
    endIndex,
    index,
  });

  const colorGap = value * coefficient;

  result.set(`okhsl.${axe}`, initialValue + colorGap);

  return result;
}

function getEndsSettingsUtils({
  endPaletteSettings,
  palette,
  paletteCenterSettingsPayload,
  defaultBgColor,
  newBgColor,
}: {
  endPaletteSettings: PaletteThemeSetting[];
  palette: Palette;
  paletteCenterSettingsPayload?: PaletteCenterSettingsPayload;
  defaultBgColor: ColorIO;
  newBgColor: ColorIO;
}): EndsSettingsUtil | undefined {
  if (!endPaletteSettings.length) return undefined;
  const centerIndex = Math.floor(palette.tints.length / 2);

  //Recolor a first time to get the palette after
  const recoloredPalette: Palette = paletteCenterSettingsPayload
    ? {
        ...palette,
        tints: palette.tints.map((tint) => {
          return {
            ...tint,
            color: recolorPaletteColor({
              defaultCenter: defaultBgColor,
              defaultColor: new ColorIO(tint.color),
              newCenter: newBgColor,
              paletteSettingsPayload: paletteCenterSettingsPayload,
            }).toString({ format: 'hex' }),
          };
        }),
      }
    : palette;

  return {
    centerIndex,
    maxIndexPalette: palette.tints.length - 1,
    index: 0,
    palette: recoloredPalette,
    centerColor: new ColorIO(recoloredPalette.tints[centerIndex].color),
  };
}
