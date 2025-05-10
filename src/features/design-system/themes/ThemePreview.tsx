import { useMemo } from "react";
import { Theme } from "../../../domain/DesignSystemDomain";
import { getRectSize, ICON_SIZE_MD } from "../../../ui/UiConstants";
import { useDesignSystemContext } from "../DesignSystemContext";
import { recolorPalettes } from "../../../util/ThemeGenerator";
import CopyableTopTooltip from "../../../ui/kit/CopyableTopTooltip";
import { MdChevronRight } from "react-icons/md";

function ThemePreview({
  theme,
  isMain,
  index,
  expandIndex,
  mainTheme,
  setExpandIndex,
}: {
  theme: Theme;
  mainTheme?: Theme;
  isMain?: boolean;
  expandIndex: number | undefined;
  setExpandIndex: (value: number | undefined) => void;
  index: number;
}) {
  const { designSystem } = useDesignSystemContext();

  const palettesString = JSON.stringify(designSystem.palettes);
  const palettes = useMemo(() => {
    if (palettesString) {
      const palettesToDisplay = designSystem.palettes.filter(
        (_palette, palIndex) => palIndex < 3 || index === expandIndex
      );
      return isMain || !mainTheme
        ? palettesToDisplay
        : recolorPalettes({
            palettes: palettesToDisplay,
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
    expandIndex,
    index,
    mainTheme,
  ]);
  return (
    <div
      className="column gap-5 p-7"
      style={{
        background: theme.background,
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
        <button
          className="action-button"
          onClick={() =>
            expandIndex === index
              ? setExpandIndex(undefined)
              : setExpandIndex(index)
          }
        >
          <MdChevronRight
            size={ICON_SIZE_MD}
            style={{
              rotate: expandIndex === index ? "-90deg" : "90deg",
            }}
          />
          {expandIndex === index ? "Collapse" : "Expand"}
        </button>
      </div>
    </div>
  );
}

export default ThemePreview;
