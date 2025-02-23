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
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../util/DraggableContext";
import { useSynchronizedVerticalScroll } from "../../util/SynchronizedScroll";

import Section from "./SectionDesignSystem";
import InputDesignSystem from "./InputDesignSystem";
import SpacePreview from "./SpacePreview"; // le composant créé plus haut

import { DesignSystem, Space } from "../../domain/DesignSystemDomain";
import { generateUniqueSpacesKey } from "../../util/DesignSystemUtils";
import { DEFAULT_BASE } from "../../ui/UiConstants";
import CopyableLabel from "../../ui/kit/CopyableLabel";
import { useRefreshDesignSystemFormsEvent } from "../../util/RefreshDesignSystemFormsEvent";
import { isEqual } from "lodash";
// import { DEFAULT_SPACES } from "../../domain/DesignSystemDomain"; // si tu veux les defaults

function SpacesComponent() {
  const { designSystem, findDesignSystemColor, spacesMode } =
    useDesignSystemContext();
  const { base, spaces } = designSystem;
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);

  const { register, watch, control, handleSubmit, reset } = useForm<{
    spaces: Space[];
  }>({
    defaultValues: {
      spaces,
    },
  });

  const {
    fields: spacesArray,
    append,
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
        hoverIndex === "remove"
      )
        return;
      move(dragIndex, hoverIndex);
    }
  );

  const [scrollableLeft, scrollableRight] = useSynchronizedVerticalScroll();

  const spacesRef = useRef<HTMLFormElement>(null);
  useTriggerScroll({
    ref: spacesRef,
    triggerId: `spaces`,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: { spaces },
  });

  function submitSpaces(newSpaces: Pick<DesignSystem, "spaces">) {
    if (isEqual(newSpaces, spaces)) return;

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
      spaceValue: spacesArray[index]?.spaceValue ?? "8px",
    };
    insert(index + 1, newSpace);
    handleSubmit(submitSpaces)();
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
      onSubmit={handleSubmit(submitSpaces)}
      ref={spacesRef}
    >
      <div className={sideSettingsClass} ref={scrollableLeft}>
        <div className={styles.sideSettingsTitle}>
          <h5>Spaces</h5>
        </div>
        <div className="column">
          {spacesArray.map((field, index) => (
            <InputDesignSystem
              key={field.id}
              label={watch(`spaces.${index}.spaceKey`)}
              mode={spacesMode}
              handleSubmit={handleSubmit(submitSpaces)}
              value={watch(`spaces.${index}.spaceValue`)}
              isAddRemoveDragAllowed={true}
              onAdd={() => handleAddSpace(index)}
              onRemove={() => {
                remove(index);
                handleSubmit(submitSpaces)();
              }}
              draggableTools={draggableTools}
              index={index}
              registerKey={register(`spaces.${index}.spaceKey`)}
              register={register(`spaces.${index}.spaceValue`)}
              popoverCopy={
                <div className="popover-body">
                  <CopyableLabel
                    copyable={`space-${watch(`spaces.${index}.spaceKey`)}`}
                  />
                  <CopyableLabel
                    copyable={watch(`spaces.${index}.spaceValue`)}
                  />
                </div>
              }
            />
          ))}

          {ModificationsMode.includes("edit") && (
            <Section.EmptySection
              itemToInsert="space"
              onInsert={() => {
                append({
                  spaceKey: `1`,
                  spaceValue: "8px",
                });
              }}
              sectionLength={spacesArray.length}
              sectionName="spaces"
            />
          )}
          {!ModificationsMode.includes("edit") && !spacesArray.length && (
            <div className="row justify-center">Empty</div>
          )}
        </div>
      </div>

      <div className={styles.previewContainer}>
        <div
          className={styles.previewElement}
          ref={scrollableRight}
          style={{
            background: findDesignSystemColor({
              label: base.background.default,
              defaultValue: DEFAULT_BASE.background.default,
            }),
          }}
        >
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
      </div>

      <div className={styles.darkPreviewPlaceholder} />
    </form>
  );
}

export default SpacesComponent;
