import Slider from "rc-slider";
import { PaletteColor } from "../../../features/design-system/PaletteBuilder3/PaletteBuilder3Store";

function ColorSlider({
  gradient,
  value,
  max,
  min,
  onChange,
  step = 1,
  color,
}: {
  gradient: string;
  value: number;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  color?: PaletteColor;
}) {
  return (
    <Slider
      min={min}
      max={max}
      step={step}
      included={false}
      value={value}
      onChange={(value) => {
        if (typeof value === "number") {
          onChange(value);
        }
      }}
      style={{
        height: "24px",
      }}
      styles={{
        rail: {
          background: gradient,
          height: "20px",
          borderRadius: "4px",
          boxShadow: "var(--shadow-md)",
          bottom: 2,
        },
        handle: {
          background: color?.hex(),
          opacity: 1,
          borderRadius: "2px",
          height: "24px",
          width: "10px",
          boxShadow: "var(--shadow-md)",
          border: "var(--base-border) 1px solid",
          bottom: 0,
        },
      }}
    />
  );
}

export default ColorSlider;
