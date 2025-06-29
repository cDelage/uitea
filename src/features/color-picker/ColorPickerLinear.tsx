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
  PickerData,
} from "../../util/PickerUtil";
import styles from "./ColorPickerLinear.module.css";
import InputNumber from "./InputNumber";
import FormComponent from "../../ui/kit/FormComponent";
import ColorIO from "colorjs.io";
import { isEqual } from "lodash";
import { useColorPickerStore } from "./ColorPickerStore";
import { getRectSize, ICON_SIZE_SM } from "../../ui/UiConstants";
import { MdColorize } from "react-icons/md";

function ColorPickerLinear({
  color,
  onChange,
  onChangeComplete,
}: {
  color: ColorIO;
  onChange: (color: ColorIO) => void;
  onChangeComplete?: () => void;
}) {
  const [colorHex, setColorHex] = useState(color.toString({ format: "hex" }));
  const [pickerMode, setPickerMode] = useState<ColorSpace>(DEFAULT_PICKER_MODE);
  const [activePipette, setActivePipette] = useState(false);
  const { setPickerFallback, pickerFallbacks } = useColorPickerStore();

  const pickerDatas = useMemo(
    () => getPickerData({ color, pickerMode }),
    [color, pickerMode]
  );

  function handleSetPickerMode(space: PickerSpace) {
    setPickerMode(
      PICKER_MODES.find((picker) => picker.space === space) ??
        DEFAULT_PICKER_MODE
    );
  }

  function handleBlur() {
    const newColor = updateColorFromString({
      value: colorHex,
      color,
      pickerMode,
    });
    if (
      !isEqual(
        newColor.toString({ format: "hex" }),
        color.toString({ format: "hex" })
      )
    ) {
      onChange(newColor);
      setTimeout(() => {
        onChangeComplete?.();
      }, 0);
    }
  }

  function handleSliderComplete() {
    onChangeComplete?.();
    setColorHex(color.toString({ format: "hex" }));
  }

  function handleUpdateColor(axe: PickerData, value: number) {
    const newColor = updateColor({
      axe: axe.name,
      color,
      pickerMode,
      value,
      fallbacks: pickerFallbacks,
    });
    setPickerFallback(newColor, pickerMode);
    onChange(newColor);
  }

  async function pickColor() {
    if ("EyeDropper" in window) {
      try {
        // 2. Ouvrir la pipette
        const eyeDropper = window.EyeDropper
          ? new window.EyeDropper()
          : undefined;

        if (eyeDropper) {
          setActivePipette(true);
          const { sRGBHex } = await eyeDropper.open(); // Attend que l’utilisateur clique
          onChange(new ColorIO(sRGBHex)); // 3. Mettre à jour l’état React
          setActivePipette(false);
        }
      } catch (err) {
        // L’utilisateur a peut-être appuyé sur Échap
        console.log("Sélection annulée", err);
      }
    }
  }

  useEffect(() => {
    if (pickerMode.space !== pickerFallbacks[0]?.space) {
      setPickerFallback(color, pickerMode);
    }
  }, [pickerMode, pickerFallbacks, setPickerFallback, color]);

  return (
    <div className={styles.picker}>
      <div className={styles.settingsContainer}>
        <div
          className="row uidt-input cursor-pointer"
          style={{
            width: "160px",
          }}
        >
          <div
            className="row align-center gap-2 p-2"
          >
            <div
              className="palette-color"
              style={{
                background: colorHex,
                ...getRectSize({ height: "var(--uidt-space-6)" }),
              }}
            ></div>
            <input
              value={colorHex}
              onBlur={handleBlur}
              onChange={(e) => setColorHex(e.target.value)}
              className="inherit-input empty-border"
              style={{
                width: "100%",
              }}
            />
            <button
              className="action-ghost-button"
              data-active={activePipette}
              onClick={pickColor}
              style={{
                borderRadius: "0px",
                overflow: "hidden",
                height: "100%",
                width: "48px",
                borderLeft: "1px solid var(--uidt-base-border)",
              }}
            >
              <MdColorize size={ICON_SIZE_SM} />
            </button>
          </div>
        </div>
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
      </div>
      {pickerDatas.map((axe) => (
        <div key={axe.name}>
          <FormComponent
            label={axe.label}
            rightElement={
              <InputNumber
                value={axe.value}
                setValue={(value: number) => handleUpdateColor(axe, value)}
                min={axe.min}
                max={axe.max}
              />
            }
          >
            <ColorSlider
              gradient={axe.gradient}
              value={axe.value ?? 0}
              max={axe.max}
              min={axe.min}
              step={axe.steps}
              onChangeComplete={handleSliderComplete}
              onChange={(value: number) => {
                handleUpdateColor(axe, value);
              }}
              color={color}
              axe={axe.name}
            />
          </FormComponent>
        </div>
      ))}
    </div>
  );
}

export default ColorPickerLinear;
