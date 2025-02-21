import { MdContentCopy, MdEdit, MdVisibility, MdWarning } from "react-icons/md";
import { ComponentMode } from "./DesignSystemContext";
import styles from "./InputDesignSystem.module.css";
import { ICON_SIZE_SM } from "../../ui/UiConstants";
import { ReactNode, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Popover from "../../ui/kit/Popover";
import classNames from "classnames";
import InputDesignSystemPopover from "./InputDesignSystemPopover";
import { DraggableTools } from "../../util/DraggableContext";

function InputDesignSystem({
  label,
  value,
  mode,
  register,
  registerKey,
  popoverCopy,
  handleSubmit,
  isColor,
  computedColor,
  isAddRemoveDragAllowed,
  onAdd,
  onRemove,
  popoverEdit,
  draggableTools,
  index,
  onClosePopover
}: {
  label: string;
  value: string | undefined;
  mode: ComponentMode;
  register?: UseFormRegisterReturn<string>;
  registerKey?: UseFormRegisterReturn<string>;
  popoverCopy?: ReactNode;
  popoverEdit?: ReactNode;
  handleSubmit?: () => void;
  isColor?: boolean;
  computedColor?: string;
  isAddRemoveDragAllowed?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  draggableTools?: DraggableTools;
  index?: number;
  onClosePopover?: () => void;
}) {
  const [isHover, setIsHover] = useState(false);

  const colorRectClassNames = classNames(styles.colorPreviewContainer, {
    [styles.colorPreviewContainerHover]: isHover,
  });

  const inputClassNames = classNames(
    styles.inputDesignSystem,
    {
      add: mode === "add" && isAddRemoveDragAllowed,
    },
    { remove: mode === "remove" && isAddRemoveDragAllowed },
    {
      draggable:
        draggableTools &&
        ((mode === "drag" &&
          isHover &&
          draggableTools.dragIndex === undefined) ||
          draggableTools.dragIndex === index) &&
        isAddRemoveDragAllowed,
    },
    {
      "drag-hover-top":
        mode === "drag" &&
        draggableTools &&
        draggableTools.hoverIndex === index &&
        draggableTools.dragIndex !== index &&
        isAddRemoveDragAllowed,
    }
  );

  function handleClick() {
    if (isAddRemoveDragAllowed && mode === "add") {
      onAdd?.();
      handleSubmit?.();
    } else if (isAddRemoveDragAllowed && mode === "remove") {
      onRemove?.();
      handleSubmit?.();
    }
  }

  function handleHoverEvent() {
    setIsHover(true);
    if (
      isAddRemoveDragAllowed &&
      draggableTools &&
      mode === "drag" &&
      draggableTools?.dragIndex !== undefined
    ) {
      draggableTools.setHoverIndex(index);
    }
  }

  function handleMouseDown() {
    if (mode === "drag" && isAddRemoveDragAllowed && draggableTools) {
      draggableTools.setDragIndex(index);
    }
  }

  return (
    <div
      onMouseEnter={handleHoverEvent}
      onMouseLeave={() => setIsHover(false)}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={inputClassNames}
    >
      <div className={styles.sideContainer}>
        {mode === "default" && isHover && popoverCopy && (
          <Popover>
            <InputDesignSystemPopover
              isHover={isHover}
              popoverBody={popoverCopy}
              openId="popover-copy"
            >
              <button type="button" className="action-button">
                <MdContentCopy size={ICON_SIZE_SM} />
              </button>
            </InputDesignSystemPopover>
          </Popover>
        )}
      </div>
      <div className={styles.middleContainer}>
        <strong>
          {mode === "edit" && registerKey ? (
            <input
              disabled={mode !== "edit"}
              className="inherit-input w-full"
              placeholder="empty"
              {...registerKey}
              onBlur={handleSubmit}
            />
          ) : (
            <div className="inherit-input-placeholder">{label ?? "empty"}</div>
          )}
        </strong>

        <div className="text-color-light">
          {mode === "edit" && !popoverEdit && (
            <input
              disabled={mode !== "edit"}
              className="inherit-input w-full"
              placeholder="empty"
              {...register}
              onBlur={handleSubmit}
            />
          )}
          {(mode !== "edit" || popoverEdit) && (
            <div className="inherit-input-placeholder nowrap">
              {value ?? "empty"}
            </div>
          )}
        </div>
      </div>
      <div className={styles.sideContainer}>
        {isColor && (
          <div
            className={colorRectClassNames}
            style={{
              background: computedColor,
            }}
          >
            {!computedColor && (
              <MdWarning size={12} color="var(--theme-warning-outline-text)" />
            )}
          </div>
        )}
        {popoverEdit && (mode === "edit" || mode === "default") && (
          <Popover onClose={onClosePopover ?? handleSubmit}>
            <InputDesignSystemPopover
              isHover={isHover}
              popoverBody={popoverEdit}
              openId="popover-edit"
            >
              <button type="button" className="action-button">
                {mode === "edit" && <MdEdit size={ICON_SIZE_SM} />}
                {mode === "default" && <MdVisibility size={ICON_SIZE_SM} />}
              </button>
            </InputDesignSystemPopover>
          </Popover>
        )}
      </div>
    </div>
  );
}

export default InputDesignSystem;
