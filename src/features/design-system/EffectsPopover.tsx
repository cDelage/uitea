import { MdAdd, MdDragIndicator, MdFormatSize, MdRemove } from "react-icons/md";
import styles from "./InputPopover.module.css";
import { ICON_SIZE_MD, ICON_SIZE_SM } from "../../ui/UiConstants";
import {
  Control,
  useFieldArray,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Effect } from "../../domain/DesignSystemDomain";
import {
  ComponentMode,
  EffectsPopoverMode,
  ModificationsMode,
} from "./DesignSystemContext";
import { ChangeEvent, useState } from "react";
import classNames from "classnames";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../util/DraggableContext";
import EffectsPopoverTab from "./EffectsPopoverTab";
import { getEffectCss } from "../../util/DesignSystemUtils";

function EffectsPopover({
  register,
  watch,
  index,
  mode,
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
  mode: ComponentMode;
  handleSubmit: () => void;
}) {
  const [popoverMode, setPopoverMode] = useState<EffectsPopoverMode>("default");
  const {
    fields: items,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: `effects.${index}.items`,
  });
  const { draggableTools } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: RemovableIndex) => {
      if (
        dragIndex === undefined ||
        hoverIndex === undefined ||
        hoverIndex === "remove"
      )
        return;
      move(dragIndex, hoverIndex);
    }
  );
  function handleSetMode(newMode: EffectsPopoverMode) {
    setPopoverMode((mode) => (newMode === mode ? "default" : newMode));
  }

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

  const dragButtonClassNames = classNames("action-button", {
    active: popoverMode === "drag",
  });

  const removeButtonClassNames = classNames("action-button", {
    negative: popoverMode === "remove",
  });

  const background = watch(`effects.${index}.bg`);

  return (
    <div className={styles.inputPopover}>
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
          {ModificationsMode.includes(mode) && (
            <div className="row gap-2">
              <button
                className="action-button"
                onClick={() =>
                  append({
                    effectType: "BoxShadow",
                    effectValue: "",
                  })
                }
              >
                <MdAdd size={ICON_SIZE_SM} />
              </button>
              <button
                className={dragButtonClassNames}
                onClick={() => handleSetMode("drag")}
              >
                <MdDragIndicator size={ICON_SIZE_SM} />
              </button>
              <button
                className={removeButtonClassNames}
                onClick={() => handleSetMode("remove")}
              >
                <MdRemove size={ICON_SIZE_SM} />
              </button>
            </div>
          )}
        </div>
        <div className={styles.keyValueMenuContainer}>
          {items.map((item, itemIndex) => (
            <EffectsPopoverTab
              key={item.id}
              effectIndex={index}
              draggableTools={draggableTools}
              itemIndex={itemIndex}
              popoverMode={popoverMode}
              mode={mode}
              register={register}
              remove={remove}
              watch={watch}
              handleSubmit={handleSubmit}
            />
          ))}
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
