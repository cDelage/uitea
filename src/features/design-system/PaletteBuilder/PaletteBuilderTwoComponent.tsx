import {
  MdAdd,
  MdBuild,
  MdChevronRight,
  MdDarkMode,
  MdRemove,
  MdRestartAlt,
  MdSunny,
} from "react-icons/md";
import styles from "./PaletteBuilderTwo.module.css";
import { usePaletteBuilderTwoStore } from "../../../util/PaletteBuilderTwoStore";
import { ICON_SIZE_MD, ICON_SIZE_SM, SLIDER_STYLE } from "../../../ui/UiConstants";
import Slider from "rc-slider";
import { useState } from "react";
import "rc-slider/assets/index.css";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import FormComponent from "../../../ui/kit/FormComponent";
import MainPaletteRow from "./MainPaletteRow";
import PaletteBuilderAdvancedSettings from "./PaletteBuilderAdvancedSettings";
import Popover from "../../../ui/kit/Popover";
import PaletteBuilderAddPalettePopover from "./PaletteBuilderAddPalettePopover";
import AdditionalPaletteRow from "./AdditionalPaletteRow";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function PaletteBuilderTwoComponent() {
  const {
    steps,
    setSteps,
    setRangeLuminance,
    startLuminance,
    endLuminance,
    mainPalette,
    resetPalette,
    colorsRecommanded,
    additionalPalettes,
  } = usePaletteBuilderTwoStore();
  const [advancedSettings, setAdvancedSettings] = useState(false);
  const chevronClassname = advancedSettings ? "rotate-chevron" : "";

  function handleChangeLuminance(newRange: number | number[]) {
    if (typeof newRange !== "number") {
      setRangeLuminance([100 - newRange[0], 100 - newRange[1]]);
    }
  }

  return (
    <div className={styles.modalPaletteBuilder}>
      <div className={styles.header}>
        <div className="row gap-2 align-center">
          <MdBuild />
          <h5>Palette builder</h5>
        </div>
        <button className="action-ghost-button" onClick={resetPalette}>
          <MdRestartAlt size={ICON_SIZE_MD} /> Reset all
        </button>
      </div>
      <div className={styles.settings} data-disableoutside={true}>
        <FormComponent label="Tints length">
          <div className="row align-center gap-3">
            <button
              className="menu-button"
              onClick={() => setSteps(Math.max(steps - 1, 1))}
            >
              <MdRemove size={ICON_SIZE_MD} />
            </button>
            <strong className="text-color-light">{steps}</strong>
            <button
              className="menu-button"
              onClick={() => setSteps(Math.min(steps + 1, 20))}
            >
              <MdAdd size={ICON_SIZE_MD} />
            </button>
          </div>
        </FormComponent>
        <FormComponent label="Lightness">
          <div className="row align-center gap-6" data-disableoutside={true}>
            <div className="row align-center gap-3 sunny-text">
              <MdSunny size={ICON_SIZE_MD} />
              {startLuminance}%
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[100 - endLuminance, 100 - startLuminance]}
              range={true}
              onChange={handleChangeLuminance}
              allowCross={false}
              styles={SLIDER_STYLE}
              ariaValueTextFormatterForHandle={(value) => `${value}`}
            />
            <div className="row align-center gap-3 moon-text">
              {endLuminance}%<MdDarkMode size={ICON_SIZE_MD} />
            </div>
          </div>
        </FormComponent>
      </div>
      <div
        className={styles.advancedSettingsTab}
        onClick={() => setAdvancedSettings((state) => !state)}
      >
        <MdChevronRight size={ICON_SIZE_SM} className={chevronClassname} />
        Advanced settings
      </div>
      {advancedSettings && <PaletteBuilderAdvancedSettings />}
      <div className={styles.tableContainer}>
        <div className={styles.tablePaletteBuilder}>
          <table className="tableBuilder">
            <thead>
              <tr>
                <td className={styles.columnPalette}>
                  <strong className="text-color-light">Palettes</strong>
                </td>
                {mainPalette.tints.map((tint) => (
                  <td key={tint.name} className={styles.columnTint}>
                    {tint.name}
                  </td>
                ))}
                <td className={styles.columnOptions}></td>
              </tr>
            </thead>
            <tbody>
              <MainPaletteRow />
              {additionalPalettes.map((palette) => (
                <AdditionalPaletteRow key={palette.name} palette={palette} />
              ))}
            </tbody>
          </table>
        </div>
        <Popover>
          <Popover.Toggle id="add-palette" positionPayload="bottom-left">
            <button className="menu-primary-button padding-right-button">
              <MdAdd size={ICON_SIZE_MD} />
              Add palette
            </button>
          </Popover.Toggle>
          <Popover.Body id="add-palette" zIndex={50}>
            <PaletteBuilderAddPalettePopover />
          </Popover.Body>
        </Popover>
        <FormComponent label="Colors recommanded">
          <div className="row wrap">
            {colorsRecommanded.map((colorRecommanded) => (
              <div
                key={colorRecommanded.color}
                className={styles.colorRecommanded}
              >
                <div className={styles.colorRecommandedHeader}>
                  <div
                    className={styles.paletteColor}
                    style={{
                      background: colorRecommanded.color,
                    }}
                  ></div>
                  <strong className="text-color-dark">
                    {colorRecommanded.name}
                  </strong>
                </div>
                <div className="text-color-light">{colorRecommanded.flag}</div>
              </div>
            ))}
          </div>
        </FormComponent>
      </div>
    </div>
  );
}

export default PaletteBuilderTwoComponent;
