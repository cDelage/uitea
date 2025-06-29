import { MouseEvent, useRef, useState } from "react";
import styles from "./TintsComponent.module.css";
import { ComponentMode, useDesignSystemContext } from "../DesignSystemContext";
import classNames from "classnames";
import { Tint } from "../../../domain/DesignSystemDomain";
import { UseFormRegisterReturn } from "react-hook-form";
import { DraggableTools } from "../../../util/DraggableContext";
import {
  generateUniqueTintKey,
  stopPropagation,
} from "../../../util/DesignSystemUtils";
import CopyableTopTooltip from "../../../ui/kit/CopyableTopTooltip";
import Popover from "../../../ui/kit/Popover";
import { useSearchParams } from "react-router-dom";
import ColorPickerLinear from "../../color-picker/ColorPickerLinear";
import ColorIO from "colorjs.io";
import { ICON_SIZE_SM } from "../../../ui/UiConstants";
import { MdLock } from "react-icons/md";

function TintComponent({
  index,
  submitEvent,
  error,
  paletteName,
  registerKey,
  setColor,
  getColor,
  getLabel,
  keyReadOnly,
  tokenStart,
  insertTint,
  removeTint,
  tintsArray,
  draggableTools,
}: {
  paletteName?: string;
  index?: number;
  submitEvent: () => void;
  error?: string;
  registerKey?: UseFormRegisterReturn<string>;
  setColor: (e: string) => void;
  getColor: () => string;
  getLabel: () => string;
  keyReadOnly?: string;
  tokenStart: "palette" | "color";
  tintsArray?: Tint[];
  insertTint?: (tint: Tint) => void;
  removeTint?: (index: number) => void;
  draggableTools?: DraggableTools;
}) {
  const { editMode } = useDesignSystemContext();

  const shadeRef = useRef<HTMLDivElement>(null);

  const shadeToken: string = paletteName
    ? `${tokenStart}-${paletteName}-${getLabel()}`
    : `${tokenStart}-${getLabel()}`;

  const [colorIo, setColorIo] = useState(() => {
    try {
      return new ColorIO(getColor());
    } catch {
      return new ColorIO("#DDDDDD");
    }
  });

  const [searchParams] = useSearchParams();

  const keyboardAction = searchParams.get("keyboardAction");

  function getTintComponentMode(): ComponentMode {
    if (editMode) {
      if (draggableTools?.dragIndex !== undefined && keyboardAction === "i") {
        return "add";
      } else if (
        (draggableTools?.dragIndex === index &&
          draggableTools?.hoverIndex === "remove") ||
        (draggableTools?.dragIndex !== undefined && keyboardAction === "d")
      ) {
        return "remove";
      } else if (
        draggableTools?.dragIndex === index &&
        draggableTools?.hoverIndex !== "remove"
      ) {
        return "drag";
      } else if (
        draggableTools?.hoverIndex === index &&
        draggableTools?.dragIndex !== index
      ) {
        return "drag-hover";
      } else {
        return "edit";
      }
    } else {
      return "default";
    }
  }

  const tintComponentMode = getTintComponentMode();

  const shadeClassname = classNames(
    styles.shade,
    {
      draggable: tintComponentMode === "drag" && tintsArray,
    },
    {
      "remove-hover": tintComponentMode === "remove" && removeTint,
    },
    {
      remove:
        tintComponentMode === "remove" &&
        draggableTools?.dragIndex === index &&
        removeTint,
    },
    {
      "drag-hover-left": tintComponentMode === "drag-hover" && tintsArray,
    },
    {
      "add-right": tintComponentMode === "add" && insertTint,
    }
  );

  const strongClassname = classNames("relative", {
    error: error,
  });

  const colorPreviewClassname = classNames(styles.colorPreview, "cursor-move");

  function handleHoverEvent() {
    if (draggableTools && draggableTools?.dragIndex !== undefined) {
      draggableTools?.setHoverIndex(index);
    }
  }

  function handleMouseDown(e: MouseEvent<HTMLInputElement>) {
    e.stopPropagation();
    if (draggableTools && tintComponentMode === "edit") {
      draggableTools.setDragIndex(index);
    }
  }

  function handleClick() {
    if (tintComponentMode === "add" && tintsArray && index !== undefined) {
      const label = generateUniqueTintKey(tintsArray, `${index + 1}`);
      insertTint?.({
        label,
        color: "#DDDDDD",
      });
      submitEvent();
    } else if (tintComponentMode === "remove" && index !== undefined) {
      removeTint?.(index);
      submitEvent();
    }
  }

  return (
    <CopyableTopTooltip tooltipValue={shadeToken}>
      <div
        className={shadeClassname}
        ref={shadeRef}
        onMouseEnter={handleHoverEvent}
        onMouseDown={handleMouseDown}
        onDragStart={(event) => {
          event.preventDefault();
        }}
        onClick={handleClick}
      >
        <div
          className={colorPreviewClassname}
          style={{
            background: colorIo.toString({ format: "hex" }),
          }}
        />
        <div className="column" onMouseDown={stopPropagation}>
          <strong className={strongClassname}>
            <input
              {...(registerKey ?? { value: keyReadOnly })}
              className="inherit-input"
              type="text"
              autoComplete="off"
              onBlur={submitEvent}
              readOnly={!editMode && !draggableTools?.dragIndex}
              disabled={!registerKey}
              onMouseDown={(e) => {
                if (e.currentTarget.readOnly) {
                  e.preventDefault();
                }
              }}
            />
            {!registerKey && (
              <div
                style={{
                  position: "absolute",
                  right: "0px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <MdLock
                  size={ICON_SIZE_SM}
                  color="var(--uidt-base-text-light)"
                />
              </div>
            )}
          </strong>
          <Popover
            onClose={() => {
              setColor(colorIo.toString({ format: "hex" }));
              submitEvent();
            }}
          >
            {editMode ? (
              <Popover.Toggle id="color-picker">
                <div className="input-hover">
                  <div className="text-color-light">{getColor()}</div>
                </div>
              </Popover.Toggle>
            ) : (
              <div className="text-color-light">{getColor()}</div>
            )}
            <Popover.Body id="color-picker" zIndex={100}>
              <div
                className="popover-body"
                data-disableoutside={true}
                style={{
                  width: "280px",
                }}
              >
                <ColorPickerLinear color={colorIo} onChange={setColorIo} />
              </div>
            </Popover.Body>
          </Popover>
        </div>
      </div>
    </CopyableTopTooltip>
  );
}

export default TintComponent;
