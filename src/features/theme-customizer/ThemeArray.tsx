import { Theme } from '../../domain/DesignSystemDomain';
import styles from './ThemeCustomizerComponent.module.css';
import { useThemeCustomizerContext } from './ThemeCustomizerContext';
import { getRectSize } from '../../ui/UiConstants';
import SidePanel from '../../ui/kit/SidePanel';

function ThemeArray({ activeTheme }: { activeTheme: Theme }) {
  const { referencePalette, palettes, activePaletteIndex, setActivePaletteIndex } =
    useThemeCustomizerContext();

  return (
    <div
      className="w-full h-full p-6 border-box"
      style={{
        background: activeTheme.background,
      }}
    >
      <table className="table-builder">
        <thead>
          <tr className={styles.tableHeader}>
            <th style={{ background: activeTheme.background }}></th>
            {referencePalette.map((tint) => (
              <th key={tint.label} className={styles.columnTint}>
                {tint.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {palettes.map((palette, paletteIndex) => (
            <SidePanel.Button
              id="palette-customizer"
              stopClose={true}
              callback={() => setActivePaletteIndex(paletteIndex)}
            >
              <tr className={styles.paletteRow}>
                <td
                  className={styles.columnPalette}
                  data-open={activePaletteIndex === paletteIndex}
                  data-drag-hover={false}
                  data-dragged={false}
                  data-remove={false}
                  style={{ padding: 'var(--uit-space-4)' }}
                >
                  <div className="row align-center gap-2">
                    <div
                      className="palette-color"
                      style={{
                        background: palette.tints[Math.floor(palette.tints.length / 2)].color,
                        ...getRectSize({
                          height: 'var(--uit-space-5)',
                        }),
                      }}
                    ></div>
                    <div className="flex-1">{palette.paletteName}</div>
                  </div>
                </td>
                {palette.tints.map((tint) => (
                  <td
                    key={tint.label}
                    className={styles.columnTint}
                    style={{
                      background: tint.color,
                    }}
                    data-drag-hover={false}
                  >
                    {tint.color}
                  </td>
                ))}
              </tr>
            </SidePanel.Button>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ThemeArray;
