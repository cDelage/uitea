import styles from "./BodyDesignSystem.module.css";
import Section from "./SectionDesignSystem";
import HeaderDesignSystem from "./HeaderDesignSystem";
import IconColors from "../../ui/icons/IconColors";
import { ICON_SIZE_MD, ICON_SIZE_XL } from "../../ui/UiConstants";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import PaletteComponent from "./PaletteComponent";
import { MdAdd, MdDragIndicator, MdEdit, MdRemove } from "react-icons/md";
import {
  ParentDraggableContext,
  useDraggableFeatures,
} from "../../util/DraggableContext";
import BaseComponent from "./BaseComponent";
import { useDesignSystemContext } from "./DesignSystemContext";
import { useParams } from "react-router-dom";

function BodyDesignSystem() {
  const { designSystem } = useDesignSystemContext();
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const { draggableFeatures } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: number) => {
      if (
        dragIndex === undefined ||
        hoverIndex === undefined ||
        !designSystem ||
        dragIndex === hoverIndex
      )
        return;
      const newPalettes = [...designSystem.palettes];
      const dragElement = newPalettes.splice(dragIndex, 1);
      newPalettes.splice(hoverIndex, 0, dragElement[0]);
      saveDesignSystem({
        designSystem: {
          ...designSystem,
          palettes: newPalettes,
        },
        isTmp: true,
      });
    }
  );

  return (
    <div
      className={styles.bodyDesignSystem}
      key={designSystem.metadata.designSystemId}
    >
      <HeaderDesignSystem />
      <Section
        sectionTitle={
          <>
            <IconColors size={ICON_SIZE_XL} /> Colors
          </>
        }
      >
        <Section.Subsection
          subSectionName="Palettes"
          actions={
            <>
              <Section.ActionButton componentId="color-palettes" mode="remove">
                <MdRemove size={ICON_SIZE_MD} />
              </Section.ActionButton>
              <Section.ActionButton componentId="color-palettes" mode="drag">
                <MdDragIndicator size={ICON_SIZE_MD} />
              </Section.ActionButton>
              <Section.ActionButton componentId="color-palettes" mode="add">
                <MdAdd size={ICON_SIZE_MD} />
              </Section.ActionButton>
            </>
          }
        >
          <ParentDraggableContext value={draggableFeatures}>
            {designSystem.palettes.map((colorPalette, index) => (
              <PaletteComponent
                key={colorPalette.paletteName}
                colorPalette={colorPalette}
                index={index}
              />
            ))}
          </ParentDraggableContext>
        </Section.Subsection>
        <Section.Subsection
          subSectionName="Base"
          actions={
            <>
              <Section.ActionButton componentId="base" mode="edit">
                <MdEdit size={ICON_SIZE_MD} />
              </Section.ActionButton>
            </>
          }
        >
          <BaseComponent />
        </Section.Subsection>
      </Section>
    </div>
  );
}

export default BodyDesignSystem;
