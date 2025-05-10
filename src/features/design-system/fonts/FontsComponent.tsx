import { useFieldArray, useForm } from "react-hook-form";
import styles from "../ComponentDesignSystem.module.css";
import { useDesignSystemContext } from "../DesignSystemContext";
import { Fonts } from "../../../domain/DesignSystemDomain";
import { useSaveDesignSystem } from "../DesignSystemQueries";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import InputDesignSystem from "../InputDesignSystem";
import { generateUniqueFontKey } from "../../../util/DesignSystemUtils";
import { useTriggerScroll } from "../../../util/TriggerScrollEvent";
import { useRef } from "react";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../../util/DraggableContext";
import { isEqual } from "lodash";
import InputDesignSystemAddRemove from "../InputDesignSystemAddRemove";
import { useRefreshDesignSystemFormsEvent } from "../../../util/RefreshDesignSystemFormsEvent";
import FontsPopover from "./FontsPopover";
import { useSidebarComponentVisible } from "../../../util/SidebarComponentVisible";
import PreviewComponentDesignSystem from "../previews/PreviewComponentDesignSystem";

function FontsComponent() {
  const { designSystem, editMode } = useDesignSystemContext();
  const { fonts } = designSystem;
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const { handleSubmit, watch, control, register, reset, setValue } =
    useForm<Fonts>({
      defaultValues: fonts,
    });
  const fontsRef = useRef(null);
  useSidebarComponentVisible(fontsRef, "fonts");

  useTriggerScroll({
    ref: fontsRef,
    triggerId: `fonts`,
  });

  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: fonts,
  });

  const {
    fields: fontAdditionals,
    insert,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "additionals",
  });
  const { draggableTools } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: RemovableIndex) => {
      if (
        dragIndex === undefined ||
        hoverIndex === undefined ||
        dragIndex === hoverIndex
      )
        return;
      if (hoverIndex !== "remove") {
        move(dragIndex, hoverIndex);
      } else {
        remove(dragIndex);
      }
      handleSubmit(submitFonts)();
    }
  );

  const formClassNames = classNames(
    styles.componentDesignSystem,
    styles.mediumHeight
  );

  function submitFonts(newFonts: Fonts) {
    if (isEqual(newFonts, fonts)) return;

    saveDesignSystem({
      designSystem: {
        ...designSystem,
        fonts: newFonts,
      },
      isTmp: true,
    });
  }

  function handleAddFonts(index: number) {
    const fontName = generateUniqueFontKey(
      fontAdditionals,
      `font-${index + 2}`
    );
    insert(
      index + 1,
      {
        fontName: fontName,
        value: "sans-serif",
      },
      { shouldFocus: false }
    );
  }

  const sideSettingsClassNames = classNames(
    styles.sideSettings,
    styles.scrollableSettings
  );

  return (
    <form
      className={formClassNames}
      ref={fontsRef}
      onSubmit={handleSubmit(submitFonts)}
    >
      <div className={sideSettingsClassNames}>
        <div className={styles.sideSettingsTitle}>
          <h5>Default font</h5>
        </div>
        <InputDesignSystem
          handleSubmit={handleSubmit(submitFonts)}
          label="default"
          register={register("default", { required: true })}
          value={watch("default")}
          tooltipValue="font-default"
        />
        <div className={styles.sideSettingsTitle}>
          <h5>Additionals</h5>
        </div>
        <div className="column">
          {fontAdditionals.map((typo, index) => (
            <InputDesignSystem
              handleSubmit={handleSubmit(submitFonts)}
              key={typo.fontName}
              label={watch(`additionals.${index}.fontName`)}
              register={register(`additionals.${index}.value`, {
                required: true,
              })}
              registerKey={register(`additionals.${index}.fontName`, {
                required: true,
              })}
              onAdd={() => handleAddFonts(index)}
              onRemove={() => remove(index)}
              isAddRemoveDragAllowed={true}
              draggableTools={draggableTools}
              index={index}
              editText={true}
              tooltipValue={`font-${watch(`additionals.${index}.fontName`)}`}
              popoverEdit={
                <FontsPopover
                  value={watch(`additionals.${index}.value`)}
                  setValue={(value) =>
                    setValue(`additionals.${index}.value`, value)
                  }
                />
              }
            />
          ))}
          {editMode && (
            <InputDesignSystemAddRemove
              itemName="font"
              draggableTools={draggableTools}
              onAppend={() => handleAddFonts(fontAdditionals.length - 1)}
            />
          )}
        </div>
        {!editMode && !fontAdditionals.length && (
          <div className="row justify-center">Empty</div>
        )}
      </div>
      <PreviewComponentDesignSystem maxHeight="600px">
        <div
          className={styles.previewElement}
          style={{
            fontFamily: watch("default"),
            minHeight: "100%"
          }}
        >
          <div className="column">
            <p>default : {watch("default")}</p>
            {fontAdditionals.map((typo, index) => (
              <p
                key={typo.fontName}
                style={{
                  fontFamily: watch(`additionals.${index}.value`),
                }}
              >
                {watch(`additionals.${index}.fontName`)} :{" "}
                {watch(`additionals.${index}.value`)}
              </p>
            ))}
          </div>
        </div>
      </PreviewComponentDesignSystem>
      <div className={styles.darkPreviewPlaceholder} />
    </form>
  );
}

export default FontsComponent;
