import { ReactNode } from "react";
import styles from "../ComponentDesignSystem.module.css";
import { PreviewStyle } from "./PreviewStyle";
import { useDesignSystemContext } from "../DesignSystemContext";

function PreviewComponentDesignSystem({
  children,
  maxHeight,
}: {
  children: ReactNode;
  maxHeight?: string;
}) {
  const { tokenFamilies } = useDesignSystemContext();
  return (
    <div
      className={styles.previewContainer}
      style={{
        maxHeight,
      }}
    >
      <PreviewStyle tokenFamilies={tokenFamilies}>
        <div className={styles.previewBody}>{children}</div>
      </PreviewStyle>
    </div>
  );
}

export default PreviewComponentDesignSystem;
