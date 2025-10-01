import { ChangeEvent, useEffect, useState } from "react";
import { autoRangeNumber } from "../palette-builder/PaletteBuilderStore";
import styles from "./InputNumber.module.css";
import classNames from "classnames";

function InputNumber({
  value,
  max,
  min,
  setValue,
  step,
  disabled
}: {
  value?: number;
  setValue: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  const [valueInput, setValueInput] = useState(Number(value?.toFixed(2)));
  const [storedValue, setStoredValue] = useState(value);
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (!Number.isNaN(e.target.value)) {
      setValueInput(autoRangeNumber(Number(e.target.value), min, max));
    }
  }

  const inputStyle = classNames(
    "inherit-input empty-border",
    styles.inputContainer
  );

  useEffect(() => {
    if(storedValue !== value){
      setStoredValue(value);
      setValueInput(Number(value?.toFixed(2)));
    }
  },[storedValue, setStoredValue, value])

  return (
    <div className="row gap-2 align-center uidt-input p-2">
      <input
        className={inputStyle}
        type="number"
        value={valueInput}
        step={step}
        onChange={handleChange}
        disabled={disabled}
        onBlur={() => setValue(valueInput)}
      />
    </div>
  );
}

export default InputNumber;
