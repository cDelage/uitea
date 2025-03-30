import { useMemo, useState } from "react";
import ColorSlider from "./ColorSlider";
import {
  getPickerData,
  PickerMode,
  updateColor,
} from "../../../util/PickerUtil";
import FormComponent from "../FormComponent";
import { PaletteColor } from "../../../features/design-system/PaletteBuilder3/PaletteBuilder3Store";

function ColorPickerLinear({
  color,
  onChange,
}: {
  color: PaletteColor;
  onChange: (color: PaletteColor) => void;
}) {
  const [pickerMode, setPickerMode] = useState<PickerMode>("hsl");
  const pickerData = useMemo(
    () => getPickerData({ color, pickerMode }),
    [color, pickerMode]
  );

  return (
    <div>
      <FormComponent label="Mode">
        <select
          className="inherit-input"
          value={pickerMode}
          onChange={(e) => setPickerMode(e.target.value as PickerMode)}
        >
          <option>hsl</option>
          <option>oklch</option>
        </select>
      </FormComponent>
      {pickerMode === "hsl" && (
        <>
          <div className="row align-center gap-2">
            <strong className="font-weight-bold">HUE</strong>
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
          </div>
          <FormComponent label="Saturation">
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
          <FormComponent label="Lightness">
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
        </>
      )}
    </div>
  );
}

export default ColorPickerLinear;
