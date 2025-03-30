import { MdAdd, MdBuild, MdRemove, MdRestartAlt } from "react-icons/md";
import styles from "./PaletteBuilder3.module.css";
import { ICON_SIZE_MD } from "../../../ui/UiConstants";
import { usePaletteBuilder3Store } from "./PaletteBuilder3Store";
import SidePanel from "../../../ui/kit/SidePanel";
import { useMemo, useState } from "react";
import PaletteSidePanel from "./PaletteSidePanel";
import FormComponent from "../../../ui/kit/FormComponent";
import {
  isTintsNamingMode,
  TINTS_NAMING_MODE,
  TintsNamingMode,
} from "../../../util/TintsNaming";

function PaletteBuilder3Component() {
  const { palettes, createPalette, settings, setSettings, reset } =
    usePaletteBuilder3Store();
  const { steps, tintNamingMode } = settings;
  const firstPalette = palettes[0];
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<
    number | undefined
  >(undefined);

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

  const selectedPalette = useMemo(
    () =>
      selectedPaletteIndex !== undefined
        ? palettes[selectedPaletteIndex]
        : undefined,
    [selectedPaletteIndex, palettes]
  );

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
        <div className="row align-center gap-8">
          <div>
            <FormComponent label="Tints naming mode" className="flex-1">
              <div>
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
              </div>
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
        </div>
        <SidePanel>
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
                  {palettes.map((palette, index) => (
                    <SidePanel.Button
                      id="palette"
                      key={`${palette.name}-${index}`}
                      openKey={`${palette.name}-${index}`}
                      callback={() => setSelectedPaletteIndex(index)}
                    >
                      <tr className={styles.paletteRow}>
                        <td className={styles.columnPalette}>
                          <div className="row align-center gap-2">
                            <div
                              className={styles.paletteColor}
                              style={{
                                background: palette.tints
                                  .find((palette) => palette.isCenter)
                                  ?.color.hex(),
                              }}
                            ></div>
                            {palette.name}
                          </div>
                        </td>
                        {palette?.tints.map((tint) => (
                          <td
                            key={tint.name}
                            className={styles.columnTint}
                            style={{ background: tint.color.hex() }}
                          >
                          </td>
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
          <button className="add-button" onClick={() => createPalette()}>
            <MdAdd />
            Append palette
          </button>
          <SidePanel.BodyRelative id="palette" width="500px">
            <PaletteSidePanel
              palette={selectedPalette}
              index={selectedPaletteIndex}
            />
          </SidePanel.BodyRelative>
        </SidePanel>
      </div>
    </div>
  );
}

export default PaletteBuilder3Component;
