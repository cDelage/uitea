import classNames from "classnames";
import styles from "./TintsComponent.module.css";
import { MdAdd, MdDelete } from "react-icons/md";
import { DraggableTools } from "../../../util/DraggableContext";
import { ICON_SIZE_MD } from "../../../ui/UiConstants";
import { Tint } from "../../../domain/DesignSystemDomain";
import { generateUniqueTintKey } from "../../../util/DesignSystemUtils";
import { MouseEvent } from "react";

function TintsAddRemove({
  draggableTools,
  handleSubmit,
  tintArray,
  appendTint,
}: {
  draggableTools: DraggableTools;
  tintArray: Tint[];
  appendTint: (tint: Tint) => void;
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
    ? "var(--uidt-add-bg)"
    : "var(--uidt-remove-bg)";

  function handleMouseEnter() {
    if (draggableTools.dragIndex !== undefined) {
      draggableTools.setHoverIndex("remove");
    }
  }

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (draggableTools.dragIndex === undefined) {
      const label = generateUniqueTintKey(
        tintArray,
        `${tintArray.length + 1}`
      );
      appendTint({
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

export default TintsAddRemove;
