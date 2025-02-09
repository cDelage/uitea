import styles from "./BodyDesignSystem.module.css";
import Section from "./SectionDesignSystem";
import HeaderDesignSystem from "./HeaderDesignSystem";
import IconColors from "../../ui/icons/IconColors";
import { ICON_SIZE_MD, ICON_SIZE_XL } from "../../ui/UiConstants";
import PaletteComponent from "./PaletteComponent";
import { MdAdd, MdDragIndicator, MdEdit, MdRemove } from "react-icons/md";
import BaseComponent from "./BaseComponent";
import { useDesignSystemContext } from "./DesignSystemContext";
import ThemeComponent from "./ThemeComponent";
import DraggableList from "./DraggableList";

function BodyDesignSystem() {
  const { designSystem } = useDesignSystemContext();

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
              <Section.Actions>
                Palettes
                <Section.ActionButton componentId="palettes" mode="remove">
                  <MdRemove size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="palettes" mode="drag">
                  <MdDragIndicator size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="palettes" mode="add">
                  <MdAdd size={ICON_SIZE_MD} />
                </Section.ActionButton>
              </Section.Actions>
              <Section.Actions>
                Shades
                <Section.ActionButton componentId="shades" mode="remove">
                  <MdRemove size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="shades" mode="drag">
                  <MdDragIndicator size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="shades" mode="edit">
                  <MdEdit size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="shades" mode="add">
                  <MdAdd size={ICON_SIZE_MD} />
                </Section.ActionButton>
              </Section.Actions>
            </>
          }
        >
          <DraggableList keyList="palettes">
            {designSystem.palettes.map((colorPalette, index) => (
              <PaletteComponent
                key={colorPalette.paletteName}
                colorPalette={colorPalette}
                index={index}
              />
            ))}
          </DraggableList>
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
        <Section.Subsection
          subSectionName="Themes"
          actions={
            <>
              <Section.Actions>
                <Section.ActionButton componentId="themes" mode="remove">
                  <MdRemove size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="themes" mode="drag">
                  <MdDragIndicator size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="themes" mode="edit">
                  <MdEdit size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="themes" mode="add">
                  <MdAdd size={ICON_SIZE_MD} />
                </Section.ActionButton>
              </Section.Actions>
            </>
          }
        >
          <DraggableList keyList="themes">
            {designSystem.themes.map((theme, index) => (
              <ThemeComponent
                key={theme.themeName}
                theme={theme}
                index={index}
              />
            ))}
          </DraggableList>
        </Section.Subsection>
      </Section>
    </div>
  );
}

export default BodyDesignSystem;
