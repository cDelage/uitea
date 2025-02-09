import { DarkableCategory, ThemeColor, ThemeStateCategory } from "../../domain/DesignSystemDomain";
import { useDesignSystemContext } from "./DesignSystemContext";
import styles from "./ComponentDesignSystem.module.css";

function PreviewRect({
  keyBase,
  theme,
  themeStateCategory
}: {
  keyBase: DarkableCategory;
  theme: ThemeColor;
  themeStateCategory: ThemeStateCategory
}) {
  const { findDesignSystemColor } = useDesignSystemContext();

  return (
    <div
      className={styles.previewRectWrap}
      style={{
        background: findDesignSystemColor({
          label: theme?.[themeStateCategory]?.background[keyBase],
        }),
        border: `${findDesignSystemColor({
          label: theme?.[themeStateCategory]?.border[keyBase],
        })} 1px solid`,
        color: findDesignSystemColor({
          label: theme?.[themeStateCategory]?.text[keyBase],
        }),
      }}
    >
      {themeStateCategory}
    </div>
  );
}

export default PreviewRect;
