import { useRef, useState } from "react";
import styles from "./ShadeComponent.module.css";
import { useDesignSystemContext } from "./DesignSystemContext";
import classNames from "classnames";
import { ICON_SIZE_SM } from "../../ui/UiConstants";
import { MdContentCopy } from "react-icons/md";
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
  paletteName: string;
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
  const { shadesMode, palettesMode } = useDesignSystemContext();

  const colorPreviewClassname = classNames(styles.colorPreview, {
    [styles.elevateColor]:
      shadesMode === "default" && isHover && palettesMode === "default",
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
      [styles.addColor]: shadesMode === "add" && isHover,
    },
    {
      [styles.removeColor]: shadesMode === "remove" && isHover,
    },
    {
      [styles.draggable]:
        (shadesMode === "drag" && isHover && dragIndex === undefined) ||
        dragIndex === index,
    },
    {
      [styles.dragHover]:
        shadesMode === "drag" && hoverIndex === index && dragIndex !== index,
    }
  );

  const strongClassname = classNames({
    error: error,
  });

  function handleClickEvent() {
    //Remove palette
    if (shadesMode === "remove") {
      remove(index);
      submitEvent();
    } else if (shadesMode === "add") {
      insert(index + 1, {
        label: generateUniqueShadeKey(shades, `${(index + 1) * 100}`),
        color: "#DDDDDD",
      });
      submitEvent();
    }
  }

  function handleHoverEvent() {
    setIsHover(true);
    if (shadesMode === "drag" && dragIndex !== undefined) {
      setHoverIndex(index);
    }
  }

  function handleMouseDown() {
    if (shadesMode === "drag") {
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
      <div
        className={colorPreviewClassname}
        style={{
          background: getValues(`shades.${index}.color`),
        }}
      />
      <div className="row space-between">
        <div className="column">
          <strong className={strongClassname}>
            {shadesMode === "edit" ? (
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
                disabled={shadesMode !== "edit"}
                autoComplete="off"
                onBlur={submitEvent}
              />
            ) : (
              <div className={"inherit-input-placeholder"}>
                {getValues(`shades.${index}.label`)}
              </div>
            )}
          </strong>

          <small className="text-color-light">
            {shadesMode === "edit" ? (
              <input
                {...register(`shades.${index}.color`)}
                type="text"
                className="inherit-input"
                onFocus={(e) => e.target.select()}
                disabled={shadesMode !== "edit"}
                autoComplete="off"
                onBlur={submitEvent}
              />
            ) : (
              <div className="inherit-input-placeholder">
                {getValues(`shades.${index}.color`)}
              </div>
            )}
          </small>
        </div>
        {isHover && shadesMode === "default" && (
          <Popover>
            <Popover.Toggle id="copy-shade" positionPayload="top-right">
              <button className="action-button">
                <MdContentCopy size={ICON_SIZE_SM} />
              </button>
            </Popover.Toggle>
            <Popover.Body id="copy-shade">
              <div className="popover-body">
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
