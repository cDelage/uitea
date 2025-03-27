import {
  MdAdd,
  MdContrast,
  MdOutlinePalette,
  MdOutlineWbSunny,
  MdRemove,
} from "react-icons/md";
import FormComponent from "../../../ui/kit/FormComponent";
import {
  HUE_CONVERSIONS_ALGORITHM,
  HueConversionAlgorithm,
  SATURATION_MODES,
  SaturationMode,
  usePaletteBuilderTwoStore,
} from "../../../util/PaletteBuilderTwoStore";
import { isTintsNamingMode, TINTS_NAMING_MODE } from "../../../util/TintsNaming";
import styles from "./PaletteBuilderTwo.module.css";
import { ICON_SIZE_MD, SLIDER_STYLE } from "../../../ui/UiConstants";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Slider from "rc-slider";
import Popover from "../../../ui/kit/Popover";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function PaletteBuilderAdvancedSettings() {
  const {
    getCharts,
    maxSaturation,
    minSaturation,
    tintNamingMode,
    setTintNamingMode,
    hueCorrectionActive,
    toggleHueCorrection,
    hueCorrectionFactor,
    setHueCorrectionFactor,
    setRangeSaturation,
    setSaturationMode,
    saturationMode,
    setMaxSaturation,
    hueConversionAlgorithm,
    setHueConversionAlgorithm,
  } = usePaletteBuilderTwoStore();
  const chartsData = getCharts();

  function handleChangeSaturation(newRange: number | number[]) {
    if (typeof newRange !== "number") {
      setRangeSaturation([newRange[0], newRange[1]]);
    } else {
      setMaxSaturation(newRange);
    }
  }

  return (
    <div className={styles.advancedSettings}>
      <div className={styles.settingsHue}>
        <FormComponent label="Hue correction" className="flex-1">
          <div className="row gap-2 align-center">
            <input
              type="checkbox"
              checked={hueCorrectionActive}
              onChange={toggleHueCorrection}
            />
            Active
          </div>
        </FormComponent>
        <FormComponent label="Hue correction factor" className="flex-1">
          <div className="row align-center gap-3" data-disableoutside={true}>
            <button
              className="menu-button"
              onClick={() => setHueCorrectionFactor(hueCorrectionFactor - 1)}
            >
              <MdRemove size={ICON_SIZE_MD} />
            </button>
            <strong className="text-color-light">{hueCorrectionFactor}</strong>
            <button
              className="menu-button"
              onClick={() => setHueCorrectionFactor(hueCorrectionFactor + 1)}
            >
              <MdAdd size={ICON_SIZE_MD} />
            </button>
          </div>
        </FormComponent>
      </div>
      <div className="row w-full gap-8">
        <div className={styles.settingsTint}>
          <FormComponent label="Tints naming mode" className="flex-1">
            <div className={styles.actionsContainer}>
              <select
                value={tintNamingMode}
                className="w-full"
                onChange={(e) => {
                  if (isTintsNamingMode(e.target.value)) {
                    setTintNamingMode(e.target.value);
                  }
                }}
              >
                {TINTS_NAMING_MODE.map((mode) => (
                  <option value={mode} key={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
          </FormComponent>
          <FormComponent label="Palette conversion mode" className="flex-1">
            <div className={styles.actionsContainer}>
              <select
                className="w-full"
                value={hueConversionAlgorithm}
                onChange={(e) => {
                  setHueConversionAlgorithm(
                    e.target.value as HueConversionAlgorithm
                  );
                }}
              >
                {HUE_CONVERSIONS_ALGORITHM.map((algo) => (
                  <option key={algo}>{algo}</option>
                ))}
              </select>
            </div>
          </FormComponent>
        </div>
        <div>
          <FormComponent label="Display curves">
            <div className={styles.actionsContainer}>
              <Popover>
                <Popover.Toggle id="lum-array" positionPayload="bottom-left">
                  <button className="menu-button w-full justify-center">
                    <MdOutlineWbSunny size={ICON_SIZE_MD} />
                    Lightness
                  </button>
                </Popover.Toggle>
                <Popover.Toggle id="hue-array" positionPayload="bottom-left">
                  <button className="menu-button  w-full justify-center">
                    <MdOutlinePalette size={ICON_SIZE_MD} />
                    Hue
                  </button>
                </Popover.Toggle>
                <Popover.Body id="lum-array" zIndex={50}>
                  <div className="popover-body">
                    <Line
                      data={chartsData.lightness}
                      options={chartsData.options}
                      width="400px"
                      height="400px"
                    />
                  </div>
                </Popover.Body>
                <Popover.Body id="hue-array" zIndex={50}>
                  <div className="popover-body">
                    <Line
                      data={chartsData.hue}
                      options={chartsData.hueOptions}
                      width="400px"
                      height="200px"
                    />
                  </div>
                </Popover.Body>
              </Popover>
            </div>
          </FormComponent>
        </div>
      </div>
      <div className={styles.saturationBlock}>
        <FormComponent label="Saturation">
          <div className="row justify-center gap-2">
            <Line
              data={chartsData.saturation}
              options={chartsData.options}
              width={"400px"}
            />
            <div className={styles.saturationButtons}>
              <select
                value={saturationMode}
                onChange={(e) => {
                  setSaturationMode(e.target.value as SaturationMode);
                }}
              >
                {SATURATION_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
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
              value={
                saturationMode === "constants"
                  ? maxSaturation
                  : [maxSaturation, minSaturation]
              }
              range={saturationMode !== "constants"}
              onChange={handleChangeSaturation}
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
    </div>
  );
}

export default PaletteBuilderAdvancedSettings;
