import Slider from "rc-slider";
import { HANDLE_SLIDER_LIST, RAIL_SLIDER_LIST, TRACK_SLIDER_LIST } from "../UiConstants";

function ValueSlider({
  values,
  value,
  setValue,
  onChangeComplete
}: {
  values: string[];
  value: string;
  setValue: (value: string) => void;
  onChangeComplete?: () => void;
}) {
  const currentIndex = values.findIndex((val) => val === value) ?? 0;

  return (
    <Slider
      min={0}
      max={values.length - 1}
      value={currentIndex}
      step={1}
      onChangeComplete={onChangeComplete}
      onChange={(val) => {
        if (typeof val === "number") {
          if (Number.isInteger(val)) {
            setValue(values[val as number]);
          }
        }
      }}
      styles={{
        handle: HANDLE_SLIDER_LIST,
        rail: RAIL_SLIDER_LIST,
        track: TRACK_SLIDER_LIST
      }}
    />
  );
}

export default ValueSlider;
