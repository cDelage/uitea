import {
  MdClose,
  MdDelete,
  MdRestartAlt,
  MdSave,
  MdUpload,
} from "react-icons/md";
import { getRectSize, ICON_SIZE_MD } from "../../ui/UiConstants";
import { usePaletteBuilderStore } from "./PaletteBuilderStore";
import FormComponent from "../../ui/kit/FormComponent";
import { isInterpolationColorSpace } from "../../util/TintsNaming";
import styles from "./PaletteBuilder.module.css";
import Popover from "../../ui/kit/Popover";
import {
  Aligner,
  ALIGNER_CONTRAST_MODE_OPTIONS,
  ALIGNER_OPTIONS,
  AlignerContrastMode,
  InterpolationColorSpace,
  INTERPOLATIONS_COLOR_SPACES,
  paletteBuilderFromFile,
  PaletteBuilderPayload,
  paletteBuildToFile,
} from "../../domain/PaletteBuilderDomain";
import { ButtonPrimary, ButtonTertiary } from "../../ui/kit/Buttons";
import { open } from "@tauri-apps/api/dialog";
import {
  useFetchDesignSystemPaletteBuilder,
  useRemovePaletteBuilderFromDesignSystem,
  useSavePaletteBuilderIntoDesignSystem,
} from "./PaletteBuilderQueries";
import { useParams, useSearchParams } from "react-router-dom";
import { Table } from "../../ui/kit/Table";
import { invoke } from "@tauri-apps/api";
import { generateUniquePaletteBuilder } from "../../util/DesignSystemUtils";
import ExistingPaletteBuilderTab from "./ExistingPaletteBuilderTab";
import toast from "react-hot-toast";
import ColorIO from "colorjs.io";
import ColorPickerLinear from "../color-picker/ColorPickerLinear";

function PaletteBuilderSettingsSidePanel({
  saveOnComputer,
  stepsArray,
}: {
  saveOnComputer: () => void;
  stepsArray: string[];
}) {
  const {
    reset,
    settings,
    setSettings,
    palettes,
    loadPaletteBuilder,
    alignerSettings,
    setAlignerSettings,
  } = usePaletteBuilderStore();
  const { designSystemPath } = useParams();
  const [searchParams] = useSearchParams();
  const currentDesignSystem =
    searchParams.get("currentDesignSystem") ?? undefined;
  const designSystemPathComputed: string | undefined =
    designSystemPath ?? currentDesignSystem;
  const { designSystemPaletteBuilder } = useFetchDesignSystemPaletteBuilder(
    designSystemPathComputed
  );
  const { removePaletteBuilderFromDesignSystem } =
    useRemovePaletteBuilderFromDesignSystem(designSystemPathComputed);
  const { savePaletteBuilderIntoDesignSystem } =
    useSavePaletteBuilderIntoDesignSystem(designSystemPathComputed);
  const { interpolationColorSpace } = settings;

  function setInterpolationColorSpace(
    interpolationColorSpace: InterpolationColorSpace
  ) {
    setSettings({
      ...settings,
      interpolationColorSpace,
    });
  }

  async function overwriteIntoDesignSystem(name: string) {
    if (designSystemPathComputed && palettes.length) {
      savePaletteBuilderIntoDesignSystem({
        designSystemPath: designSystemPathComputed,
        paletteBuilder: {
          metadata: {
            paletteBuilderName: name,
            path: "",
            mainColors: [],
          },
          palettes: palettes.map(paletteBuildToFile),
          settings,
        },
      });
    }
  }

  async function handleSaveIntoDesignSystem() {
    if (designSystemPathComputed) {
      savePaletteBuilderIntoDesignSystem({
        designSystemPath: designSystemPathComputed,
        paletteBuilder: {
          metadata: {
            paletteBuilderName: generateUniquePaletteBuilder(
              designSystemPaletteBuilder
            ),
            path: "",
            mainColors: [],
          },
          palettes: palettes.map(paletteBuildToFile),
          settings,
        },
      });
    }
  }

  async function loadPaletteBuilderFromPath(path: string) {
    try {
      const paletteBuilderFile = await invoke<PaletteBuilderPayload>(
        "load_palette_builder",
        { path }
      );
      const paletteBuilder = paletteBuilderFromFile(paletteBuilderFile);
      loadPaletteBuilder(paletteBuilder.palettes, paletteBuilder.settings);
    } catch (e) {
      console.error(e);
      toast.error("Fail to load palette builder");
    }
  }

  async function loadPaletteBuilderFromDialog() {
    const path = (await open({
      directory: false, // Permet de sélectionner uniquement les dossiers
      multiple: false, // Empêche la sélection multiple
      title: "Select a folder",
      defaultPath: ".", // Chemin par défaut
      filters: [
        {
          name: "Fichiers YAML",
          extensions: ["yaml", "yml"],
        },
      ],
    })) as null | string;

    if (!path) return;
    const paletteBuilderFile = await invoke<PaletteBuilderPayload>(
      "load_palette_builder",
      { path }
    );
    const paletteBuilder = paletteBuilderFromFile(paletteBuilderFile);
    loadPaletteBuilder(paletteBuilder.palettes, paletteBuilder.settings);
  }

  function setAligner(aligner: Aligner) {
    setAlignerSettings({
      ...alignerSettings,
      aligner,
    });
  }

  function setAlignerContrastMode(alignerContrastMode: AlignerContrastMode) {
    setAlignerSettings({
      ...alignerSettings,
      alignerContrastMode,
    });
  }

  function setAlignerContrastPaletteStep(alignerContrastPaletteStep: number) {
    setAlignerSettings({
      ...alignerSettings,
      alignerContrastPaletteStep,
    });
  }

  function setAlignerContrastCustomColor(alignerConstrastCustomColor: ColorIO) {
    setAlignerSettings({
      ...alignerSettings,
      alignerConstrastCustomColor,
    });
  }

  return (
    <Popover>
      <div className={styles.sidePanel}>
        <div className={styles.sidePanelHeader}>
          <div className="row w-full justify-between align-center">
            <h2>Settings</h2>
            <Popover.Toggle id="delete-palette" positionPayload="bottom-right">
              <ButtonTertiary className="action-ghost-button">
                <MdRestartAlt size={ICON_SIZE_MD} /> Reset
              </ButtonTertiary>
            </Popover.Toggle>
            <Popover.Body id="delete-palette" zIndex={100}>
              <Popover.Actions>
                <Popover.Tab>
                  <MdClose size={ICON_SIZE_MD} /> Cancel
                </Popover.Tab>
                <Popover.Tab
                  clickEvent={() => {
                    reset();
                  }}
                  theme="alert"
                >
                  <MdDelete size={ICON_SIZE_MD} /> Reset all palettes
                </Popover.Tab>
              </Popover.Actions>
            </Popover.Body>
          </div>
        </div>
        <div className={styles.sidePanelBodyContainer}>
          <h5 className="text-color-dark">File management</h5>
          <div className={styles.sidePanelContainer}>
            <div className="row gap-4 justify-end">
              <ButtonPrimary
                type="button"
                onClick={loadPaletteBuilderFromDialog}
              >
                <MdUpload size={ICON_SIZE_MD} />
                Load
              </ButtonPrimary>
              {designSystemPathComputed ? (
                <>
                  <Popover.Toggle
                    id="save-palette-builder"
                    positionPayload="bottom-right"
                    disabled={!palettes.length}
                  >
                    <ButtonPrimary type="button" disabled={!palettes.length}>
                      <MdSave size={ICON_SIZE_MD} /> Save
                    </ButtonPrimary>
                  </Popover.Toggle>
                  <Popover.Body id="save-palette-builder" zIndex={100}>
                    <Popover.Actions>
                      <Popover.Tab
                        clickEvent={handleSaveIntoDesignSystem}
                        theme={
                          !designSystemPathComputed ? "disabled" : undefined
                        }
                      >
                        Save in design system repository
                      </Popover.Tab>
                      <Popover.Tab clickEvent={saveOnComputer}>
                        Save on computer
                      </Popover.Tab>
                    </Popover.Actions>
                  </Popover.Body>
                </>
              ) : (
                <ButtonPrimary
                  type="button"
                  disabled={!palettes.length}
                  onClick={saveOnComputer}
                >
                  <MdSave size={ICON_SIZE_MD} /> Save
                </ButtonPrimary>
              )}
            </div>
            {designSystemPaletteBuilder && (
              <>
                <FormComponent
                  label="From design system"
                  className="overflow-hidden"
                >
                  <Table>
                    <colgroup>
                      <col style={{ width: "84%" }} />
                      <col style={{ width: "8%" }} />
                      <col style={{ width: "8%" }} />
                    </colgroup>
                    <tbody>
                      {designSystemPaletteBuilder.map(
                        (paletteBuilderMetadata) => (
                          <ExistingPaletteBuilderTab
                            key={paletteBuilderMetadata.paletteBuilderName}
                            designSystemPath={designSystemPathComputed}
                            paletteBuilderMetadata={paletteBuilderMetadata}
                            loadPaletteBuilderFromPath={
                              loadPaletteBuilderFromPath
                            }
                            overwriteIntoDesignSystem={
                              overwriteIntoDesignSystem
                            }
                            palettes={palettes}
                            removePaletteBuilderFromDesignSystem={
                              removePaletteBuilderFromDesignSystem
                            }
                          />
                        )
                      )}
                    </tbody>
                  </Table>
                </FormComponent>
              </>
            )}
          </div>
          <div className={styles.separator} />
          <h5 className="text-color-dark">Aligner settings</h5>
          <div className="row align-center gap-8">
            <FormComponent label="Aligner" className="w-full">
              <select
                value={alignerSettings.aligner}
                onChange={(e) => setAligner(e.target.value as Aligner)}
              >
                {ALIGNER_OPTIONS.map((alignerOption) => (
                  <option key={alignerOption.value} value={alignerOption.value}>
                    {alignerOption.label}
                  </option>
                ))}
              </select>
            </FormComponent>
            <div className="w-full" />
          </div>
          {alignerSettings.aligner === "CONTRAST_COLOR" && (
            <>
              <div className="row align-center gap-8">
                <FormComponent label="Contrast mode" className="w-full">
                  <select
                    value={alignerSettings.alignerContrastMode}
                    onChange={(e) =>
                      setAlignerContrastMode(
                        e.target.value as AlignerContrastMode
                      )
                    }
                  >
                    {ALIGNER_CONTRAST_MODE_OPTIONS.map((contrastMode) => (
                      <option
                        key={contrastMode.value}
                        value={contrastMode.value}
                      >
                        {contrastMode.label}
                      </option>
                    ))}
                  </select>
                </FormComponent>
                {alignerSettings.alignerContrastMode === "PALETTE_STEP" ? (
                  <FormComponent label="Step to compare" className="w-full">
                    <select
                      value={alignerSettings.alignerContrastPaletteStep}
                      onChange={(e) =>
                        setAlignerContrastPaletteStep(Number(e.target.value))
                      }
                    >
                      {stepsArray.map((step, index) => (
                        <option key={step} value={index}>
                          {step}
                        </option>
                      ))}
                    </select>
                  </FormComponent>
                ) : (
                  <div className="w-full" />
                )}
              </div>
              {alignerSettings.alignerContrastMode === "CUSTOM_COLOR" && (
                <>
                  <ColorPickerLinear
                    color={alignerSettings.alignerConstrastCustomColor}
                    onChange={setAlignerContrastCustomColor}
                  />
                  <div className="row justify-center align-center gap-4">
                    <div
                      className="palette-color"
                      style={{
                        background:
                          alignerSettings.alignerConstrastCustomColor.toString({
                            format: "hex",
                          }),
                        ...getRectSize({
                          height: "var(--uidt-space-10)",
                        }),
                      }}
                    ></div>
                    <strong>Aligner contrast color</strong>
                  </div>
                </>
              )}
            </>
          )}
          <div className={styles.separator} />
          <h5 className="text-color-dark">Colors settings</h5>
          <div className={styles.sidePanelContainer}>
            <div className="row align-center gap-8">
              <FormComponent
                label="Interpolation color spaces"
                className="w-full"
              >
                <select
                  value={interpolationColorSpace}
                  className="w-full"
                  onChange={(e) => {
                    if (isInterpolationColorSpace(e.target.value)) {
                      setInterpolationColorSpace(e.target.value);
                    }
                  }}
                >
                  {INTERPOLATIONS_COLOR_SPACES.map((space) => (
                    <option
                      value={space.interpolationColorSpace}
                      key={space.interpolationColorSpace}
                    >
                      {space.label}
                    </option>
                  ))}
                </select>
              </FormComponent>
              <div className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </Popover>
  );
}

export default PaletteBuilderSettingsSidePanel;
