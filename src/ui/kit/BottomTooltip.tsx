import { ReactNode } from "react";
import styles from "./tooltip.module.css";
import classNames from "classnames";

function BottomTooltip({
  children,
  tooltipValue,
  className,
}: {
  children: ReactNode;
  tooltipValue?: ReactNode;
  className?: string;
}) {
  const tooltipElementStyle = classNames(styles.tooltipElement, className);

  return (
    <div className={tooltipElementStyle}>
      {tooltipValue && (
        <div
          className={styles.tooltipBodyBottom}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className={styles.valueTextContainer}>{tooltipValue}</div>
          <div className={styles.tooltipArrowBottom}></div>
        </div>
      )}
      {children}
    </div>
  );
}

export default BottomTooltip;
