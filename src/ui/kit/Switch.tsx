import { ChangeEvent } from "react";
import styles from "./Switch.module.css";
function Switch({
  checked,
  onChange,
}: {
  checked?: boolean;
  onChange: (e?: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className={styles.toggleSwitch}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={onChange}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />
      <span className={styles.switch}></span>
    </label>
  );
}

export default Switch;
