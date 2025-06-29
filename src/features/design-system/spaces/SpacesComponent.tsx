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

import InputDesignSystem from "../InputDesignSystem";
import SpacePreview from "./SpacePreview"; // le composant créé plus haut

import { DesignSystem, Space } from "../../../domain/DesignSystemDomain";
import { generateUniqueSpacesKey } from "../../../util/DesignSystemUtils";
import { useRefreshDesignSystemFormsEvent } from "../../../util/RefreshDesignSystemFormsEvent";
import { isEqual } from "lodash";
import InputDesignSystemAddRemove from "../InputDesignSystemAddRemove";
import { useSidebarComponentVisible } from "../../../util/SidebarComponentVisible";
import PreviewComponentDesignSystem from "../previews/PreviewComponentDesignSystem";
import Popover from "../../../ui/kit/Popover";

function SpacesComponent() {
  const { designSystem, editMode } = useDesignSystemContext();
  const { spaces } = designSystem;
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);

  const { register, watch, control, handleSubmit, reset, setValue } = useForm<{
    spaces: Space[];
  }>({
    defaultValues: {
      spaces,
    },
  });

  const {
    fields: spacesArray,
    remove,
    move,
    insert,
  } = useFieldArray({
    control,
    name: "spaces",
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
      handleSubmit(submitSpaces)();
    }
  );

  const spacesRef = useRef<HTMLFormElement>(null);
  useSidebarComponentVisible(spacesRef, "spaces");
  useTriggerScroll({
    ref: spacesRef,
    triggerId: `spaces`,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: { spaces },
  });

  function submitSpaces(newSpaces: Pick<DesignSystem, "spaces">) {
    if (isEqual(newSpaces.spaces, spaces)) return;

    saveDesignSystem({
      designSystem: {
        ...designSystem,
        spaces: newSpaces.spaces,
      },
      isTmp: true,
    });
  }

  function handleAddSpace(index: number) {
    const spaceKey = generateUniqueSpacesKey(spacesArray, `${index + 1}`);
    const newSpace: Space = {
      spaceKey,
      spaceValue: {
        unit: "PX",
        value: 0,
      },
    };
    insert(index + 1, newSpace, { shouldFocus: false });
    handleSubmit(submitSpaces)();
  }

  const formClassNames = classNames(
    styles.componentDesignSystem,
  );
  const sideSettingsClass = classNames(
    styles.sideSettings,
  );

  return (
    <Popover>
      <form
        className={formClassNames}
        onSubmit={handleSubmit(submitSpaces)}
        ref={spacesRef}
      >
        <div className={sideSettingsClass}>
          <div className={styles.sideSettingsTitle}>
            <h5>Spaces</h5>
          </div>
          <div className="column">
            {spacesArray.map((field, index) => (
              <InputDesignSystem
                key={field.id}
                label={watch(`spaces.${index}.spaceKey`)}
                handleSubmit={handleSubmit(submitSpaces)}
                isAddRemoveDragAllowed={true}
                onAdd={() => handleAddSpace(index)}
                onRemove={() => {
                  remove(index);
                  handleSubmit(submitSpaces)();
                }}
                draggableTools={draggableTools}
                index={index}
                registerKey={register(`spaces.${index}.spaceKey`)}
                measurement={watch(`spaces.${index}.spaceValue`)}
                setMeasurement={(measurement) =>
                  setValue(`spaces.${index}.spaceValue`, measurement)
                }
                tooltipValue={`space-${watch(`spaces.${index}.spaceKey`)}`}
              />
            ))}
            {editMode && (
              <InputDesignSystemAddRemove
                draggableTools={draggableTools}
                itemName="space"
                onAppend={() => handleAddSpace(spacesArray.length - 1)}
              />
            )}
            {!editMode && !spacesArray.length && (
              <div className="row justify-center">Empty</div>
            )}
          </div>
        </div>

        <PreviewComponentDesignSystem>
          <div className={styles.previewElement}>
            {spacesArray.map((field, index) => (
              <SpacePreview
                key={field.id}
                space={{
                  spaceKey: watch(`spaces.${index}.spaceKey`),
                  spaceValue: watch(`spaces.${index}.spaceValue`),
                }}
              />
            ))}
          </div>
          <div
            style={{
              minHeight: "32px",
            }}
          />
        </PreviewComponentDesignSystem>

        <div className={styles.darkPreviewPlaceholder} />
      </form>
    </Popover>
  );
}

export default SpacesComponent;
