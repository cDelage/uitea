import { MouseEvent, ReactNode, RefObject, useState } from "react";
import styles from "./tooltip.module.css";
import toast from "react-hot-toast";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { ICON_SIZE_MD } from "../UiConstants";
import { createPortal } from "react-dom";

function CopyableTopTooltip({
  children,
  tooltipValue,
  portalComponent,
}: {
  children: ReactNode;
  tooltipValue?: string;
  portalComponent?: RefObject<HTMLDivElement | null>;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const [isHover, setIsHover] = useState(false);

  function copy(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (!tooltipValue) return;
    navigator.clipboard
      .writeText(tooltipValue)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        toast.error(`Fail to copy ${tooltipValue}`);
      });
  }

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

  return (
    <div
      className={styles.tooltipElement}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {tooltipValue && !portalComponent && (
        <div
          className={styles.tooltipBody}
          onClick={copy}
          onMouseDown={(e) => e.stopPropagation()}
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
            onClick={copy}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.valueTextContainer}>{tooltipValue}</div>
            {isCopied ? (
              <MdCheck size={ICON_SIZE_MD} />
            ) : (
              <MdContentCopy size={ICON_SIZE_MD} />
            )}
            <div className={styles.tooltipArrow}></div>
          </div>,
          portalComponent.current
        )}
      {children}
    </div>
  );
}

export default CopyableTopTooltip;
