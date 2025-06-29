import styles from "./BodyDesignSystem.module.css";
import Section from "./SectionDesignSystem";
import HeaderDesignSystem from "./HeaderDesignSystem";
import IconColors from "../../ui/icons/IconColors";
import { ICON_SIZE_MD, ICON_SIZE_XL } from "../../ui/UiConstants";
import PaletteComponent from "./palette/PaletteComponent";
import { useDesignSystemContext } from "./DesignSystemContext";
import DraggableList from "./DraggableList";
import FontIcon from "../../ui/icons/FontIcon";
import { useNavigate } from "react-router-dom";
import FontsComponent from "./fonts/FontsComponent";
import TypographyComponent from "./typography/TypographyComponent";
import { useScrollTriggerRefresh } from "../../util/ScrollTriggerRefresh";
import SpacesIcon from "../../ui/icons/SpacesIcon";
import SpacesComponent from "./spaces/SpacesComponent";
import RadiusComponent from "./radius/RadiusComponent";
import ShadowsComponent from "./shadows/ShadowsComponent";
import Modal from "../../ui/kit/Modal";
import { MdBrush, MdConstruction, MdStore } from "react-icons/md";
import ThemesComponent from "./themes/ThemesComponent";
import SemanticColorTokensComponent from "./semantic-color-tokens/SemanticColorTokensComponent";
import { useTokenCrafterStore } from "../token-crafter/TokenCrafterStore";
import Popover from "../../ui/kit/Popover";
import SpacesPresetPopover from "./spaces/SpacesPresetPopover";
import SidePanel from "../../ui/kit/SidePanel";
import ShadowPresetSidepanel from "./shadows/ShadowPresetSidepanel";
import IndependantColorsComponent from "./palette/IndependantColorsComponent";
import PalettePlaceholder from "./palette/PalettePlaceholder";
import EmptyPalettes from "./palette/EmptyPalettes";

function BodyDesignSystem() {
  const { designSystem } = useDesignSystemContext();
  const { scrollRef } = useScrollTriggerRefresh();
  const { generateRecommandations } = useTokenCrafterStore();
  const navigate = useNavigate();

  return (
    <Popover>
      <SidePanel background={true}>
        <Modal>
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
                    <button
                      className="action-ghost-button"
                      type="button"
                      onClick={() =>
                        navigate(
                          `/palette-builder?currentDesignSystem=${designSystem.metadata.designSystemPath}`
                        )
                      }
                    >
                      <MdConstruction size={ICON_SIZE_MD} />
                      Palette builder
                    </button>
                  </>
                }
              >
                <>
                  {!designSystem.palettes.length && <PalettePlaceholder />}
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
              <Section.Subsection subSectionName="Independant colors">
                <IndependantColorsComponent />
              </Section.Subsection>
              <Section.Subsection subSectionName="Themes">
                {designSystem.palettes.length !== 0 ? (
                  <ThemesComponent />
                ) : (
                  <EmptyPalettes />
                )}
              </Section.Subsection>
              <Section.Subsection
                subSectionName="Semantic color tokens"
                actions={
                  <>
                    <button
                      className="action-ghost-button"
                      type="button"
                      onClick={() => {
                        generateRecommandations(designSystem);
                        navigate(
                          `/token-crafter?currentDesignSystem=${designSystem.metadata.designSystemPath}`
                        );
                      }}
                    >
                      <MdBrush size={ICON_SIZE_MD} />
                      Token crafter
                    </button>
                  </>
                }
              >
                {designSystem.palettes.length !== 0 ? (
                  <SemanticColorTokensComponent />
                ) : (
                  <EmptyPalettes />
                )}
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
              <Section.Subsection
                subSectionName="Spaces"
                actions={
                  <>
                    <Popover.Toggle id="presets">
                      <button
                        type="button"
                        className="action-ghost-button"
                        style={{
                          zIndex: 4,
                        }}
                      >
                        <MdStore size={ICON_SIZE_MD} /> Presets
                      </button>
                    </Popover.Toggle>
                    <Popover.Body id="presets" zIndex={5}>
                      <SpacesPresetPopover />
                    </Popover.Body>
                  </>
                }
              >
                <SpacesComponent />
              </Section.Subsection>
              <Section.Subsection subSectionName="Radius">
                <RadiusComponent />
              </Section.Subsection>
              <Section.Subsection
                subSectionName="Shadows"
                actions={
                  <>
                    <SidePanel.Button id="presets-shadows">
                      <button
                        type="button"
                        className="action-ghost-button"
                        style={{
                          zIndex: 4,
                        }}
                      >
                        <MdStore size={ICON_SIZE_MD} /> Presets
                      </button>
                    </SidePanel.Button>
                    <SidePanel.Body
                      id="presets-shadows"
                      width="50%"
                      background="#eff6ff"
                    >
                      <ShadowPresetSidepanel />
                    </SidePanel.Body>
                  </>
                }
              >
                <ShadowsComponent />
              </Section.Subsection>
            </Section>
          </div>
        </Modal>
      </SidePanel>
    </Popover>
  );
}

export default BodyDesignSystem;
