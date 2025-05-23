import classNames from "classnames";
import { Shadows } from "../../../domain/DesignSystemDomain";
import styles from "../ComponentDesignSystem.module.css";

function ShadowPreview({ effect }: { effect: Shadows }) {
  const previewRect = classNames(styles.previewRectWrap, "default-combination");

  return (
    <div className={previewRect}>
      {effect.shadowName}
    </div>
  );
}

export default ShadowPreview;
