import styles from "./BodyDesignSystem.module.css";
import Section from "./SectionDesignSystem";
import HeaderDesignSystem from "./HeaderDesignSystem";
import IconColors from "../../ui/icons/IconColors";
import {
  DEFAULT_PALETTE,
  DEFAULT_THEME,
  ICON_SIZE_MD,
  ICON_SIZE_XL,
} from "../../ui/UiConstants";
import PaletteComponent from "./PaletteComponent";
import BaseComponent from "./BaseComponent";
import { useDesignSystemContext } from "./DesignSystemContext";
import ThemeComponent from "./ThemeComponent";
import DraggableList from "./DraggableList";
import FontIcon from "../../ui/icons/FontIcon";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import { useParams } from "react-router-dom";
import FontsComponent from "./FontsComponent";
import TypographyComponent from "./TypographyComponent";
import { useScrollTriggerRefresh } from "../../util/ScrollTriggerRefresh";
import SpacesIcon from "../../ui/icons/SpacesIcon";
import SpacesComponent from "./SpacesComponent";
import RadiusComponent from "./RadiusComponent";
import EffectsComponent from "./EffectsComponent";
import Modal from "../../ui/kit/Modal";
import { MdBuild } from "react-icons/md";
import PaletteBuilderTwoComponent from "./PaletteBuilderTwoComponent";

function BodyDesignSystem() {
  const { designSystem } = useDesignSystemContext();
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const { scrollRef } = useScrollTriggerRefresh();

  function initPalette() {
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        palettes: [...designSystem.palettes, DEFAULT_PALETTE],
      },
      isTmp: true,
    });
  }

  function initTheme() {
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        themes: [...designSystem.themes, DEFAULT_THEME],
      },
      isTmp: true,
    });
  }

  return (
    <div
      className={styles.bodyDesignSystem}
      id="body-design-system"
      key={designSystem.metadata.designSystemId}
      ref={scrollRef}
    >
      <HeaderDesignSystem />
      <Section
        sectionName="colors"
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
              <Modal>
                <Modal.Toggle id="palette-builder">
                  <button className="action-ghost-button" type="button">
                    <MdBuild size={ICON_SIZE_MD}/>Palette builder
                  </button>
                </Modal.Toggle>
                <Modal.Body id="palette-builder">
                  <PaletteBuilderTwoComponent />
                </Modal.Body>
              </Modal>
            </>
          }
        >
          <>
            <Section.EmptySection
              sectionName="palettes"
              itemToInsert="palette"
              onInsert={initPalette}
              sectionLength={designSystem.palettes.length}
              mediumHeight={true}
            />
            <DraggableList keyList="palettes">
              {designSystem.palettes.map((colorPalette, index) => (
                <PaletteComponent
                  key={colorPalette.paletteName}
                  colorPalette={colorPalette}
                  index={index}
                />
              ))}
            </DraggableList>
          </>
        </Section.Subsection>
        <Section.Subsection subSectionName="Base">
          <BaseComponent />
        </Section.Subsection>
        <Section.Subsection subSectionName="Themes">
          <>
            <Section.EmptySection
              sectionName="themes"
              itemToInsert="theme"
              onInsert={initTheme}
              sectionLength={designSystem.themes.length}
              mediumHeight={true}
            />
            <DraggableList keyList="themes">
              {designSystem.themes.map((theme, index) => (
                <ThemeComponent
                  key={theme.themeName}
                  theme={theme}
                  index={index}
                />
              ))}
            </DraggableList>
          </>
        </Section.Subsection>
      </Section>
      <Section
        sectionName="texts"
        sectionTitle={
          <>
            <FontIcon size={ICON_SIZE_XL} /> Texts
          </>
        }
      >
        <Section.Subsection subSectionName="Fonts">
          <FontsComponent />
        </Section.Subsection>
        <Section.Subsection subSectionName="Typography">
          <TypographyComponent />
        </Section.Subsection>
      </Section>
      <Section
        sectionName="layout"
        sectionTitle={
          <>
            <SpacesIcon size={ICON_SIZE_XL} /> Layout
          </>
        }
      >
        <Section.Subsection subSectionName="Spaces">
          <SpacesComponent />
        </Section.Subsection>
        <Section.Subsection subSectionName="Radius">
          <RadiusComponent />
        </Section.Subsection>
        <Section.Subsection subSectionName="Effects">
          <EffectsComponent />
        </Section.Subsection>
      </Section>
    </div>
  );
}

export default BodyDesignSystem;
