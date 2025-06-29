import { ReactNode, useRef } from "react";
import styles from "../ComponentDesignSystem.module.css";
import { PreviewStyle } from "./PreviewStyle";
import { useDesignSystemContext } from "../DesignSystemContext";
import { PreviewContext } from "./PreviewContext";

function PreviewComponentDesignSystem({
  children,
  height,
}: {
  children: ReactNode;
  height?: string;
}) {
  const {
    themeTokenFamilies,
    tokenFamilies,
    designSystem,
    defaultCombination,
  } = useDesignSystemContext();
  const styleRef = useRef<HTMLDivElement>(null);

  return (
    <PreviewContext.Provider value={{ styleRef, tokenFamilies }}>
      <div
        className={styles.previewContainer}
        style={{
          height,
        }}
      >
        <PreviewStyle
          $tokenFamilies={themeTokenFamilies}
          ref={styleRef}
          $designSystem={designSystem}
          $defaultCombination={defaultCombination}
        >
          <div className={styles.previewBody}>{children}</div>
        </PreviewStyle>
      </div>
    </PreviewContext.Provider>
  );
}

export default PreviewComponentDesignSystem;
