import { MdDragIndicator, MdLock, MdWarning } from "react-icons/md";
import { ComponentMode, useDesignSystemContext } from "./DesignSystemContext";
import styles from "./InputDesignSystem.module.css";
import { ICON_SIZE_SM } from "../../ui/UiConstants";
import { ReactNode, RefObject, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Popover from "../../ui/kit/Popover";
import classNames from "classnames";
import { DraggableTools } from "../../util/DraggableContext";
import CopyableTopTooltip from "../../ui/kit/CopyableTopTooltip";
import { useSearchParams } from "react-router-dom";

function InputDesignSystem({
  label,
  value,
  register,
  registerKey,
  handleSubmit,
  isColor,
  computedColor,
  isAddRemoveDragAllowed,
  popoverEdit,
  draggableTools,
  index,
  onClosePopover,
  tooltipValue,
  onAdd,
  onRemove,
  keyPopover,
  portalTooltip,
  editText,
  isLocked,
}: {
  label: string;
  value?: string | undefined;
  register?: UseFormRegisterReturn<string>;
  registerKey?: UseFormRegisterReturn<string>;
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
  tooltipValue?: string;
  portalTooltip?: RefObject<HTMLDivElement | null>;
  keyPopover?: string;
  setValue?: (value: string) => void;
  editText?: boolean;
  isLocked?: boolean;
}) {
  const [isHover, setIsHover] = useState(false);

  const { editMode } = useDesignSystemContext();

  const [searchParams] = useSearchParams();

  const keyboardAction = searchParams.get("keyboardAction");

  const colorRectClassNames = classNames(styles.colorPreviewContainer, {
    [styles.colorPreviewContainerHover]: isHover,
  });

  function getComponentMode(): ComponentMode {
    if (editMode && isAddRemoveDragAllowed) {
      if (keyboardAction === "i" && !draggableTools?.dragIndex && isHover) {
        return "add";
      } else if (
        (draggableTools?.dragIndex === index &&
          draggableTools?.hoverIndex === "remove") ||
        (draggableTools?.dragIndex === undefined &&
          keyboardAction === "d" &&
          isHover)
      ) {
        return "remove";
      } else if (
        draggableTools &&
        draggableTools.dragIndex === index &&
        draggableTools.hoverIndex !== "remove"
      ) {
        return "drag";
      } else if (
        draggableTools?.hoverIndex === index &&
        draggableTools?.dragIndex !== index
      ) {
        return "drag-hover";
      } else {
        return "edit";
      }
    } else if (editMode) {
      return "edit";
    } else {
      return "default";
    }
  }

  const inputDesignSystemMode: ComponentMode = getComponentMode();

  const inputClassNames = classNames(
    styles.inputDesignSystem,
    {
      add: inputDesignSystemMode === "add",
    },
    {
      draggable: inputDesignSystemMode === "drag",
    },
    {
      remove: inputDesignSystemMode === "remove",
    },
    {
      "drag-hover-top": inputDesignSystemMode === "drag-hover",
    }
  );

  function handleHoverEvent() {
    setIsHover(true);
    if (
      isAddRemoveDragAllowed &&
      draggableTools &&
      editMode &&
      draggableTools?.dragIndex !== undefined
    ) {
      draggableTools.setHoverIndex(index);
    }
  }

  function handleMouseDown() {
    if (editMode && isAddRemoveDragAllowed && draggableTools) {
      draggableTools.setDragIndex(index);
    }
  }

  function handleClick() {
    if (inputDesignSystemMode === "add") {
      onAdd?.();
    } else if (inputDesignSystemMode === "remove") {
      onRemove?.();
    }
  }

  return (
    <CopyableTopTooltip
      tooltipValue={tooltipValue}
      portalComponent={portalTooltip}
    >
      <div
        onMouseEnter={handleHoverEvent}
        onMouseLeave={() => setIsHover(false)}
        className={inputClassNames}
        onClick={handleClick}
      >
        <div className={styles.middleContainer}>
          <div className="row w-full">
            <div className={styles.sideContainer} />
            <strong className="w-full">
              {registerKey ? (
                <input
                  className="inherit-input w-full"
                  placeholder="empty"
                  {...registerKey}
                  readOnly={inputDesignSystemMode !== "edit"}
                  onMouseDown={(e) => {
                    if (e.currentTarget.readOnly) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={handleSubmit}
                />
              ) : (
                <input
                  className="inherit-input w-full"
                  placeholder="empty"
                  value={label}
                  readOnly={true}
                  onMouseDown={(e) => {
                    if (e.currentTarget.readOnly) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={handleSubmit}
                />
              )}
            </strong>
          </div>
          <div className="row w-full">
            <div className={styles.sideContainer}>
              {editMode && isAddRemoveDragAllowed && (
                <button
                  onMouseDown={handleMouseDown}
                  type="button"
                  className="action-button"
                >
                  <MdDragIndicator size={ICON_SIZE_SM} />
                </button>
              )}
              {isLocked && (
                <MdLock size={ICON_SIZE_SM} color="var(--uidt-palette-gray-400)" />
              )}
            </div>
            {register && !isColor && !popoverEdit && (
              <div className="text-color-light w-full">
                <input
                  className="inherit-input w-full"
                  placeholder="empty"
                  {...register}
                  onBlur={handleSubmit}
                  readOnly={inputDesignSystemMode !== "edit"}
                  onMouseDown={(e) => {
                    if (e.currentTarget.readOnly) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            )}
            {(isColor || popoverEdit) && (
              <Popover onClose={onClosePopover ?? handleSubmit}>
                <Popover.Toggle
                  id={keyPopover ?? "edit-popover"}
                  positionPayload="bottom-left"
                >
                  <div className={styles.popoverContainer}>
                    {register && (isColor || editText) ? (
                      <input
                        className="inherit-input empty-border w-full"
                        placeholder="empty"
                        {...register}
                        readOnly={inputDesignSystemMode !== "edit"}
                        onMouseDown={(e) => {
                          if (e.currentTarget.readOnly) {
                            e.preventDefault();
                          }
                        }}
                      />
                    ) : (
                      <input
                        className="inherit-input w-full"
                        placeholder="empty"
                        value={value}
                        readOnly={true}
                        onMouseDown={(e) => {
                          if (e.currentTarget.readOnly) {
                            e.preventDefault();
                          }
                        }}
                      />
                    )}
                    <div className={styles.sideContainerVisible}>
                      {isColor && (
                        <Popover.Close>
                          <div
                            className={colorRectClassNames}
                            style={{
                              background: computedColor,
                            }}
                          >
                            {!computedColor && (
                              <MdWarning
                                size={12}
                                color="var(--uidt-warning-outline-text)"
                              />
                            )}
                          </div>
                        </Popover.Close>
                      )}
                    </div>
                  </div>
                </Popover.Toggle>
                <Popover.Body id={keyPopover ?? "edit-popover"} zIndex={100}>
                  {popoverEdit}
                </Popover.Body>
              </Popover>
            )}
          </div>
        </div>
        <div className={styles.sideContainer}/>
      </div>
    </CopyableTopTooltip>
  );
}

export default InputDesignSystem;
