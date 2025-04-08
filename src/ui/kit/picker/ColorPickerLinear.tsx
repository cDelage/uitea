import { useEffect, useMemo, useState } from "react";
import ColorSlider from "./ColorSlider";
import {
  DEFAULT_PICKER_MODE,
  getPickerData,
  PICKER_MODES,
  ColorSpace,
  PickerSpace,
  updateColor,
  updateColorFromString,
} from "../../../util/PickerUtil";
import styles from "./ColorPickerLinear.module.css";
import InputNumber from "./InputNumber";
import FormComponent from "../FormComponent";
import { isValidColor } from "../../../util/PaletteBuilderStore";
import ColorIO from "colorjs.io";

function ColorPickerLinear({
  color,
  onChange,
}: {
  color: ColorIO;
  onChange: (color: ColorIO) => void;
}) {
  const [colorHex, setColorHex] = useState(color.toString({ format: "hex" }));
  const [lastColorHex, setLastColorHex] = useState(
    color.toString({ format: "hex" })
  );
  const [pickerMode, setPickerMode] = useState<ColorSpace>(DEFAULT_PICKER_MODE);
  const pickerData = useMemo(
    () => getPickerData({ color, pickerMode }),
    [color, pickerMode]
  );

  function handleSetPickerMode(space: PickerSpace) {
    setPickerMode(
      PICKER_MODES.find((picker) => picker.space === space) ??
        DEFAULT_PICKER_MODE
    );
  }

  useEffect(() => {
    if (color.toString({ format: "hex" }) !== lastColorHex) {
      setColorHex(color.toString({ format: "hex" }));
      setLastColorHex(color.toString({ format: "hex" }));
    }
  }, [color, lastColorHex]);

  useEffect(() => {
    if (colorHex !== lastColorHex && isValidColor(colorHex)) {
      onChange(updateColorFromString({ value: colorHex, color, pickerMode }));
    }
  }, [colorHex, lastColorHex, color, onChange, pickerMode]);

  return (
    <div className={styles.picker}>
      <div className={styles.settingsContainer}>
        <div className={styles.colorSpaceMode}>
          <select
            className="inherit-input"
            value={pickerMode.space}
            onChange={(e) => handleSetPickerMode(e.target.value as PickerSpace)}
          >
            {PICKER_MODES.map((picker) => (
              <option key={picker.space}>{picker.space}</option>
            ))}
          </select>
        </div>
        <div className={styles.hexContainer}>
          <input
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="inherit-input text-align-right"
          />
        </div>
      </div>
      {pickerData.map((axe) => (
        <div key={axe.name}>
          <FormComponent
            label={axe.label}
            rightElement={
              <InputNumber
                value={axe.value}
                setValue={(value: number) =>
                  onChange(
                    updateColor({
                      axe: axe.name,
                      color,
                      pickerMode,
                      value,
                    })
                  )
                }
                min={axe.min}
                max={axe.max}
              />
            }
          >
            <ColorSlider
              gradient={axe.gradient}
              value={axe.value}
              max={axe.max}
              min={axe.min}
              step={axe.steps}
              onChange={(value: number) => {
                onChange(
                  updateColor({
                    axe: axe.name,
                    color,
                    pickerMode,
                    value,
                  })
                );
              }}
              color={color}
            />
          </FormComponent>
        </div>
      ))}
    </div>
  );
}

export default ColorPickerLinear;
