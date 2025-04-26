import ColorIO from "colorjs.io";
import { usePaletteBuilderStore } from "./PaletteBuilderStore";
import { useMemo } from "react";
import { AlignerValue, TintBuild } from "../../domain/PaletteBuilderDomain";
import styles from "./PaletteBuilder.module.css";
import Anchor from "./Anchor";
import { getContrastColor } from "../../util/PickerUtil";
import { MdContrast, MdDarkMode, MdSunny } from "react-icons/md";

function ColorPreviewBody({
  color,
  isAlignerDisplay,
  isAnchor,
  tints,
}: {
  color: ColorIO;
  isAlignerDisplay: boolean;
  isAnchor?: boolean;
  tints: TintBuild[];
}) {
  const { alignerSettings } = usePaletteBuilderStore();

  const alignerDisplay = useMemo<AlignerValue[]>(() => {
    if (alignerSettings.aligner === "HWB") {
      color.toGamut({ space: "hwb" });
      return [
        {
          aligner: "W",
          icon: MdSunny,
          value: Math.abs(color.get("hwb.w")).toFixed(2),
        },
        {
          aligner: "B",
          icon: MdDarkMode,
          value: Math.abs(color.get("hwb.b")).toFixed(2),
        },
      ];
    } else if (alignerSettings.aligner === "OKLCH") {
      color.toGamut({ space: "oklch" });
      return [
        {
          aligner: "L",
          icon: MdSunny,
          value: Math.abs(color.get("oklch.l")).toFixed(2),
        },
        {
          aligner: "C",
          icon: MdContrast,
          value: Math.abs(color.get("oklch.c")).toFixed(2),
        },
      ];
    } else if (alignerSettings.aligner === "LCH") {
      color.toGamut({ space: "lch" });
      return [
        {
          aligner: "L",
          icon: MdSunny,
          value: Math.abs(color.get("lch.l")).toFixed(2),
        },
        {
          aligner: "C",
          icon: MdContrast,
          value: Math.abs(color.get("lch.c")).toFixed(2),
        },
      ];
    } else if (alignerSettings.aligner === "CONTRAST_COLOR") {
      if (alignerSettings.alignerContrastMode === "PALETTE_STEP") {
        const comparationTint =
          tints[alignerSettings.alignerContrastPaletteStep];
        if (comparationTint) {
          return [
            {
              aligner: "C",
              icon: MdContrast,
              value: color.contrastWCAG21(comparationTint.color).toFixed(2),
            },
          ];
        }
      } else if (alignerSettings.alignerContrastMode === "CUSTOM_COLOR") {
        return [
          {
            aligner: "C",
            icon: MdContrast,
            value: color
              .contrastWCAG21(alignerSettings.alignerConstrastCustomColor)
              .toFixed(2),
          },
        ];
      }
    }

    return [];
  }, [alignerSettings, color, tints]);

  return (
    <div className="gap-2 h-full p-1">
      <table className="table-transparent">
        {isAlignerDisplay &&
          alignerDisplay.map((line) => (
            <tr
              key={line.aligner}
              style={{
                color: getContrastColor(color.toString({ format: "hex" })),
              }}
            >
              <td>
                <div className="row align-center gap-1">
                  <line.icon />
                  <small>{line.aligner}:</small>
                </div>
              </td>
              <td>
                <small className={styles.valueRealign}>{line.value}</small>
              </td>
            </tr>
          ))}
      </table>
      <div className={styles.anchorPreviewContainer}>
        {isAnchor ? (
          <Anchor background={color} />
        ) : (
          <div className={styles.anchorPlaceholder} />
        )}
      </div>
    </div>
  );
}

export default ColorPreviewBody;
