import {
  getColorsRecommanded,
  getEndsTints,
  getHueName,
  huesName,
  usePaletteBuilderStore,
} from "./PaletteBuilderStore";
import styles from "./PaletteBuilder.module.css";
import { useEffect, useMemo, useState } from "react";
import "rc-slider/assets/index.css";
import ColorPickerLinear from "../color-picker/ColorPickerLinear";
import FormComponent from "../../ui/kit/FormComponent";
import {
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { Chart } from "chart.js";
import { getRectSize, ICON_SIZE_MD, ICON_SIZE_XL } from "../../ui/UiConstants";
import ColorIO from "colorjs.io";
import {
  MdArrowForward,
  MdClose,
  MdDelete,
  MdLocationPin,
} from "react-icons/md";
import { ButtonAlert, ButtonPrimary } from "../../ui/kit/Buttons";
import { BiCross, BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import Popover from "../../ui/kit/Popover";
import { useSidepanelContext } from "../../ui/kit/SidepanelContext";
import ColorSlider from "../color-picker/ColorSlider";
import { useChartAxeData } from "./PaletteChartsUtil";
import PaletteChart from "./PaletteChart";
import { PaletteBuild, TintBuild } from "../../domain/PaletteBuilderDomain";
import { getContrastColor } from "../../util/PickerUtil";
import Anchor from "./Anchor";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

function PaletteSidePanel({
  palette,
  index,
  setSelectedPaletteIndex,
  selectedTintIndex,
  setSelectedTintIndex,
}: {
  palette?: PaletteBuild;
  index?: number;
  setSelectedPaletteIndex: (id: number | undefined) => void;
  selectedTintIndex: number | undefined;
  setSelectedTintIndex: (value: number | undefined) => void;
}) {
  const {
    updatePalette,
    createPaletteFromExisting,
    deletePalette,
    settings: { interpolationColorSpace },
    palettes,
    doPaletteBuilder,
  } = usePaletteBuilderStore();
  const { closeModal } = useSidepanelContext();
  const centerTint = useMemo<TintBuild | undefined>(
    () => (palette ? palette.tints.find((color) => color.isCenter) : undefined),
    [palette]
  );

  const otherPalettes: PaletteBuild[] = useMemo(
    () => palettes.filter((other) => other.id !== palette?.id),
    [palettes, palette]
  );

  const [isCompare, setIsCompare] = useState(false);

  const [paletteComparatorId, setPaletteComparatorId] = useState<
    string | undefined
  >(undefined);

  const comparatorPalette = useMemo<PaletteBuild | undefined>(
    () =>
      paletteComparatorId
        ? palettes.find((palette) => palette.id === paletteComparatorId)
        : undefined,
    [paletteComparatorId, palettes]
  );

  const selectedTint = useMemo<TintBuild | undefined>(() => {
    return selectedTintIndex !== undefined && palette
      ? palette?.tints[selectedTintIndex]
      : undefined;
  }, [selectedTintIndex, palette]);

  const colorsRecommanded = useMemo(
    () => getColorsRecommanded(palettes, centerTint?.color),
    [centerTint, palettes]
  );

  const chartsAxeData = useChartAxeData({
    interpolationColorSpace,
    palette,
    index,
  });

  function setPaletteName(name: string) {
    if (index !== undefined && palette && name) {
      updatePalette(index, {
        ...palette,
        name,
      });
    }
  }

  function updateColor({
    newTint,
    value,
    applyAnchor,
  }: {
    newTint: TintBuild;
    value: ColorIO;
    applyAnchor?: boolean;
  }) {
    if (palette && index !== undefined) {
      const newTintUpdated: TintBuild = {
        ...newTint,
        color: value,
        isAnchor: applyAnchor ?? newTint.isAnchor,
      };
      const newPalette: PaletteBuild = {
        ...palette,
        tints: palette.tints.map((tint) =>
          tint.name === newTint.name ? newTintUpdated : tint
        ),
      };
      const newCenter = newPalette.tints.find((tint) => tint.isCenter)?.color;
      newPalette.name =
        newCenter && huesName.includes(newPalette.name)
          ? getHueName(newCenter)
          : newPalette.name;
      if (newTintUpdated.isCenter && centerTint) {
        const [startColor, endColor] = getEndsTints({
          color: centerTint.color,
          settings: palette.settings,
          existingTints: newPalette.tints,
          interpolationColorSpace: interpolationColorSpace,
        });
        newPalette.tints[0] = {
          ...newPalette.tints[0],
          color: startColor,
        };
        newPalette.tints[newPalette.tints.length - 1] = {
          ...newPalette.tints[newPalette.tints.length - 1],
          color: endColor,
        };
      }
      updatePalette(index, newPalette, true);
    }
  }

  function toggleAnchorTint(tintIndex: number) {
    if (
      palette &&
      index !== undefined &&
      tintIndex !== 0 &&
      tintIndex !== palette.tints.length - 1 &&
      !palette.tints[tintIndex]?.isCenter
    ) {
      updatePalette(index, {
        ...palette,
        tints: palette.tints.map((tint, i) => {
          return {
            ...tint,
            isAnchor:
              i === tintIndex ? (!tint.isAnchor ? true : false) : tint.isAnchor,
          };
        }),
      });
    }
  }

  useEffect(() => {
    if (!selectedTint) {
      setSelectedTintIndex(palette?.tints.findIndex((tint) => tint.isCenter));
    }
  }, [selectedTint, setSelectedTintIndex, palette]);

  useEffect(() => {
    if (
      (!comparatorPalette && palettes.length > 1) ||
      (comparatorPalette && comparatorPalette.id === palette?.id)
    ) {
      setPaletteComparatorId(
        palettes.find((comparator) => comparator.id !== palette?.id)?.id
      );
    }
    if (!palette) {
      closeModal("palette");
    }
  }, [comparatorPalette, palettes, palette, closeModal]);

  if (!palette || !chartsAxeData) return;
  return (
    <div className={styles.sidePanel}>
      {centerTint && (
        <>
          <div className={styles.sidePanelHeader}>
            <div className="column gap-7">
              <div className="row align-center gap-6">
                <div
                  className="palette-color"
                  style={{
                    background: centerTint?.color.toString({ format: "hex" }),
                    ...getRectSize({ height: "var(--uidt-space-10)" }),
                  }}
                ></div>
                <h2 className="text-color-dark">
                  <input
                    className="inherit-input"
                    value={palette.name}
                    onChange={(e) => setPaletteName(e.target.value)}
                  />
                </h2>
                <div className="row align-center gap-2">
                  <Popover>
                    <Popover.Toggle
                      id="delete-palette"
                      positionPayload="bottom-right"
                    >
                      <button className="action-ghost-button">
                        <MdDelete size={ICON_SIZE_MD} />
                      </button>
                    </Popover.Toggle>
                    <Popover.Body id="delete-palette" zIndex={100}>
                      <Popover.Actions>
                        <Popover.Tab>
                          <MdClose size={ICON_SIZE_MD} /> Cancel
                        </Popover.Tab>
                        <Popover.Tab
                          clickEvent={() => {
                            deletePalette(palette.id);
                            setSelectedPaletteIndex(undefined);
                            closeModal("palette");
                          }}
                          theme="alert"
                        >
                          <MdDelete size={ICON_SIZE_MD} /> Remove
                        </Popover.Tab>
                      </Popover.Actions>
                    </Popover.Body>
                  </Popover>
                  <button
                    className="action-ghost-button"
                    onClick={() => closeModal("palette")}
                  >
                    <MdArrowForward size={ICON_SIZE_MD} />
                  </button>
                </div>
              </div>
              <div className="row">
                {palette.tints.map((tint, tintIndex) => (
                  <div
                    key={tint.name}
                    className="row align-center justify-center cursor-pointer"
                    onClick={() => setSelectedTintIndex(tintIndex)}
                    style={{
                      background: tint.color.toString({ format: "hex" }),
                      boxSizing: "border-box",
                      position: "relative",
                      border:
                        selectedTint?.name === tint.name
                          ? `2px solid var(--uidt-primary-border)`
                          : undefined,
                      ...getRectSize({
                        height: "var(--uidt-space-9)",
                        flex: true,
                      }),
                    }}
                  >
                    {selectedTint?.name === tint.name && (
                      <MdLocationPin
                        size={ICON_SIZE_XL}
                        color="var(--uidt-primary-bg)"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "50%",
                          transform: "translate(-50%, -100%)",
                        }}
                      />
                    )}
                    {tint.isAnchor &&
                      !tint.isCenter &&
                      tintIndex !== 0 &&
                      tintIndex !== palette.tints.length && (
                        <Anchor background={tint.color} />
                      )}
                    {tint.isCenter && (
                      <BiCross
                        color={getContrastColor(
                          tint.color.toString({ format: "hex" })
                        )}
                        size={"24"}
                      />
                    )}
                    {tintIndex === 0 && (
                      <BiArrowToLeft
                        color={getContrastColor(
                          tint.color.toString({ format: "hex" })
                        )}
                        size={"16"}
                      />
                    )}
                    {tintIndex === palette.tints.length - 1 && (
                      <BiArrowToRight
                        color={getContrastColor(
                          tint.color.toString({ format: "hex" })
                        )}
                        size={"16"}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.sidePanelBodyContainer}>
            <div className={styles.sidePanelContainer}>
              <h5 className="text-color-dark">Colors</h5>
              {selectedTint && selectedTintIndex !== undefined ? (
                <>
                  {selectedTintIndex !== 0 &&
                    selectedTintIndex !== palette.tints.length - 1 && (
                      <ColorPickerLinear
                        color={selectedTint.color}
                        onChange={(color: ColorIO) => {
                          updateColor({
                            newTint: selectedTint,
                            value: color,
                            applyAnchor: !selectedTint.isCenter,
                          });
                        }}
                        onChangeComplete={doPaletteBuilder}
                      />
                    )}
                  {selectedTintIndex === 0 && (
                    <>
                      <FormComponent label="Whiteness mix percentage">
                        <ColorSlider
                          value={palette.settings.lightnessMax}
                          min={0}
                          max={1}
                          step={0.01}
                          reverse={true}
                          color={selectedTint.color}
                          onChange={chartsAxeData[0].leftAxeData.update}
                          onChangeComplete={doPaletteBuilder}
                          gradient={`linear-gradient(to right, ${chartsAxeData[0].leftAxeData.gradient})`}
                        />
                      </FormComponent>
                      <FormComponent label={`${chartsAxeData[1].axeLabel} gap`}>
                        <ColorSlider
                          value={palette.settings.satChromaGapLeft}
                          min={0}
                          max={1}
                          step={0.01}
                          reverse={true}
                          color={selectedTint.color}
                          onChange={chartsAxeData[1].leftAxeData.update}
                          onChangeComplete={doPaletteBuilder}
                          gradient={`linear-gradient(to right, ${chartsAxeData[1].leftAxeData.gradient})`}
                        />
                      </FormComponent>
                      <FormComponent label="Hue gap">
                        <ColorSlider
                          value={palette.settings.hueGapLeft}
                          min={0}
                          max={1}
                          step={0.01}
                          reverse={true}
                          color={selectedTint.color}
                          onChange={chartsAxeData[2].leftAxeData.update}
                          onChangeComplete={doPaletteBuilder}
                          gradient={`linear-gradient(to right, ${chartsAxeData[2].leftAxeData.gradient})`}
                        />
                      </FormComponent>
                    </>
                  )}
                  {selectedTintIndex === palette.tints.length - 1 && (
                    <>
                      <FormComponent label="Blackness mix percentage">
                        <ColorSlider
                          value={palette.settings.lightnessMin}
                          min={0}
                          max={1}
                          step={0.01}
                          reverse={true}
                          color={selectedTint.color}
                          onChange={chartsAxeData[0].rightAxeData.update}
                          gradient={`linear-gradient(to right, ${chartsAxeData[0].rightAxeData.gradient})`}
                          onChangeComplete={doPaletteBuilder}
                        />
                      </FormComponent>
                      <FormComponent label={`${chartsAxeData[1].axeLabel} gap`}>
                        <ColorSlider
                          value={palette.settings.satChromaGapRight}
                          min={0}
                          max={1}
                          step={0.01}
                          reverse={true}
                          color={selectedTint.color}
                          onChange={chartsAxeData[1].rightAxeData.update}
                          gradient={`linear-gradient(to right, ${chartsAxeData[1].rightAxeData.gradient})`}
                          onChangeComplete={doPaletteBuilder}
                        />
                      </FormComponent>
                      <FormComponent label="Hue gap">
                        <ColorSlider
                          value={palette.settings.hueGapRight}
                          min={0}
                          max={1}
                          step={0.01}
                          reverse={true}
                          color={selectedTint.color}
                          onChange={chartsAxeData[2].rightAxeData.update}
                          gradient={`linear-gradient(to right, ${chartsAxeData[2].rightAxeData.gradient})`}
                          onChangeComplete={doPaletteBuilder}
                        />
                      </FormComponent>
                    </>
                  )}
                  <div className="row justify-between align-center gap-4">
                    <div className="row align-center gap-4">
                      <div
                        className="palette-color"
                        style={{
                          background: selectedTint.color.toString({
                            format: "hex",
                          }),
                          ...getRectSize({ height: "var(--uidt-space-10)" }),
                        }}
                      ></div>
                      <div className="column gap-2">
                        <strong className="text-color-dark">
                          {selectedTint.name}
                        </strong>
                        <div className="text-color-light">
                          {selectedTint.color.toString({ format: "hex" })}
                        </div>
                      </div>
                    </div>
                    <div>
                      {selectedTintIndex !== 0 &&
                        !selectedTint.isCenter &&
                        selectedTintIndex !== palette.tints.length - 1 &&
                        (!selectedTint.isAnchor ? (
                          <ButtonPrimary
                            onClick={() => toggleAnchorTint(selectedTintIndex)}
                          >
                            Anchor tint
                          </ButtonPrimary>
                        ) : (
                          <ButtonAlert
                            onClick={() => toggleAnchorTint(selectedTintIndex)}
                          >
                            Remove anchor
                          </ButtonAlert>
                        ))}
                    </div>
                  </div>
                  {comparatorPalette && isCompare && (
                    <div className="row justify-between align-center gap-4">
                      <div className="row align-center gap-4">
                        <div
                          className="palette-color"
                          style={{
                            background: comparatorPalette.tints[
                              selectedTintIndex
                            ].color.toString({
                              format: "hex",
                            }),
                            ...getRectSize({ height: "var(--uidt-space-10)" }),
                          }}
                        ></div>
                        <div className="column gap-2">
                          <strong className="text-color-dark">
                            {comparatorPalette.tints[selectedTintIndex].name}{" "}
                            {comparatorPalette.name}
                          </strong>
                          <div className="text-color-light">
                            {comparatorPalette.tints[
                              selectedTintIndex
                            ].color.toString({ format: "hex" })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {otherPalettes.length ? (
                    <div className="row justify-between align-center select-none">
                      <div
                        className="row align-center"
                        onClick={() => setIsCompare((comp) => !comp)}
                      >
                        <input type="checkbox" checked={isCompare} />
                        <label>Compare</label>
                      </div>
                      <div className="row align-center gap-3">
                        <label>Comparaison palette</label>
                        <select
                          onChange={(e) =>
                            setPaletteComparatorId(e.target.value)
                          }
                        >
                          {otherPalettes.map((paletteToCompare) => (
                            <option
                              key={paletteToCompare.id}
                              value={paletteToCompare.id}
                            >
                              <div
                                className="palette-color"
                                style={{
                                  background: centerTint?.color.toString({
                                    format: "hex",
                                  }),
                                  ...getRectSize({ height: "var(--uidt-space-5)" }),
                                }}
                              ></div>
                              {paletteToCompare.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <div className="row justify-center">No tints selected</div>
              )}
            </div>
            <div className={styles.separator} />
            <h5 className="text-color-dark">Recommanded colors</h5>
            {colorsRecommanded
              .filter((colorSet) => colorSet.colors.length)
              .map((colorSet) => (
                <div key={colorSet.flag}>
                  <FormComponent label={colorSet.flag}>
                    <div className={styles.complementaryColorsRow}>
                      {colorSet.colors.map((color, colorIndex) => (
                        <div
                          className={styles.recommandedHueButton}
                          key={`${color.name}${color.color.toString({
                            format: "hex",
                          })}${colorIndex}`}
                          onClick={() =>
                            createPaletteFromExisting(palette, color)
                          }
                        >
                          <div
                            className="palette-color"
                            style={{
                              background: color.color.toString({
                                format: "hex",
                              }),
                              ...getRectSize({ height: "var(--uidt-space-7)" }),
                            }}
                          ></div>
                          {color.name}
                        </div>
                      ))}
                    </div>
                  </FormComponent>
                </div>
              ))}
            <div className={styles.separator} />
            <h5 className="text-color-dark">Charts</h5>
            <div className={styles.chartContainer}>
              {chartsAxeData.map((axeData) => (
                <PaletteChart
                  key={axeData.axeName}
                  interpolationColorSpace={interpolationColorSpace}
                  chartAxeData={axeData}
                  palette={palette}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PaletteSidePanel;
