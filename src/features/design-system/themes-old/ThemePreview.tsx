import {
  Base,
  DarkableCategory,
  ThemeColor,
} from "../../../domain/DesignSystemDomain";
import styles from "../ComponentDesignSystem.module.css";
import { useDesignSystemContext } from "../DesignSystemContext";
import PreviewRect from "./PreviewThemeRect";

function ThemePreview({
  base,
  defaultBase,
  keyBase,
  theme,
}: {
  base?: Base;
  defaultBase: Base;
  keyBase: DarkableCategory;
  theme: ThemeColor;
}) {
  const { findDesignSystemColor } = useDesignSystemContext();
  return (
    <div
      className={styles.previewElementWrap}
      style={{
        background: findDesignSystemColor({
          label: base?.background[keyBase],
          defaultValue: defaultBase.background[keyBase],
        }),
      }}
    >
      <PreviewRect
        keyBase={keyBase}
        theme={theme}
        themeStateCategory="default"
      />
      {theme.hover && (
        <PreviewRect
          keyBase={keyBase}
          theme={theme}
          themeStateCategory="hover"
        />
      )}

      {theme.focus && (
        <PreviewRect
          keyBase={keyBase}
          theme={theme}
          themeStateCategory="focus"
        />
      )}
      {theme.active && (
        <PreviewRect
          keyBase={keyBase}
          theme={theme}
          themeStateCategory="active"
        />
      )}
    </div>
  );
}

export default ThemePreview;
