import ColorIO from "colorjs.io";
import { getRectSize, ICON_SIZE_SM } from "../../ui/UiConstants";
import { MdColorize, MdSelectAll } from "react-icons/md";
import { useColorPickerStore } from "./ColorPickerStore";
import Popover from "../../ui/kit/Popover";
import ColorPickerLinear from "./ColorPickerLinear";
import TokenSelector from "../../ui/kit/TokenSelector";
import { DesignToken, TokenFamily } from "../../domain/DesignSystemDomain";
import { getDesignSystemTokens } from "../../util/DesignSystemUtils";
import { useParams, useSearchParams } from "react-router-dom";
import { useFindDesignSystem } from "../design-system/DesignSystemQueries";
import { useRef } from "react";

function InputColorPopover({
  color,
  index,
}: {
  color: ColorIO;
  index: number;
}) {
  const colorString = color?.toString({ format: "hex" }) ?? "#dddddd";
  const { activePipette, setActivePipette, setColor } = useColorPickerStore();
  const [searchParams] = useSearchParams();
  const { designSystemPath } = useParams();
  const currentDesignSystem =
    searchParams.get("currentDesignSystem") || designSystemPath;
  const { designSystem } = useFindDesignSystem(
    currentDesignSystem ?? undefined
  );
  const tokenFamilies: TokenFamily[] = getDesignSystemTokens(designSystem, true);

  // Ref pour le fallback <input type="color">
  const colorInputRef = useRef<HTMLInputElement | null>(null);

  async function pickColor() {
    if ("EyeDropper" in window) {
      try {
        const eyeDropper = window.EyeDropper
          ? new window.EyeDropper()
          : undefined;
        if (eyeDropper) {
          setActivePipette(index === activePipette ? undefined : index);
          const { sRGBHex } = await eyeDropper.open();
          setColor(new ColorIO(sRGBHex), index);
        }
      } catch (err) {
        console.log("Sélection annulée", err);
      }
    } else {
      // Fallback Mac/Safari/Tauri : on déclenche le color picker natif
      if (colorInputRef.current) {
        // nouvelle API showPicker si disponible
        (colorInputRef.current as any).showPicker?.() || colorInputRef.current.click();
      }
    }
  }

  return (
    <div className="row uidt-input cursor-pointer" style={{ position: "relative" }}>
      {/* input transparent pour fallback color picker */}
      <input
        type="color"
        ref={colorInputRef}
        value={colorString}
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: "none",
        }}
        onChange={(e) => setColor(new ColorIO(e.target.value), index)}
      />

      <Popover.Toggle
        id={`color-selector-${index}`}
        positionPayload="bottom-right"
      >
        <div
          className="row align-center gap-2 p-2"
          style={{
            width: "100px",
          }}
        >
          <div
            className="palette-color"
            style={{
              background: colorString,
              ...getRectSize({ height: "var(--uidt-space-6)" }),
            }}
          ></div>
          {colorString}
        </div>
      </Popover.Toggle>
      <Popover.Body id={`color-selector-${index}`} zIndex={2000}>
        <div
          className="popover-body"
          style={{
            width: "300px",
          }}
        >
          <ColorPickerLinear
            color={color}
            onChange={(value) => setColor(value, index)}
          />
          <Popover>
            <Popover.Toggle id="token-selector">
              <button className="action-ghost-button">
                <MdSelectAll size={ICON_SIZE_SM} />
                tokens
              </button>
            </Popover.Toggle>
            <Popover.Body
              id="token-selector"
              zIndex={3000}
              skipDisableOutside={true}
            >
              <TokenSelector
                tokensFamilies={tokenFamilies}
                onSelect={(token: DesignToken) =>
                  setColor(new ColorIO(token.value), index)
                }
              />
            </Popover.Body>
          </Popover>
        </div>
      </Popover.Body>
      <button
        className="action-ghost-button"
        data-active={index === activePipette}
        onClick={pickColor}
        style={{
          borderRadius: "0px",
          overflow: "hidden",
          height: "100%",
          borderLeft: "1px solid var(--uidt-base-border)",
        }}
      >
        <MdColorize size={ICON_SIZE_SM} />
      </button>
    </div>
  );
}

export default InputColorPopover;
