import classNames from "classnames";
import { ComponentMode, useDesignSystemContext } from "../DesignSystemContext";
import styles from "../InputPopover.module.css";
import { DraggableTools } from "../../../util/DraggableContext";
import { UseFormRegister } from "react-hook-form";
import { Effect } from "../../../domain/DesignSystemDomain";
import { EFFECT_TYPES, ICON_SIZE_SM } from "../../../ui/UiConstants";
import { MdDragIndicator } from "react-icons/md";
import { useSearchParams } from "react-router-dom";

function EffectsPopoverTab({
  itemIndex,
  effectIndex,
  draggableTools,
  register,
  handleSubmit,
  onAdd,
  onRemove,
}: {
  itemIndex: number;
  effectIndex: number;
  draggableTools: DraggableTools;
  register: UseFormRegister<{ effects: Effect[] }>;
  handleSubmit: () => void;
  onAdd: (index: number) => void;
  onRemove: (index: number) => void;
}) {
  const { editMode } = useDesignSystemContext();
  const [searchParams] = useSearchParams();
  const keyboardActions = searchParams.get("keyboardAction");

  function getEffectPopoverTabMode(): ComponentMode {
    if (editMode) {
      if (
        (draggableTools.hoverIndex === "remove" &&
          draggableTools.dragIndex === itemIndex) ||
        keyboardActions === "d"
      ) {
        return "remove";
      } else if (draggableTools.dragIndex === itemIndex) {
        return "drag";
      } else if (
        draggableTools.hoverIndex === itemIndex &&
        draggableTools.dragIndex !== itemIndex
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

  const effectPopoverTabMode = getEffectPopoverTabMode();

  const effectClassName = classNames(
    styles.tabEffectContainer,
    {
      remove:
        effectPopoverTabMode === "remove" &&
        draggableTools.dragIndex === itemIndex,
    },
    {
      "remove-hover":
        effectPopoverTabMode === "remove" && keyboardActions === "d",
    },
    {
      draggable: effectPopoverTabMode === "drag",
    },
    {
      "drag-hover-top": effectPopoverTabMode === "drag-hover",
    },
    {
      add: effectPopoverTabMode === "add",
    }
  );

  function handleHoverEvent() {
    if (effectPopoverTabMode === "drag-hover") {
      draggableTools.setHoverIndex(itemIndex);
    }
  }

  function handleMouseDown() {
    if (effectPopoverTabMode === "edit") {
      draggableTools.setDragIndex(itemIndex);
    }
  }

  function handleClick() {
    if (effectPopoverTabMode === "add") {
      onAdd(itemIndex + 1);
    } else if (effectPopoverTabMode === "remove") {
      onRemove(itemIndex);
    }
  }

  return (
    <div
      className={effectClassName}
      onMouseEnter={handleHoverEvent}
      onClick={handleClick}
    >
      <select
        className="inherit-input"
        {...register(`effects.${effectIndex}.items.${itemIndex}.effectType`)}
        disabled={!editMode}
        onBlur={handleSubmit}
      >
        {EFFECT_TYPES.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>
      <input
        className="inherit-input inherit-input-size"
        {...register(`effects.${effectIndex}.items.${itemIndex}.effectValue`)}
        readOnly={effectPopoverTabMode !== "edit"}
        onMouseDown={(e) => {
          if (e.currentTarget.readOnly) {
            e.preventDefault();
          }
        }}
        onBlur={handleSubmit}
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

export default EffectsPopoverTab;
