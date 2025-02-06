import { useRef, useState } from "react";
import styles from "./ShadeComponent.module.css";
import { ComponentMode } from "./DesignSystemContext";
import classNames from "classnames";
import { ButtonSignifiantAction } from "../../ui/kit/Buttons";
import { getRectPosition } from "../../util/PositionUtil";
import { ICON_SIZE_MD, ICON_SIZE_SM } from "../../ui/UiConstants";
import { MdAdd, MdContentCopy, MdDeleteOutline } from "react-icons/md";
import { Palette, Shade } from "../../domain/DesignSystemDomain";
import {
  UseFieldArrayInsert,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";
import { useDraggableContext } from "../../util/DraggableContext";
import { generateUniqueShadeKey } from "../../util/DesignSystemUtils";
import Popover from "../../ui/kit/Popover";
import CopyableLabel from "../../ui/kit/CopyableLabel";

function ShadeComponent({
  paletteMode,
  isAllColorPalettesActive,
  index,
  register,
  insert,
  remove,
  getValues,
  submitEvent,
  shades,
  error,
  paletteName,
}: {
  paletteMode: ComponentMode;
  paletteName: string;
  isAllColorPalettesActive: boolean;
  index: number;
  register: UseFormRegister<Palette>;
  insert: UseFieldArrayInsert<Palette, "shades">;
  remove: UseFieldArrayRemove;
  getValues: UseFormGetValues<Palette>;
  submitEvent: () => void;
  shades: Shade[];
  error?: string;
}) {
  const [isHover, setIsHover] = useState(false);

  const colorPreviewClassname = classNames(styles.colorPreview, {
    [styles.elevateColor]:
      paletteMode === "default" && isHover && !isAllColorPalettesActive,
  });
  const shadeRef = useRef<HTMLDivElement>(null);
  const { dragIndex, hoverIndex, setDragIndex, setHoverIndex } =
    useDraggableContext();

  const shadeToken: string = `palette-${paletteName}-${getValues(
    `shades.${index}.label`
  )}`;

  const shadeClassname = classNames(
    styles.shade,
    {
      [styles.addColor]: paletteMode === "add" && isHover,
    },
    {
      [styles.removeColor]: paletteMode === "remove" && isHover,
    },
    {
      [styles.draggable]:
        (paletteMode === "drag" && isHover && dragIndex === undefined) ||
        dragIndex === index,
    },
    {
      [styles.dragHover]:
        paletteMode === "drag" && hoverIndex === index && dragIndex !== index,
    }
  );

  const strongClassname = classNames({
    error: error,
  });

  function handleClickEvent() {
    //Remove palette
    if (paletteMode === "remove") {
      remove(index);
      submitEvent();
    } else if (paletteMode === "add") {
      insert(index + 1, {
        label: generateUniqueShadeKey(shades, `${(index + 1) * 100}`),
        color: "#DDDDDD",
      });
      submitEvent();
    }
  }

  function handleHoverEvent() {
    setIsHover(true);
    if (paletteMode === "drag" && dragIndex !== undefined) {
      setHoverIndex(index);
    }
  }

  function handleMouseDown() {
    if (paletteMode === "drag") {
      setDragIndex(index);
    }
  }

  return (
    <div
      className={shadeClassname}
      ref={shadeRef}
      onMouseEnter={handleHoverEvent}
      onMouseDown={handleMouseDown}
      onDragStart={(event) => {
        event.preventDefault();
      }}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleClickEvent}
    >
      {paletteMode === "remove" && isHover && (
        <ButtonSignifiantAction
          theme="remove"
          type="button"
          position={getRectPosition(
            "top-right",
            shadeRef.current?.getBoundingClientRect(),
            "translate(50%, -50%)"
          )}
        >
          <MdDeleteOutline size={ICON_SIZE_MD} />
        </ButtonSignifiantAction>
      )}
      {paletteMode === "add" && isHover && (
        <ButtonSignifiantAction
          theme="add"
          type="button"
          position={getRectPosition(
            "top-right",
            shadeRef.current?.getBoundingClientRect(),
            "translate(50%, -50%)"
          )}
        >
          <MdAdd size={ICON_SIZE_MD} />
        </ButtonSignifiantAction>
      )}
      <div
        className={colorPreviewClassname}
        style={{
          background: getValues(`shades.${index}.color`),
        }}
      />
      <div className="row space-between">
        <div className="column gap-1">
          <strong className={strongClassname}>
            {paletteMode === "edit" ? (
              <input
                {...register(`shades.${index}.label`, {
                  required: true,
                  validate: (label: string) => {
                    const duplicates = shades.filter(
                      (_, i) => i !== index && shades[i].label === label
                    );
                    return (
                      duplicates.length === 0 ||
                      "Shades key can't be duplicated"
                    );
                  },
                })}
                className="inherit-input"
                type="text"
                onFocus={(e) => e.target.select()}
                disabled={paletteMode !== "edit"}
                autoComplete="off"
                onBlur={submitEvent}
              />
            ) : (
              <div className={styles.readOnly}>
                {getValues(`shades.${index}.label`)}
              </div>
            )}
          </strong>

          <small className="text-color-light">
            {paletteMode === "edit" ? (
              <input
                {...register(`shades.${index}.color`)}
                type="text"
                className="inherit-input"
                onFocus={(e) => e.target.select()}
                disabled={paletteMode !== "edit"}
                autoComplete="off"
                onBlur={submitEvent}
              />
            ) : (
              <div className={styles.readOnly}>
                {getValues(`shades.${index}.color`)}
              </div>
            )}
          </small>
        </div>
        {isHover && paletteMode === "default" && (
          <Popover>
            <Popover.Toggle id="copy-shade" positionPayload="top-right">
              <button className="action-button">
                <MdContentCopy size={ICON_SIZE_SM} />
              </button>
            </Popover.Toggle>
            <Popover.Body id="copy-shade">
              <div className="column gap-3 p-3 justify-end">
                <CopyableLabel copyable={shadeToken} />
                <CopyableLabel copyable={getValues(`shades.${index}.color`)} />
              </div>
            </Popover.Body>
          </Popover>
        )}
      </div>
    </div>
  );
}

export default ShadeComponent;
