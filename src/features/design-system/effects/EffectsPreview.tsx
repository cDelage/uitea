import classNames from "classnames";
import { Effect } from "../../../domain/DesignSystemDomain";
import styles from "../ComponentDesignSystem.module.css";
import { getEffectCss } from "../../../util/DesignSystemUtils";

function EffectsPreview({ effect }: { effect: Effect }) {
  const previewRect = classNames(styles.previewRectWrap, styles.primaryTheme);

  return (
    <div className={previewRect} style={{ ...getEffectCss(effect) }}>
      {effect.effectName}
    </div>
  );
}

export default EffectsPreview;
