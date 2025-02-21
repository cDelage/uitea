import classNames from "classnames";
import { ComponentMode, EffectsPopoverMode } from "./DesignSystemContext";
import styles from "./InputPopover.module.css";
import { DraggableTools } from "../../util/DraggableContext";
import {
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { Effect } from "../../domain/DesignSystemDomain";
import { EFFECT_TYPES } from "../../ui/UiConstants";
import { MouseEvent } from "react";

function EffectsPopoverTab({
  itemIndex,
  effectIndex,
  popoverMode,
  draggableTools,
  register,
  watch,
  remove,
  mode,
  handleSubmit
}: {
  itemIndex: number;
  effectIndex: number;
  popoverMode: EffectsPopoverMode;
  draggableTools: DraggableTools;
  register: UseFormRegister<{ effects: Effect[] }>;
  watch: UseFormWatch<{ effects: Effect[] }>;
  remove: UseFieldArrayRemove;
  mode: ComponentMode;
  handleSubmit : () => void;
}) {
  const effectClassName = classNames(
    styles.tabEffectContainer,
    { remove: popoverMode === "remove" },
    {
      draggable:
        draggableTools &&
        ((popoverMode === "drag" && draggableTools.dragIndex === undefined) ||
          draggableTools.dragIndex === itemIndex),
    },
    {
      "drag-hover-top":
        popoverMode === "drag" &&
        draggableTools &&
        draggableTools.hoverIndex === itemIndex &&
        draggableTools.dragIndex !== itemIndex,
    }
  );

  function handleClickEvent(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (popoverMode === "remove") {
      remove(itemIndex);
    }
  }

  function handleHoverEvent() {
    if (
      draggableTools &&
      popoverMode === "drag" &&
      draggableTools?.dragIndex !== undefined
    ) {
      draggableTools.setHoverIndex(itemIndex);
    }
  }

  function handleMouseDown() {
    if (popoverMode === "drag" && draggableTools) {
      draggableTools.setDragIndex(itemIndex);
    }
  }

  return (
    <div
      className={effectClassName}
      onMouseEnter={handleHoverEvent}
      onMouseDown={handleMouseDown}
      onClick={handleClickEvent}
    >
      {popoverMode === "default" ? (
        <>
          <select
            className="inherit-input"
            {...register(
              `effects.${effectIndex}.items.${itemIndex}.effectType`
            )}
            disabled={mode !== "edit" || popoverMode !== "default"}
            onBlur={handleSubmit}
          >
            {EFFECT_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <input
            className="inherit-input inherit-input-size"
            {...register(
              `effects.${effectIndex}.items.${itemIndex}.effectValue`
            )}
            disabled={mode !== "edit" || popoverMode !== "default"}
            onBlur={handleSubmit}
          />
        </>
      ) : (
        <>
          <div className="inherit-input-placeholder inherit-input-size">
            {watch(`effects.${effectIndex}.items.${itemIndex}.effectType`)}
          </div>
          <div className="inherit-input-placeholder inherit-input-size">
            {watch(`effects.${effectIndex}.items.${itemIndex}.effectValue`)}
          </div>
        </>
      )}
    </div>
  );
}

export default EffectsPopoverTab;
