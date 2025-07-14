import { useFieldArray, useForm } from "react-hook-form";
import { useDesignSystemContext } from "../DesignSystemContext";
import { isEqual } from "lodash";
import { useSaveDesignSystem } from "../DesignSystemQueries";
import { IndependantColors, Tint } from "../../../domain/DesignSystemDomain";
import { useRefreshDesignSystemFormsEvent } from "../../../util/RefreshDesignSystemFormsEvent";
import { useRef } from "react";
import { useSidebarComponentVisible } from "../../../util/SidebarComponentVisible";
import { useTriggerScroll } from "../../../util/TriggerScrollEvent";
import styles from "../ComponentDesignSystem.module.css";
import TintComponent from "./TintComponent";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../../util/DraggableContext";
import TintAddRemove from "./TintAddRemove";

function IndependantColorsComponent() {
  const { designSystem, editMode } = useDesignSystemContext();
  const { independantColors } = designSystem;
  const { saveDesignSystem } = useSaveDesignSystem(
    designSystem.metadata.designSystemPath
  );
  const {
    reset,
    handleSubmit,
    getValues,
    setValue,
    control,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: independantColors,
  });
  const tintsFieldArray = useFieldArray({
    control,
    name: "independantColors",
  });
  const { draggableTools } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: RemovableIndex) => {
      if (
        dragIndex !== undefined &&
        hoverIndex !== undefined &&
        dragIndex !== hoverIndex &&
        hoverIndex !== "remove"
      ) {
        tintsFieldArray.move(dragIndex, hoverIndex);
      }
      if (dragIndex !== undefined && hoverIndex === "remove") {
        tintsFieldArray.remove(dragIndex);
      }
      handleSubmit(submitIndependantColors)();
    }
  );

  const emptyColorsLength =
    designSystem.palettes.reduce((acc, cur) => {
      return cur.tints.length > acc ? cur.tints.length : acc;
    }, 5) -
    (independantColors.independantColors.length + (editMode ? 1 : 0));
  const independantColorsRef = useRef<HTMLFormElement>(null);
  useSidebarComponentVisible(independantColorsRef, "independant-colors");
  useTriggerScroll({
    ref: independantColorsRef,
    triggerId: `independant-colors`,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: independantColors,
  });

  function submitIndependantColors(newIndependantColors: IndependantColors) {
    if (isEqual(newIndependantColors, independantColors)) return;

    saveDesignSystem({
      designSystem: {
        ...designSystem,
        independantColors: newIndependantColors,
      },
      isTmp: true,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(submitIndependantColors)}
      ref={independantColorsRef}
      className={styles.componentDesignSystemColumn}
    >
      <div className={styles.shadesContainer}>
        <TintComponent
          getColor={() => getValues("white")}
          getLabel={() => "white"}
          keyReadOnly="white"
          setColor={(color: string) => setValue("white", color)}
          submitEvent={handleSubmit(submitIndependantColors)}
          tokenStart="color"
        />
        {tintsFieldArray.fields.map((tint, tintIndex) => (
          <TintComponent
            key={tint.id}
            getColor={() => getValues(`independantColors.${tintIndex}.color`)}
            getLabel={() => getValues(`independantColors.${tintIndex}.label`)}
            index={tintIndex}
            setColor={(color: string) =>
              setValue(`independantColors.${tintIndex}.color`, color)
            }
            submitEvent={handleSubmit(submitIndependantColors)}
            error={errors.independantColors?.[tintIndex]?.label?.message}
            tokenStart="color"
            registerKey={register(`independantColors.${tintIndex}.label`, {
              required: true,
              validate: (label: string) => {
                const duplicates = tintsFieldArray.fields.filter(
                  (_, i) =>
                    i !== tintIndex && tintsFieldArray.fields[i].label === label
                );
                return (
                  duplicates.length === 0 || "Shades key can't be duplicated"
                );
              },
            })}
            tintsArray={tintsFieldArray.fields}
            insertTint={(tintInsert: Tint) =>
              tintsFieldArray.insert(tintIndex, tintInsert, {
                shouldFocus: false,
              })
            }
            removeTint={tintsFieldArray.remove}
            draggableTools={draggableTools}
          />
        ))}
        {editMode && (
          <TintAddRemove
            draggableTools={draggableTools}
            handleSubmit={handleSubmit(submitIndependantColors)}
            appendTint={(tint: Tint) => tintsFieldArray.append(tint)}
            tintArray={tintsFieldArray.fields}
          />
        )}
        {Array.from({ length: emptyColorsLength }, (_, i) => (
          <div key={`${i}`}></div>
        ))}
      </div>
    </form>
  );
}

export default IndependantColorsComponent;
