import { useRef } from "react";
import classNames from "classnames";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "react-router-dom";

import styles from "../ComponentDesignSystem.module.css";
import { useDesignSystemContext } from "../DesignSystemContext";
import { useSaveDesignSystem } from "../DesignSystemQueries";
import { useTriggerScroll } from "../../../util/TriggerScrollEvent";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../../util/DraggableContext";
import { useSynchronizedVerticalScroll } from "../../../util/SynchronizedScroll";

import InputDesignSystem from "../InputDesignSystem";
import RadiusPreview from "./RadiusPreview";

import {
  Measurement,
  Radius,
  RadiusItem,
} from "../../../domain/DesignSystemDomain";
import { generateUniqueRadiusKey } from "../../../util/DesignSystemUtils";
import { useRefreshDesignSystemFormsEvent } from "../../../util/RefreshDesignSystemFormsEvent";
import { isEqual } from "lodash";
import InputDesignSystemAddRemove from "../InputDesignSystemAddRemove";
import { useSidebarComponentVisible } from "../../../util/SidebarComponentVisible";
import PreviewComponentDesignSystem from "../previews/PreviewComponentDesignSystem";
import Popover from "../../../ui/kit/Popover";

function RadiusComponent() {
  const { designSystem, editMode } = useDesignSystemContext();
  const { radius } = designSystem;
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);

  const { register, watch, control, handleSubmit, reset, setValue } = useForm({
    defaultValues: radius,
  });

  const {
    fields: additionalsRadiusArray,
    remove,
    move,
    insert,
  } = useFieldArray({
    control,
    name: "additionalsRadius",
  });

  const { draggableTools } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: RemovableIndex) => {
      if (
        dragIndex === undefined ||
        hoverIndex === undefined ||
        hoverIndex === dragIndex
      )
        return;
      if (hoverIndex !== "remove") {
        move(dragIndex, hoverIndex);
      } else {
        remove(dragIndex);
      }
      handleSubmit(submitRadius)();
    }
  );

  const [scrollableLeft, scrollableRight] = useSynchronizedVerticalScroll();

  const radiusRef = useRef<HTMLFormElement>(null);
  useSidebarComponentVisible(radiusRef, "radius");
  useTriggerScroll({
    ref: radiusRef,
    triggerId: `radius`,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: radius,
  });

  function submitRadius(newRadius: Radius) {
    if (isEqual(newRadius, radius)) return;

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

    insert(index + 1, newRadius, { shouldFocus: false });
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
    <Popover>
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
            handleSubmit={handleSubmit(submitRadius)}
            measurement={watch("default")}
            setMeasurement={(measurement: Measurement) =>
              setValue("default", measurement)
            }
            tooltipValue="radius-default"
          />
          <div className={styles.sideSettingsTitle}>
            <h5>Additionals radius</h5>
          </div>
          <div className="column">
            {additionalsRadiusArray.map((field, index) => (
              <InputDesignSystem
                key={field.id}
                label={watch(`additionalsRadius.${index}.radiusKey`)}
                handleSubmit={handleSubmit(submitRadius)}
                isAddRemoveDragAllowed={true}
                onAdd={() => handleAddRadius(index)}
                onRemove={() => {
                  remove(index);
                  handleSubmit(submitRadius)();
                }}
                draggableTools={draggableTools}
                index={index}
                registerKey={register(`additionalsRadius.${index}.radiusKey`)}
                tooltipValue={`radius-${watch(
                  `additionalsRadius.${index}.radiusKey`
                )}`}
                measurement={watch("default")}
                setMeasurement={(measurement: Measurement) =>
                  setValue("default", measurement)
                }
              />
            ))}
          </div>
          {editMode && (
            <InputDesignSystemAddRemove
              draggableTools={draggableTools}
              itemName="radius"
              onAppend={() =>
                handleAddRadius(additionalsRadiusArray.length - 1)
              }
            />
          )}

          {!editMode && !additionalsRadiusArray.length && (
            <div className="row justify-center">Empty</div>
          )}
        </div>

        <PreviewComponentDesignSystem maxHeight="400px">
          <div className={styles.previewElementWrap} ref={scrollableRight}>
            <RadiusPreview label="default" radiusValue={watch("default")} />
            {additionalsRadiusArray.map((field, index) => (
              <RadiusPreview
                key={field.id}
                label={watch(`additionalsRadius.${index}.radiusKey`)}
                radiusValue={watch(`additionalsRadius.${index}.radiusValue`)}
              />
            ))}
          </div>
        </PreviewComponentDesignSystem>
        <div className={styles.darkPreviewPlaceholder} />
      </form>
    </Popover>
  );
}

export default RadiusComponent;
