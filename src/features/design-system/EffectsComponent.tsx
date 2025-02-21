import classNames from "classnames";
import styles from "./ComponentDesignSystem.module.css";
import { DEFAULT_BASE, DEFAULT_EFFECT } from "../../ui/UiConstants";
import {
  ModificationsMode,
  useDesignSystemContext,
} from "./DesignSystemContext";
import { useFieldArray, useForm } from "react-hook-form";
import { Effect } from "../../domain/DesignSystemDomain";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import { useParams } from "react-router-dom";
import { useSynchronizedVerticalScroll } from "../../util/SynchronizedScroll";
import Section from "./SectionDesignSystem";
import InputDesignSystem from "./InputDesignSystem";
import EffectsPopover from "./EffectsPopover";
import CopyableLabel from "../../ui/kit/CopyableLabel";
import { generateUniqueEffectsKey } from "../../util/DesignSystemUtils";
import { useDraggableFeatures } from "../../util/DraggableContext";
import { useTriggerScroll } from "../../util/TriggerScrollEvent";
import { useRef } from "react";
import { useRefreshDesignSystemFormsEvent } from "../../util/RefreshDesignSystemFormsEvent";
import EffectsPreview from "./EffectsPreview";

function EffectsComponent() {
  const { designSystem, findDesignSystemColor, effectsMode } =
    useDesignSystemContext();
  const { base, effects } = designSystem;
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const [scrollableLeft, scrollableRight] = useSynchronizedVerticalScroll();

  const {
    register,
    watch,
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: { effects },
  });
  const {
    fields: effectsFields,
    append,
    insert,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "effects",
  });
  const { draggableTools } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: number) => {
      if (dragIndex === undefined || hoverIndex === undefined) return;
      move(dragIndex, hoverIndex);
    }
  );
  const effectsRef = useRef(null);
  useTriggerScroll({
    ref: effectsRef,
    triggerId: `effects`,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: { effects },
  });

  function submitEffects({ effects: newEffects }: { effects: Effect[] }) {
    if (!isDirty) return;
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
    insert(index + 1, newEffect);
    handleSubmit(submitEffects);
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
      <div className={sideSettingsClass} ref={scrollableLeft}>
        <div className="column">
          {effectsFields.map((effect, index) => (
            <InputDesignSystem
              key={effect.effectName}
              label={watch(`effects.${index}.effectName`)}
              mode={effectsMode}
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
                  mode={effectsMode}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  getValue={getValues}
                  handleSubmit={handleSubmit(submitEffects)}
                />
              }
              popoverCopy={
                <div className="popover-body">
                  <CopyableLabel copyable={`effect-${effect.effectName}`} />
                  <CopyableLabel
                    copyable={effect.items
                      .map((item) => item.effectValue)
                      .join(",")}
                  />
                </div>
              }
            />
          ))}
          {ModificationsMode.includes(effectsMode) && (
            <Section.EmptySection
              itemToInsert="effect"
              onInsert={() => {
                append(DEFAULT_EFFECT);
              }}
              sectionLength={effectsFields.length}
              sectionName="effects"
            />
          )}
          {!ModificationsMode.includes(effectsMode) &&
            !effectsFields.length && (
              <div className="row justify-center">Empty</div>
            )}
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
          {watch(`effects`).map(effect => <EffectsPreview key={effect.effectName} effect={effect}/>)}
        </div>
      </div>
      <div className={styles.darkPreviewPlaceholder} />
    </form>
  );
}

export default EffectsComponent;
