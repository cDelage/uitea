import { ColorCombinationCollection } from "../../../../domain/DesignSystemDomain";
import { combinationHasAnyColor } from "../../../../util/DesignSystemUtils";
import styles from "./CombinationPreview.module.css";
import CombinationRectPreview from "./CombinationRectPreview";

function CombinationComponentPlaceholder({
  combination,
}: {
  combination: ColorCombinationCollection;
}) {
  return (
    <div className={styles.gridContainer}>
      {combinationHasAnyColor(combination.default) && (
        <CombinationRectPreview
          colorCombination={combination.default}
          type="default"
        />
      )}
      {combinationHasAnyColor(combination.hover) && (
        <CombinationRectPreview
          colorCombination={combination.hover}
          type="hover"
        />
      )}
      {combinationHasAnyColor(combination.focus) && (
        <CombinationRectPreview
          colorCombination={combination.focus}
          type="focus"
        />
      )}
      {combinationHasAnyColor(combination.active) && (
        <CombinationRectPreview
          colorCombination={combination.active}
          type="active"
        />
      )}
    </div>
  );
}

export default CombinationComponentPlaceholder;
