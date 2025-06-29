import classNames from "classnames";
import styles from "../ComponentDesignSystem.module.css";
import {
  DEFAULT_TYPOGRAPHIES,
  DEFAULT_TYPOGRAPHY_SCALE,
} from "../../../ui/UiConstants";
import { useDesignSystemContext } from "../DesignSystemContext";
import { useFieldArray, useForm } from "react-hook-form";
import InputDesignSystem from "../InputDesignSystem";
import TypographyPopover from "./TypographyPopover";
import {
  CustomTypographyScale,
  Typographies,
  TypographyScale,
} from "../../../domain/DesignSystemDomain";
import { generateUniqueTypographyKey } from "../../../util/DesignSystemUtils";
import { useSaveDesignSystem } from "../DesignSystemQueries";
import { useParams } from "react-router-dom";
import TypographyPreview from "./TypographyPreview";
import { useRef } from "react";
import { useTriggerScroll } from "../../../util/TriggerScrollEvent";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../../util/DraggableContext";
import { isEqual } from "lodash";
import { useRefreshDesignSystemFormsEvent } from "../../../util/RefreshDesignSystemFormsEvent";
import InputDesignSystemAddRemove from "../InputDesignSystemAddRemove";
import { useSidebarComponentVisible } from "../../../util/SidebarComponentVisible";
import PreviewComponentDesignSystem from "../previews/PreviewComponentDesignSystem";
import Popover from "../../../ui/kit/Popover";

function TypographyComponent() {
  const { designSystem, editMode } = useDesignSystemContext();
  const { typography } = designSystem;
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);

  const { register, watch, control, handleSubmit, reset, setValue } = useForm({
    defaultValues: typography,
  });
  const {
    fields: customScales,
    insert,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "customScales",
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
      customScales,
      `additional-${index + 2}`
    );
    const newScale: CustomTypographyScale = {
      ...DEFAULT_TYPOGRAPHY_SCALE,
      scaleName: key,
    };
    insert(index + 1, newScale, { shouldFocus: false });
    handleSubmit(submitTypography)();
  }

  function submitTypography(newTypo: Typographies) {
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
    styles.bigHeight
  );

  function handleRemove(index: number) {
    remove(index);
    handleSubmit(submitTypography)();
  }

  function getTypoName(typographyScale: TypographyScale) {
    return `${
      typographyScale.fontSize.value
    } ${typographyScale.fontSize.unit.toLocaleLowerCase()} / ${
      typographyScale.lineHeight.value
    } ${typographyScale.lineHeight.unit.toLocaleLowerCase()}`;
  }

  return (
    <Popover onClose={handleSubmit(submitTypography)}>
      <form
        className={formClassNames}
        onSubmit={handleSubmit(submitTypography)}
        ref={typographyRef}
      >
        <div className={styles.sideSettings}>
          <div className={styles.sideSettingsTitle}>
            <h5>Typography scales</h5>
          </div>
          <div className="column">
            {DEFAULT_TYPOGRAPHIES.map((typoScale) => (
              <InputDesignSystem
                key={typoScale}
                label={typoScale}
                handleSubmit={handleSubmit(submitTypography)}
                value={getTypoName(watch(typoScale))}
                popoverEdit={
                  <TypographyPopover
                    register={register}
                    fieldPath={typoScale}
                    watch={watch}
                    setValue={setValue}
                    scaleName={typoScale}
                    handleSubmit={handleSubmit(submitTypography)}
                  />
                }
                tooltipValue={`typography-${
                  typoScale === "paragraph" ? "p" : typoScale
                }`}
                popoverId={typoScale}
              />
            ))}
          </div>
          <div className={styles.sideSettingsTitle}>
            <h5>Additionals scales</h5>
          </div>
          <div className="column">
            {customScales.map((scale, index) => (
              <InputDesignSystem
                label={scale.scaleName}
                key={scale.scaleName}
                handleSubmit={handleSubmit(submitTypography)}
                isAddRemoveDragAllowed={true}
                onAdd={() => handleAddAdditionalScale(index)}
                onRemove={() => handleRemove(index)}
                value={getTypoName(watch(`customScales.${index}.scale`))}
                registerKey={register(`customScales.${index}.scaleName`)}
                draggableTools={draggableTools}
                index={index}
                popoverEdit={
                  <TypographyPopover
                    register={register}
                    fieldPath={`customScales.${index}.scale`}
                    watch={watch}
                    setValue={setValue}
                    scaleName={scale.scaleName}
                    handleSubmit={handleSubmit(submitTypography)}
                  />
                }
                popoverId={scale.scaleName}
                tooltipValue={`typography-${scale.scaleName}`}
              />
            ))}
            {editMode && (
              <InputDesignSystemAddRemove
                draggableTools={draggableTools}
                itemName="typography"
                onAppend={() =>
                  handleAddAdditionalScale(customScales.length - 1)
                }
              />
            )}
            {!editMode && !customScales.length && (
              <div className="row justify-center">Empty</div>
            )}
          </div>
        </div>
        <PreviewComponentDesignSystem>
          <div
            className={styles.previewElement}
            style={{
              minHeight: "600px",
            }}
          >
            {DEFAULT_TYPOGRAPHIES.map((typoScale) => (
              <TypographyPreview
                key={typoScale}
                keyScale={typoScale}
                typographyScale={typography[typoScale]}
              />
            ))}
            {customScales.map((scale) => (
              <TypographyPreview
                key={scale.scaleName}
                keyScale={scale.scaleName}
                typographyScale={scale.scale}
              />
            ))}
          </div>
        </PreviewComponentDesignSystem>
        <div className={styles.darkPreviewPlaceholder} />
      </form>
    </Popover>
  );
}

export default TypographyComponent;
