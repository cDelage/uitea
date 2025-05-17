import { useMemo } from "react";
import { Theme } from "../../../domain/DesignSystemDomain";
import { getRectSize } from "../../../ui/UiConstants";
import { useDesignSystemContext } from "../DesignSystemContext";
import { recolorPalettes } from "../../../util/ThemeGenerator";
import CopyableTopTooltip from "../../../ui/kit/CopyableTopTooltip";
import { getContrastColor } from "../../../util/PickerUtil";

function ThemePreview({
  theme,
  isMain,
  mainTheme,
}: {
  theme: Theme;
  mainTheme?: Theme;
  isMain?: boolean;
}) {
  const { designSystem } = useDesignSystemContext();

  const palettesString = JSON.stringify(designSystem.palettes);
  const palettes = useMemo(() => {
    if (palettesString) {
      return isMain || !mainTheme
        ? designSystem.palettes
        : recolorPalettes({
            palettes: designSystem.palettes,
            defaultBackground: mainTheme.background,
            newBackground: theme.background,
          });
    } else {
      return undefined;
    }
  }, [
    isMain,
    theme,
    palettesString,
    designSystem.palettes,
    mainTheme,
  ]);
  return (
    <div
      className="column gap-5 p-7"
      style={{
        background: theme.background,
        color: getContrastColor(theme.background)
      }}
    >
      <h4>{theme.name}</h4>
      <div className="column  w-full gap-5">
        {palettes?.map((palette) => (
          <div className="column w-full gap-3" key={palette.paletteName}>
            <div>{palette.paletteName}</div>
            <div className="row w-full gap-3 align-center ">
              {palette.tints.map((tint) => (
                <div key={tint.label} className="flex-1">
                  <CopyableTopTooltip tooltipValue={tint.color}>
                    <div className="py-3">
                      <div
                        className="palette-color"
                        style={{
                          background: tint.color,
                          border: "none",
                          ...getRectSize({
                            height: "var(--uidt-space-9)",
                            flex: true,
                          }),
                        }}
                      />
                    </div>
                  </CopyableTopTooltip>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThemePreview;
