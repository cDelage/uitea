import { ChangeEvent, useMemo, useState } from "react";
import StepsList from "../../../ui/kit/StepsList";
import { Step } from "../../../util/Steps";
import styles from "./PaletteBuilderAddPalettePopover.module.css";
import {
  ColorOkhsl,
  getColorOkhsl,
  getHueName,
  TintBuilder,
  usePaletteBuilderTwoStore,
} from "../../../util/PaletteBuilderTwoStore";
import { HuePicker } from "react-color";
import { ButtonPrimary } from "../../../ui/kit/Buttons";
import HueSaturationSquarePicker from "./HueSaturationSquarePicker";
import { isValidCssColorOrGradient } from "../../../util/DesignSystemUtils";
import FormComponent from "../../../ui/kit/FormComponent";
import { formatHex, okhsl } from "culori";
import LightnessSaturationPicker from "./LightnessSaturationPicker";
import { DEFAULT_OKHSL } from "../../../ui/UiConstants";

function PaletteBuilderAddPalettePopover({
  initialColor,
  huePreconfirm,
}: {
  initialColor?: string;
  huePreconfirm?: boolean;
}) {
  const {
    getTintsToSynchronize,
    mainPalette: { tints },
    appendAdditionalPalette,
  } = usePaletteBuilderTwoStore();
  const tintsToSync = useMemo(getTintsToSynchronize, [getTintsToSynchronize]);
  const [colorInput, setColorInput] = useState<string>(
    initialColor ?? "#f7ff00"
  );
  const [steps, setSteps] = useState<Step[]>([
    {
      stepName: "Hue selection",
      state: huePreconfirm ? "DONE" : "WAITING",
      disabled: false,
      backgroundDone: initialColor ?? "#f7ff00",
    },
    ...tintsToSync.map((tint) => {
      return {
        stepName: `Calibrate color ${tint.name}`,
        disabled: !huePreconfirm,
        state: !huePreconfirm ? "WAITING" : "DONE",
        backgroundDone: undefined,
      } as Step;
    }),
  ]);

  function handleConfirmStep(stepIndex: number, nextStepColor?: ColorOkhsl) {
    setSteps(
      steps.map((step, index) => {
        return {
          ...step,
          state: index === stepIndex ? "DONE" : step.state,
          disabled: index === stepIndex + 1 ? false : step.disabled,
          backgroundDone:
            index === stepIndex + 1 ? nextStepColor?.hex : step.backgroundDone,
          tintBuilderColor: index === stepIndex + 1 ? nextStepColor : step.tintBuilderColor,
        };
      })
    );
  }

  function handleUpdateStepColorByIndex(
    color: ColorOkhsl,
    targetIndex: number
  ) {
    setSteps(
      steps.map((step, index) => {
        return {
          ...step,
          backgroundDone:
            index === targetIndex ? color.hex : step.backgroundDone,
          tintBuilderColor:
            index === targetIndex ? color : step.tintBuilderColor,
        };
      })
    );
  }

  function handleUpdateInputColor(e: ChangeEvent<HTMLInputElement>) {
    const newColor = e.target.value;
    setColorInput(newColor);
    if (isValidCssColorOrGradient(newColor)) {
      handleUpdateStepColorByIndex(getColorOkhsl(newColor), 0);
    }
  }

  const currentMainHue = steps[0].backgroundDone ?? "#dddddd";

  function computeCenterColor(): ColorOkhsl {
    const centerTint = tints[Math.floor(tints.length / 2)];
    const mainHueOkhsl = okhsl(currentMainHue);
    return {
      hex: formatHex({
        mode: "okhsl",
        h: mainHueOkhsl?.h ?? 0,
        l: centerTint.color.l,
        s: centerTint.color.s,
      }),
      h: mainHueOkhsl?.h ?? 0,
      l: centerTint.color.l,
      s: centerTint.color.s,
    };
  }

  function computeTintColor(originTint: TintBuilder): ColorOkhsl {
    const centerColor = steps[1].backgroundDone;
    const centerOkhsl = okhsl(centerColor);
    const originalCenterTint = tints[Math.floor(tints.length / 2)];

    return {
      hex: formatHex({
        mode: "okhsl",
        h: centerOkhsl?.h,
        s:
          (originTint.color.s / originalCenterTint.color.s || 0.001) *
          (centerOkhsl?.s ?? 0.01),
        l:
          (originTint.color.l / originalCenterTint.color.l || 0.001) *
          (centerOkhsl?.l ?? 0.01),
      }),
      h: centerOkhsl?.h ?? 0,
      s:
        (originTint.color.s / originalCenterTint.color.s || 0.001) *
        (centerOkhsl?.s ?? 0.01),
      l:
        (originTint.color.l / originalCenterTint.color.l || 0.001) *
        (centerOkhsl?.l ?? 0.01),
    };
  }

  function handleCreatePalette() {
    const tints = tintsToSync.map((tint, index) => {
      return {
        ...tint,
        color: steps[index + 1].tintBuilderColor ?? tint.color,
      };
    });
    const hue = steps[0].backgroundDone ?? "#dddddd";
    const name = getHueName(okhsl(hue)?.h ?? 0);
    appendAdditionalPalette(tints, hue, name);
  }

  return (
    <div className="popover-body" data-disableoutside={true}>
      <StepsList steps={steps} initialActiveStep="Hue selection">
        <StepsList.Step stepName="Hue selection">
          <div className={styles.popoverStep}>
            <h6 className="text-color-light">Hue selection</h6>
            <div style={{ height: "20px" }}>
              <HuePicker
                width="100%"
                color={currentMainHue}
                onChange={(color) =>
                  handleUpdateStepColorByIndex(getColorOkhsl(color.hex), 0)
                }
              />
            </div>
            <div>
              <HueSaturationSquarePicker
                color={steps[0].tintBuilderColor ?? DEFAULT_OKHSL}
                onChange={(color) => handleUpdateStepColorByIndex(color, 0)}
              />
            </div>
            <div className={styles.previewContainer}>
              <FormComponent label="Color">
                <input
                  type="text"
                  className="inherit-input"
                  value={colorInput}
                  onChange={handleUpdateInputColor}
                />
              </FormComponent>
              <div
                className={styles.colorBigPreview}
                style={{
                  background: steps[0].backgroundDone,
                }}
              ></div>
            </div>
            <div className="row justify-end gap-4 align-center">
              <StepsList.NextStepButton
                callback={() => {
                  handleConfirmStep(0, computeCenterColor());
                }}
              >
                <ButtonPrimary>Confirm</ButtonPrimary>
              </StepsList.NextStepButton>
            </div>
          </div>
        </StepsList.Step>

        {tintsToSync.map((tint, index) => (
          <StepsList.Step
            key={tint.name}
            stepName={`Calibrate color ${tint.name}`}
          >
            <div className={styles.popoverStep}>
              <h6 className="text-color-light">Calibrate color {tint.name}</h6>
              <div>
                <LightnessSaturationPicker
                  color={steps[index + 1]?.tintBuilderColor ?? DEFAULT_OKHSL}
                  onChange={(value) =>
                    handleUpdateStepColorByIndex(value, index + 1)
                  }
                />
              </div>
              <div className="row justify-center gap-2">
                <div
                  className={styles.colorBigPreview}
                  style={{
                    background: steps[index + 1]?.backgroundDone ?? "#dddddd",
                  }}
                ></div>
                <div
                  className={styles.colorBigPreview}
                  style={{
                    background: tint.color.hex,
                  }}
                ></div>
              </div>
              <StepsList.NextStepButton
                callback={() => {
                  if (index !== tintsToSync.length - 1) {
                    handleConfirmStep(
                      index + 1,
                      computeTintColor(tintsToSync[index + 1])
                    );
                  } else {
                    handleCreatePalette();
                  }
                }}
              >
                <ButtonPrimary>Confirm</ButtonPrimary>
              </StepsList.NextStepButton>
            </div>
          </StepsList.Step>
        ))}
      </StepsList>
    </div>
  );
}

export default PaletteBuilderAddPalettePopover;
