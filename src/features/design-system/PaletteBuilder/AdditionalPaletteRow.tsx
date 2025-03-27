import { MdVpnKey } from "react-icons/md";
import {
  getContrastColor,
  PaletteBuilder,
} from "../../../util/PaletteBuilderTwoStore";
import styles from "./PaletteBuilderTwo.module.css";
import { ICON_SIZE_MD } from "../../../ui/UiConstants";
import Popover from "../../../ui/kit/Popover";
import AdditionalTintPicker from "./AdditionalTintPicker";

function AdditionalPaletteRow({ palette }: { palette: PaletteBuilder }) {
  return (
    <tr>
      <td className={styles.columnPalette}>
        <div className={styles.palettePickerButton}>
          <div
            className={styles.paletteColor}
            style={{
              background: palette.mainColorHex,
            }}
          ></div>
          {palette.name}
        </div>
      </td>
      {palette.tints.map((tint) => (
        <Popover>
          <Popover.Toggle id="additional-picker">
            <td
              key={tint.name}
              className={styles.columnPrimaryTintPreview}
              style={{
                background: tint.color.hex,
              }}
            >
              {tint.isFixed && (
                <div className={styles.keyColor}>
                  <MdVpnKey
                    color={getContrastColor(tint.color.hex)}
                    size={ICON_SIZE_MD}
                    className="rotate-key"
                  />
                </div>
              )}
            </td>
          </Popover.Toggle>
          <Popover.Body id="additional-picker">
            <AdditionalTintPicker />
          </Popover.Body>
        </Popover>
      ))}
    </tr>
  );
}

export default AdditionalPaletteRow;
