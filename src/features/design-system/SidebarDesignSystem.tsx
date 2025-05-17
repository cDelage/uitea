import { useParams, useSearchParams } from "react-router-dom";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import styles from "./SidebarDesignSystem.module.css";
import SidebarSection from "./SidebarSection";
import IconColors from "../../ui/icons/IconColors";
import { useDesignSystemContext } from "./DesignSystemContext";
import SidebarFile from "./SidebarFile";
import {
  MdAbc,
  MdContrast,
  MdEdit,
  MdFormatColorFill,
  MdLightMode,
  MdLineWeight,
  MdRoundedCorner,
  MdSave,
  MdSettings,
  MdSunny,
  MdTextFields,
  MdVisibility,
} from "react-icons/md";
import { getRectSize, ICON_SIZE_MD, ICON_SIZE_SM } from "../../ui/UiConstants";
import Popover from "../../ui/kit/Popover";
import SidebarSettings from "./SidebarSettings";
import Switch from "../../ui/kit/Switch";
import { invoke } from "@tauri-apps/api";
import { RecentFile } from "../../domain/HomeDomain";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import PaletteIcon from "../../ui/icons/PaletteIcon";
import FontIcon from "../../ui/icons/FontIcon";
import SpacesIcon from "../../ui/icons/SpacesIcon";
import Modal from "../../ui/kit/Modal";
import ExportModal from "./export/ExportModal";

function SidebarDesignSystem() {
  const { designSystem, setActiveComponent, editMode, theme, setTheme } =
    useDesignSystemContext();
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const queryClient = useQueryClient();
  function handleSave() {
    saveDesignSystem({ designSystem, isTmp: false });
  }

  const [searchParams, setSearchParams] = useSearchParams();

  const VisibilityIcon = editMode ? MdEdit : MdVisibility;

  function toggleSearchParams() {
    const newEditMode = !editMode;
    searchParams.set("editMode", String(newEditMode));
    setSearchParams(searchParams);
    //isEditMode is active when we toggle => then switch to read only
    if (!newEditMode) {
      setActiveComponent({
        componentId: "",
        mode: "default",
      });
    }

    if (!newEditMode) {
      if (window.getSelection) {
        const selection: Selection | null = window.getSelection();
        selection?.removeAllRanges();
      }
    }

    if (!designSystemPath) return;
    invoke<{ updatedFile: RecentFile }>("update_recent_file", {
      updatedFile: {
        filePath: designSystemPath,
        editMode: newEditMode,
        category: "DesignSystemCategory",
      },
    })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: "recent-files",
        });
      })
      .catch((err) => {
        toast.error(`Fail to save read only : ${err}`);
      });
  }

  const visible = searchParams.get("visible");

  return (
    <Popover>
      <Modal>
        <div className={styles.sidebarDesignSystem}>
          <div className={styles.topContainer}>
            <div className="row align-center justify-space-between">
              <div className={styles.topMenu}>
                <Switch checked={editMode} onChange={toggleSearchParams} />
                <VisibilityIcon size={ICON_SIZE_SM} />
                {editMode ? <>Edit mode</> : <>Read only</>}
              </div>
              {editMode && (
                <div className="row align-center gap-2">
                  <Popover.Toggle id="settings">
                    <button className="action-ghost-button">
                      <MdSettings size={ICON_SIZE_MD} />
                    </button>
                  </Popover.Toggle>
                  <Popover.Body zIndex={100} id="settings">
                    <SidebarSettings />
                  </Popover.Body>
                  <button
                    className="action-ghost-button"
                    onClick={handleSave}
                    disabled={!designSystem.metadata.isTmp}
                  >
                    <MdSave size={ICON_SIZE_MD} />
                  </button>
                </div>
              )}
            </div>

            <SidebarSection
              SectionIcon={IconColors}
              name="Colors"
              scrollName="colors"
            >
              <>
                {designSystem?.palettes.map((palette) => (
                  <SidebarFile
                    key={palette.paletteName}
                    filename={palette.paletteName}
                    underFolder={true}
                    id={`palette-${palette.paletteName}`}
                    icon={<PaletteIcon palette={palette} size={ICON_SIZE_SM} />}
                    visible={visible}
                  />
                ))}
              </>
              <SidebarFile
                filename="Themes"
                id="themes"
                underFolder={true}
                icon={<MdLightMode size={ICON_SIZE_SM} />}
                visible={visible}
              />
              <SidebarFile
                filename={"Semantic color tokens"}
                underFolder={true}
                id={"semantic-color-tokens"}
                icon={<MdFormatColorFill size={ICON_SIZE_SM} />}
                visible={visible}
              />
            </SidebarSection>
            <SidebarSection
              SectionIcon={FontIcon}
              name="Texts"
              scrollName="texts"
            >
              <>
                <SidebarFile
                  filename="Fonts"
                  id="fonts"
                  underFolder={true}
                  icon={<MdAbc size={ICON_SIZE_SM} />}
                  visible={visible}
                />
                <SidebarFile
                  filename={"Typography"}
                  underFolder={true}
                  id={"typography"}
                  icon={<MdTextFields size={ICON_SIZE_SM} />}
                  visible={visible}
                />
              </>
            </SidebarSection>
            <SidebarSection
              SectionIcon={SpacesIcon}
              name="Layout"
              scrollName="layout"
            >
              <>
                <SidebarFile
                  filename="Spaces"
                  id="spaces"
                  underFolder={true}
                  icon={<MdLineWeight size={ICON_SIZE_SM} />}
                  visible={visible}
                />
                <SidebarFile
                  filename={"Radius"}
                  underFolder={true}
                  id={"radius"}
                  icon={<MdRoundedCorner size={ICON_SIZE_SM} />}
                  visible={visible}
                />
                <SidebarFile
                  filename={"Effects"}
                  underFolder={true}
                  id={"effects"}
                  icon={<MdContrast size={ICON_SIZE_SM} />}
                  visible={visible}
                />
              </>
            </SidebarSection>
          </div>
          <div className={styles.bottomContainer}>
            <div className="row align-center gap-3">
              <MdSunny size={ICON_SIZE_SM} />
              <Popover.Toggle
                id="theme-selector"
                disabled={!designSystem.themes.otherThemes.length}
              >
                <div className="row w-full">
                  <Popover.SelectorButton
                    disabled={!designSystem.themes.otherThemes.length}
                    id="theme-selector"
                    width="200px"
                    value={
                      theme ? (
                        <>{theme.name}</>
                      ) : (
                        <>{designSystem.themes.mainTheme?.name ?? "default"}</>
                      )
                    }
                    onRemove={theme ? () => setTheme(undefined) : undefined}
                  />
                </div>
              </Popover.Toggle>
              <Popover.Body id="theme-selector">
                <Popover.Actions width="200px">
                  <Popover.Tab
                    key={designSystem.themes.mainTheme?.name}
                    clickEvent={() => setTheme(undefined)}
                  >
                    <div
                      className="palette-color"
                      style={{
                        background: designSystem.themes.mainTheme?.background,
                        ...getRectSize({ height: "var(--uidt-space-5)" }),
                      }}
                    />
                    {designSystem.themes.mainTheme?.name}
                  </Popover.Tab>
                  {designSystem.themes.otherThemes.map((theme) => (
                    <Popover.Tab
                      key={theme.name}
                      clickEvent={() => setTheme(theme)}
                    >
                      <div
                        className="palette-color"
                        style={{
                          background: theme.background,
                          ...getRectSize({ height: "var(--uidt-space-5)" }),
                        }}
                      />
                      {theme.name}
                    </Popover.Tab>
                  ))}
                </Popover.Actions>
              </Popover.Body>
            </div>
          </div>
        </div>
        <Modal.Body id="exports">
          <ExportModal />
        </Modal.Body>
      </Modal>
    </Popover>
  );
}

export default SidebarDesignSystem;
