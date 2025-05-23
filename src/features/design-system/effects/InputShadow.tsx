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
import InputNumber from "../../color-picker/InputNumber";

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
  const [opacity, setOpacity] = useState(shadow.colorOpacity);

  return (
    <>
      <div className="uidt-input flex-1 row align-center justify-end cursor-pointer select-none">
        <Popover.Toggle
          id={`shadow-${shadowIndex}-color`}
          positionPayload="bottom-left"
        >
          <div className="p-2 row flex-1 justify-between overflow-hidden">
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
                  tokensFamilies={tokenFamilies}
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
                value={opacity}
                step={0.01}
                onChangeComplete={() =>
                  setShadow({
                    ...shadow,
                    colorOpacity: opacity,
                  })
                }
                onChange={(val) => {
                  console.log(val, typeof val);
                  if (typeof val === "number") {
                    setOpacity(Number(val.toFixed(2)));
                  }
                }}
                styles={{
                  handle: HANDLE_SLIDER_LIST,
                  rail: RAIL_SLIDER_LIST,
                  track: TRACK_SLIDER_LIST,
                }}
              />
              {opacity.toFixed(2)}
            </div>
          </FormComponent>
          <div className="row align-center">
            <FormComponent label="X axis" className="flex-1">
              <InputNumber value={shadow.shadowX} setValue={() => {}} />
            </FormComponent>
            <FormComponent label="Y axis" className="flex-1">
              <div className="uidt-input p-2">{shadow.shadowY}</div>
            </FormComponent>
          </div>
        </div>
      </Popover.Body>
    </>
  );
}

export default InputShadow;
