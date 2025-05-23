import { MdFormatSize } from "react-icons/md";
import styles from "../InputPopover.module.css";
import { DEFAULT_SHADOW, ICON_SIZE_MD } from "../../../ui/UiConstants";
import { Control, useFieldArray, UseFormSetValue } from "react-hook-form";
import { Shadows } from "../../../domain/DesignSystemDomain";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../../util/DraggableContext";
import ShadowPopoverTab from "./ShadowPopoverTab";
import InputDesignSystemAddRemove from "../InputDesignSystemAddRemove";
import { useDesignSystemContext } from "../DesignSystemContext";
import { PreviewStyle } from "../previews/PreviewStyle";
import Popover from "../../../ui/kit/Popover";
import { useRef } from "react";

function ShadowPopover({
  index,
  control,
  setValue,
  handleSubmit,
}: {
  setValue: UseFormSetValue<{ shadows: Shadows[] }>;
  control: Control<{ shadows: Shadows[] }>;
  effect: Shadows;
  index: number;
  handleSubmit: () => void;
}) {
  const { editMode, designSystem, tokenFamilies } = useDesignSystemContext();
  const styleRef = useRef<HTMLDivElement>(null);
  const {
    fields: items,
    move,
    remove,
    insert,
  } = useFieldArray({
    control,
    name: `shadows.${index}.shadowsArray`,
  });
  const { draggableTools } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: RemovableIndex) => {
      if (dragIndex === undefined || hoverIndex === undefined) return;
      if (hoverIndex !== "remove") {
        move(dragIndex, hoverIndex);
      } else {
        remove(dragIndex);
      }
    }
  );

  function handleInsertEffectItem(index: number) {
    insert(index, DEFAULT_SHADOW);
    handleSubmit();
  }

  function handleRemoveEffectItem(itemIndex: number) {
    remove(itemIndex);
    handleSubmit();
  }

  return (
    <div
      className="column"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "400px",
      }}
    >
      <div className={styles.popoverHeader}>
        <MdFormatSize size={ICON_SIZE_MD} />
        <h5>Effects</h5>
      </div>
      <PreviewStyle
        $tokenFamilies={tokenFamilies}
        $designSystem={designSystem}
        ref={styleRef}
      >
        <div className={styles.previewContainer}>
          <div className={styles.rectPreview} />
        </div>
      </PreviewStyle>
      {styleRef.current && (
        <div className={styles.bodyContainer}>
          <div className={styles.bodyMenuContainer}>
            <h6>Effect</h6>
          </div>
          <div className={styles.keyValueMenuContainer}>
            <Popover>
              {items.map((shadow, shadowIndex) => (
                <ShadowPopoverTab
                  key={shadow.id}
                  shadowsArrayIndex={index}
                  draggableTools={draggableTools}
                  shadowIndex={shadowIndex}
                  handleSubmit={handleSubmit}
                  onAdd={handleInsertEffectItem}
                  onRemove={handleRemoveEffectItem}
                  setValue={setValue}
                  shadow={shadow}
                  styleRef={styleRef}
                />
              ))}
            </Popover>
            {editMode && (
              <InputDesignSystemAddRemove
                itemName="effect item"
                draggableTools={draggableTools}
                onAppend={() => handleInsertEffectItem(items.length + 1)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ShadowPopover;
