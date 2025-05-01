import classNames from "classnames";
import styles from "../ComponentDesignSystem.module.css";
import { DEFAULT_BASE, DEFAULT_EFFECT } from "../../../ui/UiConstants";
import { useDesignSystemContext } from "../DesignSystemContext";
import { useFieldArray, useForm } from "react-hook-form";
import { Effect } from "../../../domain/DesignSystemDomain";
import { useSaveDesignSystem } from "../DesignSystemQueries";
import { useParams } from "react-router-dom";
import { useSynchronizedVerticalScroll } from "../../../util/SynchronizedScroll";
import InputDesignSystem from "../InputDesignSystem";
import EffectsPopover from "./EffectsPopover";
import { generateUniqueEffectsKey } from "../../../util/DesignSystemUtils";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../../util/DraggableContext";
import { useTriggerScroll } from "../../../util/TriggerScrollEvent";
import { useRef } from "react";
import { useRefreshDesignSystemFormsEvent } from "../../../util/RefreshDesignSystemFormsEvent";
import EffectsPreview from "./EffectsPreview";
import { isEqual } from "lodash";
import InputDesignSystemAddRemove from "../InputDesignSystemAddRemove";
import { useSidebarComponentVisible } from "../../../util/SidebarComponentVisible";

function EffectsComponent() {
  const { designSystem, findDesignSystemColor, editMode } =
    useDesignSystemContext();
  const { base, effects } = designSystem;
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const [scrollableLeft, scrollableRight] = useSynchronizedVerticalScroll();
  const topTooltipRef = useRef(null);
  const { register, watch, control, handleSubmit, setValue, getValues, reset } =
    useForm({
      defaultValues: { effects },
    });
  const {
    fields: effectsFields,
    insert,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "effects",
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
      handleSubmit(submitEffects)();
    }
  );
  const effectsRef = useRef(null);

  useSidebarComponentVisible(effectsRef, "effects");
  useTriggerScroll({
    ref: effectsRef,
    triggerId: `effects`,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: { effects },
  });

  function submitEffects({ effects: newEffects }: { effects: Effect[] }) {
    if (isEqual(newEffects, effects)) return;
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        effects: newEffects,
      },
      isTmp: true,
    });
  }

  function handleAddEffect(index: number) {
    const key = generateUniqueEffectsKey(effectsFields, `effect-${index + 2}`);
    const newEffect: Effect = {
      ...DEFAULT_EFFECT,
      effectName: key,
    };
    insert(index + 1, newEffect, { shouldFocus: false });
    handleSubmit(submitEffects)();
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
      onSubmit={handleSubmit(submitEffects)}
      ref={effectsRef}
    >
      <div>
        <div ref={topTooltipRef} className="relative" />
        <div className={sideSettingsClass} ref={scrollableLeft}>
          <div className="column">
            {effectsFields.map((effect, index) => (
              <InputDesignSystem
                key={effect.effectName}
                keyPopover={`effect-${index}`}
                label={watch(`effects.${index}.effectName`)}
                draggableTools={draggableTools}
                isAddRemoveDragAllowed={true}
                index={index}
                onAdd={() => handleAddEffect(index)}
                onRemove={() => {
                  remove(index);
                  handleSubmit(submitEffects);
                }}
                value={effect.items.map((item) => item.effectValue).join(",")}
                registerKey={register(`effects.${index}.effectName`, {
                  required: true,
                })}
                handleSubmit={handleSubmit(submitEffects)}
                popoverEdit={
                  <EffectsPopover
                    effect={effect}
                    register={register}
                    index={index}
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    getValue={getValues}
                    handleSubmit={handleSubmit(submitEffects)}
                  />
                }
                tooltipValue={`effect-${effect.effectName}`}
                portalTooltip={index === 0 ? topTooltipRef : undefined}
              />
            ))}
            {editMode && (
              <InputDesignSystemAddRemove
                draggableTools={draggableTools}
                itemName="effect"
                onAppend={() => handleAddEffect(effectsFields.length - 1)}
              />
            )}
            {!editMode && !effectsFields.length && (
              <div className="row justify-center">Empty</div>
            )}
          </div>
        </div>
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
          {watch(`effects`).map((effect) => (
            <EffectsPreview key={effect.effectName} effect={effect} />
          ))}
        </div>
      </div>
      <div className={styles.darkPreviewPlaceholder} />
    </form>
  );
}

export default EffectsComponent;
