import classNames from "classnames";
import styles from "../ComponentDesignSystem.module.css";
import { Measurement } from "../../../domain/DesignSystemDomain";
import { measurementToCss } from "../../../util/DesignSystemUtils";

interface RadiusPreviewProps {
  label: string;
  radiusValue: Measurement;
}

function RadiusPreview({ label, radiusValue }: RadiusPreviewProps) {
  const previewRect = classNames(styles.previewRectWrap, "default-combination");
  const value = measurementToCss(radiusValue);
  return (
    <div
      className={previewRect}
      style={{
        borderRadius: value,
      }}
    >
      <span className={styles.textPreview}>
        <strong>{label}</strong>: {value}
      </span>
    </div>
  );
}

export default RadiusPreview;
