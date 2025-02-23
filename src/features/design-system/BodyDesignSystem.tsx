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
import { MdAdd, MdDragIndicator, MdEdit, MdRemove } from "react-icons/md";
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
        <Section.Subsection subSectionName="Palettes">
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
        <Section.Subsection
          subSectionName="Base"
        >
          <BaseComponent />
        </Section.Subsection>
        <Section.Subsection
          subSectionName="Themes"
        >
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
        <Section.Subsection
          subSectionName="Fonts"
          actions={
            <>
              <Section.Actions>
                All
                <Section.ActionButton componentId="all" mode="edit">
                  <MdEdit size={ICON_SIZE_MD} />
                </Section.ActionButton>
              </Section.Actions>
              <Section.Actions>
                Additionals
                <Section.ActionButton componentId="fonts" mode="remove">
                  <MdRemove size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="fonts" mode="drag">
                  <MdDragIndicator size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="fonts" mode="add">
                  <MdAdd size={ICON_SIZE_MD} />
                </Section.ActionButton>
              </Section.Actions>
            </>
          }
        >
          <FontsComponent />
        </Section.Subsection>
        <Section.Subsection
          subSectionName="Typography"
          actions={
            <Section.Actions>
              <Section.ActionButton componentId="typography" mode="remove">
                <MdRemove size={ICON_SIZE_MD} />
              </Section.ActionButton>
              <Section.ActionButton componentId="typography" mode="drag">
                <MdDragIndicator size={ICON_SIZE_MD} />
              </Section.ActionButton>
              <Section.ActionButton componentId="all" mode="edit">
                <MdEdit size={ICON_SIZE_MD} />
              </Section.ActionButton>
              <Section.ActionButton componentId="typography" mode="add">
                <MdAdd size={ICON_SIZE_MD} />
              </Section.ActionButton>
            </Section.Actions>
          }
        >
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
        <Section.Subsection
          subSectionName="Spaces"
          actions={
            <Section.Actions>
              <Section.ActionButton componentId="spaces" mode="remove">
                <MdRemove size={ICON_SIZE_MD} />
              </Section.ActionButton>
              <Section.ActionButton componentId="spaces" mode="drag">
                <MdDragIndicator size={ICON_SIZE_MD} />
              </Section.ActionButton>
              <Section.ActionButton componentId="all" mode="edit">
                <MdEdit size={ICON_SIZE_MD} />
              </Section.ActionButton>
              <Section.ActionButton componentId="spaces" mode="add">
                <MdAdd size={ICON_SIZE_MD} />
              </Section.ActionButton>
            </Section.Actions>
          }
        >
          <SpacesComponent />
        </Section.Subsection>
        <Section.Subsection
          subSectionName="Radius"
          actions={
            <>
              <Section.Actions>
                All
                <Section.ActionButton componentId="all" mode="edit">
                  <MdEdit size={ICON_SIZE_MD} />
                </Section.ActionButton>
              </Section.Actions>
              <Section.Actions>
                Additionals
                <Section.ActionButton componentId="radius" mode="remove">
                  <MdRemove size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="radius" mode="drag">
                  <MdDragIndicator size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="radius" mode="add">
                  <MdAdd size={ICON_SIZE_MD} />
                </Section.ActionButton>
              </Section.Actions>
            </>
          }
        >
          <RadiusComponent />
        </Section.Subsection>
        <Section.Subsection
          subSectionName="Effects"
          actions={
            <>
              <Section.Actions>
                <Section.ActionButton componentId="effects" mode="remove">
                  <MdRemove size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="effects" mode="drag">
                  <MdDragIndicator size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="all" mode="edit">
                  <MdEdit size={ICON_SIZE_MD} />
                </Section.ActionButton>
                <Section.ActionButton componentId="effects" mode="add">
                  <MdAdd size={ICON_SIZE_MD} />
                </Section.ActionButton>
              </Section.Actions>
            </>
          }
        >
          <EffectsComponent />
        </Section.Subsection>
      </Section>
    </div>
  );
}

export default BodyDesignSystem;
