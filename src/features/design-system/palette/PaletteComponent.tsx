import {
  DesignSystem,
  Palette,
  Tint,
} from "../../../domain/DesignSystemDomain";
import styles from "../ComponentDesignSystem.module.css";
import { useDesignSystemContext } from "../DesignSystemContext";
import classNames from "classnames";
import { useRef } from "react";
import TintComponent from "./TintComponent";
import { useSaveDesignSystem } from "../DesignSystemQueries";
import { useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import {
  DraggableContext,
  RemovableIndex,
  useDraggableFeatures,
  useParentDraggableContext,
} from "../../../util/DraggableContext";
import { getAllErrorMessages } from "../../../util/HookFormUtils";
import { useTriggerScroll } from "../../../util/TriggerScrollEvent";
import { useRefreshDesignSystemFormsEvent } from "../../../util/RefreshDesignSystemFormsEvent";
import TintAddRemove from "./TintAddRemove";
import Popover from "../../../ui/kit/Popover";
import {
  MdArrowDownward,
  MdArrowUpward,
  MdDelete,
  MdDragIndicator,
  MdMoreHoriz,
} from "react-icons/md";
import { ICON_SIZE_MD } from "../../../ui/UiConstants";
import { generateUniquePaletteKey } from "../../../util/DesignSystemUtils";
import isEqual from "lodash/isEqual";
import { useSidebarComponentVisible } from "../../../util/SidebarComponentVisible";

function PaletteComponent({
  colorPalette,
  index,
}: {
  colorPalette: Palette;
  index: number;
}) {
  const { designSystem, editMode } = useDesignSystemContext();
  const { paletteName } = colorPalette;
  const componentId = `palette-${paletteName}`;
  const colorPaletteRef = useRef<HTMLFormElement>(null);
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const { setDragIndex, dragIndex, setHoverIndex, hoverIndex } =
    useParentDraggableContext();
  useSidebarComponentVisible(colorPaletteRef, componentId);
  //Form
  const {
    control,
    register,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: colorPalette,
  });

  useTriggerScroll({
    ref: colorPaletteRef,
    triggerId: componentId,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: colorPalette,
  });
  
  const tintsFieldArray = useFieldArray({
    control,
    name: "tints",
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
      handleSubmit(submitPalette)();
    }
  );

  const colorPalettesClass = classNames(
    styles.componentDesignSystemColumn,
    {
      draggable: dragIndex === index,
    },
    {
      "drag-hover-top":
        dragIndex !== undefined && dragIndex !== index && hoverIndex === index,
    }
  );

  function handleAddPalette(place: "before" | "after") {
    const newIndex = place === "before" ? index : index + 1;
    const newPalette: Palette = {
      paletteName: generateUniquePaletteKey(
        designSystem.palettes,
        `palette-${newIndex + 1}`
      ),
      tints: tintsFieldArray.fields.map((shade) => {
        return {
          ...shade,
          color: "#DDDDDD",
        };
      }),
    };

    designSystem.palettes.splice(newIndex, 0, newPalette);
    const newDesignSystem: DesignSystem = {
      ...designSystem,
      palettes: Array.from([...designSystem.palettes]),
    };
    saveDesignSystem({
      designSystem: newDesignSystem,
      isTmp: true,
    });
  }

  function handleRemovePalette() {
    const newDesignSystem: DesignSystem = {
      ...designSystem,
      palettes: designSystem.palettes.filter(
        (pal) => pal.paletteName !== paletteName
      ),
    };
    saveDesignSystem({
      designSystem: newDesignSystem,
      isTmp: true,
    });
  }

  function handleMouseDown() {
    setDragIndex(index);
  }

  function handleMouseEnter() {
    if (dragIndex !== undefined) {
      setHoverIndex(index);
    }
  }

  function submitPalette(newPalette: Palette) {
    if (isEqual(newPalette, colorPalette)) return;
    const newColorPalettes: Palette[] = [...designSystem.palettes];
    newColorPalettes.splice(index, 1, newPalette);
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        palettes: newColorPalettes,
      },
      isTmp: true,
    });
  }

  return (
    <form
      className={colorPalettesClass}
      ref={colorPaletteRef}
      onMouseEnter={handleMouseEnter}
      onDragStart={(e) => e.preventDefault()}
      onSubmit={handleSubmit(submitPalette)}
    >
      <div className={styles.componentHead}>
        <h4>
          <input
            className="inherit-input"
            {...register("paletteName", {
              required: true,
              validate: (paletteNameValue: string) => {
                const duplicates = designSystem.palettes.filter(
                  (_, i) =>
                    i !== index &&
                    designSystem.palettes[i].paletteName === paletteNameValue
                );
                return (
                  duplicates.length === 0 || "Palette name can't be duplicated"
                );
              },
            })}
            readOnly={!editMode}
            onMouseDown={(e) => {
              if (e.currentTarget.readOnly) {
                e.preventDefault();
              }
            }}
            onBlur={() => handleSubmit(submitPalette)()}
          />
        </h4>
        {editMode && (
          <div className="row gap-3 align-center">
            <button
              type="button"
              className="action-ghost-button cursor-drag"
              onMouseDown={handleMouseDown}
            >
              <MdDragIndicator size={ICON_SIZE_MD} />
            </button>
            <Popover>
              <Popover.Toggle id="menu-palette" positionPayload="bottom-right">
                <button type="button" className="action-ghost-button">
                  <MdMoreHoriz size={ICON_SIZE_MD} />
                </button>
              </Popover.Toggle>
              <Popover.Body id="menu-palette">
                <Popover.Actions>
                  <Popover.Tab clickEvent={() => handleAddPalette("before")}>
                    <>
                      <MdArrowUpward size={ICON_SIZE_MD} />
                      Insert palette before
                    </>
                  </Popover.Tab>
                  <Popover.Tab clickEvent={() => handleAddPalette("after")}>
                    <>
                      <MdArrowDownward size={ICON_SIZE_MD} />
                      Insert palette after
                    </>
                  </Popover.Tab>
                  <Popover.Tab clickEvent={() => handleRemovePalette()}>
                    <div className="remove-text-color row align-center gap-3">
                      <MdDelete size={ICON_SIZE_MD} />
                      Remove palette
                    </div>
                  </Popover.Tab>
                </Popover.Actions>
              </Popover.Body>
            </Popover>
          </div>
        )}
      </div>
      <DraggableContext.Provider value={draggableTools}>
        <div className={styles.shadesContainer}>
          {tintsFieldArray.fields.map((tint, tintIndex) => (
            <TintComponent
              key={tint.id}
              getColor={() => getValues(`tints.${tintIndex}.color`)}
              getLabel={() => getValues(`tints.${tintIndex}.label`)}
              index={tintIndex}
              setColor={(color: string) =>
                setValue(`tints.${tintIndex}.color`, color)
              }
              submitEvent={handleSubmit(submitPalette)}
              error={errors.tints?.[index]?.label?.message}
              paletteName={paletteName}
              tokenStart="palette"
              registerKey={register(`tints.${tintIndex}.label`, {
                required: true,
                validate: (label: string) => {
                  const duplicates = tintsFieldArray.fields.filter(
                    (_, i) =>
                      i !== tintIndex &&
                      tintsFieldArray.fields[i].label === label
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
              handleSubmit={handleSubmit(submitPalette)}
              appendTint={(tint: Tint) =>
                tintsFieldArray.append(tint)
              }
              tintArray={tintsFieldArray.fields}
            />
          )}
        </div>
      </DraggableContext.Provider>
      {getAllErrorMessages(errors).map((error) => (
        <small className="error">{error}</small>
      ))}
    </form>
  );
}

export default PaletteComponent;
