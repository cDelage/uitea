import classNames from "classnames";
import styles from "./ShadeComponent.module.css";
import { MdAdd, MdDelete } from "react-icons/md";
import { DraggableTools } from "../../util/DraggableContext";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import { UseFieldArrayReturn } from "react-hook-form";
import { Palette } from "../../domain/DesignSystemDomain";
import { generateUniqueShadeKey } from "../../util/DesignSystemUtils";
import { MouseEvent } from "react";

function ShadeAddRemove({
  draggableTools,
  shadesFieldArray,
  handleSubmit
}: {
  draggableTools: DraggableTools;
  shadesFieldArray: UseFieldArrayReturn<Palette, "shades", "id">;
  handleSubmit: () => void;
}) {
  const shadeClassNames = classNames(
    styles.shade,
    {
      [styles.shadeAdd]: draggableTools.dragIndex === undefined,
    },
    {
      [styles.shadeRemove]: draggableTools.dragIndex !== undefined,
    }
  );

  const background = !draggableTools.dragIndex
    ? "var(--add-bg)"
    : "var(--remove-bg)";

  function handleMouseEnter() {
    if (draggableTools.dragIndex) {
      draggableTools.setHoverIndex("remove");
    }
  }

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (!draggableTools.dragIndex) {
      const label = generateUniqueShadeKey(
        shadesFieldArray.fields,
        `palette-${shadesFieldArray.fields.length + 1}`
      );
      shadesFieldArray.append({
        label,
        color: "#DDDDDD",
      });
      handleSubmit();
    }
  }

  return (
    <div
      className={shadeClassNames}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <div
        className={styles.colorPreview}
        style={{
          background,
        }}
      ></div>
      {!draggableTools.dragIndex ? (
        <strong className="row align-center h-full">
          <MdAdd size={ICON_SIZE_MD} />
          Teint
        </strong>
      ) : (
        <strong className="row align-center h-full">
          <MdDelete size={ICON_SIZE_MD} />
          Teint
        </strong>
      )}
    </div>
  );
}

export default ShadeAddRemove;
