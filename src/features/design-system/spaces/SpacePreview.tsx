import styles from "./SpacePreview.module.css";
import { Space } from "../../../domain/DesignSystemDomain";
import { measurementToCss } from "../../../util/DesignSystemUtils";
import classNames from "classnames";

interface SpacePreviewProps {
  space: Space;
}

function SpacePreview({ space }: SpacePreviewProps) {
  // space.spaceValue est censé être du type "4px", "8px", etc.
  // Ici, on l’utilise comme hauteur, mais on peut l'utiliser en marge, etc.
  const spaceCss = measurementToCss(space.spaceValue)
  const spaceClass = classNames(styles.spacePreviewItem, "default-combination")
  return (
    <div
      className={spaceClass}
      style={{
        minHeight: spaceCss,
        maxHeight: spaceCss,
      }}
    >
      <div className="default-combination">
        <strong>{space.spaceKey}</strong>: {spaceCss}
      </div>
    </div>
  );
}

export default SpacePreview;
