import { MouseEvent, useRef } from "react";
import styles from "./ShadeComponent.module.css";
import { ComponentMode, useDesignSystemContext } from "./DesignSystemContext";
import classNames from "classnames";
import { Palette, Tint } from "../../domain/DesignSystemDomain";
import {
  UseFieldArrayReturn,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { useDraggableContext } from "../../util/DraggableContext";
import {
  generateUniqueTintKey,
  stopPropagation,
} from "../../util/DesignSystemUtils";
import CopyableTopTooltip from "../../ui/kit/CopyableTopTooltip";
import Popover from "../../ui/kit/Popover";
import ColorPickerOld from "./ColorPickerOld";
import { useSearchParams } from "react-router-dom";

function ShadeComponent({
  index,
  register,
  getValues,
  submitEvent,
  shades,
  error,
  paletteName,
  setValue,
  shadesFieldArray,
}: {
  paletteName: string;
  index: number;
  register: UseFormRegister<Palette>;
  getValues: UseFormGetValues<Palette>;
  submitEvent: () => void;
  setValue: UseFormSetValue<Palette>;
  shades: Tint[];
  error?: string;
  shadesFieldArray: UseFieldArrayReturn<Palette, "shades", "id">;
}) {
  const { editMode } = useDesignSystemContext();

  const shadeRef = useRef<HTMLDivElement>(null);
  const { dragIndex, hoverIndex, setDragIndex, setHoverIndex } =
    useDraggableContext();

  const shadeToken: string = `palette-${paletteName}-${getValues(
    `shades.${index}.label`
  )}`;

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
        shadesFieldArray.fields,
        `palette-${index + 1}`
      );
      shadesFieldArray.insert(
        index,
        {
          label,
          color: "#DDDDDD",
        },
        { shouldFocus: false }
      );
      submitEvent();
    } else if (shadeComponentMode === "remove") {
      shadesFieldArray.remove(index);
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
            background: getValues(`shades.${index}.color`),
          }}
        />
        <div className="column" onMouseDown={stopPropagation}>
          <strong className={strongClassname}>
            <input
              {...register(`shades.${index}.label`, {
                required: true,
                validate: (label: string) => {
                  const duplicates = shades.filter(
                    (_, i) => i !== index && shades[i].label === label
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
          <Popover>
            <Popover.Toggle
              id="color-picker"
              disableButtonClosure={true}
              keyPopover={shadeToken}
            >
              <small className="text-color-light">
                <input
                  {...register(`shades.${index}.color`)}
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
            <Popover.Body id="color-picker">
              <div className="popover-body">
                <ColorPickerOld
                  setColor={(color: string) => {
                    if (editMode) setValue(`shades.${index}.color`, color);
                  }}
                  color={getValues(`shades.${index}.color`)}
                />
              </div>
            </Popover.Body>
          </Popover>
        </div>
      </div>
    </CopyableTopTooltip>
  );
}

export default ShadeComponent;
