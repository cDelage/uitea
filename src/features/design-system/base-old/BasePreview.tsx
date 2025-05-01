import styled from "styled-components";
import { Base, DarkableCategory } from "../../../domain/DesignSystemDomain";
import styles from "../ComponentDesignSystem.module.css";
import { useDesignSystemContext } from "../DesignSystemContext";

const BorderStyled = styled.div<{ border: string }>`
  border: ${(props) => props.border};
  height: 100%;
  box-sizing: border-box;
`;

function BasePreview({
  base,
  defaultBase,
  keyBase,
}: {
  base: Base;
  defaultBase: Base;
  keyBase: DarkableCategory;
}) {
  const { findDesignSystemColor } = useDesignSystemContext();
  const borderColor = findDesignSystemColor({
    label: base.border[keyBase],
    defaultValue: defaultBase.border[keyBase],
  });

  return (
    <div
      className={styles.previewElement}
      style={{
        background: findDesignSystemColor({
          label: base.background[keyBase],
          defaultValue: defaultBase.background[keyBase],
        }),
        color: findDesignSystemColor({
          label: base.textDefault[keyBase],
          defaultValue: defaultBase.textDefault[keyBase],
        }),
      }}
    >
      <h4>Base color preview</h4>
      <div className="row align-center gap-4">
        <div
          className={styles.previewRect}
          style={{
            border: `${borderColor} 2px solid`,
          }}
        >
          <strong>Border</strong>
          <div className="row h-full gap-6">
            <BorderStyled border={`1px dashed ${borderColor}`} />
            <BorderStyled border={`1px solid ${borderColor}`} />
            <BorderStyled border={`2px dashed ${borderColor}`} />
            <BorderStyled border={`2px solid ${borderColor}`} />
            <BorderStyled border={`4px dashed ${borderColor}`} />
            <BorderStyled border={`4px solid ${borderColor}`} />
            <BorderStyled border={`6px solid ${borderColor}`} />
            <BorderStyled border={`8px solid ${borderColor}`} />
            <BorderStyled border={`10px solid ${borderColor}`} />
          </div>
        </div>
      </div>
      <div className="column gap-4">
        <div
          style={{
            color: findDesignSystemColor({
              label: base.textLight[keyBase],
              defaultValue: defaultBase.textLight[keyBase],
            }),
          }}
        >
          <strong>Text color light:</strong> sample of text.
        </div>
        <div>
          <strong>Text color default:</strong> sample of text.
        </div>
        <div
          style={{
            color: findDesignSystemColor({
              label: base.textDark[keyBase],
              defaultValue: defaultBase.textDark[keyBase],
            }),
          }}
        >
          <strong>Text color dark:</strong> sample of text.
        </div>
      </div>
      <div
        style={{
          color: findDesignSystemColor({
            label: base.textDisabled[keyBase],
            defaultValue: defaultBase.textDisabled[keyBase],
          }),
          background: findDesignSystemColor({
            label: base.backgroundDisabled[keyBase],
            defaultValue: defaultBase.backgroundDisabled[keyBase],
          }),
          border: `${findDesignSystemColor({
            label: base.backgroundDisabled[keyBase],
            defaultValue: defaultBase.backgroundDisabled[keyBase],
          })} 1px solid`,
          padding: "var(--space-4)",
        }}
      >
        Disabled component
      </div>
    </div>
  );
}

export default BasePreview;
