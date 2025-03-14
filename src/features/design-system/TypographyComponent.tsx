import classNames from "classnames";
import styles from "./ComponentDesignSystem.module.css";
import {
  DEFAULT_BASE,
  DEFAULT_TYPOGRAPHIES,
  DEFAULT_TYPOGRAPHY_SCALE,
} from "../../ui/UiConstants";
import { useDesignSystemContext } from "./DesignSystemContext";
import { useFieldArray, useForm } from "react-hook-form";
import InputDesignSystem from "./InputDesignSystem";
import TypographyPopover from "./TypographyPopover";
import {
  AdditionalTypographyScale,
  Typography,
} from "../../domain/DesignSystemDomain";
import { generateUniqueTypographyKey } from "../../util/DesignSystemUtils";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import { useParams } from "react-router-dom";
import TypographyPreview from "./TypographyPreview";
import { useRef } from "react";
import { useTriggerScroll } from "../../util/TriggerScrollEvent";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../util/DraggableContext";
import { isEqual } from "lodash";
import { useRefreshDesignSystemFormsEvent } from "../../util/RefreshDesignSystemFormsEvent";
import InputDesignSystemAddRemove from "./InputDesignSystemAddRemove";
import { useSidebarComponentVisible } from "../../util/SidebarComponentVisible";

function TypographyComponent() {
  const { designSystem, findDesignSystemColor, editMode } =
    useDesignSystemContext();
  const { base, typography } = designSystem;
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);

  const { register, watch, control, handleSubmit, reset } = useForm({
    defaultValues: typography,
  });
  const {
    fields: additionalsScales,
    insert,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "additionalsScales",
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
      handleSubmit(submitTypography)();
    }
  );
  const typographyRef = useRef(null);
  useTriggerScroll({
    ref: typographyRef,
    triggerId: `typography`,
  });

  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: typography,
  });
  useSidebarComponentVisible(typographyRef, "typography");

  function handleAddAdditionalScale(index: number) {

    const key = generateUniqueTypographyKey(
      additionalsScales,
      `additional-${index + 2}`
    );
    const newScale: AdditionalTypographyScale = {
      ...DEFAULT_TYPOGRAPHY_SCALE,
      scaleName: key,
    };
    insert(index + 1, newScale, { shouldFocus: false });
    handleSubmit(submitTypography)();

  }

  function submitTypography(newTypo: Typography) {
    if (isEqual(newTypo, typography)) return;

    saveDesignSystem({
      designSystem: {
        ...designSystem,
        typography: newTypo,
      },
      isTmp: true,
    });
  }

  const formClassNames = classNames(
    styles.componentDesignSystem,
    styles.mediumHeight
  );

  const sideSettingsClass = classNames(
    styles.sideSettings,
    styles.scrollableSettings
  );

  function handleRemove(index: number) {
    remove(index);
    handleSubmit(submitTypography)();

  }

  return (
    <form
      className={formClassNames}
      onSubmit={handleSubmit(submitTypography)}
      ref={typographyRef}
    >
      <div className={sideSettingsClass}>
        <div className={styles.sideSettingsTitle}>
          <h5>Typography scales</h5>
        </div>
        <div className="column">
          {DEFAULT_TYPOGRAPHIES.map((typoScale) => (
            <InputDesignSystem
              key={typoScale}
              label={typoScale}
              handleSubmit={handleSubmit(submitTypography)}
              value={`${watch(`${typoScale}.fontSize`)}/${watch(
                `${typoScale}.lineHeight`
              )}`}
              popoverEdit={
                <TypographyPopover
                  register={register}
                  fieldPath={typoScale}
                  watch={watch}
                  scaleName={typoScale}
                />
              }
              tooltipValue={`typography-${typoScale === "paragraph" ? "p" : typoScale}`}
              keyPopover={typoScale}
            />
          ))}
        </div>
        <div className={styles.sideSettingsTitle}>
          <h5>Additionals scales</h5>
        </div>
        <div className="column">
          {additionalsScales.map((scale, index) => (
            <InputDesignSystem
              label={scale.scaleName}
              key={scale.scaleName}
              handleSubmit={handleSubmit(submitTypography)}
              isAddRemoveDragAllowed={true}
              onAdd={() => handleAddAdditionalScale(index)}
              onRemove={() => handleRemove(index)}
              value={`${watch(
                `additionalsScales.${index}.scale.fontSize`
              )}/${watch(`additionalsScales.${index}.scale.fontSize`)}`}
              registerKey={register(`additionalsScales.${index}.scaleName`)}
              draggableTools={draggableTools}
              index={index}
              popoverEdit={
                <TypographyPopover
                  register={register}
                  fieldPath={`additionalsScales.${index}.scale`}
                  watch={watch}
                  scaleName={scale.scaleName}
                />
              }
              keyPopover={scale.scaleName}
              tooltipValue={`typography-${scale.scaleName}`}
            />
          ))}
          {editMode && (
            <InputDesignSystemAddRemove
              draggableTools={draggableTools}
              itemName="typography"
              onAppend={() =>
                handleAddAdditionalScale(additionalsScales.length - 1)
              }
            />
          )}
          {!editMode && !additionalsScales.length && (
            <div className="row justify-center">Empty</div>
          )}
        </div>
      </div>
      <div className={styles.previewContainer}>
        <div
          className={styles.previewElement}
          style={{
            background: findDesignSystemColor({
              label: base.background.default,
              defaultValue: DEFAULT_BASE.background.default,
            }),
          }}
        >
          {DEFAULT_TYPOGRAPHIES.map((typoScale) => (
            <TypographyPreview
              key={typoScale}
              keyScale={typoScale}
              typographyScale={typography[typoScale]}
            />
          ))}
          {additionalsScales.map((scale) => (
            <TypographyPreview
              key={scale.scaleName}
              keyScale={scale.scaleName}
              typographyScale={scale.scale}
            />
          ))}
        </div>
      </div>
      <div className={styles.darkPreviewPlaceholder} />
    </form>
  );
}

export default TypographyComponent;
