import Slider from "rc-slider";
import ColorIO from "colorjs.io";
import {
  HANDLE_SLIDER_HORIZONTAL,
  RAIL_SLIDER_HORIZONTAL,
} from "../../UiConstants";

function ColorSlider({
  gradient,
  value,
  max,
  min,
  onChange,
  step = 1,
  color,
  reverse,
}: {
  gradient: string;
  value: number;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  color?: ColorIO;
  reverse?: boolean;
}) {
  return (
    <Slider
      min={min}
      max={max}
      step={step}
      included={false}
      value={value}
      reverse={reverse}
      onChange={(value) => {
        if (typeof value === "number") {
          if (Number.isInteger(value)) {
            onChange(value);
          } else {
            onChange(Number(value.toFixed(2)));
          }
        }
      }}
      style={{
        height: "24px",
      }}
      styles={{
        rail: {
          ...RAIL_SLIDER_HORIZONTAL,
          background: gradient,
        },
        handle: {
          ...HANDLE_SLIDER_HORIZONTAL,
          background: color?.toString({ format: "hex" }),
        },
      }}
    />
  );
}

export default ColorSlider;
