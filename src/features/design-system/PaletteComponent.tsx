import {
  MdAdd,
  MdDeleteOutline,
  MdDragIndicator,
  MdEdit,
  MdRemove,
} from "react-icons/md";
import { Palette, DesignSystem } from "../../domain/DesignSystemDomain";
import styles from "./PaletteComponent.module.css";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import { ComponentMode, useDesignSystemContext } from "./DesignSystemContext";
import classNames from "classnames";
import { ButtonSignifiantAction } from "../../ui/kit/Buttons";
import { getRectPosition } from "../../util/PositionUtil";
import { useRef, useState } from "react";
import ShadeComponent from "./ShadeComponent";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import { generateUniqueColorPaletteKey } from "../../util/DesignSystemUtils";
import { useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import Section from "./SectionDesignSystem";
import {
  DraggableContext,
  useDraggableFeatures,
  useParentDraggableContext,
} from "../../util/DraggableContext";
import { getAllErrorMessages } from "../../util/HookFormUtils";

function PaletteComponent({
  colorPalette,
  index,
}: {
  colorPalette: Palette;
  index: number;
}) {
  const { activeComponent, designSystem } = useDesignSystemContext();
  const { paletteName, shades } = colorPalette;
  const [isHover, setIsHover] = useState(false);
  const colorPaletteRef = useRef<HTMLFormElement>(null);
  const componentId = "color-palette-" + paletteName;
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
    formState: { errors },
  } = useForm({
    defaultValues: colorPalette,
  });

  const {
    fields: shadesArray,
    insert,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "shades",
  });

  const { draggableFeatures } = useDraggableFeatures(
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

  //Check the state of actions (add remove...) for color palette
  //High level
  const isAllColorPalettesActive: boolean =
    activeComponent?.componentId === "color-palettes";

  //Low level
  const isColorPaletteActive = activeComponent?.componentId === componentId;
  const colorPaletteMode: ComponentMode = isColorPaletteActive
    ? activeComponent.mode
    : "default";

  function isColorPalettesMode(mode: ComponentMode): boolean {
    return activeComponent?.mode === mode;
  }

  const colorPalettesClass = classNames(
    styles.colorPalette,
    { [styles.add]: isAllColorPalettesActive && isColorPalettesMode("add") },
    {
      [styles.remove]:
        isAllColorPalettesActive && isColorPalettesMode("remove"),
    },
    {
      [styles.draggable]:
        (isAllColorPalettesActive &&
          isColorPalettesMode("drag") &&
          isHover &&
          dragIndex === undefined) ||
        dragIndex === index,
    },
    {
      [styles.dragHover]:
        isAllColorPalettesActive &&
        isColorPalettesMode("drag") &&
        dragIndex !== undefined &&
        dragIndex !== index &&
        hoverIndex === index,
    }
  );

  function handleClickEvent() {
    if (isAllColorPalettesActive && isColorPalettesMode("add")) {
      handleAddPalette();
    }
    if (isAllColorPalettesActive && isColorPalettesMode("remove")) {
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
    if (isAllColorPalettesActive && isColorPalettesMode("drag")) {
      setDragIndex(index);
    }
  }

  function handleMouseEnter() {
    setIsHover(true);
    if (
      isAllColorPalettesActive &&
      isColorPalettesMode("drag") &&
      dragIndex !== undefined
    ) {
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
      {isColorPalettesMode("remove") && isHover && isAllColorPalettesActive && (
        <ButtonSignifiantAction
          theme="remove"
          type="button"
          position={getRectPosition(
            "top-right",
            colorPaletteRef.current?.getBoundingClientRect(),
            "translate(50%, -50%)"
          )}
        >
          <MdDeleteOutline size={ICON_SIZE_MD} />
        </ButtonSignifiantAction>
      )}
      {isColorPalettesMode("add") && isHover && isAllColorPalettesActive && (
        <ButtonSignifiantAction
          theme="add"
          type="button"
          position={getRectPosition(
            "bottom-left",
            colorPaletteRef.current?.getBoundingClientRect(),
            "translate(-50%, -50%)"
          )}
        >
          <MdAdd size={ICON_SIZE_MD} />
        </ButtonSignifiantAction>
      )}
      <div className={styles.paletteHeader}>
        <h4 className={styles.paletteTitle}>
          {colorPaletteMode === "edit" ? (
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
            <div className={styles.readOnly}>{getValues(`paletteName`)}</div>
          )}
        </h4>
        <Section.Actions>
          <Section.ActionButton componentId={componentId} mode="remove">
            <MdRemove size={ICON_SIZE_MD} />
          </Section.ActionButton>
          <Section.ActionButton componentId={componentId} mode="edit">
            <MdEdit size={ICON_SIZE_MD} />
          </Section.ActionButton>
          <Section.ActionButton componentId={componentId} mode="drag">
            <MdDragIndicator size={ICON_SIZE_MD} />
          </Section.ActionButton>
          <Section.ActionButton componentId={componentId} mode="add">
            <MdAdd size={ICON_SIZE_MD} />
          </Section.ActionButton>
        </Section.Actions>
      </div>
      <DraggableContext.Provider value={draggableFeatures}>
        <div className={styles.shadesContainer}>
          {shadesArray.map((shade, index) => (
            <ShadeComponent
              key={shade.label}
              getValues={getValues}
              paletteMode={colorPaletteMode}
              isAllColorPalettesActive={isAllColorPalettesActive}
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
        </div>
      </DraggableContext.Provider>
      {getAllErrorMessages(errors).map((error) => (
        <small className="error">{error}</small>
      ))}
    </form>
  );
}

export default PaletteComponent;
