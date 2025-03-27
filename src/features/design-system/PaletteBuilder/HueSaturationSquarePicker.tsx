import { formatHex, hsl, okhsl } from "culori";
import { useMemo, useState } from "react";
import {
  ColorColumn,
  generateLinearArray,
  generateLoopArray,
} from "../../../util/PickerArray";
import Slider from "rc-slider";
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import { ICON_SIZE_MD } from "../../../ui/UiConstants";
import { ColorOkhsl } from "../../../util/PaletteBuilderTwoStore";

function HueSaturationSquarePicker({
  color,
  onChange,
}: {
  color: ColorOkhsl;
  onChange: (color: ColorOkhsl) => void;
}) {
  const [gapValues, setGapValues] = useState({
    hue: 5,
    saturation: -0.24,
  });

  const colorsArray = useMemo<ColorColumn[]>(() => {
    const okhslInitialColor = hsl(color.hex);
    const saturationArray = generateLinearArray({
      centerValue: okhslInitialColor?.s ?? 0,
      gap: gapValues.saturation,
      maxValue: 1,
      minValue: 0,
      length: 5,
    });
    return generateLoopArray({
      centerValue: okhslInitialColor?.h ?? 0,
      gap: gapValues.hue,
      maxValue: 360,
      minValue: 0,
      length: 7,
    }).map((hue) => {
      return {
        key: `${hue}`,
        colors: saturationArray.map((saturation) => {
          const hex = formatHex({
            mode: "hsl",
            h: hue,
            l: okhslInitialColor?.l ?? 0.5,
            s: saturation,
          });
          const colorOkhsl = okhsl(hex);
          return {
            active:
              color.h === colorOkhsl?.h &&
              color.s === colorOkhsl?.s &&
              color.l === colorOkhsl?.l,
            color: {
              hex,
              h: colorOkhsl?.h ?? 0,
              l: colorOkhsl?.l ?? 0.5,
              s: colorOkhsl?.s ?? 1,
            },
          };
        }),
      };
    });
  }, [color, gapValues]);

  function handleSetGap(value: number) {
    if (value === 0) {
      setGapValues({
        hue: 5,
        saturation: -0.25,
      });
    } else if (value === 0.5) {
      setGapValues({
        hue: 2.5,
        saturation: -0.1,
      });
    } else {
      setGapValues({
        hue: 1,
        saturation: -0.05,
      });
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

export default HueSaturationSquarePicker;
