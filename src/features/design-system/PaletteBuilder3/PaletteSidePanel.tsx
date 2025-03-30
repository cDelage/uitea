import {
  getEndsTints,
  PaletteBuild,
  PaletteColor,
  TintBuild,
  usePaletteBuilder3Store,
} from "./PaletteBuilder3Store";
import styles from "./PaletteBuilder3.module.css";
import { useMemo } from "react";
import "rc-slider/assets/index.css";
import ColorPickerLinear from "../../../ui/kit/picker/ColorPickerLinear";

function PaletteSidePanel({
  palette,
  index,
}: {
  palette?: PaletteBuild;
  index?: number;
}) {
  const { updatePalette } = usePaletteBuilder3Store();
  const centerTint = useMemo<TintBuild | undefined>(
    () => (palette ? palette.tints.find((color) => color.isCenter) : undefined),
    [palette]
  );

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
  }: {
    newTint: TintBuild;
    value: PaletteColor;
  }) {
    if (palette && index !== undefined) {
      const newTintUpdated: TintBuild = {
        ...newTint,
        color: value,
      };
      const newPalette: PaletteBuild = {
        ...palette,
        tints: palette.tints.map((tint) =>
          tint.name === newTint.name ? newTintUpdated : tint
        ),
      };
      if (newTintUpdated.isCenter && centerTint) {
        const [startColor, endColor] = getEndsTints(
          centerTint.color,
          palette.settings
        );
        newPalette.tints[0] = {
          ...newPalette.tints[0],
          color: startColor as PaletteColor,
        };
        newPalette.tints[newPalette.tints.length - 1] = {
          ...newPalette.tints[newPalette.tints.length - 1],
          color: endColor as PaletteColor,
        };
      }
      updatePalette(index, newPalette);
    }
  }

  if (!palette) return;
  return (
    <div>
      {centerTint && (
        <>
          <div className={styles.sidePanelHeader}>
            <div
              className={styles.bigPaletteColor}
              style={{ background: centerTint?.color.hex() }}
            ></div>
            <h2 className="text-color-dark">
              <input
                className="inherit-input"
                value={palette.name}
                onChange={(e) => setPaletteName(e.target.value)}
              />
            </h2>
          </div>

          <div></div>
          <div className={styles.sidePanelContainer}>
            <h4 className="text-color-light">Main color</h4>
            <ColorPickerLinear
              color={centerTint.color}
              onChange={(color: PaletteColor) => {
                updateColor({ newTint: centerTint, value: color });
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default PaletteSidePanel;
