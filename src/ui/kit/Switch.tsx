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
      />
      <span className={styles.switch}></span>
    </label>
  );
}

export default Switch;
