import { ReactNode, RefObject, useState } from "react";
import styles from "./tooltip.module.css";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { ICON_SIZE_MD } from "../UiConstants";
import { createPortal } from "react-dom";
import { useCopy } from "../../util/CopyUtil";
import classNames from "classnames";

function CopyableTopTooltip({
  children,
  tooltipValue,
  portalComponent,
  className,
  transformBody,
}: {
  children: ReactNode;
  tooltipValue?: string;
  portalComponent?: RefObject<HTMLDivElement | null>;
  className?: string;
  transformBody?: string;
}) {
  const [isHover, setIsHover] = useState(false);

  const { copy, isCopied } = useCopy();
  function handleMouseEnter() {
    if (portalComponent?.current) {
      setIsHover(true);
    }
  }

  function handleMouseLeave() {
    if (portalComponent?.current) {
      setIsHover(false);
    }
  }

  const tooltipElementStyle = classNames(styles.tooltipElement, className);

  return (
    <div
      className={tooltipElementStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {tooltipValue && !portalComponent && (
        <div
          className={styles.tooltipBody}
          onClick={(e) => {
            e.stopPropagation();
            copy(tooltipValue);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            transform: transformBody,
          }}
        >
          <div className={styles.valueTextContainer}>{tooltipValue}</div>
          {isCopied ? (
            <MdCheck size={ICON_SIZE_MD} />
          ) : (
            <MdContentCopy size={ICON_SIZE_MD} />
          )}
          <div className={styles.tooltipArrow}></div>
        </div>
      )}
      {tooltipValue &&
        isHover &&
        portalComponent?.current &&
        createPortal(
          <div
            className={styles.tooltipBody}
            onClick={(e) => {
              e.stopPropagation();
              copy(tooltipValue);
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.valueTextContainer}>{tooltipValue}</div>
            {isCopied ? (
              <MdCheck size={ICON_SIZE_MD} />
            ) : (
              <MdContentCopy size={ICON_SIZE_MD} />
            )}
            <div className={styles.tooltipArrow} />
          </div>,
          portalComponent.current
        )}
      {children}
    </div>
  );
}

export default CopyableTopTooltip;
