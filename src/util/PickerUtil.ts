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

export interface PickerFallback {
  axe: PickerAxeName;
  space: PickerSpace;
  value: number;
}

export interface PickerAxe {
  name: PickerAxeName;
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
    const { min, max, steps, name: name, otherAxes, gradientSteps } = axe;

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
  fallbacks,
}: {
  color: ColorIO;
  pickerMode: ColorSpace;
  value: number;
  axe: PickerAxeName;
  fallbacks: PickerFallback[];
}): ColorIO {
  const newColor = new ColorIO(color);
  const { axes, space } = pickerMode;

  const computedValues: [number, number, number] = [
    axe === axes[0].name
      ? Number(value.toFixed(2))
      : color.get(`${space}.${axes[0].name}`) ??
        fallbacks.find((fallback) => fallback.axe === axes[0].name)?.value ??
        0,
    axe === axes[1].name
      ? Number(value.toFixed(2))
      : (color.get(`${space}.${axes[1].name}`) ||
          fallbacks.find((fallback) => fallback.axe === axes[1].name)?.value) ??
        0,
    axe === axes[2].name
      ? Number(value.toFixed(2))
      : (color.get(`${space}.${axes[2].name}`) ||
          fallbacks.find((fallback) => fallback.axe === axes[2].name)?.value) ??
        0,
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
    [`${space}.${axes[0].name}`]: newColor.get(`${space}.${axes[0].name}`)
      ? newColor.get(`${space}.${axes[0].name}`)
      : color.get(`${space}.${axes[1].name}`),
    [`${space}.${axes[1].name}`]: newColor.get(`${space}.${axes[1].name}`)
      ? newColor.get(`${space}.${axes[1].name}`)
      : color.get(`${space}.${axes[1].name}`),
    [`${space}.${axes[2].name}`]: newColor.get(`${space}.${axes[2].name}`)
      ? newColor.get(`${space}.${axes[2].name}`)
      : color.get(`${space}.${axes[2].name}`),
  });

  return newColor;
}

export const DEFAULT_PICKER_MODE: ColorSpace = {
  space: "hsl",
  axes: [
    {
      name: "h",
      label: "hue",
      min: 0,
      max: 360,
      steps: 0.5,
      gradientSteps: 12,
      otherAxes: ["s", "l"],
    },
    {
      name: "s",
      label: "saturation",
      min: 0,
      max: 100,
      steps: 0.01,
      gradientSteps: 5,
      otherAxes: ["h", "l"],
    },
    {
      name: "l",
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
        name: "h",
        label: "Hue",

        min: 0,
        max: 360,
        steps: 0.5,
        gradientSteps: 12,
        otherAxes: ["s", "l"],
      },
      {
        name: "s",
        label: "Saturation",

        min: 0,
        max: 100,
        steps: 0.5,
        gradientSteps: 5,
        otherAxes: ["h", "l"],
      },
      {
        name: "l",
        label: "Lightness",
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
        name: "h",
        label: "Hue",

        min: 0,
        max: 360,
        steps: 0.5,
        gradientSteps: 12,
        otherAxes: ["s", "v"],
      },
      {
        name: "s",
        label: "Saturation",

        min: 0,
        max: 100,
        steps: 0.5,
        gradientSteps: 5,
        otherAxes: ["h", "v"],
      },
      {
        name: "v",
        label: "Value",

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
        name: "h",
        label: "Hue",

        min: 0,
        max: 360,
        steps: 0.5,
        gradientSteps: 12,
        otherAxes: ["w", "b"],
      },
      {
        name: "w",
        label: "Whiteness",
        min: 0,
        max: 100,
        steps: 0.5,
        gradientSteps: 5,
        otherAxes: ["h", "b"],
      },
      {
        name: "b",
        label: "Blackness",

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
        name: "l",
        label: "Lightness",

        min: 0,
        max: 100,
        steps: 0.5,
        gradientSteps: 5,
        otherAxes: ["c", "h"],
      },
      {
        name: "c",
        label: "Chroma",

        min: 0,
        max: 150,
        steps: 0.5,
        gradientSteps: 5,
        otherAxes: ["l", "h"],
      },
      {
        name: "h",
        label: "Hue",

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
        name: "l",
        label: "Lightness",

        min: 0,
        max: 1,
        steps: 0.01,
        gradientSteps: 5,
        otherAxes: ["c", "h"],
      },
      {
        name: "c",
        label: "Chroma",

        min: 0,
        max: 0.4,
        steps: 0.01,
        gradientSteps: 5,
        otherAxes: ["l", "h"],
      },
      {
        name: "h",
        label: "Hue",

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
        name: "h",
        label: "Hue",

        min: 0,
        max: 360,
        steps: 0.5,
        gradientSteps: 12,
        otherAxes: ["s", "l"],
      },
      {
        name: "s",
        label: "Saturation",

        min: 0,
        max: 1,
        steps: 0.01,
        gradientSteps: 5,
        otherAxes: ["h", "l"],
      },
      {
        name: "l",
        label: "Lightness",
        min: 0,
        max: 1,
        steps: 0.01,
        gradientSteps: 5,
        otherAxes: ["h", "s"],
      },
    ],
  },
];

export const WHITE = new ColorIO("#ffffff");
export const BLACK = new ColorIO("#000000");

export function getContrastColor(hex?: string) {
  if (!hex) return "#000000";
  try {
    const baseColor = new ColorIO(hex);
    const whiteContrast = baseColor.contrastWCAG21(WHITE);
    const blackContrast = baseColor.contrastWCAG21(BLACK);
    return whiteContrast > blackContrast ? "#ffffff" : "#000000";
  } catch {
    return "#000000";
  }
}

export function isValidColor(color: string) {
  const hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/; // Validation pour hex (short et long)
  const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/; // Validation pour RGB
  const hslRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/; // Validation pour HSL

  return hexRegex.test(color) || rgbRegex.test(color) || hslRegex.test(color);
}

export type ContrastQuality =
  | "Very poor"
  | "Poor"
  | "Good"
  | "Very good"
  | "Super";

export interface ContrastInfo {
  contrast: string;
  quality: ContrastQuality;
  starCount: number;
  palette: string;
}

function getContrastQuality(contrast: number): {
  quality: ContrastQuality;
  starCount: number;
  palette: string;
} {
  if (contrast > 12) {
    return { quality: "Super", starCount: 5, palette: "positive" };
  } else if (contrast > 7) {
    return { quality: "Very good", starCount: 4, palette: "positive" };
  } else if (contrast > 4.5) {
    return { quality: "Good", starCount: 3, palette: "warning" };
  } else if (contrast > 3) {
    return { quality: "Poor", starCount: 2, palette: "negative" };
  } else {
    return { quality: "Very poor", starCount: 1, palette: "negative" };
  }
}

export function getContrastInfo(colors: ColorIO[]): ContrastInfo {
  if (colors.length === 2) {
    const contrastNumber = colors[0].contrastWCAG21(colors[1]);

    return {
      contrast: contrastNumber.toFixed(2),
      ...getContrastQuality(contrastNumber),
    };
  } else {
    return {
      contrast: "1",
      palette: "undefined",
      quality: "Good",
      starCount: 3,
    };
  }
}

export const STAR_ARRAY = Array.from({ length: 5 }, (_, i) => {
  return `${i}`;
});
