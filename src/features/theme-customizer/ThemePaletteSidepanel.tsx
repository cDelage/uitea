import { useThemeCustomizerContext } from "./ThemeCustomizerContext"
import styles from "./ThemeCustomizerComponent.module.css";
import { getRectSize, ICON_SIZE_MD } from "../../ui/UiConstants";
import { MdArrowForward } from "react-icons/md";
import { useThemeCharts } from "./PaletteChartsThemeUtil";
import PaletteChart from "../palette-builder/PaletteChart";
import FormComponent from "../../ui/kit/FormComponent";
import ColorSlider from "../color-picker/ColorSlider";
import ColorIO from "colorjs.io";
import { PaletteBuild } from "../../domain/PaletteBuilderDomain";
import { useEffect, useState } from "react";
import { Theme } from "../../domain/DesignSystemDomain";

function ThemePaletteSidepanel({ activePalette, activeTheme }: { activePalette: PaletteBuild, activeTheme: Theme }) {
  const { setActivePaletteIndex, applyThemePaletteSetting } = useThemeCustomizerContext();
  const [activePaletteCopy, setActivePaletteCopy] = useState(activePalette);
  const charts = useThemeCharts({ palette: activePaletteCopy });
  const centerColor: ColorIO = activePaletteCopy.tints.find(tint => tint.isCenter)?.color ?? new ColorIO("#dddddd");

  const { name } = activePalette;
  useEffect(() => {
    if (name !== activePaletteCopy.name) {
      setActivePaletteCopy(activePalette)
    }
  }, [name, activePalette, activePaletteCopy])

  return (
    <div className={styles.sidePanel}>
      <div className={styles.sidePanelHeader}>
        <div className="row align-center gap-6">
          <div
            className="palette-color"
            style={{
              background: centerColor.toString({ format: "hex" }),
              ...getRectSize({ height: "var(--uit-space-10)" }),
            }}
          ></div>
          <h2>{activePaletteCopy?.name}</h2>
        </div>
        <button
          className="action-ghost-button"
          onClick={() => setActivePaletteIndex(undefined)}
        >
          <MdArrowForward size={ICON_SIZE_MD} />
        </button>
      </div>
      <div className={styles.sidePanelBodyContainer}>
        <FormComponent label="Lightness">
          <ColorSlider
            value={activePaletteCopy.settings.lightnessCenter ?? 0.5}
            min={0}
            max={1}
            step={0.01}
            reverse={true}
            color={centerColor}
            onChange={(value: number) => setActivePaletteCopy({
              ...activePaletteCopy,
              settings: {
                ...activePaletteCopy.settings,
                lightnessCenter: value
              }
            })}
            onChangeComplete={() => applyThemePaletteSetting({
              paletteThemeSetting: {
                attribute: "lightnessCenter",
                paletteName: activePalette.name,
                value: activePaletteCopy.settings.lightnessCenter ?? 0.5
              }, themeName: activeTheme.name
            })}
            gradient={`linear-gradient(to right, white)`}
          />
        </FormComponent>
        <FormComponent label="Chroma">
          <ColorSlider
            value={activePaletteCopy.settings.satChromaCenter ?? 0.5}
            min={0}
            max={1}
            step={0.01}
            reverse={true}
            color={centerColor}
            onChange={(value: number) => setActivePaletteCopy({
              ...activePaletteCopy,
              settings: {
                ...activePaletteCopy.settings,
                satChromaCenter: value
              }
            })}
            onChangeComplete={() => { }}
            gradient={`linear-gradient(to right, white)`}
          />
        </FormComponent>
        <FormComponent label="Hue">
          <ColorSlider
            value={((activePaletteCopy.settings.hueGapCenter ?? 0) + centerColor.oklch[2]) % 360}
            min={0}
            max={360}
            step={0.01}
            reverse={true}
            color={centerColor}
            onChange={(value: number) => setActivePaletteCopy({
              ...activePaletteCopy,
              settings: {
                ...activePaletteCopy.settings,
                hueGapCenter: value - centerColor.okhsl[2]
              }
            })}
            onChangeComplete={() => { }}
            gradient={`linear-gradient(to right, white)`}
          />
        </FormComponent>
        <div className={styles.chartContainer}>
          {charts.map(chart =>
            <PaletteChart chartAxeData={chart} key={chart.axeName} interpolationColorSpace="oklch" palette={activePaletteCopy} />
          )}
        </div>
      </div>
    </div>
  )
}

export default ThemePaletteSidepanel