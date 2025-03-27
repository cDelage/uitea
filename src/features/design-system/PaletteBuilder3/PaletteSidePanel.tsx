import {
  findCenterColor,
  OkhslColor,
  PaletteBuild,
  usePaletteBuilder3Store,
} from "./PaletteBuilder3Store";
import styles from "./PaletteBuilder3.module.css";
import { useMemo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

function PaletteSidePanel({
  palette,
  index,
}: {
  palette?: PaletteBuild;
  index?: number;
}) {
  const { updatePalette } = usePaletteBuilder3Store();
  const centerTint = useMemo<OkhslColor | undefined>(
    () => (palette ? findCenterColor(palette) : undefined),
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
  if (!palette) return;
  return (
    <div>
      <div className={styles.sidePanelHeader}>
        <div
          className={styles.bigPaletteColor}
          style={{ background: centerTint?.hex }}
        ></div>
        <h2>
          <input
            className="inherit-input"
            value={palette.name}
            onChange={(e) => setPaletteName(e.target.value)}
          />
        </h2>
      </div>
      <div className={styles.sidePanelContainer}>
        <Slider
          min={0}
          max={100}
          step={1}
          included={false}
          value={50}
          styles={{
            rail: {
              background: `linear-gradient(to right, hsl(0 100% 50%), hsl(30 100% 50%), hsl(60 100% 50%), hsl(90 100% 50%), hsl(120 100% 50%), hsl(150 100% 50%), hsl(180 100% 50%), hsl(210 100% 50%), hsl(240 100% 50%), hsl(270 100% 50%), hsl(330 100% 50%), hsl(360 100% 50%))`,
              height: "12px",
              borderRadius: "var(--rounded-md)"
            },

            handle: {
              height: "14px",
              width: "14px"
            }
          }}
        />
      </div>
    </div>
  );
}

export default PaletteSidePanel;
