import { useRef, useState } from "react";
import styles from "./ColorShade.module.css";
import { ComponentMode } from "./DesignSystemContext";
import classNames from "classnames";
import { ButtonSignifiantAction } from "../../ui/kit/Buttons";
import { getRectPosition } from "../../ui/kit/PositionUtil";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { ColorPalette } from "../../domain/DesignSystemDomain";
import {
  UseFieldArrayInsert,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";

function ColorShade({
  paletteMode,
  isAllColorPalettesActive,
  index,
  register,
  insert,
  remove,
  getValues,
}: {
  paletteMode: ComponentMode;
  isAllColorPalettesActive: boolean;
  index: number;
  register: UseFormRegister<ColorPalette>;
  insert: UseFieldArrayInsert<ColorPalette, "shades">;
  remove: UseFieldArrayRemove;
  getValues: UseFormGetValues<ColorPalette>;
}) {
  const [isHover, setIsHover] = useState(false);

  const colorPreviewClassname = classNames(styles.colorPreview, {
    [styles.elevateColor]:
      paletteMode === "default" && isHover && !isAllColorPalettesActive,
  });
  const shadeRef = useRef<HTMLDivElement>(null);

  const shadeClassname = classNames(
    styles.shade,
    {
      [styles.addColor]: paletteMode === "add" && isHover,
    },
    {
      [styles.removeColor]: paletteMode === "remove" && isHover,
    }
  );

  function handleClickEvent() {
    //Remove palette
    if (paletteMode === "remove") {
      remove(index);
    } else if (paletteMode === "add") {
      insert(index + 1, {
        label: `${(index + 1) * 100}`,
        color: "#DDDDDD",
      });
    }
  }

  return (
    <div
      className={shadeClassname}
      ref={shadeRef}
      onMouseEnter={() => setIsHover(true)}
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
      <div className="column gap-1">
        <strong>
          <input
            {...register(`shades.${index}.label`)}
            className="inherit-input"
            type="text"
            onFocus={(e) => e.target.select()}
            disabled={paletteMode !== "edit"}
            autoComplete="off"
          />
        </strong>
        <small className="text-color-light">
          <input
            {...register(`shades.${index}.color`)}
            type="text"
            className="inherit-input"
            onFocus={(e) => e.target.select()}
            disabled={paletteMode !== "edit"}
            autoComplete="off"
          />
        </small>
      </div>
    </div>
  );
}

export default ColorShade;
