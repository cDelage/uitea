import styles from "./BodyDesignSystem.module.css";
import Section from "./SectionDesignSystem";
import HeaderDesignSystem from "./HeaderDesignSystem";
import IconColors from "../../ui/icons/IconColors";
import { ICON_SIZE_MD, ICON_SIZE_XL } from "../../ui/UiConstants";
import { useCurrentDesignSystem } from "./DesignSystemQueries";
import ColorPaletteComponent from "./ColorPaletteComponent";
import { MdAdd, MdDragIndicator, MdRemove } from "react-icons/md";

function BodyDesignSystem() {
  const { designSystem, isLoadingDesignSystem } = useCurrentDesignSystem();
  if (isLoadingDesignSystem || !designSystem) return null;

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
          {designSystem.colorPalettes.map((colorPalette, index) => (
            <ColorPaletteComponent
              key={colorPalette.paletteName}
              colorPalette={colorPalette}
              index={index}
            />
          ))}
        </Section.Subsection>
      </Section>
    </div>
  );
}

export default BodyDesignSystem;
