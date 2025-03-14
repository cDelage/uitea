import {
  MdAdd,
  MdBuild,
  MdChevronRight,
  MdContrast,
  MdDarkMode,
  MdRemove,
  MdSunny,
} from "react-icons/md";
import styles from "./PaletteBuilder.module.css";
import classNames from "classnames";
import { usePaletteBuilderStore } from "../../util/PaletteBuilderStore";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { ICON_SIZE_MD, ICON_SIZE_SM, SLIDER_STYLE } from "../../ui/UiConstants";
import Popover from "../../ui/kit/Popover";
import HuePickerPopover from "./HuePickerPopover";
import FormComponent from "../../ui/kit/FormComponent";
import PaletteBuilderInstance from "./PaletteBuilderInstance";
import { useState } from "react";

function PaletteBuilderComponent() {
  const {
    tints,
    additionalPalettes,
    steps,
    setSteps,
    setRangeLuminance,
    setRangeSaturation,
    startLuminance,
    endLuminance,
    mainPalette,
    setMainPalette,
    huesProposed,
    startSaturation,
    endSaturation,
    appendAdditionalPalette,
  } = usePaletteBuilderStore();
  const secondStickyCol = classNames(styles.stickyCol, styles.secondStickyCol);
  const stickyCol = classNames(styles.stickyCol, "text-color-light");
  const [advancedSettings, setAdvancedSettings] = useState(false);
  const chevronClassname = advancedSettings ? "rotate-chevron" : "";

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
    <div className={styles.modalBuilderBody}>
      <div className={styles.modalHeader}>
        <MdBuild />
        <h5>Palette builder</h5>
      </div>
      <div className={styles.settingsContainer}>
        <div className="row align-center gap-3">
          <button
            className="action-button"
            onClick={() => setSteps(Math.max(steps - 1, 0))}
          >
            <MdRemove size={ICON_SIZE_MD} />
          </button>
          <strong className="text-color-light">{steps} tints count</strong>
          <button className="action-button" onClick={() => setSteps(steps + 1)}>
            <MdAdd size={ICON_SIZE_MD} />
          </button>
        </div>
        <div className="column gap-8">
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
          <div className="row align-center gap-6">
            <div className="row align-center gap-3 contrast-off">
              <MdContrast size={ICON_SIZE_MD} />
              {startSaturation}%
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[startSaturation, endSaturation]}
              range={true}
              onChange={handleChangeSaturation}
              allowCross={false}
              styles={SLIDER_STYLE}
              ariaValueTextFormatterForHandle={(value) => `${value}`}
            />
            <div className="row align-center gap-3 contrast-on">
              {endSaturation}%
              <MdContrast size={ICON_SIZE_MD} />
            </div>
          </div>
        </div>
        <div
          className="text-color-light row align-center gap-2 cursor-pointer select-none"
          onClick={() => setAdvancedSettings((state) => !state)}
        >
          <MdChevronRight size={ICON_SIZE_SM} className={chevronClassname} />
          Advanced settings
        </div>
        {advancedSettings && 
        <div className="row gap-2">
          
        </div>
        }
      </div>
      <div className={styles.bodyContainer}>
        <div className={styles.tableContainer}>
          <table className="tableBuilder">
            <thead>
              <tr>
                <th className={styles.checkCol}></th>
                <th className={styles.stickyCol}>
                  <strong className="text-color-dark">Palette</strong>
                </th>
                <th className={secondStickyCol}>
                  <strong className="text-color-dark">Tint</strong>
                </th>
                {tints.map((tint) => (
                  <th key={tint.name} className={styles.flexCol}>
                    <h5 className="text-color-dark">{tint.name}</h5>
                  </th>
                ))}
                <th className={styles.endSticky}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.checkCol}></td>
                <td className={stickyCol}></td>
                <td className={secondStickyCol}></td>
                {tints.map((tint) => (
                  <td key={tint.name} className={styles.flexColLuminance}>
                    {tint.luminance}%
                  </td>
                ))}

                <td className={styles.endSticky}></td>
              </tr>
              <tr>
                <td className={styles.checkCol}></td>
                <td className={stickyCol}>Main</td>
                <td className={secondStickyCol}></td>
                {tints.map((tint) => (
                  <td key={tint.name} className={styles.flexColLuminance}>
                    {tint.saturation}%
                  </td>
                ))}

                <td className={styles.endSticky}></td>
              </tr>

              {mainPalette ? (
                <>
                  <PaletteBuilderInstance
                    palette={mainPalette}
                    isMainPalette={true}
                  />
                  <tr>
                    <td className={styles.checkCol}></td>
                    <td className={stickyCol}>Additionals</td>
                    <td className={secondStickyCol}></td>
                    {tints.map((tint) => (
                      <td key={tint.name}></td>
                    ))}
                    <td className={styles.endSticky}></td>
                  </tr>
                  {additionalPalettes.map((palette, index) => (
                    <PaletteBuilderInstance palette={palette} index={index} />
                  ))}
                </>
              ) : (
                <>
                  <tr>
                    <td className={styles.checkCol}></td>
                    <td className={styles.stickyCol}>Main color</td>
                    <td className={secondStickyCol}>
                      <Popover>
                        <Popover.Toggle id="hue-popover">
                          <button
                            className={styles.colorPreviewContainerPlaceholder}
                          ></button>
                        </Popover.Toggle>
                        <HuePickerPopover
                          onClose={(color: string) => setMainPalette(color)}
                        />
                      </Popover>
                    </td>
                    <td
                      className={styles.flexColCenter}
                      colSpan={tints.length - 1}
                    >
                      Main color has to be defined
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        {huesProposed.length !== 0 && (
          <FormComponent label="Proposed colors">
            <div className={styles.proposedAllContainer}>
              {huesProposed.map(
                (hueProposed) =>
                  additionalPalettes.find(
                    (palette) => palette.hue === hueProposed.hex
                  ) === undefined && (
                    <div
                      className={styles.proposedHueContainer}
                      key={hueProposed.hex}
                      onClick={() =>
                        appendAdditionalPalette(
                          hueProposed.hex,
                          hueProposed.saturation,
                          hueProposed.name
                        )
                      }
                    >
                      <button
                        className={styles.hueContainer}
                        style={{
                          backgroundColor: hueProposed.hex,
                        }}
                      ></button>
                      <div>{hueProposed.name}</div>
                      <div className="text-color-light">{hueProposed.hex}</div>
                      {hueProposed.flag && (
                        <div className="flag">{hueProposed.flag}</div>
                      )}
                    </div>
                  )
              )}
            </div>
          </FormComponent>
        )}
      </div>
    </div>
  );
}

export default PaletteBuilderComponent;
