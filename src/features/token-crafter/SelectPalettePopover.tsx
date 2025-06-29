import { isPalette } from "../../domain/DesignSystemDomain";
import Popover from "../../ui/kit/Popover";
import { getRectSize } from "../../ui/UiConstants";
import { PreviewStyle } from "../design-system/previews/PreviewStyle";
import { useTokenCrafterContext } from "./TokenCrafterContext";
import { useTokenCrafterStore } from "./TokenCrafterStore";

function SelectPalettePopover({
  target,
}: {
  target: "indexPaletteA" | "indexPaletteB";
}) {
  const {
    customRowRecommandation,
    setCustomRowRecommandation,
    palettesAndColors,
  } = useTokenCrafterStore();
  const { tokenFamilies, designSystem } = useTokenCrafterContext();

  const selectedPalette =
    customRowRecommandation[target] !== undefined
      ? palettesAndColors[customRowRecommandation[target]]
      : undefined;

  function removeSelectedPalette(target: "indexPaletteA" | "indexPaletteB") {
    setCustomRowRecommandation({
      ...customRowRecommandation,
      [target]: undefined,
    });
  }

  function setSelectedPalette(index: number) {
    setCustomRowRecommandation({
      ...customRowRecommandation,
      [target]: index,
    });
  }

  return (
    <>
      <Popover.Toggle id={target} positionPayload="top-left">
        <div>
          <Popover.SelectorButton
            value={
              selectedPalette && (
                <div className="row align-center gap-2">
                  <div
                    className="palette-color"
                    style={{
                      ...getRectSize({ height: "var(--uidt-space-5)" }),
                      background: selectedPalette.mainColor.toString({
                        format: "hex",
                      }),
                    }}
                  ></div>
                  {isPalette(selectedPalette?.palette)
                    ? selectedPalette?.palette.paletteName
                    : selectedPalette?.palette.label}
                </div>
              )
            }
            placeholder="none"
            width="160px"
            id={target}
            onRemove={
              selectedPalette ? () => removeSelectedPalette(target) : undefined
            }
          />
        </div>
      </Popover.Toggle>
      <Popover.Body id={target} zIndex={2000}>
        <PreviewStyle
          $tokenFamilies={tokenFamilies}
          $designSystem={designSystem}
        >
          <Popover.Actions>
            {palettesAndColors.map((palette, index) => (
              <Popover.Tab
                key={
                  isPalette(palette.palette)
                    ? palette.palette.paletteName
                    : palette.palette.label
                }
                clickEvent={() => setSelectedPalette(index)}
              >
                <div
                  className="palette-color"
                  style={{
                    ...getRectSize({ height: "var(--uidt-space-5)" }),
                    background: palette.mainColor.toString({ format: "hex" }),
                  }}
                ></div>
                {isPalette(palette.palette)
                  ? palette.palette.paletteName
                  : palette.palette.label}
              </Popover.Tab>
            ))}
          </Popover.Actions>
        </PreviewStyle>
      </Popover.Body>
    </>
  );
}

export default SelectPalettePopover;
