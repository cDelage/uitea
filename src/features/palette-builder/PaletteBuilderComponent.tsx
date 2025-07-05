import {
  MdAdd,
  MdChevronLeft,
  MdDelete,
  MdDone,
  MdDragIndicator,
  MdLocationPin,
  MdRemove,
  MdSave,
  MdSettings,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import styles from "./PaletteBuilder.module.css";
import {
  getRectSize,
  ICON_SIZE_MD,
  ICON_SIZE_SM,
  ICON_SIZE_XL,
} from "../../ui/UiConstants";
import {
  paletteBuildToDesignSystemPalette,
  usePaletteBuilderStore,
} from "./PaletteBuilderStore";
import SidePanel from "../../ui/kit/SidePanel";
import { useMemo, useState } from "react";
import PaletteSidePanel from "./PaletteSidePanel";
import FormComponent from "../../ui/kit/FormComponent";
import {
  getTintName,
  isTintsNamingMode,
  TINTS_NAMING_MODE,
  TintsNamingMode,
} from "../../util/TintsNaming";
import classNames from "classnames";
import { ButtonPrimary, ButtonTertiary } from "../../ui/kit/Buttons";
import Popover from "../../ui/kit/Popover";
import ColorPickerLinear from "../color-picker/ColorPickerLinear";
import ColorIO from "colorjs.io";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../util/DraggableContext";
import PaletteBuilderSettingsSidePanel from "./PaletteBuilderSettingsSidePanel";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  useFindDesignSystem,
  useSaveDesignSystem,
} from "../design-system/DesignSystemQueries";
import {
  generateUniquePaletteBuilder,
  generateUniquePaletteKey,
} from "../../util/DesignSystemUtils";
import {
  useFetchDesignSystemPaletteBuilder,
  useSavePaletteBuilder,
  useSavePaletteBuilderIntoDesignSystem,
} from "./PaletteBuilderQueries";
import {
  ALIGNER_OPTIONS,
  paletteBuildToFile,
} from "../../domain/PaletteBuilderDomain";
import { save } from "@tauri-apps/plugin-dialog";
import { getFilenameDate } from "../../util/DateUtil";
import ColorPreviewBody from "./ColorPreviewBody";

function PaletteBuilderComponent({ closeModal }: { closeModal?: () => void }) {
  const {
    palettes,
    createPalette,
    settings,
    setSettings,
    reset,
    movePalette,
    deletePalette,
    alignerSettings,
    setAlignerSettings,
  } = usePaletteBuilderStore();
  const { steps, tintNamingMode } = settings;
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<
    number | undefined
  >(undefined);
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(false);
  const [triggerMemo, setTriggerMemo] = useState(1);
  const { designSystemPath } = useParams();
  const [searchParams] = useSearchParams();
  const [triggerOpen, setTriggerOpen] = useState<string | undefined>(undefined);
  const currentDesignSystem = searchParams.get("currentDesignSystem");
  const designSystemPathComputed: string | undefined =
    designSystemPath ?? currentDesignSystem ?? undefined;
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPathComputed);
  const { savePaletteBuilderIntoDesignSystem } =
    useSavePaletteBuilderIntoDesignSystem(designSystemPathComputed);
  const { designSystemPaletteBuilder } = useFetchDesignSystemPaletteBuilder(
    designSystemPathComputed
  );
  const [colorCreatePalette, setColorCreatePalette] = useState(
    new ColorIO("blue")
  );
  const stepsArray = useMemo<string[]>(
    () =>
      Array.from({ length: steps }, (_, i) =>
        getTintName({
          index: i,
          length: steps,
          mode: tintNamingMode,
        })
      ),
    [steps, tintNamingMode]
  );

  const navigate = useNavigate();
  const { draggableTools } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: RemovableIndex) => {
      if (
        dragIndex !== undefined &&
        hoverIndex !== undefined &&
        dragIndex !== hoverIndex &&
        hoverIndex !== "remove"
      ) {
        if (selectedPaletteIndex === dragIndex) {
          setSelectedPaletteIndex(hoverIndex);
        }
        movePalette(dragIndex, hoverIndex);
        setTriggerMemo((v) => v + 1);
      }
      if (dragIndex !== undefined && hoverIndex === "remove") {
        deletePalette(palettes[dragIndex].id);
        setTriggerMemo((v) => v + 1);
      }
    }
  );
  const { savePaletteBuilder } = useSavePaletteBuilder();
  const { designSystem } = useFindDesignSystem(designSystemPathComputed);
  const [selectedTintIndex, setSelectedTintIndex] = useState<
    number | undefined
  >(undefined);

  function handlePaletteBuilderConfirm(isSave?: boolean) {
    if (designSystem && designSystemPathComputed) {
      if (isSave) {
        const name = generateUniquePaletteBuilder(designSystemPaletteBuilder);
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
      const newPalettes = [...designSystem.palettes];
      const palettesBuilderPalettes = palettes.map(
        paletteBuildToDesignSystemPalette
      );
      for (const id in palettesBuilderPalettes) {
        const palette = palettesBuilderPalettes[id];
        newPalettes.push({
          ...palette,
          paletteName: generateUniquePaletteKey(
            newPalettes,
            palette.paletteName
          ),
        });
      }
      saveDesignSystem({
        designSystem: {
          ...designSystem,
          palettes: newPalettes,
        },
        isTmp: true,
      });
      closeModal?.();
      reset();
      navigate(
        `/design-system/${encodeURIComponent(
          designSystemPathComputed
        )}?editMode=true&scrollComponent=Palettes`
      );
    }
  }

  function handleCreatePalette() {
    const palette = createPalette(colorCreatePalette);
    setSelectedPaletteIndex(palettes.length);
    setTriggerOpen("palette");
    const centerIndex = palette.tints.findIndex((tint) => tint.isCenter);
    setSelectedTintIndex(centerIndex);
  }

  function setSteps(steps: number) {
    setSettings({
      ...settings,
      steps,
    });
  }

  function setTintsNamingMode(tintNamingMode: TintsNamingMode) {
    setSettings({
      ...settings,
      tintNamingMode,
    });
  }

  function handleDragStart(index: number) {
    draggableTools.setDragIndex(index);
  }

  function handleDragMouseEnter(index: number) {
    if (draggableTools.dragIndex !== undefined) {
      draggableTools.setHoverIndex(index);
    }
  }

  function toggleAlignerDisplay() {
    setAlignerSettings({
      ...alignerSettings,
      isDisplay: !alignerSettings.isDisplay,
    });
  }

  async function saveOnComputer() {
    const filePath = await save({
      title: "Save the palette builder file",
      defaultPath: `palette-builder-${getFilenameDate()}`,
      filters: [
        {
          name: "Fichiers YAML",
          extensions: ["yaml"],
        },
      ],
    });
    if (!filePath) return;
    savePaletteBuilder({
      metadata: {
        paletteBuilderName: "",
        path: filePath,
        mainColors: [],
      },
      palettes: palettes.map(paletteBuildToFile),
      settings,
    });
  }

  const selectedPalette = useMemo(
    () =>
      selectedPaletteIndex !== undefined && triggerMemo
        ? palettes[selectedPaletteIndex]
        : undefined,
    [selectedPaletteIndex, palettes, triggerMemo]
  );

  const alignerLabel = useMemo<string | undefined>(() => {
    return ALIGNER_OPTIONS.find(
      (aligner) => aligner.value === alignerSettings.aligner
    )?.label;
  }, [alignerSettings]);

  const builderBodyContainerChild = classNames("column gap-3 overflow-hidden", {
    [styles.rightSidepanelSpace]: isSidepanelOpen,
  });

  return (
    <SidePanel
      isOpenToSync={isSidepanelOpen}
      setIsOpenToSync={setIsSidepanelOpen}
      triggerOpen={triggerOpen}
      setTriggerOpen={setTriggerOpen}
    >
      <Popover>
        <div className={styles.paletteBuilder}>
          <div className={styles.builderBodyContainer}>
            <div className={builderBodyContainerChild}>
              <div className="column gap-6">
                <div className="row justify-between align-center gap-4">
                  {currentDesignSystem && (
                    <ButtonTertiary
                      onClick={() =>
                        navigate(
                          `/design-system/${encodeURIComponent(
                            currentDesignSystem
                          )}?editMode=true&scrollComponent=Palettes`
                        )
                      }
                    >
                      <MdChevronLeft size={ICON_SIZE_MD} /> Back to design
                      system
                    </ButtonTertiary>
                  )}
                  <SidePanel.Button id="settings">
                    <ButtonTertiary>
                      <MdSettings size={ICON_SIZE_MD} /> Advanced settings
                    </ButtonTertiary>
                  </SidePanel.Button>
                </div>
                <div className="row align-center gap-8">
                  <div>
                    <FormComponent label="Tints naming mode" className="flex-1">
                      <select
                        value={tintNamingMode}
                        className="w-full"
                        onChange={(e) => {
                          if (isTintsNamingMode(e.target.value)) {
                            setTintsNamingMode(e.target.value);
                          }
                        }}
                      >
                        {TINTS_NAMING_MODE.map((mode) => (
                          <option value={mode} key={mode}>
                            {mode}
                          </option>
                        ))}
                      </select>
                    </FormComponent>
                  </div>
                  <FormComponent label="Tints length">
                    <div className="row align-center gap-3">
                      <button
                        className="menu-button"
                        onClick={() => setSteps(steps - 1)}
                      >
                        <MdRemove size={ICON_SIZE_MD} />
                      </button>
                      <strong className="text-color-light">{steps}</strong>
                      <button
                        className="menu-button"
                        onClick={() => setSteps(steps + 1)}
                      >
                        <MdAdd size={ICON_SIZE_MD} />
                      </button>
                    </div>
                  </FormComponent>
                  <FormComponent label="Show aligner">
                    <button
                      className="action-ghost-button"
                      disabled={!isSidepanelOpen}
                      data-disableoutside={true}
                      onClick={toggleAlignerDisplay}
                    >
                      {alignerSettings.isDisplay ? (
                        <MdVisibility size={ICON_SIZE_MD} />
                      ) : (
                        <MdVisibilityOff size={ICON_SIZE_MD} />
                      )}
                      {alignerLabel}
                    </button>
                  </FormComponent>
                </div>
              </div>
              <div className={styles.tablePaletteBuilder}>
                <table className="table-builder">
                  <thead>
                    <tr className={styles.tableHeader}>
                      <th className={styles.columnPaletteHeader}></th>
                      {stepsArray.map((tint) => (
                        <th key={tint} className={styles.columnTint}>
                          {tint}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {palettes.map((palette, paletteIndex) => (
                      <SidePanel.Button
                        id="palette"
                        stopClose={true}
                        callback={() => setSelectedPaletteIndex(paletteIndex)}
                      >
                        <tr
                          className={styles.paletteRow}
                          onMouseEnter={() =>
                            handleDragMouseEnter(paletteIndex)
                          }
                        >
                          <td
                            className={styles.columnPalette}
                            data-open={selectedPaletteIndex === paletteIndex}
                            data-drag-hover={
                              draggableTools.hoverIndex === paletteIndex
                            }
                            data-dragged={
                              draggableTools.dragIndex === paletteIndex
                            }
                            data-remove={
                              draggableTools.dragIndex === paletteIndex &&
                              draggableTools.hoverIndex === "remove"
                            }
                          >
                            <div className="row align-center gap-2">
                              <div
                                className="palette-color"
                                style={{
                                  background: palette.tints
                                    .find((palette) => palette.isCenter)
                                    ?.color.toString({ format: "hex" }),
                                  ...getRectSize({
                                    height: "var(--uidt-space-5)",
                                  }),
                                }}
                              ></div>
                              <div className="flex-1">{palette.name}</div>
                              <div className={styles.dragActionContainer}>
                                <button
                                  className="action-button"
                                  onMouseDown={() =>
                                    handleDragStart(paletteIndex)
                                  }
                                >
                                  <MdDragIndicator size={ICON_SIZE_SM} />
                                </button>
                              </div>
                            </div>
                          </td>
                          {palette?.tints.map((tint, tintIndex) => (
                            <td
                              key={tint.name}
                              className={styles.columnTint}
                              data-drag-hover={
                                draggableTools.hoverIndex === paletteIndex
                              }
                              style={{
                                background: tint.color.toString({
                                  format: "hex",
                                }),
                              }}
                              onClick={() => setSelectedTintIndex(tintIndex)}
                            >
                              <ColorPreviewBody
                                color={tint.color}
                                isAlignerDisplay={
                                  selectedTintIndex === tintIndex &&
                                  isSidepanelOpen &&
                                  alignerSettings.isDisplay
                                }
                                isAnchor={tint.isAnchor}
                                tints={palette.tints}
                                isComparedContrastTint={
                                  tintIndex ===
                                    alignerSettings.alignerContrastPaletteStep &&
                                  alignerSettings.aligner ===
                                    "CONTRAST_COLOR" &&
                                  alignerSettings.alignerContrastMode ===
                                    "PALETTE_STEP"
                                }
                                selectedTintIndex={selectedTintIndex}
                              />
                              {tintIndex === selectedTintIndex &&
                                paletteIndex === selectedPaletteIndex &&
                                isSidepanelOpen && (
                                  <>
                                    <MdLocationPin
                                      size={ICON_SIZE_XL}
                                      color="var(--uidt-palette-primary-200)"
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        left: "50%",
                                        transform:
                                          "translate(-50%, -95%) scale(130%)",
                                        zIndex:1000
                                      }}
                                    />
                                    <MdLocationPin
                                      size={ICON_SIZE_XL}
                                      color="var(--uidt-primary-bg)"
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        left: "50%",
                                        transform: "translate(-50%, -100%)",
                                        zIndex:1000
                                      }}
                                    />
                                  </>
                                )}
                            </td>
                          ))}
                        </tr>
                      </SidePanel.Button>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                {draggableTools.dragIndex === undefined ? (
                  <>
                    <Popover.Toggle id="color-picker">
                      <button className="add-button w-full table-builder-row-placeholder">
                        <MdAdd />
                        Append palette
                      </button>
                    </Popover.Toggle>
                    <Popover.Body id="color-picker" zIndex={100}>
                      <div
                        className="popover-body"
                        data-disableoutside={true}
                        style={{
                          width: "280px",
                        }}
                      >
                        <ColorPickerLinear
                          color={colorCreatePalette}
                          onChange={(value: ColorIO) =>
                            setColorCreatePalette(value)
                          }
                        />
                        <div className="row justify-center align-center gap-2">
                          <div
                            className="palette-color"
                            style={{
                              background: colorCreatePalette.toString({
                                format: "hex",
                              }),
                              ...getRectSize({ height: "var(--uidt-space-9)" }),
                            }}
                          ></div>
                          <strong>
                            {colorCreatePalette.toString({
                              format: "hex",
                            })}
                          </strong>
                        </div>
                        <div className="row justify-end">
                          <Popover.Close closeCallback={handleCreatePalette}>
                            <ButtonPrimary>Confirm</ButtonPrimary>
                          </Popover.Close>
                        </div>
                      </div>
                    </Popover.Body>
                  </>
                ) : (
                  <button
                    className="remove-button w-full table-builder-row-placeholder"
                    onMouseEnter={() => draggableTools.setHoverIndex("remove")}
                  >
                    <MdDelete size={ICON_SIZE_MD} />
                    Remove palette
                  </button>
                )}
              </div>
              <div className="row justify-end">
                <SidePanel.BodyRelative id="palette" width="500px">
                  <PaletteSidePanel
                    palette={selectedPalette}
                    index={selectedPaletteIndex}
                    setSelectedPaletteIndex={setSelectedPaletteIndex}
                    selectedTintIndex={selectedTintIndex}
                    setSelectedTintIndex={setSelectedTintIndex}
                  />
                </SidePanel.BodyRelative>
                <SidePanel.BodyRelative id="settings" width="500px">
                  <PaletteBuilderSettingsSidePanel
                    saveOnComputer={saveOnComputer}
                    stepsArray={stepsArray}
                  />
                </SidePanel.BodyRelative>
                {palettes.length !== 0 && designSystemPathComputed && (
                  <>
                    <Popover.Toggle
                      id="confirm-palette-builder"
                      positionPayload="bottom-right"
                    >
                      <ButtonPrimary>
                        <MdDone size={ICON_SIZE_MD} /> Confirm creation
                      </ButtonPrimary>
                    </Popover.Toggle>
                    <Popover.Body id="confirm-palette-builder" zIndex={100}>
                      <Popover.Actions>
                        <Popover.Tab
                          clickEvent={() => handlePaletteBuilderConfirm(true)}
                        >
                          Confirm + save into design system
                        </Popover.Tab>
                        <Popover.Tab clickEvent={saveOnComputer}>
                          Save only
                        </Popover.Tab>
                        <Popover.Tab clickEvent={handlePaletteBuilderConfirm}>
                          Confirm and clear
                        </Popover.Tab>
                      </Popover.Actions>
                    </Popover.Body>
                  </>
                )}
                {palettes.length !== 0 && !designSystemPathComputed && (
                  <ButtonPrimary onClick={saveOnComputer}>
                    <MdSave size={ICON_SIZE_MD} /> Save
                  </ButtonPrimary>
                )}
              </div>
            </div>
          </div>
        </div>
      </Popover>
    </SidePanel>
  );
}

export default PaletteBuilderComponent;
