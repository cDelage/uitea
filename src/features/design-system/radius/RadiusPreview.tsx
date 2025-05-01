import classNames from "classnames";
import styles from "../ComponentDesignSystem.module.css";

interface RadiusPreviewProps {
  label: string;
  radiusValue: string;
}

function RadiusPreview({ label, radiusValue }: RadiusPreviewProps) {
  const previewRect = classNames(styles.previewRectWrap, styles.primaryTheme);
  return (
    <div
      className={previewRect}
      style={{
        borderRadius: radiusValue,
      }}
    >
      <span className={styles.textPreview}>
        <strong>{label}</strong>: {radiusValue}
      </span>
    </div>
  );
}

export default RadiusPreview;
