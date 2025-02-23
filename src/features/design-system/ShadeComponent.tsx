import { MouseEvent, useRef } from "react";
import styles from "./ShadeComponent.module.css";
import { useDesignSystemContext } from "./DesignSystemContext";
import classNames from "classnames";
import { Palette, Shade } from "../../domain/DesignSystemDomain";
import { UseFormGetValues, UseFormRegister } from "react-hook-form";
import { useDraggableContext } from "../../util/DraggableContext";
import { stopPropagation } from "../../util/DesignSystemUtils";
import CopyableTopTooltip from "../../ui/kit/CopyableTopTooltip";

function ShadeComponent({
  index,
  register,
  getValues,
  submitEvent,
  shades,
  error,
  paletteName,
}: {
  paletteName: string;
  index: number;
  register: UseFormRegister<Palette>;
  getValues: UseFormGetValues<Palette>;
  submitEvent: () => void;
  shades: Shade[];
  error?: string;
}) {
  const { editMode } = useDesignSystemContext();

  const shadeRef = useRef<HTMLDivElement>(null);
  const { dragIndex, hoverIndex, setDragIndex, setHoverIndex } =
    useDraggableContext();

  const shadeToken: string = `palette-${paletteName}-${getValues(
    `shades.${index}.label`
  )}`;

  const shadeClassname = classNames(
    styles.shade,
    {
      draggable: dragIndex === index && hoverIndex !== "remove",
    },
    {
      remove: dragIndex === index && hoverIndex === "remove",
    },
    {
      "drag-hover-left": hoverIndex === index && dragIndex !== index,
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
    setDragIndex(index);
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
        </div>
      </div>
    </CopyableTopTooltip>
  );
}

export default ShadeComponent;
