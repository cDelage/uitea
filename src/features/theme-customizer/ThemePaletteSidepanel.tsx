import { useThemeCustomizerContext } from './ThemeCustomizerContext';
import styles from './ThemeCustomizerComponent.module.css';
import { getRectSize, ICON_SIZE_MD } from '../../ui/UiConstants';
import { MdArrowForward, MdRestartAlt } from 'react-icons/md';
import { useThemeCenterAxes, useThemeCharts } from './PaletteChartsThemeUtil';
import PaletteChart from '../palette-builder/PaletteChart';
import FormComponent from '../../ui/kit/FormComponent';
import ColorSlider from '../color-picker/ColorSlider';
import { PaletteBuild } from '../../domain/PaletteBuilderDomain';
import { Theme } from '../../domain/DesignSystemDomain';
import InputNumber from '../color-picker/InputNumber';
import ColorIO from 'colorjs.io';

function ThemePaletteSidepanel({
  activePalette,
  activeTheme,
  centerColor,
  activePaletteWithoutEndSettings,
  activePaletteWithoutSettings,
}: {
  activePalette: PaletteBuild;
  activeTheme: Theme;
  centerColor: ColorIO;
  activePaletteWithoutSettings: PaletteBuild;
  activePaletteWithoutEndSettings: PaletteBuild;
}) {
  const { setActivePaletteIndex, activeThemeIndex } = useThemeCustomizerContext();
  const { paletteBuild, centerAxesOkhsl } = useThemeCenterAxes({
    palette: activePaletteWithoutSettings,
    theme: activeTheme,
    centerColor,
  });
  const charts = useThemeCharts({
    palette: activePalette,
    activePaletteWithoutEndSettings,
    theme: activeTheme,
  });
  //Active Theme 0 : main theme (do not update main theme)
  const disablePaletteUpdate: boolean = activeThemeIndex === 0;

  return (
    <div className={styles.sidePanel}>
      <div className={styles.sidePanelHeader}>
        <div className="row align-center gap-6">
          <div
            className="palette-color"
            style={{
              background: centerColor.toString({ format: 'hex' }),
              ...getRectSize({ height: 'var(--uit-space-10)' }),
            }}
          ></div>
          <h2>{paletteBuild?.name}</h2>
        </div>
        <button className="action-ghost-button" onClick={() => setActivePaletteIndex(undefined)}>
          <MdArrowForward size={ICON_SIZE_MD} />
        </button>
      </div>
      <div className={styles.sidePanelBodyContainer}>
        {centerAxesOkhsl.map((axe) => (
          <FormComponent
            label={axe.axeName}
            key={axe.axeName}
            rightElement={
              <div className="row align-center gap-2">
                <div style={{ width: '100px' }}>
                  <InputNumber
                    value={axe.value}
                    setValue={axe.update}
                    min={axe.min}
                    max={axe.max}
                    disabled={disablePaletteUpdate}
                  />
                </div>
                <button
                  className="action-ghost-button"
                  onClick={axe.reset}
                  disabled={disablePaletteUpdate}
                >
                  <MdRestartAlt size={ICON_SIZE_MD} />
                </button>
              </div>
            }
          >
            <ColorSlider
              value={axe.value}
              min={axe.min}
              max={axe.max}
              step={axe.step}
              reverse={axe.reverse}
              color={centerColor}
              onChange={axe.update}
              onChangeComplete={axe.onComplete}
              gradient={axe.gradient}
              disabled={disablePaletteUpdate}
            />
          </FormComponent>
        ))}
        <div className={styles.chartContainer}>
          {charts.map((chart) => (
            <PaletteChart
              chartAxeData={chart}
              key={chart.axeName}
              interpolationColorSpace="okhsl"
              palette={activePalette}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThemePaletteSidepanel;
