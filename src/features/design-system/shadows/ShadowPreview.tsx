import classNames from "classnames";
import { Shadows } from "../../../domain/DesignSystemDomain";
import styles from "../ComponentDesignSystem.module.css";
import { buildBoxShadow } from "../../../util/DesignSystemUtils";
import { usePreviewContext } from "../previews/PreviewContext";

function ShadowPreview({ effect }: { effect: Shadows }) {
  const previewRect = classNames(
    styles.previewRectWrap,
    "default-combination radius"
  );

  const {styleRef} = usePreviewContext();

  return (
    <div
      className={previewRect}
      style={{
        boxShadow: buildBoxShadow(effect, styleRef),
      }}
    >
      {effect.shadowName}
    </div>
  );
}

export default ShadowPreview;
