import { MdContentCopy, MdWarning } from "react-icons/md";
import { ComponentMode } from "./DesignSystemContext";
import styles from "./InputDesignSystem.module.css";
import { ICON_SIZE_SM } from "../../ui/UiConstants";
import { ReactNode, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Popover from "../../ui/kit/Popover";
import classNames from "classnames";

function InputDesignSystem({
  label,
  value,
  mode,
  register,
  popoverCopy,
  handleSubmit,
  isColor,
  computedColor,
}: {
  label: string;
  value: string | undefined;
  mode: ComponentMode;
  register?: UseFormRegisterReturn<string>;
  popoverCopy?: ReactNode;
  handleSubmit: () => void;
  isColor?: boolean;
  computedColor?: string;
}) {
  const [isHover, setIsHover] = useState(false);

  const colorRectClassNames = classNames(
    styles.colorPreviewContainer,
    {[styles.colorPreviewContainerHover]: isHover}
  )

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={styles.inputDesignSystem}
    >
      <div className={styles.sideContainer}>
        {mode === "default" && isHover && popoverCopy && (
          <Popover>
            <Popover.Toggle id="copy-shade" positionPayload="top-right">
              <button type="button" className="action-button">
                <MdContentCopy size={ICON_SIZE_SM} />
              </button>
            </Popover.Toggle>
            <Popover.Body id="copy-shade">{popoverCopy}</Popover.Body>
          </Popover>
        )}
      </div>
      <div className="column w-full gap-1">
        <strong>{label}</strong>
        <small className="text-color-light">
          {mode === "edit" ? (
            <input
              disabled={mode !== "edit"}
              className="inherit-input w-full"
              placeholder="empty"
              {...register}
              onBlur={handleSubmit}
            />
          ) : (
            <div className="inherit-input-placeholder">{value ?? "empty"}</div>
          )}
        </small>
      </div>
      <div className={styles.sideContainer}>
        {isColor && (
          <div
            className={colorRectClassNames}
            style={{
              background: computedColor,
            }}
          >
            {!computedColor && (
              <MdWarning size={12} color="var(--theme-warning-outline-text)" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InputDesignSystem;
