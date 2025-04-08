import {
  MdAdd,
  MdBuild,
  MdDelete,
  MdDragIndicator,
  MdRemove,
  MdRestartAlt,
} from "react-icons/md";
import styles from "./PaletteBuilder3.module.css";
import {
  getRectSize,
  ICON_SIZE_MD,
  ICON_SIZE_SM,
} from "../../../ui/UiConstants";
import {
  InterpolationColorSpace,
  INTERPOLATIONS_COLOR_SPACES,
  paletteBuildToDesignSystemPalette,
  usePaletteBuilder3Store,
} from "./PaletteBuilder3Store";
import SidePanel from "../../../ui/kit/SidePanel";
import { useMemo, useState } from "react";
import PaletteSidePanel from "./PaletteSidePanel";
import FormComponent from "../../../ui/kit/FormComponent";
import {
  isInterpolationColorSpace,
  isTintsNamingMode,
  TINTS_NAMING_MODE,
  TintsNamingMode,
} from "../../../util/TintsNaming";
import classNames from "classnames";
import { ButtonPrimary } from "../../../ui/kit/Buttons";
import { Palette } from "../../../domain/DesignSystemDomain";
import { useModalContext } from "../../../ui/kit/ModalContext";
import Popover from "../../../ui/kit/Popover";
import ColorPickerLinear from "../../../ui/kit/picker/ColorPickerLinear";
import ColorIO from "colorjs.io";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../../util/DraggableContext";

function PaletteBuilder3Component({
  onConfirmCreation,
}: {
  onConfirmCreation?: (palettes: Palette[]) => void;
}) {
  const {
    palettes,
    createPalette,
    settings,
    setSettings,
    reset,
    movePalette,
    deletePalette,
  } = usePaletteBuilder3Store();
  const { steps, tintNamingMode, interpolationColorSpace } = settings;
  const firstPalette = palettes[0];
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<
    number | undefined
  >(undefined);

  const [triggerMemo, setTriggerMemo] = useState(1);
  const { closeModal } = useModalContext();
  const [colorCreatePalette, setColorCreatePalette] = useState(
    new ColorIO("blue")
  );
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

  function handleCreatePalette() {
    createPalette(colorCreatePalette);
    setSelectedPaletteIndex(palettes.length);
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

  function setInterpolationColorSpace(
    interpolationColorSpace: InterpolationColorSpace
  ) {
    setSettings({
      ...settings,
      interpolationColorSpace,
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

  const selectedPalette = useMemo(
    () =>
      selectedPaletteIndex !== undefined && triggerMemo
        ? palettes[selectedPaletteIndex]
        : undefined,
    [selectedPaletteIndex, palettes, triggerMemo]
  );

  const builderBodyContainerChild = classNames("column gap-6", {
    [styles.rightSidepanelSpace]: selectedPalette !== undefined,
  });

  return (
    <div className={styles.modalPaletteBuilder}>
      <div className={styles.header}>
        <div className="row gap-2 align-center">
          <MdBuild />
          <h5>Palette builder</h5>
        </div>
        <button className="action-ghost-button" onClick={reset}>
          <MdRestartAlt size={ICON_SIZE_MD} /> Reset
        </button>
      </div>
      <div className={styles.builderBodyContainer}>
        <div className={builderBodyContainerChild}>
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
            <div>
              <FormComponent
                label="Interpolation color spaces"
                className="flex-1"
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
                    <option value={space} key={space}>
                      {space}
                    </option>
                  ))}
                </select>
              </FormComponent>
            </div>
          </div>
          <SidePanel closeCallback={() => setSelectedPaletteIndex(undefined)}>
            {palettes.length ? (
              <div className={styles.tablePaletteBuilder}>
                <table className="tableBuilder">
                  <thead>
                    <tr className={styles.tableHeader}>
                      <th className={styles.columnPaletteHeader}></th>
                      {firstPalette?.tints.map((tint) => (
                        <th key={tint.name} className={styles.columnTint}>
                          {tint.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {palettes.map((palette, paletteIndex) => (
                      <SidePanel.Button
                        id="palette"
                        key={`${palette.name}-${paletteIndex}`}
                        openKey={`${palette.name}-${paletteIndex}`}
                        callback={() => setSelectedPaletteIndex(paletteIndex)}
                        toggleKey={
                          selectedPaletteIndex !== undefined
                            ? "palette"
                            : undefined
                        }
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
                                  ...getRectSize({ height: "var(--space-5)" }),
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
                          {palette?.tints.map((tint) => (
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
                            ></td>
                          ))}
                        </tr>
                      </SidePanel.Button>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <></>
            )}
            <div className="row justify-between">
              {draggableTools.dragIndex === undefined ? (
                <Popover>
                  <Popover.Toggle id="color-picker">
                    <button className="add-button">
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
                            ...getRectSize({ height: "var(--space-9)" }),
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
                </Popover>
              ) : (
                <button
                  className="remove-button"
                  onMouseEnter={() => draggableTools.setHoverIndex("remove")}
                >
                  <MdDelete size={ICON_SIZE_MD} />
                  Remove palette
                </button>
              )}
              <SidePanel.BodyRelative id="palette" width="500px">
                <PaletteSidePanel
                  palette={selectedPalette}
                  index={selectedPaletteIndex}
                  setSelectedPaletteIndex={setSelectedPaletteIndex}
                />
              </SidePanel.BodyRelative>
              <div>
                {palettes.length !== 0 && (
                  <ButtonPrimary
                    onClick={() => {
                      onConfirmCreation?.(
                        palettes.map(paletteBuildToDesignSystemPalette)
                      );
                      closeModal();
                      reset();
                    }}
                  >
                    Confirm creation
                  </ButtonPrimary>
                )}
              </div>
            </div>
          </SidePanel>
        </div>
      </div>
    </div>
  );
}

export default PaletteBuilder3Component;
