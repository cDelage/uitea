import { MdFormatSize } from "react-icons/md";
import styles from "./InputPopover.module.css";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import {
  Control,
  useFieldArray,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Effect } from "../../domain/DesignSystemDomain";
import { ChangeEvent } from "react";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../util/DraggableContext";
import EffectsPopoverTab from "./EffectsPopoverTab";
import { getEffectCss } from "../../util/DesignSystemUtils";
import InputDesignSystemAddRemove from "./InputDesignSystemAddRemove";
import { useDesignSystemContext } from "./DesignSystemContext";

function EffectsPopover({
  register,
  watch,
  index,
  control,
  setValue,
  getValue,
  handleSubmit,
}: {
  register: UseFormRegister<{ effects: Effect[] }>;
  watch: UseFormWatch<{ effects: Effect[] }>;
  setValue: UseFormSetValue<{ effects: Effect[] }>;
  getValue: UseFormGetValues<{ effects: Effect[] }>;
  control: Control<{ effects: Effect[] }>;
  effect: Effect;
  index: number;
  handleSubmit: () => void;
}) {
  const { editMode } = useDesignSystemContext();
  const {
    fields: items,
    move,
    remove,
    insert,
  } = useFieldArray({
    control,
    name: `effects.${index}.items`,
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

  function handleChangeBackground(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.checked) {
      setValue(`effects.${index}.bg`, undefined);
    } else {
      const bg = getValue(`effects.${index}.bg`);
      if (!bg) {
        setValue(`effects.${index}.bg`, "#DDDDDD");
      }
    }
    handleSubmit();
  }

  function handleInsertEffectItem(index: number) {
    insert(index, {
      effectType: "BoxShadow",
      effectValue: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px",
    });
    handleSubmit();
  }

  function handleRemoveEffectItem(itemIndex: number) {
    remove(itemIndex);
    handleSubmit();
  }

  const background = watch(`effects.${index}.bg`);

  return (
    <div
      className={styles.inputPopover}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.popoverHeader}>
        <MdFormatSize size={ICON_SIZE_MD} />
        <h5>Effects</h5>
      </div>
      <div className={styles.previewContainer}>
        <div
          className={styles.rectPreview}
          style={{ ...getEffectCss(watch(`effects.${index}`)) }}
        />
      </div>
      <div className={styles.bodyContainer}>
        <div className={styles.bodyMenuContainer}>
          <h6>Effect</h6>
        </div>
        <div className={styles.keyValueMenuContainer}>
          {items.map((item, itemIndex) => (
            <EffectsPopoverTab
              key={item.id}
              effectIndex={index}
              draggableTools={draggableTools}
              itemIndex={itemIndex}
              register={register}
              handleSubmit={handleSubmit}
              onAdd={handleInsertEffectItem}
              onRemove={handleRemoveEffectItem}
            />
          ))}
          {editMode && (
            <InputDesignSystemAddRemove
              itemName="effect item"
              draggableTools={draggableTools}
              onAppend={() => handleInsertEffectItem(items.length + 1)}
            />
          )}
        </div>
        <div className={styles.tabEffectContainer}>
          <div>
            <input
              type="checkbox"
              checked={
                watch(`effects.${index}.bg`) !== undefined ? true : false
              }
              onChange={handleChangeBackground}
            />
            background
          </div>
          {(background === undefined ? false : true) && (
            <input
              placeholder="bg-color"
              className="inherit-input inherit-input-size"
              {...register(`effects.${index}.bg`)}
              onBlur={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default EffectsPopover;
