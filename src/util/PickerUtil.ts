import ColorIO from "colorjs.io";
import { linearInterpolation } from "./Interpolation";

export interface PickerData {
  name: PickerAxeName;
  gradient: string;
  value: number;
  max: number;
  min: number;
  steps: number;
  label: string;
}

export interface AxeLabel {
  axeName: PickerAxeName;
  label: string;
}

const AXES_LABELS: AxeLabel[] = [
  {
    axeName: "h",
    label: "Hue",
  },
  {
    axeName: "s",
    label: "Saturation",
  },
  {
    axeName: "l",
    label: "Lightness",
  },
  {
    axeName: "c",
    label: "Chroma",
  },
  {
    axeName: "w",
    label: "Whiteness",
  },
  {
    axeName: "b",
    label: "Blackness",
  },
  {
    axeName: "v",
    label: "Value",
  },
];

export type PickerSpace = "hsl" | "oklch" | "lch" | "okhsl" | "hwb" | "hsv";

export type PickerAxeName = "h" | "s" | "l" | "c" | "w" | "b" | "v";

export interface PickerAxe {
  axe: PickerAxeName;
  label: string;
  min: number;
  max: number;
  steps: number;
  gradientSteps: number;
  otherAxes: PickerAxeName[];
}

export interface ColorSpace {
  space: PickerSpace;
  axes: [PickerAxe, PickerAxe, PickerAxe];
}

export function getPickerData({
  color,
  pickerMode,
}: {
  color: ColorIO;
  pickerMode: ColorSpace;
}): PickerData[] {
  const { space, axes } = pickerMode;
  return axes.map((axe) => {
    const { min, max, steps, axe: name, otherAxes, gradientSteps } = axe;

    const gradientColors = Array.from({ length: gradientSteps }, (_, i) => {
      const gradientColor = new ColorIO(color);
      gradientColor.set({
        [`${space}.${name}`]: linearInterpolation(i, gradientSteps, min, max),
        [`${space}.${otherAxes[0]}`]: Number(
          color.get(`${space}.${otherAxes[0]}`)?.toFixed(2)
        ),
        [`${space}.${otherAxes[1]}`]: Number(
          color.get(`${space}.${otherAxes[1]}`)?.toFixed(2)
        ),
      });
      return gradientColor.toString({ format: "hex" });
    });

    const linearGradient = `linear-gradient(to right, ${gradientColors.join(
      ", "
    )})`;

    return {
      value: color.get(`${space}.${name}`),
      gradient: linearGradient,
      max,
      min,
      steps,
      name: name,
      label:
        AXES_LABELS.find((axe) => axe.axeName === name)?.label ?? "Not found",
    };
  });
}

export function updateColor({
  axe,
  color,
  pickerMode,
  value,
}: {
  color: ColorIO;
  pickerMode: ColorSpace;
  value: number;
  axe: PickerAxeName;
}): ColorIO {
  const newColor = new ColorIO(color);
  const { axes, space } = pickerMode;

  const computedValues: [number, number, number] = [
    axe === axes[0].axe
      ? Number(value.toFixed(2))
      : color.get(`${space}.${axes[0].axe}`),
    axe === axes[1].axe
      ? Number(value.toFixed(2))
      : color.get(`${space}.${axes[1].axe}`),
    axe === axes[2].axe
      ? Number(value.toFixed(2))
      : color.get(`${space}.${axes[2].axe}`),
  ];

  newColor.setAll(space, computedValues);

  return newColor;
}

export function updateColorFromString({
  color,
  value,
  pickerMode,
}: {
  color: ColorIO;
  value: string;
  pickerMode: ColorSpace;
}): ColorIO {
  const { space, axes } = pickerMode;
  const newColor = new ColorIO(value);
  newColor.set({
    [`${space}.${axes[0].axe}`]: newColor.get(`${space}.${axes[0].axe}`)
      ? newColor.get(`${space}.${axes[0].axe}`)
      : color.get(`${space}.${axes[1].axe}`),
    [`${space}.${axes[1].axe}`]: newColor.get(`${space}.${axes[1].axe}`)
      ? newColor.get(`${space}.${axes[1].axe}`)
      : color.get(`${space}.${axes[1].axe}`),
    [`${space}.${axes[2].axe}`]: newColor.get(`${space}.${axes[2].axe}`)
      ? newColor.get(`${space}.${axes[2].axe}`)
      : color.get(`${space}.${axes[2].axe}`),
  });

  return newColor;
}

export const DEFAULT_PICKER_MODE: ColorSpace = {
  space: "hsl",
  axes: [
    {
      axe: "h",
      label: "hue",
      min: 0,
      max: 360,
      steps: 0.5,
      gradientSteps: 12,
      otherAxes: ["s", "l"],
    },
    {
      axe: "s",
      label: "saturation",
      min: 0,
      max: 100,
      steps: 0.01,
      gradientSteps: 5,
      otherAxes: ["h", "l"],
    },
    {
      axe: "l",
      label: "lightness",
      min: 0,
      max: 100,
      steps: 0.01,
      gradientSteps: 5,
      otherAxes: ["h", "s"],
    },
  ],
};

export const PICKER_MODES: ColorSpace[] = [
  {
    space: "hsl",
    axes: [
      {
        axe: "h",
        label: "hue",

        min: 0,
        max: 360,
        steps: 0.5,
        gradientSteps: 12,
        otherAxes: ["s", "l"],
      },
      {
        axe: "s",
        label: "saturation",

        min: 0,
        max: 100,
        steps: 0.5,
        gradientSteps: 5,
        otherAxes: ["h", "l"],
      },
      {
        axe: "l",
        label: "lightness",
        min: 0,
        max: 100,
        steps: 0.5,
        gradientSteps: 5,
        otherAxes: ["h", "s"],
      },
    ],
  },
  {
    space: "hsv",
    axes: [
      {
        axe: "h",
        label: "hue",

        min: 0,
        max: 360,
        steps: 0.5,
        gradientSteps: 12,
        otherAxes: ["s", "v"],
      },
      {
        axe: "s",
        label: "saturation",

        min: 0,
        max: 100,
        steps: 0.5,
        gradientSteps: 5,
        otherAxes: ["h", "v"],
      },
      {
        axe: "v",
        label: "value",

        min: 0,
        max: 100,
        steps: 0.5,
        gradientSteps: 5,
        otherAxes: ["h", "s"],
      },
    ],
  },
  {
    space: "hwb",
    axes: [
      {
        axe: "h",
        label: "hue",

        min: 0,
        max: 360,
        steps: 0.5,
        gradientSteps: 12,
        otherAxes: ["w", "b"],
      },
      {
        axe: "w",
        label: "whiteness",
        min: 0,
        max: 100,
        steps: 0.5,
        gradientSteps: 5,
        otherAxes: ["h", "b"],
      },
      {
        axe: "b",
        label: "blackness",

        min: 0,
        max: 100,
        steps: 0.5,
        gradientSteps: 5,
        otherAxes: ["h", "w"],
      },
    ],
  },
  {
    space: "lch",
    axes: [
      {
        axe: "l",
        label: "lightness",

        min: 0,
        max: 100,
        steps: 0.5,
        gradientSteps: 5,
        otherAxes: ["c", "h"],
      },
      {
        axe: "c",
        label: "chroma",

        min: 0,
        max: 150,
        steps: 0.5,
        gradientSteps: 5,
        otherAxes: ["l", "h"],
      },
      {
        axe: "h",
        label: "hue",

        min: 0,
        max: 360,
        steps: 0.5,
        gradientSteps: 12,
        otherAxes: ["l", "c"],
      },
    ],
  },
  {
    space: "oklch",
    axes: [
      {
        axe: "l",
        label: "lightness",

        min: 0,
        max: 1,
        steps: 0.01,
        gradientSteps: 5,
        otherAxes: ["c", "h"],
      },
      {
        axe: "c",
        label: "chroma",

        min: 0,
        max: 0.4,
        steps: 0.01,
        gradientSteps: 5,
        otherAxes: ["l", "h"],
      },
      {
        axe: "h",
        label: "hue",

        min: 0,
        max: 360,
        steps: 0.5,
        gradientSteps: 12,
        otherAxes: ["l", "c"],
      },
    ],
  },
  {
    space: "okhsl",
    axes: [
      {
        axe: "h",
        label: "hue",

        min: 0,
        max: 360,
        steps: 0.5,
        gradientSteps: 12,
        otherAxes: ["s", "l"],
      },
      {
        axe: "s",
        label: "saturation",

        min: 0,
        max: 1,
        steps: 0.01,
        gradientSteps: 5,
        otherAxes: ["h", "l"],
      },
      {
        axe: "l",
        label: "lightness",
        min: 0,
        max: 1,
        steps: 0.01,
        gradientSteps: 5,
        otherAxes: ["h", "s"],
      },
    ],
  },
];
