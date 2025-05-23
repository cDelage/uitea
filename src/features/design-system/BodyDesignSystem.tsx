import styles from "./BodyDesignSystem.module.css";
import Section from "./SectionDesignSystem";
import HeaderDesignSystem from "./HeaderDesignSystem";
import IconColors from "../../ui/icons/IconColors";
import {
  DEFAULT_PALETTE,
  ICON_SIZE_MD,
  ICON_SIZE_XL,
} from "../../ui/UiConstants";
import PaletteComponent from "./palette/PaletteComponent";
import { useDesignSystemContext } from "./DesignSystemContext";
import DraggableList from "./DraggableList";
import FontIcon from "../../ui/icons/FontIcon";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import { useNavigate, useParams } from "react-router-dom";
import FontsComponent from "./fonts/FontsComponent";
import TypographyComponent from "./typography/TypographyComponent";
import { useScrollTriggerRefresh } from "../../util/ScrollTriggerRefresh";
import SpacesIcon from "../../ui/icons/SpacesIcon";
import SpacesComponent from "./spaces/SpacesComponent";
import RadiusComponent from "./radius/RadiusComponent";
import ShadowsComponent from "./effects/ShadowsComponent";
import Modal from "../../ui/kit/Modal";
import { MdBrush, MdConstruction, MdStore } from "react-icons/md";
import ThemesComponent from "./themes/ThemesComponent";
import SemanticColorTokensComponent from "./semantic-color-tokens/SemanticColorTokensComponent";
import { useTokenCrafterStore } from "../token-crafter/TokenCrafterStore";
import Popover from "../../ui/kit/Popover";
import SpacesPresetPopover from "./spaces/SpacesPresetPopover";

function BodyDesignSystem() {
  const { designSystem } = useDesignSystemContext();
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const { scrollRef } = useScrollTriggerRefresh();
  const { generateRecommandations } = useTokenCrafterStore();
  const navigate = useNavigate();

  function initPalette() {
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        palettes: [...designSystem.palettes, DEFAULT_PALETTE],
      },
      isTmp: true,
    });
  }

  return (
    <Popover>
      {" "}
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
                        `/palette-builder?currentDesignSystem=${designSystemPath}`
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
            <Section.Subsection subSectionName="Themes">
              <ThemesComponent />
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
                        `/token-crafter?currentDesignSystem=${designSystemPath}`
                      );
                    }}
                  >
                    <MdBrush size={ICON_SIZE_MD} />
                    Token crafter
                  </button>
                </>
              }
            >
              <SemanticColorTokensComponent />
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
            <Section.Subsection subSectionName="Effects">
              <ShadowsComponent />
            </Section.Subsection>
          </Section>
        </div>
      </Modal>
    </Popover>
  );
}

export default BodyDesignSystem;
