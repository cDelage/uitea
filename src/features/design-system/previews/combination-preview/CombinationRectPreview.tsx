import {
  ColorCombination,
  ColorCombinationState,
} from "../../../../domain/DesignSystemDomain";
import { getRectSize } from "../../../../ui/UiConstants";

function CombinationRectPreview({
  colorCombination,
  type,
}: {
  colorCombination?: ColorCombination;
  type: ColorCombinationState;
}) {
  if (!colorCombination) return;
  return (
    <div
      className="palette-color"
      style={{
        borderRadius: "var(--uidt-rounded-md)",
        backgroundColor:
          colorCombination.background &&
          `var(--${colorCombination.background})`,
        border:
          colorCombination.border ?
          `var(--${colorCombination.border}) 2px solid` : "none",
        color:
          colorCombination.text && `var(--${colorCombination.text})`,
        ...getRectSize({ height: "100%", flex: true }),
      }}
    >
      {type}
    </div>
  );
}

export default CombinationRectPreview;
