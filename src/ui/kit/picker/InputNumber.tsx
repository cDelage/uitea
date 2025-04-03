import { ChangeEvent } from "react";
import { autoRangeNumber } from "../../../features/design-system/PaletteBuilder3/PaletteBuilder3Store";
import styles from "./InputNumber.module.css";
import classNames from "classnames";

function InputNumber({
  value,
  max,
  min,
  setValue,
  step,
}: {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (!Number.isNaN(e.target.value)) {
      setValue(autoRangeNumber(Number(e.target.value), min, max));
    }
  }
  const inputStyle = classNames("inherit-input", styles.inputContainer);
  return (
    <div className="row gap-2 align-center">
      <input
        className={inputStyle}
        type="number"
        value={value.toFixed(2)}
        step={step}
        onChange={handleChange}
      />
    </div>
  );
}

export default InputNumber;
