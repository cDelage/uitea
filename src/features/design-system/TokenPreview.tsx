import { ReactNode } from "react";
import CopyableTopTooltip from "../../ui/kit/CopyableTopTooltip";
import { getRectSize } from "../../ui/UiConstants";
import styles from "./TokenPreview.module.css";

function TokenPreview({
  label,
  value,
  tooltipValue,
  flex,
  preview,
}: {
  label: string;
  value?: string;
  tooltipValue?: string;
  flex?: boolean;
  preview?: ReactNode;
}) {
  return (
    <div className={`column w-fit gap-2 ${flex ? "flex-1" : ""}`}>
      {preview && 
      <div className={styles.previewNode}>{preview}</div>
      }
      <CopyableTopTooltip
        tooltipValue={tooltipValue}
        className={flex ? "flex-1" : "w-fit"}
      >
        <div className="row align-center gap-3 p-2 py-3 w-fit">
          <div
            className="palette-color w-full"
            style={{
              ...getRectSize({ height: "var(--uidt-space-7)" }),
              background: `var(--${value})`,
            }}
          ></div>
          <div className="column">
            <strong className="nowrap overflow-visible text-color-dark">
              {label}
            </strong>
            <div className="nowrap overflow-visible">{value}</div>
          </div>
        </div>
      </CopyableTopTooltip>
    </div>
  );
}

export default TokenPreview;
