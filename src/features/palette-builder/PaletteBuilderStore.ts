import { create } from 'zustand';
import { getTintName } from '../../util/TintsNaming';
import { ChartData, ChartOptions } from 'chart.js';
import ColorIO from 'colorjs.io';
import { v4 } from 'uuid';
import { Palette } from '../../domain/DesignSystemDomain';
import { PickerAxe, OKHSL } from '../../util/PickerUtil';
import { moveItem } from '../../util/ArrayMove';
import {
  isBetween,
  linearCenterWeight,
  linearPieceInterpolation,
  reindexPosition,
} from '../../util/Interpolation';
import {
  PalettesStoreSettings,
  TintBuild,
  PaletteBuild,
  PaletteSettings,
  InterpolationColorSpace,
  AlignerSettings,
  PaletteBuilderPayload,
  paletteBuildToFile,
  paletteBuilderFromFile,
  FlagColorsToRecommand,
  FlagColorsPayload,
  ColorSettings,
} from '../../domain/PaletteBuilderDomain';
import { invoke } from '@tauri-apps/api/core';
import { CanUndoRedo } from '../../util/UndoRedo';
import { recolorWithNewBackground } from '../../util/ThemeGenerator';
import { getCenterIndex } from '../../util/CenterIndex';
import { ClosestInterval, findClosestInterval } from '../../util/FindClosest';
import { TAILWIND_PALETTES } from '../../util/PaletteRecommandationLayerConstants';

export interface Point {
  x: number;
  y: number;
}

export interface PaletteRecommandationPosition {
  referentialPalette: Palette;
  index: number;
}

interface PaletteBuilderStore {
  palettes: PaletteBuild[];
  settings: PalettesStoreSettings;
  alignerSettings: AlignerSettings;
  canUndoRedo: CanUndoRedo;
  insertPalette: (paletteBuild: PaletteBuild) => void;
  updatePalettes: () => void;
  updatePalette: (index: number, palette: PaletteBuild, stopUndoRedo?: boolean) => void;
  setSettings: (settings: PalettesStoreSettings) => void;
  reset: () => void;
  deletePalette: (id: string) => void;
  movePalette: (fromIndex: number, toIndex: number) => void;
  loadPaletteBuilder: (palettes: PaletteBuild[], settings: PalettesStoreSettings) => void;
  setAlignerSettings: (alignerSettings: AlignerSettings) => void;
  doPaletteBuilder: () => void;
  undoPaletteBuilder: () => void;
  redoPaletteBuilder: () => void;
}

export const usePaletteBuilderStore = create<PaletteBuilderStore>((set, get) => ({
  palettes: [],
  settings: {
    steps: 11,
    tintNamingMode: '50,100,200...900,950',
    paletteSettings: {
      lightnessLeft: 0.9,
      lightnessRight: 0.3,
      saturationGapRight: 0.5,
      saturationGapLeft: 0.5,
      hueGapLeft: 0.5,
      hueGapRight: 0.5,
    },
    referentialPalettes: TAILWIND_PALETTES,
  },
  alignerSettings: {
    aligner: 'HWB',
    alignerContrastMode: 'PALETTE_STEP',
    alignerConstrastCustomColor: new ColorIO('#000000'),
    alignerContrastPaletteStep: 0,
    isDisplay: false,
  },
  canUndoRedo: {
    canUndo: false,
    canRedo: false,
  },
  insertPalette: (paletteBuild: PaletteBuild) => {
    const { doPaletteBuilder } = get();
    set((state) => {
      return {
        ...state,
        palettes: [...state.palettes, paletteBuild],
      };
    });

    doPaletteBuilder();
  },
  updatePalettes() {
    const { settings, doPaletteBuilder } = get();

    set((state) => {
      return {
        ...state,
        palettes: state.palettes.map((palette) => {
          const anchorIndexedTints = getAnchorTintsToConstruct({
            palette,
          });
          return {
            ...palette,
            tints: constructTints({ centerEndsTints: palette.tints, settings, anchorIndexedTints }),
          };
        }),
      };
    });
    doPaletteBuilder();
  },
  updatePalette(index: number, newPalette: PaletteBuild, stopUndoRedo?: boolean) {
    const { settings, doPaletteBuilder } = get();
    const centerTint = newPalette.tints.find((tint) => tint.isCenter);
    if (centerTint) {
      const [startColor, endColor] = getEndsTints({
        color: centerTint.color,
        settings: newPalette.settings,
        existingTints: newPalette.tints,
      });
      const tints = constructTints({
        centerEndsTints: newPalette.tints.map((tint, index) => {
          if (index === 0 && !tint.isAnchor) {
            tint.color = startColor;
          }
          if (index === newPalette.tints.length - 1 && !tint.isAnchor) {
            tint.color = endColor;
          }
          return tint;
        }),
        settings,
        anchorIndexedTints: newPalette.tints
          .map((tint, index) => ({
            ...tint,
            indexPosition: index,
          }))
          .filter((tint) => tint.isAnchor),
      });
      set((state) => {
        return {
          ...state,
          palettes: state.palettes.map((palette, i) =>
            index === i ? { ...newPalette, tints } : palette,
          ),
        };
      });
    }
    if (!stopUndoRedo) {
      doPaletteBuilder();
    }
  },
  setSettings(settings: PalettesStoreSettings) {
    set((state) => {
      return {
        ...state,
        settings: {
          ...settings,
          steps: autoRangeNumber(settings.steps, 3, 20),
        },
      };
    });
    get().updatePalettes();
  },
  reset() {
    set((state) => {
      return {
        ...state,
        palettes: [],
      };
    });
    get().doPaletteBuilder();
  },
  deletePalette(id: string) {
    set((state) => {
      return {
        ...state,
        palettes: state.palettes.filter((palette) => palette.id !== id),
      };
    });
    get().doPaletteBuilder();
  },
  movePalette(fromIndex: number, toIndex: number) {
    set((state) => {
      return {
        ...state,
        palettes: moveItem(state.palettes, fromIndex, toIndex),
      };
    });
    get().doPaletteBuilder();
  },
  loadPaletteBuilder(palettes: PaletteBuild[], settings: PalettesStoreSettings) {
    set((state) => {
      return {
        ...state,
        palettes,
        settings,
      };
    });
    get().doPaletteBuilder();
  },
  setAlignerSettings(alignerSettings) {
    set((state) => {
      return {
        ...state,
        alignerSettings,
      };
    });
  },
  doPaletteBuilder: async () => {
    const { palettes, settings } = get();
    await invoke('do_palette_builder', {
      paletteBuilder: {
        palettes: palettes.map(paletteBuildToFile),
        settings,
      },
    });
    const canUndoRedo = await invoke<CanUndoRedo>('can_undo_redo_palette_builder');
    set((state) => {
      return {
        ...state,
        canUndoRedo,
      };
    });
  },
  undoPaletteBuilder: async () => {
    const paletteBuilder = await invoke<PaletteBuilderPayload>('undo_palette_builder');
    const canUndoRedo = await invoke<CanUndoRedo>('can_undo_redo_palette_builder');
    set((state) => {
      return {
        ...state,
        ...paletteBuilderFromFile(paletteBuilder),
        canUndoRedo,
      };
    });
  },
  redoPaletteBuilder: async () => {
    const paletteBuilder = await invoke<PaletteBuilderPayload>('redo_palette_builder');
    const canUndoRedo = await invoke<CanUndoRedo>('can_undo_redo_palette_builder');
    set((state) => {
      return {
        ...state,
        ...paletteBuilderFromFile(paletteBuilder),
        canUndoRedo,
      };
    });
  },
}));

export function getProportionalValue({
  initialMax,
  initialMin,
  initialValue,
  newMax,
  newMin,
}: {
  initialValue: number;
  initialMin: number;
  initialMax: number;
  newMin: number;
  newMax: number;
}): number {
  return newMin + ((initialValue - initialMin) * (newMax - newMin)) / (initialMax - initialMin);
}

export const huesName: string[] = [
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'teal',
  'cyan',
  'blue',
  'indigo',
  'violet',
  'purple',
  'pink',
  'gray-red',
  'gray-orange',
  'gray-yellow',
  'gray-lime',
  'gray-green',
  'gray-teal',
  'gray-cyan',
  'gray-blue',
  'gray-indigo',
  'gray-violet',
  'gray-purple',
  'gray-pink',
];

export function getHueName(color: ColorIO): string {
  const angle: number = color.hsl[0];
  const saturation: number = color.hsl[1];
  const preColor = saturation < 15 ? 'gray-' : '';
  if (angle < 15 || angle >= 345) return `${preColor}red`;
  if (angle < 45) return `${preColor}orange`;
  if (angle < 75) return `${preColor}yellow`;
  if (angle < 105) return `${preColor}lime`;
  if (angle < 135) return `${preColor}green`;
  if (angle < 165) return `${preColor}teal`;
  if (angle < 195) return `${preColor}cyan`;
  if (angle < 225) return `${preColor}blue`;
  if (angle < 255) return `${preColor}indigo`;
  if (angle < 285) return `${preColor}violet`;
  if (angle < 315) return `${preColor}purple`;
  return `${preColor}pink`;
}

export function getEndsTints({
  color,
  existingTints,
  settings,
}: {
  color: ColorIO;
  settings: PaletteSettings;
  existingTints?: TintBuild[];
}): [ColorIO, ColorIO] {
  const startColor = color.mix('#ffffff', settings.lightnessLeft, {
    space: 'okhsl',
  });
  const endColor = color.mix('#000000', 1 - settings.lightnessRight, {
    space: 'okhsl',
  });
  const centerTintIndex = existingTints?.findIndex((tint) => tint.isCenter);
  if (centerTintIndex !== undefined && centerTintIndex !== -1) {
    //Find anchor between ends and center, to align hue
    const leftAnchor = existingTints?.find(
      (tint, index) => tint.isAnchor && index < centerTintIndex,
    );
    if (leftAnchor) {
      startColor.set({
        'okhsl.h': leftAnchor.color.get('okhsl.h'),
      });
    }

    const rightAnchor = existingTints
      ? [...existingTints]
          ?.reverse()
          .find((tint, index) => tint.isAnchor && index < centerTintIndex)
      : undefined;
    if (rightAnchor) {
      endColor.set({
        'okhsl.h': rightAnchor.color.get('okhsl.h'),
      });
    }
  }

  const hueAxe: PickerAxe = OKHSL.axes[0];

  if (settings.hueGapLeft !== 0.5 && hueAxe) {
    const startHue = startColor.get('okhsl.h');
    const colorPoints = getColorAxeToPoints({
      axe: {
        ...hueAxe,
        min: startHue - 30,
        max: startHue + 30,
      },
      centerColor: startColor,
      positionX: settings.hueGapLeft,
    });
    const newHue = linearPieceInterpolation(colorPoints);
    startColor.set('okhsl.h', newHue);
  }

  if (settings.hueGapRight !== 0.5 && hueAxe) {
    const endHue = endColor.get('okhsl.h');
    const colorPoints = getColorAxeToPoints({
      axe: {
        ...hueAxe,
        min: endHue - 30,
        max: endHue + 30,
      },
      centerColor: endColor,
      positionX: settings.hueGapRight,
    });
    const newHue = linearPieceInterpolation(colorPoints);
    endColor.set('okhsl.h', newHue);
  }

  const saturationAxe: PickerAxe = OKHSL.axes[1];

  if (settings.saturationGapLeft !== 0.5 && saturationAxe) {
    const colorPoints = getColorAxeToPoints({
      axe: saturationAxe,
      centerColor: startColor,
      positionX: settings.saturationGapLeft,
    });
    const newSaturation = linearPieceInterpolation(colorPoints);
    startColor.set('okhsl.s', newSaturation);
  }

  if (settings.saturationGapRight !== 0.5 && saturationAxe) {
    const colorPoints = getColorAxeToPoints({
      axe: saturationAxe,
      centerColor: endColor,
      positionX: settings.saturationGapRight,
    });
    const newSaturation = linearPieceInterpolation(colorPoints);
    endColor.set('okhsl.s', newSaturation);
  }

  return [startColor, endColor];
}

function getColorAxeToPoints({
  axe,
  positionX,
  centerColor,
}: {
  axe: PickerAxe;
  positionX: number;
  centerColor: ColorIO;
}): {
  min: Point;
  max: Point;
  center: Point;
  positionX: number;
} {
  return {
    min: {
      x: 0,
      y: axe.min,
    },
    center: {
      x: 0.5,
      y: centerColor.get(`okhsl.${axe.name}`),
    },
    max: {
      x: 1,
      y: axe.max,
    },
    positionX,
  };
}

export function autoRangeNumber(value: number, min?: number, max?: number, modulo?: boolean) {
  if (modulo) {
    return Math.max(min ?? value, value % (max ?? value));
  }
  return Math.min(max ?? value, Math.max(min ?? value, value));
}

interface ColorPositionIndex {
  color?: ColorIO;
  index: number;
}

interface ReduceColors {
  colors: ColorIO[];
  previousColor: ColorPositionIndex;
}

function constructTints({
  centerEndsTints,
  settings,
  anchorIndexedTints = [],
}: {
  centerEndsTints: TintBuild[];
  settings: PalettesStoreSettings;
  anchorIndexedTints?: TintBuild[];
}): TintBuild[] {
  const { tintNamingMode, steps } = settings;

  //Step 1 : construct an array with the fixed colors : [Color, undefined, undefined, Color...]
  const anchorTints: (TintBuild | undefined)[] = Array.from({ length: steps }, (_, i) => {
    const indexedTint = anchorIndexedTints.find((tint) => tint.indexPosition === i);
    if (indexedTint) {
      return indexedTint;
    }

    if (i === 0) {
      return centerEndsTints[0];
    }

    if (i === Math.floor(steps / 2)) {
      return (
        centerEndsTints.find((tint) => tint.isCenter) ?? {
          ...centerEndsTints[Math.floor(centerEndsTints.length / 2)],
          isCenter: true,
        }
      );
    }
    if (i === steps - 1) {
      return centerEndsTints[centerEndsTints.length - 1];
    }

    return undefined;
  });

  //Step 2 : Reduce the array to calc the undefined entries (and conserve the existing colors)
  const reducedTints = anchorTints.reduce<ReduceColors>(
    (acc, tint, index) => {
      if (acc.colors[index]) {
        //Case 1 : The tint already exist into array
        return {
          ...acc,
          previousColor: tint
            ? {
                color: tint.color,
                index,
              }
            : acc.previousColor,
        };
      } else if (tint) {
        //Case 2 : the tint exist but not push into array
        return {
          ...acc,
          previousColor: { color: tint.color, index },
          colors: [...acc.colors, tint.color],
        };
      } else {
        //Case 3 : calculate next undefined tints by get the next & the previous
        const nextColor: ColorPositionIndex = anchorTints
          .map((e, i) => {
            return {
              color: e?.color,
              index: i,
            };
          })
          .find((e) => e.index > index && e?.color !== undefined) as ColorPositionIndex;
        const subSteps = nextColor.index + 1 - acc.previousColor.index;

        if (!acc.previousColor?.color || !nextColor.color) {
          return acc;
        }
        const colors = acc.previousColor.color.steps(nextColor.color, {
          space: 'okhsl',
          steps: subSteps,
        });
        colors.shift();
        colors.pop();
        return {
          colors: [...acc.colors, ...colors],
          previousColor: nextColor,
        };
      }
    },
    {
      colors: [],
      previousColor: { index: 0, color: anchorTints[0]?.color },
    },
  );

  //Step 3: Transform into tint object
  return reducedTints.colors.map((step, index) => {
    step.to('sRgb');
    return {
      name: getTintName({
        index,
        length: steps,
        mode: tintNamingMode,
      }),
      isCenter: anchorTints[index]?.isCenter,
      isAnchor: anchorTints[index]?.isAnchor,
      color: step.clone().toGamut(),
    };
  });
}

export function hwbHueAligner({
  newColor,
  colorToAlign,
}: {
  newColor: ColorIO;
  colorToAlign: ColorIO;
}): ColorIO {
  return new ColorIO('hwb', [newColor.hwb[0], colorToAlign.hwb[1], colorToAlign.hwb[2]]);
}

const COLOR_FLAGS_TO_RECOMMAND: FlagColorsToRecommand[] = [
  {
    flag: 'complementary',
    gap: [180],
  },
  {
    flag: 'triad',
    gap: [120, 240],
  },
  {
    flag: 'square',
    gap: [90, 270],
  },
  {
    flag: 'others',
    gap: [30, 60, 150, 210, 300, 330],
  },
  {
    flag: 'gray',
    gap: [0, 90, 180, 270],
  },
];

export interface PaletteChartsData {
  lightness: ChartData<'line'>;
  saturation?: ChartData<'line'>;
  chroma?: ChartData<'line'>;
  hue: ChartData<'line'>;
  ligSatOptions: ChartOptions<'line'>;
  chromaOptions: ChartOptions<'line'>;
  hueOptions: ChartOptions<'line'>;
}

export const CHROMATIC_COLOR_SPACES: InterpolationColorSpace[] = ['oklch', 'lch'];
export const SATURED_COLOR_SPACES: InterpolationColorSpace[] = ['hsl'];

export function paletteBuildToDesignSystemPalette(palette: PaletteBuild): Palette {
  return {
    paletteName: palette.name,
    tints: palette.tints.map((tint) => {
      return {
        label: tint.name,
        color: tint.color.toString({ format: 'hex' }),
      };
    }),
  };
}

export function recommandColorPlacement({
  steps,
  referentialPalettes,
  color,
}: {
  steps: number;
  referentialPalettes: Palette[];
  color: ColorIO;
}): PaletteRecommandationPosition {
  const paletteRecommandation: Palette = chooseClosestPalette({
    color,
    referentialPalettes,
  });

  const indexClosestColor: number = findClosestColor(color, paletteRecommandation).index;

  return {
    index: reindexPosition({
      index: indexClosestColor,
      defaultLength: paletteRecommandation.tints.length,
      newLength: steps,
    }),
    referentialPalette: paletteRecommandation,
  };
}

// choose the color palette that is visually closest
export function chooseClosestPalette({
  referentialPalettes,
  color,
}: {
  referentialPalettes: Palette[];
  color: ColorIO;
}): Palette {
  return referentialPalettes.reduce((resultPalette, currentPalette) => {
    const currentCenterTint: ColorIO = findClosestColor(color, currentPalette).color;
    const resultCenterTint: ColorIO = findClosestColor(color, resultPalette).color;

    const distCurrent = currentCenterTint.deltaE2000(color);
    const distResult = resultCenterTint.deltaE2000(color);

    return distCurrent < distResult ? currentPalette : resultPalette;
  }, referentialPalettes[0]);
}

function findClosestColor(
  color: ColorIO,
  palette: Palette,
): {
  index: number;
  color: ColorIO;
} {
  return palette.tints.reduce(
    (acc, cur, curIndex) => {
      const accDelta = acc.color.deltaE2000(color);
      const curColor = new ColorIO(cur.color);
      const curDelta = curColor.deltaE2000(color);

      return accDelta < curDelta
        ? acc
        : {
            index: curIndex,
            color: curColor,
          };
    },
    {
      index: 0,
      color: new ColorIO(palette.tints[0].color),
    },
  );
}

function getPaletteCenterColor({
  tint,
  paletteRecommandationPositon,
}: {
  tint: ColorIO;
  paletteRecommandationPositon?: PaletteRecommandationPosition;
}): ColorIO {
  if (!paletteRecommandationPositon) return tint;

  const { index, referentialPalette } = paletteRecommandationPositon;
  const recommandationCenterIndex = getCenterIndex(referentialPalette.tints.length);
  if (recommandationCenterIndex === index) return tint;

  const centerColor = new ColorIO(referentialPalette.tints[recommandationCenterIndex].color);

  const defaultCenter = new ColorIO(referentialPalette.tints[index].color);

  return recolorFromRecommandation({
    newTint: tint,
    index,
    length: referentialPalette.tints.length - 1,
    toRecolor: centerColor,
    originalTint: defaultCenter,
  });
}

/**
 * Calculate the new center tint to create the palette center color
 * (to spread the effect of new lightness & new saturation, but keep the changes of hue)
 */
function recolorFromRecommandation({
  newTint,
  index,
  length,
  toRecolor,
  reverse,
  originalTint,
}: {
  newTint: ColorIO;
  index: number;
  length: number;
  toRecolor: ColorIO;
  reverse?: boolean;
  originalTint: ColorIO;
}): ColorIO {
  const indice = reverse
    ? 1 - linearCenterWeight(index, length)
    : linearCenterWeight(index, length);

  const newCenter = originalTint.mix(newTint, indice).set('okhsl.h', newTint.get('okhsl.h'));

  return recolorWithNewBackground({
    defaultCenter: originalTint,
    newCenter,
    defaultColor: toRecolor,
  });
}

function isRecommandationColorCenter(reco?: PaletteRecommandationPosition): boolean {
  if (!reco) return false;
  const { index, referentialPalette } = reco;
  return index === Math.round(referentialPalette.tints.length / 2);
}

function getPaletteSettingsByRecommandation({
  centerTint,
  paletteRecommandationPositon,
  tint,
}: {
  centerTint: ColorIO;
  paletteRecommandationPositon: PaletteRecommandationPosition;
  tint: ColorIO;
}): PaletteSettings {
  const {
    referentialPalette: { tints },
    index,
  } = paletteRecommandationPositon;

  const isRecommandationLeft = index <= getCenterIndex(tints.length);

  const leftColor: ColorIO = isRecommandationLeft
    ? recolorFromRecommandation({
        newTint: tint,
        index,
        length: tints.length,
        toRecolor: new ColorIO(tints[0].color),
        reverse: true,
        originalTint: new ColorIO(tints[index].color),
      })
    : new ColorIO(tints[0].color);

  const rightColor: ColorIO = !isRecommandationLeft
    ? recolorFromRecommandation({
        newTint: tint,
        index,
        length: tints.length,
        toRecolor: new ColorIO(tints[tints.length - 1].color),
        reverse: true,
        originalTint: new ColorIO(tints[index].color),
      })
    : new ColorIO(tints[tints.length - 1].color);

  const leftEndsSettings: ColorSettings = findClosestEndTint({
    centerColor: centerTint,
    direction: 'light',
    targetColor: leftColor,
  });

  const rightEndsSettings: ColorSettings = findClosestEndTint({
    centerColor: centerTint,
    direction: 'dark',
    targetColor: rightColor,
  });

  return {
    lightnessLeft: leftEndsSettings.lightness,
    lightnessRight: rightEndsSettings.lightness,
    hueGapLeft: 0.5,
    hueGapRight: 0.5,
    saturationGapLeft: leftEndsSettings.saturation,
    saturationGapRight: leftEndsSettings.saturation,
  };
}

/**
 * Compute the paletteSettings for a end of a palette, to match with the recommandation palette model
 */
function findClosestEndTint({
  targetColor,
  centerColor,
  steps = 3,
  direction,
}: {
  targetColor: ColorIO;
  centerColor: ColorIO;
  steps?: number;
  direction: 'dark' | 'light';
}): ColorSettings {
  const firstInterval = Array.from({ length: 5 }, (_, i) => i / (5 - 1));
  const targetEnd = direction === 'light' ? '#ffffff' : '#000000';

  const closestLightness = Array.from({ length: steps }).reduce<ClosestInterval>(
    (acc, _) => {
      return findClosestInterval({
        xArray: acc.interval,
        getValueY: (index: number) => {
          const factor = direction === 'light' ? index : 1 - index;
          const newColor = centerColor.mix(targetEnd, factor);
          return Math.abs(newColor.get('okhsl.l') - targetColor.get('okhsl.l'));
        },
        target: 0,
      });
    },
    {
      interval: firstInterval,
      closestX: 1,
    },
  );

  const adjustLightnessColor = centerColor.mix(targetColor, closestLightness.closestX);

  const saturationAxe: PickerAxe = OKHSL.axes[1];

  const closestSaturation = Array.from({ length: steps }).reduce<ClosestInterval>(
    (acc, _) => {
      return findClosestInterval({
        xArray: acc.interval,
        getValueY: (index: number) => {
          const colorPoints = getColorAxeToPoints({
            axe: saturationAxe,
            centerColor: adjustLightnessColor,
            positionX: index,
          });
          const newSaturation = linearPieceInterpolation(colorPoints);
          const newColor: ColorIO = new ColorIO(adjustLightnessColor).set('okhsl.s', newSaturation);
          return Math.abs(newColor.get('okhsl.s') - targetColor.get('okhsl.s'));
        },
        target: 0,
      });
    },
    {
      interval: firstInterval,
      closestX: 1,
    },
  );

  return {
    lightness: closestLightness.closestX,
    saturation: closestSaturation.closestX,
  };
}

function getAnchorTintsToConstruct({
  palette,
  transform,
}: {
  palette: PaletteBuild;
  transform?: (tintBuild: TintBuild) => TintBuild;
}): TintBuild[] {
  return palette.tints
    .map((tint, index) => ({
      ...tint,
      indexPosition: index,
    }))
    .filter((tint) => tint.isAnchor)
    .map((tint) => transform?.(tint) || tint);
}

export function createPalette({
  tint,
  paletteRecommandationPosition,
  settings,
}: {
  tint: ColorIO;
  paletteRecommandationPosition: PaletteRecommandationPosition;
  settings: PalettesStoreSettings;
}) {
  const centerColor: ColorIO = getPaletteCenterColor({
    tint,
    paletteRecommandationPositon: paletteRecommandationPosition,
  });

  const settingsUsed = getPaletteSettingsByRecommandation({
    centerTint: centerColor,
    paletteRecommandationPositon: paletteRecommandationPosition,
    tint,
  });

  const [startColor, endColor]: [ColorIO, ColorIO] = getEndsTints({
    color: centerColor,
    settings: settingsUsed,
  });

  const tintPrebuild: TintBuild[] = [startColor, centerColor, endColor].map((color, index) => {
    return {
      name: getTintName({ index, length: 3, mode: settings.tintNamingMode }),
      color,
      isCenter: index === 1,
    };
  });

  const isRecommandationCenter = isRecommandationColorCenter(paletteRecommandationPosition);

  const tints: TintBuild[] = constructTints({
    centerEndsTints: tintPrebuild,
    settings: {
      ...settings,
      paletteSettings: settingsUsed,
    },
    anchorIndexedTints: paletteRecommandationPosition && [
      {
        color: tint,
        name: getTintName({
          index: paletteRecommandationPosition.index,
          length: paletteRecommandationPosition.referentialPalette.tints.length,
          mode: settings.tintNamingMode,
        }),
        isCenter: isRecommandationCenter,
        isAnchor: !isRecommandationCenter,
        indexPosition: paletteRecommandationPosition.index,
      },
    ],
  });
  const palette: PaletteBuild = {
    id: v4(),
    name: paletteRecommandationPosition.referentialPalette.paletteName,
    tints,
    settings: settingsUsed,
    referentialPalette: paletteRecommandationPosition.referentialPalette,
  };

  return palette;
}

export function getPalettesRecommanded({
  existingPalettes,
  basePalette,
  settings,
}: {
  existingPalettes: PaletteBuild[];
  settings: PalettesStoreSettings;
  basePalette: PaletteBuild;
}): PaletteBuild[] {
  return getColorsRecommanded({ palettes: existingPalettes, basePalette, settings }).map(
    (payload) => {
      return createPaletteFromExisting({
        flagColorsPayload: payload,
        basePalette: basePalette,
        settings,
      });
    },
  );
}

export function getColorsRecommanded({
  palettes,
  settings,
  basePalette,
}: {
  palettes: PaletteBuild[];
  settings: PalettesStoreSettings;
  basePalette: PaletteBuild;
}): FlagColorsPayload[] {
  const { tints, referentialPalette: paletteRecommandation } = basePalette;
  const centerTint: ColorIO | undefined = tints.find((tint) => tint.isCenter)?.color;
  if (!centerTint || !paletteRecommandation) return [];

  const existingTints: number[] = palettes.map((palette) => {
    const tint = palette.tints.find(
      (tint, index) => tint.isCenter || index === Math.floor(palette.tints.length / 2),
    ) as TintBuild;
    return tint.color.get('okhsl.h');
  });

  const defaultCenter: ColorIO = basePalette.tints.find((tint) => tint.isCenter)!.color;

  return settings.referentialPalettes
    .filter((palette) => palette.paletteName !== paletteRecommandation.paletteName)
    .filter((palette) => {
      const centerIndex = getCenterIndex(palette.tints.length);
      const centerTint = new ColorIO(palette.tints[centerIndex].color);
      return !existingTints.find((existingHue) =>
        isBetween({
          max: existingHue + 10,
          min: existingHue - 10,
          value: centerTint.get('okhsl.h'),
        }),
      );
    })
    .map((palette) => {
      const defaultColorIndex: number = getCenterIndex(palette.tints.length);
      const defaultColorHex: string = palette.tints[defaultColorIndex].color;
      const defaultColor: ColorIO = new ColorIO(defaultColorHex);

      const recommandedCenterColor = recolorWithNewBackground({
        defaultCenter,
        newCenter: centerTint,
        defaultColor,
      });

      return {
        colorRecommanded: recommandedCenterColor,
        defaultColorRecommanded: defaultColor,
        referentialPalette: palette,
      } as FlagColorsPayload;
    });
}

export function constructComplementaryColor({
  flag,
  gap,
  color,
}: {
  gap: number;
  flag: string;
  color: ColorIO;
}): ColorIO {
  const colorRecommanded = new ColorIO(color);
  colorRecommanded.set({
    'okhsl.l': colorRecommanded.okhsl[2],
    'okhsl.s': colorRecommanded.okhsl[1],
    'okhsl.h': (colorRecommanded.okhsl[0] + gap) % 360,
  });
  colorRecommanded.set({
    'hwb.h': colorRecommanded.hwb[0],
    'hwb.w': color.hwb[1],
    'hwb.b': color.hwb[2],
  });
  if (flag === 'gray') {
    const hsl = [...colorRecommanded.hsl];
    colorRecommanded.set({
      'hsl.h': hsl[0],
      'hsl.s': 8,
      'hsl.l': hsl[2],
    });
  }
  return colorRecommanded;
}

export function createPaletteFromExisting({
  basePalette,
  flagColorsPayload,
  settings,
}: {
  basePalette: PaletteBuild;
  flagColorsPayload: FlagColorsPayload;
  settings: PalettesStoreSettings;
}) {
  const { colorRecommanded, referentialPalette: paletteRecommandation } = flagColorsPayload;

  const leftColor = getTargetRecolored({
    basePalette,
    flagColorsPayload,
    targetIndex: 0,
    referentialIndex: 0,
  });

  const leftEndsSettings: ColorSettings = findClosestEndTint({
    centerColor: colorRecommanded,
    direction: 'light',
    targetColor: leftColor,
  });

  const rightColor = getTargetRecolored({
    basePalette,
    flagColorsPayload,
    targetIndex: basePalette.tints.length - 1,
    referentialIndex: basePalette.referentialPalette!.tints.length - 1,
  });

  const rightEndsSettings: ColorSettings = findClosestEndTint({
    centerColor: colorRecommanded,
    direction: 'dark',
    targetColor: rightColor,
  });

  const newSettings: PaletteSettings = {
    ...basePalette.settings,
    lightnessLeft: leftEndsSettings.lightness,
    saturationGapLeft: leftEndsSettings.saturation,
    lightnessRight: rightEndsSettings.lightness,
    saturationGapRight: rightEndsSettings.saturation,
  };

  const [startColor, endColor] = getEndsTints({
    color: colorRecommanded,
    settings: newSettings,
  });

  const centerEndsTints: TintBuild[] = basePalette.tints.map((tint, index) => {
    let color = tint.color;
    if (index === 0) {
      color = startColor;
    }
    if (index === basePalette.tints.length - 1) {
      color = endColor;
    }
    if (tint.isCenter) {
      color = colorRecommanded;
    }

    return {
      ...tint,
      color,
    };
  });

  const transformAnchorFromExisting = (tint: TintBuild): TintBuild => {
    const referentialIndex = reindexPosition({
      index: tint.indexPosition!,
      defaultLength: basePalette.tints.length,
      newLength: basePalette.referentialPalette!.tints.length,
    });

    return {
      ...tint,
      color: getTargetRecolored({
        basePalette,
        flagColorsPayload,
        targetIndex: tint.indexPosition!,
        referentialIndex,
      }),
    };
  };

  const anchorIndexedTints = getAnchorTintsToConstruct({
    palette: basePalette,
    transform: transformAnchorFromExisting,
  });

  return {
    ...basePalette,
    id: v4(),
    name: paletteRecommandation.paletteName,
    tints: constructTints({ centerEndsTints, settings, anchorIndexedTints }),
  };
}

export function getTargetRecolored({
  basePalette,
  flagColorsPayload,
  targetIndex,
  referentialIndex,
}: {
  basePalette: PaletteBuild;
  flagColorsPayload: FlagColorsPayload;
  targetIndex: number;
  referentialIndex: number;
}): ColorIO {
  const newCenter: ColorIO = new ColorIO(basePalette.tints[targetIndex].color);
  const defaultCenter: ColorIO = new ColorIO(
    basePalette.referentialPalette!.tints[referentialIndex].color,
  );
  const defaultColor: ColorIO = new ColorIO(
    flagColorsPayload.referentialPalette.tints[referentialIndex].color,
  );

  return recolorWithNewBackground({
    defaultCenter,
    defaultColor,
    newCenter,
  });
}
