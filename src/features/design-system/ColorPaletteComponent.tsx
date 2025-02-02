import {
  MdAdd,
  MdDeleteOutline,
  MdDragIndicator,
  MdEdit,
  MdRemove,
} from "react-icons/md";
import { ColorPalette, DesignSystem } from "../../domain/DesignSystemDomain";
import styles from "./ColorPaletteComponent.module.css";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import { ComponentMode, useDesignSystemContext } from "./DesignSystemContext";
import classNames from "classnames";
import { ButtonSignifiantAction } from "../../ui/kit/Buttons";
import { getRectPosition } from "../../ui/kit/PositionUtil";
import { useEffect, useRef, useState } from "react";
import ColorShade from "./ColorShade";
import {
  useCurrentDesignSystem,
  useSaveDesignSystem,
} from "./DesignSystemQueries";
import { generateUniqueColorPaletteKey } from "../../util/DesignSystemUtils";
import { useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import Section from "./SectionDesignSystem";
function ColorPaletteComponent({
  colorPalette,
  index,
}: {
  colorPalette: ColorPalette;
  index: number;
}) {
  const { paletteName, shades } = colorPalette;
  const [isHover, setIsHover] = useState(false);
  const { activeComponent } = useDesignSystemContext();
  const colorPaletteRef = useRef<HTMLDivElement>(null);
  const componentId = "color-palette-" + paletteName;
  const { designSystemPath } = useParams();
  const { saveDesignSystem: updateDesignSystemLocally } =
    useSaveDesignSystem(designSystemPath);
  const { designSystem } = useCurrentDesignSystem();

  //Form
  const { control, register, getValues } = useForm({
    defaultValues: colorPalette,
  });

  const {
    fields: shadesArray,
    insert,
    remove,
  } = useFieldArray({
    control,
    name: "shades",
  });

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
    if (!designSystem) return;
    const newPalette: ColorPalette = {
      paletteName: generateUniqueColorPaletteKey(
        designSystem.colorPalettes,
        `palette-${index + 2}`
      ),
      shades: shades.map((shade) => {
        return {
          ...shade,
          color: "#DDDDDD",
        };
      }),
    };

    designSystem.colorPalettes.splice(index + 1, 0, newPalette);
    const newDesignSystem: DesignSystem = {
      ...designSystem,
      colorPalettes: Array.from([...designSystem.colorPalettes]),
    };
    updateDesignSystemLocally({
      designSystem: newDesignSystem,
      isTmp: true,
    });
  }

  function handleRemovePalette() {
    if (!designSystem) return;
    const newDesignSystem: DesignSystem = {
      ...designSystem,
      colorPalettes: designSystem.colorPalettes.filter(
        (pal) => pal.paletteName !== paletteName
      ),
    };
    updateDesignSystemLocally({
      designSystem: newDesignSystem,
      isTmp: true,
    });
  }

  useEffect(() => {
    console.log(shadesArray);
  }, [shadesArray]);

  return (
    <div
      className={colorPalettesClass}
      ref={colorPaletteRef}
      onClick={handleClickEvent}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
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
        <h4 className={styles.paletteTitle}>{paletteName}</h4>
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
      <div className={styles.shadesContainer}>
        {shadesArray.map((_shade, index) => (
          <ColorShade
            getValues={getValues}
            paletteMode={colorPaletteMode}
            isAllColorPalettesActive={isAllColorPalettesActive}
            remove={remove}
            index={index}
            register={register}
            insert={insert}
          />
        ))}
      </div>
    </div>
  );
}

export default ColorPaletteComponent;
