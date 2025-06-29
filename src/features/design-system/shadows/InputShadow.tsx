import { MdBlurOn, MdHeight, MdSelectAll, MdSunny } from "react-icons/md";
import { Shadow } from "../../../domain/DesignSystemDomain";
import {
  getRectSize,
  HANDLE_SLIDER_LIST,
  ICON_SIZE_SM,
  RAIL_SLIDER_LIST,
  TRACK_SLIDER_LIST,
} from "../../../ui/UiConstants";
import ArrowRange from "../../../ui/icons/ArrowRange";
import Popover from "../../../ui/kit/Popover";
import ColorPickerLinear from "../../color-picker/ColorPickerLinear";
import ColorIO from "colorjs.io";
import TokenSelector from "../../../ui/kit/TokenSelector";
import { useDesignSystemContext } from "../DesignSystemContext";
import { RefObject, useState } from "react";
import { getShadowColor } from "../../../util/DesignSystemUtils";
import FormComponent from "../../../ui/kit/FormComponent";
import Slider from "rc-slider";
import InputMeasurement from "../../../ui/kit/InputMeasurement";

function InputShadow({
  shadow,
  shadowIndex,
  setShadow,
  styleRef,
}: {
  shadow: Shadow;
  shadowIndex: number;
  setShadow: (shadow: Shadow) => void;
  styleRef?: RefObject<HTMLDivElement | null>;
}) {
  const { tokenFamilies } = useDesignSystemContext();
  const [color, setColor] = useState(
    new ColorIO(
      getShadowColor({ shadowColor: shadow.color, element: styleRef })
    )
  );
  const [shadowForm, setShadowForm] = useState(shadow);

  return (
    <>
      <div className="uidt-input flex-1 row align-center justify-end cursor-pointer select-none">
        <Popover.Toggle
          id={`shadow-${shadowIndex}-color`}
          positionPayload="bottom-left"
        >
          <div className="p-2 row flex-1 justify-between overflow-hidden uidt-input-hover-background">
            <div className="row gap-2 align-center ellipsis">
              <div
                className="palette-color"
                style={{
                  background: color.toString({ format: "hex" }),
                  ...getRectSize({ height: "var(--uidt-space-5)" }),
                }}
              ></div>
              {shadow.color}
            </div>

            {shadow.colorOpacity.toFixed(2)}
          </div>
        </Popover.Toggle>
        <Popover.Toggle
          id={`shadow-${shadowIndex}-dimensions`}
          positionPayload="bottom-right"
        >
          <div className="row uidt-input-hover-background">
            <div
              className="p-2 row gap-3 align-center"
              style={{
                borderLeft: "1px solid var(--uidt-base-border)",
              }}
            >
              <ArrowRange size={ICON_SIZE_SM} /> {shadow.shadowX}
            </div>
            <div
              className="p-2 row gap-3 align-center"
              style={{
                borderLeft: "1px solid var(--uidt-base-border)",
              }}
            >
              <MdHeight size={ICON_SIZE_SM} />

              {shadow.shadowY}
            </div>
            <div
              className="p-2 row gap-3 align-center"
              style={{
                borderLeft: "1px solid var(--uidt-base-border)",
              }}
            >
              <MdBlurOn size={ICON_SIZE_SM} />
              {shadow.blur}
            </div>
            <div
              className="p-2 row gap-3 align-center"
              style={{
                borderLeft: "1px solid var(--uidt-base-border)",
              }}
            >
              <MdSunny size={ICON_SIZE_SM} />
              {shadow.spread}
            </div>
            <div
              className="p-2 row gap-1 align-center"
              style={{
                borderLeft: "1px solid var(--uidt-base-border)",
              }}
            >
              <input type="checkbox" checked={shadowForm.inset} />
              <label>inset</label>
            </div>
          </div>
        </Popover.Toggle>
      </div>
      <Popover.Body id={`shadow-${shadowIndex}-color`} zIndex={5000}>
        <div
          className="popover-body border-box p-8"
          style={{
            width: "350px",
          }}
          data-disableoutside={true}
        >
          <ColorPickerLinear
            color={color}
            onChange={setColor}
            onChangeComplete={() =>
              setShadow({
                ...shadow,
                color: color.toString({ format: "hex" }),
              })
            }
          />
          <div className="row justify-end">
            <Popover>
              <Popover.Toggle id="token-selector">
                <button className="action-ghost-button">
                  <MdSelectAll size={ICON_SIZE_SM} />
                  tokens
                </button>
              </Popover.Toggle>
              <Popover.Body id="token-selector" zIndex={6000}>
                <TokenSelector
                  tokensFamilies={tokenFamilies.filter(
                    (family) => family.category === "color"
                  )}
                  onSelect={(color) =>
                    setShadow({
                      ...shadow,
                      color: color.label,
                    })
                  }
                />
              </Popover.Body>
            </Popover>
          </div>
          <FormComponent label="opacity">
            <div className="row align-center gap-3">
              <Slider
                min={0}
                max={1}
                value={shadowForm.colorOpacity}
                step={0.01}
                onChangeComplete={() =>
                  setShadow({
                    ...shadow,
                    colorOpacity: shadowForm.colorOpacity,
                  })
                }
                onChange={(val) => {
                  if (typeof val === "number") {
                    setShadowForm({
                      ...shadowForm,
                      colorOpacity: Number(val.toFixed(2)),
                    });
                  }
                }}
                styles={{
                  handle: HANDLE_SLIDER_LIST,
                  rail: RAIL_SLIDER_LIST,
                  track: TRACK_SLIDER_LIST,
                }}
              />
              {shadowForm.colorOpacity.toFixed(2)}
            </div>
          </FormComponent>
        </div>
      </Popover.Body>
      <Popover.Body id={`shadow-${shadowIndex}-dimensions`} zIndex={5000}>
        <div
          className="popover-body border-box p-8"
          style={{
            width: "350px",
          }}
          data-disableoutside={true}
        >
          <div className="row gap-2">
            <FormComponent label="X">
              <InputMeasurement
                measurement={{
                  unit: "PX",
                  value: shadowForm.shadowX,
                }}
                setMeasurement={(measurement) =>
                  setShadowForm({
                    ...shadowForm,
                    shadowX: measurement.value,
                  })
                }
                onBlur={() => setShadow(shadowForm)}
                disableUnit={true}
              />
            </FormComponent>
            <FormComponent label="Y">
              <InputMeasurement
                measurement={{
                  unit: "PX",
                  value: shadowForm.shadowY,
                }}
                setMeasurement={(measurement) =>
                  setShadowForm({
                    ...shadowForm,
                    shadowY: measurement.value,
                  })
                }
                onBlur={() => setShadow(shadowForm)}
                disableUnit={true}
              />
            </FormComponent>
            <FormComponent label="Blur">
              <InputMeasurement
                measurement={{
                  unit: "PX",
                  value: shadowForm.blur,
                }}
                setMeasurement={(measurement) =>
                  setShadowForm({
                    ...shadowForm,
                    blur: measurement.value,
                  })
                }
                onBlur={() => setShadow(shadowForm)}
                disableUnit={true}
              />
            </FormComponent>
            <FormComponent label="Spread">
              <InputMeasurement
                measurement={{
                  unit: "PX",
                  value: shadowForm.spread,
                }}
                setMeasurement={(measurement) =>
                  setShadowForm({
                    ...shadowForm,
                    spread: measurement.value,
                  })
                }
                onBlur={() => setShadow(shadowForm)}
                disableUnit={true}
              />
            </FormComponent>
            <div className="row gap-1 align-center">
              <input
                type="checkbox"
                checked={shadowForm.inset}
                onChange={() => {
                  setShadowForm({
                    ...shadowForm,
                    inset: !shadowForm.inset,
                  });
                  setShadow({
                    ...shadow,
                    inset: !shadowForm.inset,
                  });
                }}
              />
              <label>inset</label>
            </div>
          </div>
        </div>
      </Popover.Body>
    </>
  );
}

export default InputShadow;
