import classNames from "classnames";
import styles from "./ComponentDesignSystem.module.css";
import {
  DEFAULT_BASE,
  DEFAULT_TYPOGRAPHIES,
  DEFAULT_TYPOGRAPHY_SCALE,
} from "../../ui/UiConstants";
import {
  ModificationsMode,
  useDesignSystemContext,
} from "./DesignSystemContext";
import { useFieldArray, useForm } from "react-hook-form";
import InputDesignSystem from "./InputDesignSystem";
import TypographyPopover from "./TypographyPopover";
import Section from "./SectionDesignSystem";
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
import { useDraggableFeatures } from "../../util/DraggableContext";
import { useSynchronizedVerticalScroll } from "../../util/SynchronizedScroll";
import CopyableLabel from "../../ui/kit/CopyableLabel";

function TypographyComponent() {
  const { designSystem, findDesignSystemColor, typographyMode } =
    useDesignSystemContext();
  const { base, typography } = designSystem;
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const [scrollableLeft, scrollableRight] = useSynchronizedVerticalScroll();

  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: typography,
  });
  const {
    fields: additionalsScales,
    append,
    insert,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "additionalsScales",
  });
  const { draggableTools } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: number) => {
      if (dragIndex === undefined || hoverIndex === undefined) return;
      move(dragIndex, hoverIndex);
    }
  );
  const typographyRef = useRef(null);
  useTriggerScroll({
    ref: typographyRef,
    triggerId: `typography`,
  });

  function handleAddAdditionalScale(index: number) {
    const key = generateUniqueTypographyKey(
      additionalsScales,
      `additional-${index + 2}`
    );
    const newScale: AdditionalTypographyScale = {
      ...DEFAULT_TYPOGRAPHY_SCALE,
      scaleName: key,
    };
    insert(index + 1, newScale);
  }

  function submitTypography(newTypo: Typography) {
    if (!isDirty) return;
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

  return (
    <form
      className={formClassNames}
      onSubmit={handleSubmit(submitTypography)}
      ref={typographyRef}
    >
      <div className={sideSettingsClass} ref={scrollableLeft}>
        <div className={styles.sideSettingsTitle}>
          <h5>Typography scales</h5>
        </div>
        <div className="column">
          {DEFAULT_TYPOGRAPHIES.map((typoScale) => (
            <InputDesignSystem
              label={typoScale}
              mode={typographyMode}
              handleSubmit={handleSubmit(submitTypography)}
              value={`${watch(`${typoScale}.fontSize`)}/${watch(
                `${typoScale}.lineHeight`
              )}`}
              popoverCopy={
                <div className="popover-body">
                  <CopyableLabel copyable={`font-size-${typoScale}`}/>
                  <CopyableLabel copyable={`font-weight-${typoScale}`}/>
                  <CopyableLabel copyable={`line-height-${typoScale}`}/>
                </div>
              }
              popoverEdit={
                <TypographyPopover
                  register={register}
                  mode={typographyMode}
                  fieldPath={typoScale}
                  watch={watch}
                />
              }
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
              mode={typographyMode}
              handleSubmit={handleSubmit(submitTypography)}
              isAddRemoveDragAllowed={true}
              onAdd={() => handleAddAdditionalScale(index)}
              onRemove={() => remove(index)}
              value={`${watch(
                `additionalsScales.${index}.scale.fontSize`
              )}/${watch(`additionalsScales.${index}.scale.fontSize`)}`}
              registerKey={register(`additionalsScales.${index}.scaleName`)}
              draggableTools={draggableTools}
              index={index}
              popoverEdit={
                <TypographyPopover
                  register={register}
                  mode={typographyMode}
                  fieldPath={`additionalsScales.${index}.scale`}
                  watch={watch}
                />
              }
            />
          ))}
          {ModificationsMode.includes(typographyMode) && (
            <Section.EmptySection
              itemToInsert="font"
              onInsert={() => {
                append(DEFAULT_TYPOGRAPHY_SCALE);
              }}
              sectionLength={additionalsScales.length}
              sectionName="additionals"
            />
          )}
          {!ModificationsMode.includes(typographyMode) &&
            !additionalsScales.length && (
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
          {DEFAULT_TYPOGRAPHIES.map((typoScale) => (
            <TypographyPreview
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
