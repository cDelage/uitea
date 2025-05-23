import classNames from "classnames";
import { ComponentMode, useDesignSystemContext } from "../DesignSystemContext";
import styles from "../InputPopover.module.css";
import { DraggableTools } from "../../../util/DraggableContext";
import { UseFormSetValue } from "react-hook-form";
import { Shadow, Shadows } from "../../../domain/DesignSystemDomain";
import { ICON_SIZE_SM } from "../../../ui/UiConstants";
import { MdDragIndicator } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import InputShadow from "./InputShadow";
import { RefObject } from "react";

function ShadowPopoverTab({
  shadowIndex,
  shadowsArrayIndex,
  draggableTools,
  handleSubmit,
  onAdd,
  onRemove,
  setValue,
  shadow,
  styleRef
}: {
  shadowIndex: number;
  shadowsArrayIndex: number;
  draggableTools: DraggableTools;
  handleSubmit: () => void;
  onAdd: (index: number) => void;
  onRemove: (index: number) => void;
  shadow: Shadow;
  setValue: UseFormSetValue<{ shadows: Shadows[] }>;
  styleRef?: RefObject<HTMLDivElement | null>;
}) {
  const { editMode } = useDesignSystemContext();
  const [searchParams] = useSearchParams();
  const keyboardActions = searchParams.get("keyboardAction");

  function getEffectPopoverTabMode(): ComponentMode {
    if (editMode) {
      if (
        (draggableTools.hoverIndex === "remove" &&
          draggableTools.dragIndex === shadowIndex) ||
        keyboardActions === "d"
      ) {
        return "remove";
      } else if (draggableTools.dragIndex === shadowIndex) {
        return "drag";
      } else if (
        draggableTools.hoverIndex === shadowIndex &&
        draggableTools.dragIndex !== shadowIndex
      ) {
        return "drag-hover";
      } else if (keyboardActions === "i") {
        return "add";
      }

      return "edit";
    } else {
      return "default";
    }
  }

  const shadowPopoverTabMode = getEffectPopoverTabMode();

  const shadowTabStyle = classNames(
    styles.tabEffectContainer,
    {
      remove:
        shadowPopoverTabMode === "remove" &&
        draggableTools.dragIndex === shadowIndex,
    },
    {
      "remove-hover":
        shadowPopoverTabMode === "remove" && keyboardActions === "d",
    },
    {
      draggable: shadowPopoverTabMode === "drag",
    },
    {
      "drag-hover-top": shadowPopoverTabMode === "drag-hover",
    },
    {
      add: shadowPopoverTabMode === "add",
    }
  );

  function handleHoverEvent() {
    if (draggableTools.dragIndex !== undefined) {
      draggableTools.setHoverIndex(shadowIndex);
    }
  }

  function handleMouseDown() {
    if (shadowPopoverTabMode === "edit") {
      draggableTools.setDragIndex(shadowIndex);
    }
  }

  function handleClick() {
    if (shadowPopoverTabMode === "add") {
      onAdd(shadowIndex + 1);
    } else if (shadowPopoverTabMode === "remove") {
      onRemove(shadowIndex);
    }
  }

  return (
    <div
      className={shadowTabStyle}
      onMouseEnter={handleHoverEvent}
      onClick={handleClick}
    >
      <InputShadow
        shadow={shadow}
        shadowIndex={shadowIndex}
        styleRef={styleRef}
        setShadow={(shadow: Shadow) => {
          setValue(
            `shadows.${shadowsArrayIndex}.shadowsArray.${shadowIndex}`,
            shadow
          );
          handleSubmit()
        }}
      />
      <button
        className="action-button"
        onMouseDown={handleMouseDown}
        type="button"
      >
        <MdDragIndicator size={ICON_SIZE_SM} />
      </button>
    </div>
  );
}

export default ShadowPopoverTab;
