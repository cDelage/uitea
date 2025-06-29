import styles from "../ComponentDesignSystem.module.css";
import { useDesignSystemContext } from "../DesignSystemContext";
import { useFieldArray, useForm } from "react-hook-form";
import { Shadows } from "../../../domain/DesignSystemDomain";
import { useSaveDesignSystem } from "../DesignSystemQueries";
import { useParams } from "react-router-dom";
import { useSynchronizedVerticalScroll } from "../../../util/SynchronizedScroll";
import InputDesignSystem from "../InputDesignSystem";
import ShadowPopover from "./ShadowPopover";
import { generateUniqueEffectsKey } from "../../../util/DesignSystemUtils";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../../util/DraggableContext";
import { useTriggerScroll } from "../../../util/TriggerScrollEvent";
import { useRef } from "react";
import { useRefreshDesignSystemFormsEvent } from "../../../util/RefreshDesignSystemFormsEvent";
import ShadowPreview from "./ShadowPreview";
import { isEqual } from "lodash";
import InputDesignSystemAddRemove from "../InputDesignSystemAddRemove";
import { useSidebarComponentVisible } from "../../../util/SidebarComponentVisible";
import PreviewComponentDesignSystem from "../previews/PreviewComponentDesignSystem";
import Popover from "../../../ui/kit/Popover";
import { DEFAULT_SHADOW } from "../../../ui/UiConstants";

function ShadowsComponent() {
  const { designSystem, editMode } = useDesignSystemContext();
  const { shadows } = designSystem;
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const [scrollableLeft, scrollableRight] = useSynchronizedVerticalScroll();
  const topTooltipRef = useRef(null);
  const { register, watch, control, handleSubmit, setValue, reset } = useForm({
    defaultValues: { shadows },
  });
  const {
    fields: effectsFields,
    insert,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "shadows",
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

  useSidebarComponentVisible(effectsRef, "shadows");
  useTriggerScroll({
    ref: effectsRef,
    triggerId: `shadows`,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: { shadows },
  });

  function submitEffects({ shadows: newShadows }: { shadows: Shadows[] }) {
    if (isEqual(newShadows, shadows)) return;
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        shadows: newShadows,
      },
      isTmp: true,
    });
  }

  function handleAddEffect(index: number) {
    const key = generateUniqueEffectsKey(effectsFields, `effect-${index + 2}`);
    const newEffect: Shadows = {
      shadowsArray: [DEFAULT_SHADOW],
      shadowName: key,
    };
    insert(index + 1, newEffect, { shouldFocus: false });
    handleSubmit(submitEffects)();
  }

  return (
    <Popover>
      <form
        className={styles.componentDesignSystem}
        onSubmit={handleSubmit(submitEffects)}
        ref={effectsRef}
      >
        <div>
          <div ref={topTooltipRef} className="relative" />
          <div className={styles.sideSettings} ref={scrollableLeft}>
            <div className="column">
              {effectsFields.map((effect, index) => (
                <InputDesignSystem
                  key={effect.shadowName}
                  popoverId={`shadow-${index}`}
                  label={watch(`shadows.${index}.shadowName`)}
                  draggableTools={draggableTools}
                  isAddRemoveDragAllowed={true}
                  index={index}
                  onAdd={() => handleAddEffect(index)}
                  onRemove={() => {
                    remove(index);
                    handleSubmit(submitEffects);
                  }}
                  value={effect.shadowsArray
                    .map(
                      (item) =>
                        `[${item.color},${item.shadowX},${item.shadowY},${item.blur},${item.spread}]`
                    )
                    .join(",")}
                  registerKey={register(`shadows.${index}.shadowName`, {
                    required: true,
                  })}
                  handleSubmit={handleSubmit(submitEffects)}
                  popoverEdit={
                    <ShadowPopover
                      effect={effect}
                      index={index}
                      control={control}
                      setValue={setValue}
                      shadows={watch(`shadows.${index}`)}
                      handleSubmit={handleSubmit(submitEffects)}
                    />
                  }
                  tooltipValue={`shadow-${effect.shadowName}`}
                  portalTooltip={index === 0 ? topTooltipRef : undefined}
                />
              ))}
              {editMode && (
                <InputDesignSystemAddRemove
                  draggableTools={draggableTools}
                  itemName="shadow"
                  onAppend={() => handleAddEffect(effectsFields.length - 1)}
                />
              )}
              {!editMode && !effectsFields.length && (
                <div className="row justify-center">Empty</div>
              )}
            </div>
          </div>
        </div>
        <PreviewComponentDesignSystem>
          <div className={styles.previewElementWrap} ref={scrollableRight}>
            {watch(`shadows`).map((effect) => (
              <ShadowPreview key={effect.shadowName} effect={effect} />
            ))}
          </div>
        </PreviewComponentDesignSystem>
        <div className={styles.darkPreviewPlaceholder} />
      </form>
    </Popover>
  );
}

export default ShadowsComponent;
