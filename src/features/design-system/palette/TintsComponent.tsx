import { MouseEvent, useRef, useState } from "react";
import styles from "./TintsComponent.module.css";
import { ComponentMode, useDesignSystemContext } from "../DesignSystemContext";
import classNames from "classnames";
import { Palette, Tint } from "../../../domain/DesignSystemDomain";
import {
  UseFieldArrayReturn,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { useDraggableContext } from "../../../util/DraggableContext";
import {
  generateUniqueTintKey,
  stopPropagation,
} from "../../../util/DesignSystemUtils";
import CopyableTopTooltip from "../../../ui/kit/CopyableTopTooltip";
import Popover from "../../../ui/kit/Popover";
import { useSearchParams } from "react-router-dom";
import ColorPickerLinear from "../../color-picker/ColorPickerLinear";
import ColorIO from "colorjs.io";
import { getRectSize } from "../../../ui/UiConstants";

function TintComponent({
  index,
  register,
  getValues,
  submitEvent,
  tints,
  error,
  paletteName,
  setValue,
  tintsFieldArray,
}: {
  paletteName: string;
  index: number;
  register: UseFormRegister<Palette>;
  getValues: UseFormGetValues<Palette>;
  submitEvent: () => void;
  setValue: UseFormSetValue<Palette>;
  tints: Tint[];
  error?: string;
  tintsFieldArray: UseFieldArrayReturn<Palette, "tints", "id">;
}) {
  const { editMode } = useDesignSystemContext();

  const shadeRef = useRef<HTMLDivElement>(null);
  const { dragIndex, hoverIndex, setDragIndex, setHoverIndex } =
    useDraggableContext();

  const shadeToken: string = `palette-${paletteName}-${getValues(
    `tints.${index}.label`
  )}`;

  const [colorIo, setColorIo] = useState(
    new ColorIO(getValues(`tints.${index}.color`))
  );

  const [searchParams] = useSearchParams();

  const keyboardAction = searchParams.get("keyboardAction");

  function getShadeComponentMode(): ComponentMode {
    if (editMode) {
      if (!dragIndex && keyboardAction === "i") {
        return "add";
      } else if (
        (dragIndex === index && hoverIndex === "remove") ||
        (!dragIndex && keyboardAction === "d")
      ) {
        return "remove";
      } else if (dragIndex === index && hoverIndex !== "remove") {
        return "drag";
      } else if (hoverIndex === index && dragIndex !== index) {
        return "drag-hover";
      } else {
        return "edit";
      }
    } else {
      return "default";
    }
  }

  const shadeComponentMode = getShadeComponentMode();

  const shadeClassname = classNames(
    styles.shade,
    {
      draggable: shadeComponentMode === "drag",
    },
    {
      "remove-hover": shadeComponentMode === "remove",
    },
    {
      remove: shadeComponentMode === "remove" && dragIndex === index,
    },
    {
      "drag-hover-left": shadeComponentMode === "drag-hover",
    },
    {
      "add-right": shadeComponentMode === "add",
    }
  );

  const strongClassname = classNames({
    error: error,
  });

  const colorPreviewClassname = classNames(styles.colorPreview, "cursor-move");

  function handleHoverEvent() {
    if (dragIndex !== undefined) {
      setHoverIndex(index);
    }
  }

  function handleMouseDown(e: MouseEvent<HTMLInputElement>) {
    e.stopPropagation();
    if (shadeComponentMode === "edit") {
      setDragIndex(index);
    }
  }

  function handleClick() {
    if (shadeComponentMode === "add") {
      const label = generateUniqueTintKey(
        tintsFieldArray.fields,
        `palette-${index + 1}`
      );
      tintsFieldArray.insert(
        index,
        {
          label,
          color: "#DDDDDD",
        },
        { shouldFocus: false }
      );
      submitEvent();
    } else if (shadeComponentMode === "remove") {
      tintsFieldArray.remove(index);
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
              {...register(`tints.${index}.label`, {
                required: true,
                validate: (label: string) => {
                  const duplicates = tints.filter(
                    (_, i) => i !== index && tints[i].label === label
                  );
                  return (
                    duplicates.length === 0 || "Shades key can't be duplicated"
                  );
                },
              })}
              className="inherit-input"
              type="text"
              autoComplete="off"
              onBlur={submitEvent}
              readOnly={!editMode && !dragIndex}
              onMouseDown={(e) => {
                if (e.currentTarget.readOnly) {
                  e.preventDefault();
                }
              }}
            />
          </strong>
          <Popover
            onClose={() => {
              setValue(
                `tints.${index}.color`,
                colorIo.toString({ format: "hex" })
              );
              submitEvent();
            }}
          >
            <Popover.Toggle id="color-picker" keyPopover={shadeToken}>
              <small className="text-color-light">
                <input
                  {...register(`tints.${index}.color`)}
                  type="text"
                  className="inherit-input"
                  autoComplete="off"
                  onBlur={submitEvent}
                  readOnly={!editMode && !dragIndex}
                  onMouseDown={(e) => {
                    if (e.currentTarget.readOnly) {
                      e.preventDefault();
                    }
                  }}
                />
              </small>
            </Popover.Toggle>
            <Popover.Body id="color-picker" zIndex={100}>
              <div
                className="popover-body"
                data-disableoutside={true}
                style={{
                  width: "280px",
                }}
              >
                <ColorPickerLinear color={colorIo} onChange={setColorIo} />
                <div className="row justify-center align-center gap-2">
                  <div
                    className="palette-color"
                    style={{
                      background: colorIo.toString({
                        format: "hex",
                      }),
                      ...getRectSize({ height: "var(--uidt-space-9)" }),
                    }}
                  ></div>
                  <strong>
                    {colorIo.toString({
                      format: "hex",
                    })}
                  </strong>
                </div>
              </div>
            </Popover.Body>
          </Popover>
        </div>
      </div>
    </CopyableTopTooltip>
  );
}

export default TintComponent;
