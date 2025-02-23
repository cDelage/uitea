import { MouseEvent, ReactNode, useState } from "react";
import styles from "./tooltip.module.css";
import toast from "react-hot-toast";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { ICON_SIZE_MD } from "../UiConstants";

function CopyableTopTooltip({
  children,
  tooltipValue,
  width,
}: {
  children: ReactNode;
  tooltipValue?: string;
  width?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

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

  return (
    <div className={styles.tooltipElement}>
      {tooltipValue && (
        <div
          className={styles.tooltipBody}
          onClick={copy}
          style={{ width }}
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
      {children}
    </div>
  );
}

export default CopyableTopTooltip;
