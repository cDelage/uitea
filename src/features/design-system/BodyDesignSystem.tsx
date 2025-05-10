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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import FontsComponent from "./fonts/FontsComponent";
import TypographyComponent from "./typography/TypographyComponent";
import { useScrollTriggerRefresh } from "../../util/ScrollTriggerRefresh";
import SpacesIcon from "../../ui/icons/SpacesIcon";
import SpacesComponent from "./spaces/SpacesComponent";
import RadiusComponent from "./radius/RadiusComponent";
import EffectsComponent from "./effects/EffectsComponent";
import Modal from "../../ui/kit/Modal";
import { MdBrush, MdConstruction, MdPalette } from "react-icons/md";
import PaletteBuilderModal from "../palette-builder/PaletteBuilderModal";
import { useEffect, useState } from "react";
import ColorPickerModal from "../color-picker/ColorPickerModal";
import ThemesComponent from "./themes/ThemesComponent";
import SemanticColorTokensComponent from "./semantic-color-tokens/SemanticColorTokensComponent";
import TokenCrafterModal from "../token-crafter/TokenCrafterModal";
import { useTokenCrafterStore } from "../token-crafter/TokenCrafterStore";
import { useUserSettings } from "../home/HomeQueries";

function BodyDesignSystem() {
  const { designSystem } = useDesignSystemContext();
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const { scrollRef } = useScrollTriggerRefresh();
  const [isPaletteBuilderOpen, setIsPaletteBuilderOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isTokenCrafterOpen, setIsTokenCrafterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { generateRecommandations } = useTokenCrafterStore();
  const navigate = useNavigate();
  const { userSettings } = useUserSettings();

  const pluginDisplayMode = userSettings?.pluginDisplayMode ?? "fullscreen";

  function initPalette() {
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        palettes: [...designSystem.palettes, DEFAULT_PALETTE],
      },
      isTmp: true,
    });
  }

  useEffect(() => {
    searchParams.set(
      "paletteBuilderOpen",
      isPaletteBuilderOpen ? "true" : "false"
    );
    setSearchParams(searchParams);
  }, [isPaletteBuilderOpen, searchParams, setSearchParams]);

  useEffect(() => {
    searchParams.set("colorPickerOpen", isColorPickerOpen ? "true" : "false");
    setSearchParams(searchParams);
  }, [isColorPickerOpen, searchParams, setSearchParams]);

  useEffect(() => {
    searchParams.set("tokenCrafterOpen", isTokenCrafterOpen ? "true" : "false");
    setSearchParams(searchParams);
  }, [isTokenCrafterOpen, searchParams, setSearchParams]);

  return (
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
                <Modal.Toggle
                  id="palette-builder"
                  replaceOpen={
                    pluginDisplayMode === "fullscreen"
                      ? () =>
                          navigate(
                            `/palette-builder?currentDesignSystem=${designSystemPath}`
                          )
                      : undefined
                  }
                >
                  <button className="action-ghost-button" type="button">
                    <MdConstruction size={ICON_SIZE_MD} />
                    Palette builder
                  </button>
                </Modal.Toggle>
                <Modal.Body
                  id="palette-builder"
                  isOpenToSync={isPaletteBuilderOpen}
                  setIsOpenToSync={setIsPaletteBuilderOpen}
                >
                  <PaletteBuilderModal />
                </Modal.Body>
                <Modal.Toggle
                  id="color-picker"
                  replaceOpen={
                    pluginDisplayMode === "fullscreen"
                      ? () =>
                          navigate(
                            `/color-picker?currentDesignSystem=${designSystemPath}`
                          )
                      : undefined
                  }
                >
                  <button className="action-ghost-button" type="button">
                    <MdPalette size={ICON_SIZE_MD} />
                    Color picker
                  </button>
                </Modal.Toggle>
                <Modal.Body
                  id="color-picker"
                  isOpenToSync={isColorPickerOpen}
                  setIsOpenToSync={setIsColorPickerOpen}
                >
                  <ColorPickerModal />
                </Modal.Body>
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
                <Modal.Toggle
                  id="token-crafter"
                  openCallback={() => generateRecommandations(designSystem)}
                  replaceOpen={
                    pluginDisplayMode === "fullscreen"
                      ? () => {
                          generateRecommandations(designSystem);
                          navigate(
                            `/token-crafter?currentDesignSystem=${designSystemPath}`
                          );
                        }
                      : undefined
                  }
                >
                  <button className="action-ghost-button" type="button">
                    <MdBrush size={ICON_SIZE_MD} />
                    Token crafter
                  </button>
                </Modal.Toggle>
                <Modal.Body
                  id="token-crafter"
                  isOpenToSync={isTokenCrafterOpen}
                  setIsOpenToSync={setIsTokenCrafterOpen}
                >
                  <TokenCrafterModal />
                </Modal.Body>
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
    </Modal>
  );
}

export default BodyDesignSystem;
