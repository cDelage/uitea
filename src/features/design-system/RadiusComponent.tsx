import { useRef } from "react";
import classNames from "classnames";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "react-router-dom";

import styles from "./ComponentDesignSystem.module.css";
import {
  ModificationsMode,
  useDesignSystemContext,
} from "./DesignSystemContext";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import { useTriggerScroll } from "../../util/TriggerScrollEvent";
import { useDraggableFeatures } from "../../util/DraggableContext";
import { useSynchronizedVerticalScroll } from "../../util/SynchronizedScroll";

import Section from "./SectionDesignSystem";
import InputDesignSystem from "./InputDesignSystem";
import RadiusPreview from "./RadiusPreview";

import { Radius, RadiusItem } from "../../domain/DesignSystemDomain";
import { generateUniqueRadiusKey } from "../../util/DesignSystemUtils";
import { DEFAULT_BASE } from "../../ui/UiConstants";
import CopyableLabel from "../../ui/kit/CopyableLabel";
import { useRefreshDesignSystemFormsEvent } from "../../util/RefreshDesignSystemFormsEvent";

function RadiusComponent() {
  const { designSystem, findDesignSystemColor, radiusMode } =
    useDesignSystemContext();
  const { base, radius } = designSystem;
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);

  const { register, watch, control, handleSubmit, reset } = useForm({
    defaultValues: radius,
  });

  const {
    fields: additionalsRadiusArray,
    append,
    remove,
    move,
    insert,
  } = useFieldArray({
    control,
    name: "additionalsRadius",
  });

  const { draggableTools } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: number) => {
      if (dragIndex === undefined || hoverIndex === undefined) return;
      move(dragIndex, hoverIndex);
    }
  );

  const [scrollableLeft, scrollableRight] = useSynchronizedVerticalScroll();

  const radiusRef = useRef<HTMLFormElement>(null);
  useTriggerScroll({
    ref: radiusRef,
    triggerId: `radius`,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: radius,
  });
  

  function submitRadius(newRadius: Radius) {
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        radius: newRadius,
      },
      isTmp: true,
    });
  }

  function handleAddRadius(index: number) {
    const radiusKey = generateUniqueRadiusKey(
      additionalsRadiusArray,
      `radius-${index + 2}`
    );

    const newRadius: RadiusItem = {
      radiusKey,
      radiusValue: additionalsRadiusArray[index]?.radiusValue ?? "8px",
    };

    insert(index + 1, newRadius);
    handleSubmit(submitRadius)();
  }

  const formClassNames = classNames(
    styles.componentDesignSystem,
    styles.mediumHeight
  );
  const sideSettingsClass = classNames(
    styles.sideSettings,
    styles.scrollableSettings
  );

  return (
    <form
      className={formClassNames}
      onSubmit={handleSubmit(submitRadius)}
      ref={radiusRef}
    >
      <div className={sideSettingsClass} ref={scrollableLeft}>
        <div className={styles.sideSettingsTitle}>
          <h5>Default radius</h5>
        </div>
        <InputDesignSystem
          key="defaultRadius"
          label="default"
          mode={radiusMode}
          handleSubmit={handleSubmit(submitRadius)}
          value={watch("default")}
          register={register("default")}
          popoverCopy={
            <div className="popover-body">
              <CopyableLabel copyable="radius-default" />
              <CopyableLabel copyable={watch("default")} />
            </div>
          }
        />
        <div className={styles.sideSettingsTitle}>
          <h5>Additionals radius</h5>
        </div>
        <div className="column">
          {additionalsRadiusArray.map((field, index) => (
            <InputDesignSystem
              key={field.id}
              label={watch(`additionalsRadius.${index}.radiusKey`)}
              mode={radiusMode}
              handleSubmit={handleSubmit(submitRadius)}
              value={watch(`additionalsRadius.${index}.radiusValue`)}
              isAddRemoveDragAllowed={true}
              onAdd={() => handleAddRadius(index)}
              onRemove={() => {
                remove(index);
                handleSubmit(submitRadius)();
              }}
              draggableTools={draggableTools}
              index={index}
              registerKey={register(`additionalsRadius.${index}.radiusKey`)}
              register={register(`additionalsRadius.${index}.radiusValue`)}
              popoverCopy={
                <div className="popover-body">
                  <CopyableLabel
                    copyable={`radius-${watch(
                      `additionalsRadius.${index}.radiusKey`
                    )}`}
                  />
                  <CopyableLabel
                    copyable={watch(`additionalsRadius.${index}.radiusValue`)}
                  />
                </div>
              }
            />
          ))}
        </div>
        {ModificationsMode.includes("edit") && (
          <Section.EmptySection
            itemToInsert="radius"
            onInsert={() => {
              append({
                radiusKey: "radius-1",
                radiusValue: "8px",
              });
            }}
            sectionLength={additionalsRadiusArray.length}
            sectionName="radius"
          />
        )}

        {!ModificationsMode.includes("edit") &&
          !additionalsRadiusArray.length && (
            <div className="row justify-center">Empty</div>
          )}
      </div>

      <div className={styles.previewContainer}>
        <div
          className={styles.previewElementWrap}
          ref={scrollableRight}
          style={{
            background: findDesignSystemColor({
              label: base.background.default,
              defaultValue: DEFAULT_BASE.background.default,
            }),
          }}
        >
          <RadiusPreview label="default" radiusValue={watch("default")} />
          {additionalsRadiusArray.map((field, index) => (
            <RadiusPreview
              key={field.id}
              label={watch(`additionalsRadius.${index}.radiusKey`)}
              radiusValue={watch(`additionalsRadius.${index}.radiusValue`)}
            />
          ))}
        </div>
      </div>
      <div className={styles.darkPreviewPlaceholder} />
    </form>
  );
}

export default RadiusComponent;
