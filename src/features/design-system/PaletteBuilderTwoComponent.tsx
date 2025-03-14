import {
  MdAdd,
  MdBuild,
  MdChevronRight,
  MdContrast,
  MdDarkMode,
  MdRefresh,
  MdRemove,
  MdSunny,
} from "react-icons/md";
import styles from "./PaletteBuilderTwo.module.css";
import { usePaletteBuilderTwoStore } from "../../util/PaletteBuilderTwoStore";
import { ICON_SIZE_MD, ICON_SIZE_SM, SLIDER_STYLE } from "../../ui/UiConstants";
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
import { Line } from "react-chartjs-2";
import FormComponent from "../../ui/kit/FormComponent";
import { isTintsNamingMode, TINTS_NAMING_MODE } from "../../util/TintsNaming";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function PaletteBuilderTwoComponent() {
  const {
    steps,
    setSteps,
    setRangeSaturation,
    setRangeLuminance,
    startLuminance,
    endLuminance,
    mainPalette,
    getCharts,
    maxSaturation,
    minSaturation,
    tintNamingMode,
    setTintNamingMode,
  } = usePaletteBuilderTwoStore();
  const [advancedSettings, setAdvancedSettings] = useState(false);
  const chevronClassname = advancedSettings ? "rotate-chevron" : "";
  const chartsData = getCharts();

  function handleChangeLuminance(newRange: number | number[]) {
    if (typeof newRange !== "number") {
      setRangeLuminance([100 - newRange[0], 100 - newRange[1]]);
    }
  }

  function handleChangeSaturation(newRange: number | number[]) {
    if (typeof newRange !== "number") {
      setRangeSaturation([newRange[0], newRange[1]]);
    }
  }

  return (
    <div className={styles.modalPaletteBuilder}>
      <div className={styles.header}>
        <MdBuild />
        <h5>Palette builder</h5>
      </div>
      <div className={styles.settings}>
        <FormComponent label="Tints length">
          <div className="row align-center gap-3">
            <button
              className="action-button"
              onClick={() => setSteps(Math.max(steps - 1, 1))}
            >
              <MdRemove size={ICON_SIZE_MD} />
            </button>
            <strong className="text-color-light">{steps}</strong>
            <button
              className="action-button"
              onClick={() => setSteps(Math.min(steps + 1, 20))}
            >
              <MdAdd size={ICON_SIZE_MD} />
            </button>
          </div>
        </FormComponent>
        <FormComponent label="Lightness">
          <div className="row align-center gap-6">
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
      {advancedSettings && (
        <div className={styles.advancedSettings}>
          <div className="column gap-2 flex-1">
            <FormComponent label="Tints naming mode" className="flex-1">
              <select
                value={tintNamingMode}
                onChange={(e) => {
                  if (isTintsNamingMode(e.target.value)) {
                    setTintNamingMode(e.target.value);
                  }
                }}
              >
                {TINTS_NAMING_MODE.map((mode) => (
                  <option value={mode}>{mode}</option>
                ))}
              </select>
            </FormComponent>
            <FormComponent label="Palette conversion mode" className="flex-1">
              <select>
                <option>OKHSL</option>
                <option>HSL</option>
                <option>OKLCH</option>
                <option>LCH</option>
              </select>
            </FormComponent>
          </div>
          <div className="flex-1 column">
            <FormComponent label="Hue correction" className="flex-1">
              <div className="row gap-2 align-center">
                <input type="checkbox" checked={true} />
                Active
              </div>
            </FormComponent>
            <FormComponent label="Hue correction factor" className="flex-1">
              <div className="row align-center gap-3">
                <button className="action-button">
                  <MdRemove size={ICON_SIZE_MD} />
                </button>
                <strong className="text-color-light">7</strong>
                <button className="action-button">
                  <MdAdd size={ICON_SIZE_MD} />
                </button>
              </div>
            </FormComponent>
          </div>

          <div className={styles.saturationBlock}>
            <FormComponent label="Saturation">
              <div className="row justify-center">
                {chartsData && (
                  <Line
                    data={chartsData.saturation}
                    options={chartsData.options}
                  />
                )}
              </div>
              <div className="row align-center gap-6">
                <div className="row align-center gap-3 contrast-off">
                  <MdContrast size={ICON_SIZE_MD} />
                  {minSaturation}%
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[maxSaturation, minSaturation]}
                  range={true}
                  onChange={handleChangeSaturation}
                  allowCross={false}
                  styles={SLIDER_STYLE}
                  ariaValueTextFormatterForHandle={(value) => `${value}`}
                />
                <div className="row align-center gap-3 contrast-on">
                  {maxSaturation}%
                  <MdContrast size={ICON_SIZE_MD} />
                </div>
              </div>
            </FormComponent>
          </div>
          <div className="column flex-1">
            <FormComponent label="Resets">
              <button className="action-button w-full justify-center">
                <MdRefresh size={ICON_SIZE_MD} /> Lightness
              </button>
              <button className="action-button w-full justify-center">
                <MdRefresh size={ICON_SIZE_MD} /> Saturation
              </button>
              <button className="action-button w-full justify-center">
                <MdRefresh size={ICON_SIZE_MD} /> Palettes
              </button>
            </FormComponent>
          </div>
        </div>
      )}
      <div className={styles.tableContainer}>
        <div className={styles.tablePaletteBuilder}>
          <table className="tableBuilder">
            <thead>
              <tr>
                <td className={styles.columnCheck}></td>
                <td className={styles.columnPalette}>Palette</td>
                {mainPalette.tints.map((tint) => (
                  <td key={tint.name} className={styles.columnTint}>
                    {tint.name}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.columnCheck}></td>
                <td className={styles.columnPalette}>{mainPalette.name}</td>
                {mainPalette.tints.map((tint) => (
                  <td
                    key={tint.name}
                    className={styles.columnTint}
                    style={{
                      background: tint.color.hex,
                    }}
                  ></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaletteBuilderTwoComponent;
