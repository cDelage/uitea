import { useMemo, useState } from "react";
import { ColorColumn, generateLinearArray } from "../../../util/PickerArray";
import { formatHex } from "culori";
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import Slider from "rc-slider";
import { ICON_SIZE_MD } from "../../../ui/UiConstants";
import { ColorOkhsl } from "../../../util/PaletteBuilderTwoStore";

function LightnessSaturationPicker({
  color,
  onChange,
}: {
  color: ColorOkhsl;
  onChange: (color: ColorOkhsl) => void;
}) {
  const [gapValues, setGapValues] = useState(0.2);
  const [initialHue] = useState(color.h);

  const colorsArray = useMemo<ColorColumn[]>(() => {
    const lightnessArray = generateLinearArray({
      centerValue: color.l,
      gap: -gapValues,
      maxValue: 1,
      minValue: 0,
      length: 6,
    });
    return generateLinearArray({
      centerValue: color.s ?? 0,
      gap: gapValues,
      maxValue: 1,
      minValue: 0,
      length: 6,
    }).map((saturation) => {
      return {
        key: `${saturation}`,
        colors: lightnessArray.map((lightness) => {
          const hex = formatHex({
            mode: "okhsl",
            s: Number(saturation.toFixed(2)),
            l: Number(lightness.toFixed(2)),
            h: initialHue,
          });
          return {
            color: {
              hex,
              h: initialHue ?? 0,
              s: saturation,
              l: lightness,
            },
            active:
              color.h === initialHue &&
              color.s === saturation &&
              color.l === lightness,
          };
        }),
      };
    });
  }, [color, gapValues, initialHue]);

  function handleSetGap(value: number) {
    if (value === 0) {
      setGapValues(0.2);
    } else if (value === 0.5) {
      setGapValues(0.1);
    } else {
      setGapValues(0.02);
    }
  }

  return (
    <div className="row h-full gap-4">
      <div className="column gap-4 align-center">
        <div>
          <MdZoomIn size={ICON_SIZE_MD} />
        </div>

        <Slider
          vertical={true}
          step={0.5}
          min={0}
          max={1}
          defaultValue={0}
          onChange={(result) => handleSetGap(result as number)}
          included={false}
        />
        <div>
          <MdZoomOut size={ICON_SIZE_MD} />
        </div>
      </div>
      <div className="row h-full gap-2 w-full">
        {colorsArray.map((col) => (
          <div key={col.key} className="column gap-2 w-full">
            {col.colors.map((proposedColor) => (
              <div
                key={proposedColor.color.hex}
                onClick={() => onChange(proposedColor.color)}
                style={{
                  width: "100%",
                  height: "24px",
                  cursor: "pointer",
                  background: proposedColor.color.hex,
                  boxShadow: proposedColor.active
                    ? "inset 0 0 0 2px  var(--primary-bg)"
                    : "inset 0 0 0 2px  transparent, var(--shadow-md)",
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LightnessSaturationPicker;
