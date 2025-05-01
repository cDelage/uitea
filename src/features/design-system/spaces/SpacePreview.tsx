import styles from "./SpacePreview.module.css";
import { Space } from "../../../domain/DesignSystemDomain";

interface SpacePreviewProps {
  space: Space;
}

function SpacePreview({ space }: SpacePreviewProps) {
  // space.spaceValue est censé être du type "4px", "8px", etc.
  // Ici, on l’utilise comme hauteur, mais on peut l'utiliser en marge, etc.
  return (
    <div
      className={styles.spacePreviewItem}
      style={{
        minHeight: space.spaceValue,
        maxHeight: space.spaceValue,
      }}
    >
      <div className={styles.textPreview}>
        <strong>{space.spaceKey}</strong>: {space.spaceValue}
      </div>
    </div>
  );
}

export default SpacePreview;
