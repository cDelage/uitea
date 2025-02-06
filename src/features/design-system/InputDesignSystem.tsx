import { MdContentCopy } from "react-icons/md";
import { ComponentMode } from "./DesignSystemContext";
import styles from "./InputDesignSystem.module.css";
import { ICON_SIZE_SM } from "../../ui/UiConstants";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

function InputDesignSystem({
  label,
  mode,
  register,
}: {
  label: string;
  mode: ComponentMode;
  register?: UseFormRegisterReturn<string>;
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={styles.inputDesignSystem}
    >
      <div className={styles.copyContainer}>
        {mode === "default" && isHover && (
          <button className="action-button">
            <MdContentCopy size={ICON_SIZE_SM} />
          </button>
        )}
      </div>
      <div className="column w-full gap-3">
        <strong>{label}</strong>
        <small className="text-color-light">
          <input
            disabled={mode !== "edit"}
            className="inherit-input w-full"
            placeholder="empty"
            {...register}
          />
        </small>
      </div>
    </div>
  );
}

export default InputDesignSystem;
