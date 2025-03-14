import classNames from "classnames";
import Popover from "../../ui/kit/Popover";
import {
  PaletteBuild,
  usePaletteBuilderStore,
} from "../../util/PaletteBuilderStore";
import HuePickerPopover from "./HuePickerPopover";
import styles from "./PaletteBuilder.module.css";
import { useState } from "react";
import { isEqual } from "lodash";

function PaletteBuilderInstance({
  palette,
  index,
  isMainPalette,
}: {
  palette: PaletteBuild;
  index?: number;
  isMainPalette?: boolean;
}) {
  const secondStickyCol = classNames(styles.stickyCol, styles.secondStickyCol);
  const { updateAdditionalPalette, updateMainPalette } =
    usePaletteBuilderStore();
  const [name, setName] = useState(palette.name);

  function handleUpdate(newPalette: PaletteBuild) {
    if (isEqual(newPalette, palette)) return;
    if (isMainPalette) {
      updateMainPalette(newPalette);
    } else if (index !== undefined) {
      updateAdditionalPalette(index, newPalette);
    }
  }

  return (
    <tr data-disable={!palette.active} key={`${palette.hue}${palette.name}`}>
      <td data-disable={!palette.active} className={styles.checkCol}>
        <input
          type="checkbox"
          checked={palette.active}
          onChange={(e) =>
            handleUpdate({
              ...palette,
              active: e.target.checked,
            })
          }
        />
      </td>
      <td data-disable={!palette.active} className={styles.stickyCol}>
        <input
          className="inherit-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() =>
            handleUpdate({
              ...palette,
              name,
            })
          }
        />
      </td>
      <td data-disable={!palette.active} className={secondStickyCol}>
        <Popover>
          <Popover.Toggle id="hue-popover">
            <button
              className={styles.colorPreviewContainer}
              style={{
                backgroundColor: palette.hue,
              }}
            ></button>
          </Popover.Toggle>
          <HuePickerPopover
            color={palette.hue}
            saturation={palette.saturation}
            onClose={(color: string) => {
              handleUpdate({
                ...palette,
                hue: color,
              });
            }}
          />
        </Popover>
      </td>
      {palette.tints.map((tint) => (
        <td key={tint} className={styles.flexCol}>
          <div
            className={styles.colorPreviewContainer}
            style={{
              backgroundColor: tint,
            }}
          >
          </div>
        </td>
      ))}
      <td className={styles.endSticky}></td>
    </tr>
  );
}

export default PaletteBuilderInstance;
