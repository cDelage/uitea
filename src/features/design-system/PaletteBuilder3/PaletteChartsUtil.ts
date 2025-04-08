import { ChartData, ChartOptions } from "chart.js";
import {
  ColorSpace,
  DEFAULT_PICKER_MODE,
  PICKER_MODES,
  PickerAxe,
  PickerAxeName,
} from "../../../util/PickerUtil";
import {
  InterpolationColorSpace,
  PaletteAxeSetting,
  PaletteBuild,
  usePaletteBuilder3Store,
} from "./PaletteBuilder3Store";
import ColorIO from "colorjs.io";

export interface PaletteChartData {
  line: ChartData<"line">;
  options: ChartOptions<"line">;
}

export interface AxeData {
  update: (value: number | number[]) => void;
  reset: () => void;
  gradient: string;
  value: number;
  min: number;
  max: number;
  step: number;
  reverse?: boolean;
}

export interface ChartAxeData {
  axeName: PickerAxeName;
  axeLabel: string;
  leftAxeData: AxeData;
  rightAxeData: AxeData;
}

export function useChartAxeData({
  interpolationColorSpace,
  palette,
  index,
}: {
  interpolationColorSpace: InterpolationColorSpace;
  palette?: PaletteBuild;
  index?: number;
}): [ChartAxeData, ChartAxeData, ChartAxeData] | undefined {
  const {
    updatePalette,
    settings: { paletteSettings },
  } = usePaletteBuilder3Store();

  function handleUpdateAxe(
    value: number | number[],
    setting: PaletteAxeSetting
  ) {
    if (typeof value === "number" && palette && index !== undefined) {
      updatePalette(index, {
        ...palette,
        settings: {
          ...palette.settings,
          [setting]: value,
        },
      });
    }
  }

  if (!palette || index === undefined) return undefined;

  const pickerMode =
    PICKER_MODES.find((picker) => picker.space === interpolationColorSpace) ??
    DEFAULT_PICKER_MODE;
  const satChromaAxe =
    pickerMode.axes.find((axe) => axe.axe === "c" || axe.axe === "s") ??
    pickerMode.axes[1];
  const hueAxe =
    pickerMode.axes.find((axe) => axe.axe === "h") ?? pickerMode.axes[2];

  const leftColor: ColorIO = palette.tints[0].color;
  const centerColor: ColorIO =
    palette.tints.find((tint) => tint.isCenter)?.color ??
    palette.tints[Math.floor(palette.tints.length / 2)].color;
  const rightColor: ColorIO = palette.tints[palette.tints.length - 1].color;

  const colorCenterLeft = centerColor
    .mix("#ffffff", palette.settings.lightnessMax, {
      space: "oklch",
    })
    .set({
      [`${interpolationColorSpace}.h`]: leftColor.get(
        `${interpolationColorSpace}.h`
      ),
    });

  const colorCenterRight = centerColor
    .mix("#000000", 1 - palette.settings.lightnessMin, {
      space: "oklch",
    })
    .set({
      [`${interpolationColorSpace}.h`]: rightColor.get(
        `${interpolationColorSpace}.h`
      ),
    });

  const leftSatChromaGradient = computeChartAxeGradient({
    centerColor: colorCenterLeft,
    axe: satChromaAxe,
    interpolationColorSpace,
  });

  const rightSatChromaGradient = computeChartAxeGradient({
    centerColor: colorCenterRight,
    axe: satChromaAxe,
    interpolationColorSpace,
  });

  const leftHueGradient = computeChartAxeGradient({
    centerColor: colorCenterLeft,
    axe: {
      ...hueAxe,
      min:
        palette.settings.hueGapModeLeft === "accurate"
          ? colorCenterRight.get(`${interpolationColorSpace}.h`) - 20
          : hueAxe.min,
      max:
        palette.settings.hueGapModeLeft === "accurate"
          ? colorCenterRight.get(`${interpolationColorSpace}.h`) + 20
          : hueAxe.max,
    },
    interpolationColorSpace,
  });

  const rightHueGradient = computeChartAxeGradient({
    centerColor: colorCenterRight,
    axe: {
      ...hueAxe,
      min:
        palette.settings.hueGapModeRight === "accurate"
          ? colorCenterRight.get(`${interpolationColorSpace}.h`) - 20
          : hueAxe.min,
      max:
        palette.settings.hueGapModeRight === "accurate"
          ? colorCenterRight.get(`${interpolationColorSpace}.h`) + 20
          : hueAxe.max,
    },
    interpolationColorSpace,
  });

  const leftLightnessAxe: AxeData = {
    value: palette.settings.lightnessMax,
    update: (value: number | number[]) => {
      handleUpdateAxe(value, "lightnessMax");
    },
    reset: () => {
      handleUpdateAxe(paletteSettings.lightnessMax, "lightnessMax");
    },
    min: 0,
    max: 1,
    gradient: ` #ffffff, ${centerColor.toString({
      format: "hex",
    })}`,
    step: 0.01,
  };

  const rightLightnessAxe: AxeData = {
    value: palette.settings.lightnessMin,
    update: (value: number | number[]) => {
      handleUpdateAxe(value, "lightnessMin");
    },
    reset: () => {
      handleUpdateAxe(paletteSettings.lightnessMin, "lightnessMin");
    },
    min: 0,
    max: 1,
    gradient: `${centerColor.toString({
      format: "hex",
    })}, #000000`,
    reverse: true,
    step: 0.01,
  };

  const leftSatChromaAxe: AxeData = {
    value: palette.settings.satChromaGapLeft,
    update: (value: number | number[]) => {
      handleUpdateAxe(value, "satChromaGapLeft");
    },
    reset: () => {
      handleUpdateAxe(paletteSettings.satChromaGapLeft, "satChromaGapLeft");
    },
    min: 0,
    max: 1,
    gradient: leftSatChromaGradient,
    step: 0.01,
  };

  const rightSatChromaAxe: AxeData = {
    value: palette.settings.satChromaGapRight,
    update: (value: number | number[]) => {
      handleUpdateAxe(value, "satChromaGapRight");
    },
    reset: () => {
      handleUpdateAxe(paletteSettings.satChromaGapRight, "satChromaGapRight");
    },
    min: 0,
    max: 1,
    gradient: rightSatChromaGradient,

    step: 0.01,
  };

  const leftHueAxe: AxeData = {
    value: palette.settings.hueGapLeft,
    update: (value: number | number[]) => {
      handleUpdateAxe(value, "hueGapLeft");
    },
    reset: () => {
      handleUpdateAxe(paletteSettings.hueGapLeft, "hueGapLeft");
    },
    min: 0,
    max: 1,
    gradient: leftHueGradient,
    step: 0.01,
  };

  const rightHueAxe: AxeData = {
    value: palette.settings.hueGapRight,
    update: (value: number | number[]) => {
      handleUpdateAxe(value, "hueGapRight");
    },
    reset: () => {
      handleUpdateAxe(paletteSettings.hueGapRight, "hueGapRight");
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
      axeName: satChromaAxe.axe,
      axeLabel: satChromaAxe.label,
      leftAxeData: leftSatChromaAxe,
      rightAxeData: rightSatChromaAxe,
    },
    {
      axeName: "h",
      axeLabel: "hue",
      leftAxeData: leftHueAxe,
      rightAxeData: rightHueAxe,
    },
  ];
}

export function computeChartAxeGradient({
  centerColor,
  interpolationColorSpace,
  axe,
}: {
  centerColor: ColorIO;
  interpolationColorSpace: InterpolationColorSpace;
  axe: PickerAxe;
}) {
  const startColor = centerColor.clone().set({
    [`${interpolationColorSpace}.${axe.axe}`]: axe.max,
  });

  const endColor = centerColor.clone().set({
    [`${interpolationColorSpace}.${axe.axe}`]: axe.min,
  });

  return `${startColor.toString({
    format: "hex",
  })},${centerColor.toString({
    format: "hex",
  })},${endColor.toString({ format: "hex" })}`;
}

export function getPaletteChart({
  interpolationColorSpace,
  axeName,
  palette,
}: {
  interpolationColorSpace: InterpolationColorSpace;
  palette: PaletteBuild;
  axeName: PickerAxeName;
}): PaletteChartData {
  const colorSpace: ColorSpace =
    PICKER_MODES.find((mode) => mode.space === interpolationColorSpace) ??
    DEFAULT_PICKER_MODE;

  const axe: PickerAxe =
    colorSpace.axes.find((axe) => axe.axe === axeName) ?? colorSpace.axes[0];

  let minY = axe.min;
  let maxY = axe.max;
  if (axe.axe === "h") {
    const hues = palette.tints.map((tint) =>
      tint.color.get(`${interpolationColorSpace}.h`)
    );
    minY = Math.floor(Math.min(...hues) - 5);
    maxY = Math.floor(Math.max(...hues) + 5);
  }
  return {
    line: getChartLineData({
      palette,
      axe: axeName,
      interpolationColorSpace,
      label: axe.label,
    }),
    options: getOptions({
      minX: 0,
      maxX: palette.tints.length,
      minY,
      maxY,
    }),
  };
}

function getOptions({
  minX,
  maxX,
  minY,
  maxY,
}: {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}): ChartOptions<"line"> {
  return {
    responsive: false,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: { min: minX, max: maxX },
      y: { min: minY, max: maxY },
    },
  };
}

function getChartLineData({
  palette,
  interpolationColorSpace,
  axe,
  label,
}: {
  palette: PaletteBuild;
  interpolationColorSpace: InterpolationColorSpace;
  axe: PickerAxeName;
  label: string;
}): ChartData<"line"> {
  return {
    labels: palette.tints.map((tint) => tint.name),
    datasets: [
      {
        label,
        data: palette.tints.map((tint) =>
          tint.color.get(`${interpolationColorSpace}.${axe}`)
        ),
        borderColor: "#1e40af",
        backgroundColor: "#dbeafe",
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };
}
