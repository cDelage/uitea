import { Palette, DesignSystem } from "../../domain/DesignSystemDomain";
import styles from "./ComponentDesignSystem.module.css";
import { useDesignSystemContext } from "./DesignSystemContext";
import classNames from "classnames";
import { useRef, useState } from "react";
import ShadeComponent from "./ShadeComponent";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import { generateUniqueColorPaletteKey } from "../../util/DesignSystemUtils";
import { useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import {
  DraggableContext,
  useDraggableFeatures,
  useParentDraggableContext,
} from "../../util/DraggableContext";
import { getAllErrorMessages } from "../../util/HookFormUtils";
import { useTriggerScroll } from "../../util/TriggerScrollEvent";
import { useRefreshDesignSystemFormsEvent } from "../../util/RefreshDesignSystemFormsEvent";
import Section from "./SectionDesignSystem";

function PaletteComponent({
  colorPalette,
  index,
}: {
  colorPalette: Palette;
  index: number;
}) {
  const { shadesMode, palettesMode, designSystem } = useDesignSystemContext();
  const { paletteName, shades } = colorPalette;
  const [isHover, setIsHover] = useState(false);
  const colorPaletteRef = useRef<HTMLFormElement>(null);
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const { setDragIndex, dragIndex, setHoverIndex, hoverIndex } =
    useParentDraggableContext();

  //Form
  const {
    control,
    register,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: colorPalette,
  });

  const {
    fields: shadesArray,
    insert,
    remove,
    move,
    append,
  } = useFieldArray({
    control,
    name: "shades",
  });
  useTriggerScroll({
    ref: colorPaletteRef,
    triggerId: `palette-${paletteName}`,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: colorPalette,
  });

  const { draggableTools: draggableFeatures } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: number) => {
      if (
        dragIndex !== undefined &&
        hoverIndex !== undefined &&
        dragIndex !== hoverIndex
      ) {
        move(dragIndex, hoverIndex);
      }
      handleSubmit(submitPalette)();
    }
  );

  const colorPalettesClass = classNames(
    styles.componentDesignSystemColumn,
    { "add": palettesMode === "add" },
    {
      "remove": palettesMode === "remove",
    },
    {
      "draggable":
        (palettesMode === "drag" && isHover && dragIndex === undefined) ||
        dragIndex === index,
    },
    {
      "drag-hover-top":
        palettesMode === "drag" &&
        dragIndex !== undefined &&
        dragIndex !== index &&
        hoverIndex === index,
    }
  );

  function handleClickEvent() {
    if (palettesMode === "add") {
      handleAddPalette();
    }
    if (palettesMode === "remove") {
      handleRemovePalette();
    }
  }

  function handleAddPalette() {
    const newPalette: Palette = {
      paletteName: generateUniqueColorPaletteKey(
        designSystem.palettes,
        `palette-${index + 2}`
      ),
      shades: shades.map((shade) => {
        return {
          ...shade,
          color: "#DDDDDD",
        };
      }),
    };

    designSystem.palettes.splice(index + 1, 0, newPalette);
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
    if (palettesMode === "drag") {
      setDragIndex(index);
    }
  }

  function handleMouseEnter() {
    setIsHover(true);
    if (palettesMode === "drag" && dragIndex !== undefined) {
      setHoverIndex(index);
    }
  }

  function submitPalette(palette: Palette) {
    const newColorPalettes: Palette[] = [...designSystem.palettes];
    newColorPalettes.splice(index, 1, palette);
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        palettes: newColorPalettes,
      },
      isTmp: true,
    });
  }

  function createFirstShade() {
    append({
      label: "50",
      color: "#DDDDDD",
    });
    handleSubmit(submitPalette)();
  }

  return (
    <form
      className={colorPalettesClass}
      ref={colorPaletteRef}
      onClick={handleClickEvent}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHover(false)}
      onDragStart={(e) => e.preventDefault()}
      onMouseDown={handleMouseDown}
      onSubmit={handleSubmit(submitPalette)}
    >
      <div className={styles.componentHead}>
        <h4>
          {shadesMode === "edit" ? (
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
                    duplicates.length === 0 ||
                    "Palette name can't be duplicated"
                  );
                },
              })}
              onBlur={() => handleSubmit(submitPalette)()}
            />
          ) : (
            <div className="inherit-input-placeholder">
              {getValues(`paletteName`)}
            </div>
          )}
        </h4>
      </div>
      <DraggableContext.Provider value={draggableFeatures}>
        <div className={styles.shadesContainer}>
          {shadesArray.map((shade, index) => (
            <ShadeComponent
              key={shade.label}
              getValues={getValues}
              remove={remove}
              index={index}
              register={register}
              insert={insert}
              shades={shadesArray}
              submitEvent={() => {
                handleSubmit(submitPalette)();
              }}
              error={errors.shades?.[index]?.label?.message}
              paletteName={paletteName}
            />
          ))}
          <Section.EmptySection
            itemToInsert="shade"
            onInsert={createFirstShade}
            sectionLength={shadesArray.length}
            sectionName="palette"
            mediumHeight={true}
          />
        </div>
      </DraggableContext.Provider>
      {getAllErrorMessages(errors).map((error) => (
        <small className="error">{error}</small>
      ))}
    </form>
  );
}

export default PaletteComponent;
