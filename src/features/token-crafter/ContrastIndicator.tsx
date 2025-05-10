import { MdCheckBoxOutlineBlank, MdContrast, MdTitle } from "react-icons/md";
import { ICON_SIZE_XS } from "../../ui/UiConstants";
import {
  ColorCombination,
  CombinationContrasts,
} from "../../domain/DesignSystemDomain";
import { useMemo } from "react";
import { useTokenCrafterContext } from "./TokenCrafterContext";
import {
  getCssVariableValue,
} from "../../util/DesignSystemUtils";
import styles from "./TokenCrafter.module.css";
import { getCombinationContrasts } from "./TokenCrafterStore";

function ContrastIndicator({ combination }: { combination: ColorCombination }) {
  const { styleRef } = useTokenCrafterContext();
  const contrasts = useMemo<CombinationContrasts>(() => {
    const comparedCombination: ColorCombination = {
      background: combination.background
        ? getCssVariableValue(combination.background, styleRef)
        : undefined,
      text: combination.text
        ? getCssVariableValue(combination.text, styleRef)
        : undefined,
      border: combination.border
        ? getCssVariableValue(combination.border, styleRef)
        : undefined,
    };
    return getCombinationContrasts(comparedCombination);
  }, [combination, styleRef]);

  if (!contrasts.backgroundBorder && !contrasts.backgroundText) return null;
  return (
    <div className="column text-xs gap-1 align-end">
      <MdContrast
        size={ICON_SIZE_XS}
      />
      {contrasts.backgroundText && (
        <div className="row gap-1 align-center">
          <MdTitle size={ICON_SIZE_XS} />
          <div>{contrasts.backgroundText.toFixed(2)}</div>
        </div>
      )}
      {contrasts.backgroundBorder && (
        <div className="row gap-1 align-center">
          <MdCheckBoxOutlineBlank size={ICON_SIZE_XS} />
          <div className={styles.textContrast}>
            {contrasts.backgroundBorder.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContrastIndicator;
