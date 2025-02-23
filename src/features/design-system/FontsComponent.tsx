import { useFieldArray, useForm } from "react-hook-form";
import styles from "./ComponentDesignSystem.module.css";
import {
  ModificationsMode,
  useDesignSystemContext,
} from "./DesignSystemContext";
import { Fonts } from "../../domain/DesignSystemDomain";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import { DEFAULT_BASE } from "../../ui/UiConstants";
import InputDesignSystem from "./InputDesignSystem";
import CopyableLabel from "../../ui/kit/CopyableLabel";
import Section from "./SectionDesignSystem";
import { generateUniqueFontKey } from "../../util/DesignSystemUtils";
import { useTriggerScroll } from "../../util/TriggerScrollEvent";
import { useRef } from "react";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../util/DraggableContext";
import { isEqual } from "lodash";

function FontsComponent() {
  const { designSystem, findDesignSystemColor, fontsMode } =
    useDesignSystemContext();
  const { fonts, base } = designSystem;
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const { handleSubmit, watch, control, register } = useForm<Fonts>({
    defaultValues: fonts,
  });
  const fontsRef = useRef(null);
  useTriggerScroll({
    ref: fontsRef,
    triggerId: `fonts`,
  });

  const {
    fields: fontAdditionals,
    append,
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
        hoverIndex === "remove"
      )
        return;
      move(dragIndex, hoverIndex);
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
    insert(index + 1, {
      fontName: fontName,
      value: "sans-serif",
    });
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
          mode={fontsMode}
          value={watch("default")}
          popoverCopy={
            <div className="popover-body">
              <CopyableLabel copyable="font-default" />
              <CopyableLabel copyable={watch("default")} />
            </div>
          }
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
              mode={fontsMode}
              value={watch(`additionals.${index}.value`)}
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
              popoverCopy={
                <div className="popover-body">
                  <CopyableLabel
                    copyable={`font-${typo.fontName.toLowerCase()}`}
                  />
                  <CopyableLabel
                    copyable={watch(`additionals.${index}.value`)}
                  />
                </div>
              }
            />
          ))}
        </div>
        {ModificationsMode.includes(fontsMode) && (
          <Section.EmptySection
            itemToInsert="font"
            onInsert={() => {
              append({
                fontName: "font-1",
                value: "sans-serif",
              });
            }}
            sectionLength={fontAdditionals.length}
            sectionName="additionals"
          />
        )}
        {!ModificationsMode.includes(fontsMode) && !fontAdditionals.length && (
          <div className="row justify-center">Empty</div>
        )}
      </div>
      <div className={styles.previewContainer}>
        <div
          className={styles.previewElement}
          style={{
            background: findDesignSystemColor({
              label: base.background.default,
              defaultValue: DEFAULT_BASE.background.default,
            }),
            fontFamily: watch("default"),
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
      </div>
      <div className={styles.darkPreviewPlaceholder} />
    </form>
  );
}

export default FontsComponent;
