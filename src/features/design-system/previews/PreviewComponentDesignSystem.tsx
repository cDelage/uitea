import { ReactNode, useEffect, useRef } from "react";
import styles from "../ComponentDesignSystem.module.css";
import { PreviewStyle } from "./PreviewStyle";
import { useDesignSystemContext } from "../DesignSystemContext";
import { PreviewContext } from "./PreviewContext";

function PreviewComponentDesignSystem({
  children,
  maxHeight,
  height,
}: {
  children: ReactNode;
  maxHeight?: string;
  height?: string;
}) {
  const { themeTokenFamilies, tokenFamilies } = useDesignSystemContext();
  const styleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("updt", themeTokenFamilies);
  }, [themeTokenFamilies]);
  return (
    <PreviewContext.Provider value={{ styleRef, tokenFamilies }}>
      <div
        className={styles.previewContainer}
        style={{
          maxHeight,
          height,
        }}
      >
        <PreviewStyle $tokenFamilies={themeTokenFamilies} ref={styleRef}>
          <div className={styles.previewBody}>{children}</div>
        </PreviewStyle>
      </div>
    </PreviewContext.Provider>
  );
}

export default PreviewComponentDesignSystem;
