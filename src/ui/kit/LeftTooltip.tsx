import { ReactNode } from "react";
import styles from "./tooltip.module.css";

function LeftTooltip({
  children,
  tooltipBody,
}: {
  children: ReactNode;
  tooltipBody: ReactNode;
}) {
  return (
    <div className={styles.tooltipElement}>
      <div className={styles.tooltipBodyRight}>
        {tooltipBody}
        <div className={styles.tooltipArrowRight} />
      </div>
      {children}
    </div>
  );
}

export default LeftTooltip;
