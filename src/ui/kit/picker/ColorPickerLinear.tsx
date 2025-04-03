import { useEffect, useMemo, useState } from "react";
import ColorSlider from "./ColorSlider";
import {
  getPickerData,
  PickerMode,
  updateColor,
  updateColorFromString,
} from "../../../util/PickerUtil";
import { PaletteColor } from "../../../features/design-system/PaletteBuilder3/PaletteBuilder3Store";
import styles from "./ColorPickerLinear.module.css";
import InputNumber from "./InputNumber";
import FormComponent from "../FormComponent";
import { isValidColor } from "../../../util/PaletteBuilderStore";

function ColorPickerLinear({
  color,
  onChange,
}: {
  color: PaletteColor;
  onChange: (color: PaletteColor) => void;
}) {
  const [colorHex, setColorHex] = useState(color.hex());
  const [lastColorHex, setLastColorHex] = useState(color.hex());
  const [pickerMode, setPickerMode] = useState<PickerMode>("hsl");
  const pickerData = useMemo(
    () => getPickerData({ color, pickerMode }),
    [color, pickerMode]
  );

  useEffect(() => {
    if (color.hex() !== lastColorHex) {
      setColorHex(color.hex());
      setLastColorHex(color.hex());
    }
  }, [color, lastColorHex]);

  useEffect(() => {
    if (colorHex !== lastColorHex && isValidColor(colorHex)) {
      onChange(updateColorFromString({ value: colorHex, color }));
    }
  }, [colorHex, lastColorHex, color, onChange]);

  return (
    <div className={styles.picker}>
      <div className={styles.settingsContainer}>
        <div className={styles.colorSpaceMode}>
          <select
            className="inherit-input"
            value={pickerMode}
            onChange={(e) => setPickerMode(e.target.value as PickerMode)}
          >
            <option>hsl</option>
            <option>oklch</option>
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
      {pickerMode === "hsl" && (
        <>
          <FormComponent
            label="hue"
            rightElement={
              <InputNumber
                value={pickerData.hue}
                setValue={(value: number) =>
                  onChange(
                    updateColor({
                      axe: "h",
                      color,
                      pickerMode,
                      value,
                    })
                  )
                }
                min={0}
                max={360}
              />
            }
          >
            <ColorSlider
              gradient={pickerData.hueGradient}
              value={pickerData.hue}
              max={360}
              min={0}
              onChange={(value: number) => {
                onChange(
                  updateColor({
                    axe: "h",
                    color,
                    pickerMode,
                    value,
                  })
                );
              }}
              color={color}
            />
          </FormComponent>
          <FormComponent
            label="saturation"
            rightElement={
              <InputNumber
                value={pickerData.saturationChroma}
                setValue={(value: number) =>
                  onChange(
                    updateColor({
                      axe: "s",
                      color,
                      pickerMode,
                      value,
                    })
                  )
                }
                min={0}
                max={1}
              />
            }
          >
            <ColorSlider
              gradient={pickerData.saturationChromaGradient}
              value={pickerData.saturationChroma}
              max={1}
              min={0}
              step={0.01}
              onChange={(value: number) => {
                onChange(
                  updateColor({
                    axe: "s",
                    color,
                    pickerMode,
                    value,
                  })
                );
              }}
              color={color}
            />
          </FormComponent>
          <FormComponent
            label="lightness"
            rightElement={
              <InputNumber
                value={pickerData.lightness}
                setValue={(value: number) =>
                  onChange(
                    updateColor({
                      axe: "l",
                      color,
                      pickerMode,
                      value,
                    })
                  )
                }
                min={0}
                max={1}
              />
            }
          >
            <ColorSlider
              gradient={pickerData.lightnessGradient}
              value={pickerData.lightness}
              max={1}
              min={0}
              step={0.01}
              onChange={(value: number) => {
                onChange(
                  updateColor({
                    axe: "l",
                    color,
                    pickerMode,
                    value,
                  })
                );
              }}
              color={color}
            />
          </FormComponent>
        </>
      )}
      {pickerMode === "oklch" && (
        <>
          <FormComponent
            label="lightness"
            rightElement={
              <InputNumber
                value={pickerData.lightness}
                setValue={(value: number) =>
                  onChange(
                    updateColor({
                      axe: "l",
                      color,
                      pickerMode,
                      value,
                    })
                  )
                }
                min={0}
                max={1}
              />
            }
          >
            <ColorSlider
              gradient={pickerData.lightnessGradient}
              value={pickerData.lightness}
              max={1}
              min={0}
              step={0.01}
              onChange={(value: number) => {
                onChange(
                  updateColor({
                    axe: "l",
                    color,
                    pickerMode,
                    value,
                  })
                );
              }}
              color={color}
            />
          </FormComponent>
          <FormComponent
            label="chroma"
            rightElement={
              <InputNumber
                value={pickerData.saturationChroma}
                setValue={(value: number) =>
                  onChange(
                    updateColor({
                      axe: "c",
                      color,
                      pickerMode,
                      value,
                    })
                  )
                }
                min={0}
                max={1}
              />
            }
          >
            <ColorSlider
              gradient={pickerData.saturationChromaGradient}
              value={pickerData.saturationChroma}
              max={0.4}
              min={0}
              step={0.01}
              onChange={(value: number) => {
                onChange(
                  updateColor({
                    axe: "c",
                    color,
                    pickerMode,
                    value,
                  })
                );
              }}
              color={color}
            />
          </FormComponent>
          <FormComponent
            label="hue"
            rightElement={
              <InputNumber
                value={pickerData.hue}
                setValue={(value: number) =>
                  onChange(
                    updateColor({
                      axe: "h",
                      color,
                      pickerMode,
                      value,
                    })
                  )
                }
                min={0}
                max={360}
              />
            }
          >
            <ColorSlider
              gradient={pickerData.hueGradient}
              value={pickerData.hue}
              max={360}
              min={0}
              step={0.25}
              onChange={(value: number) => {
                onChange(
                  updateColor({
                    axe: "h",
                    color,
                    pickerMode,
                    value,
                  })
                );
              }}
              color={color}
            />
          </FormComponent>
        </>
      )}
    </div>
  );
}

export default ColorPickerLinear;
