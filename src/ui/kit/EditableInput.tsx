import styles from "./EditableInput.module.css";
function EditableInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (e: string) => void;
  disabled: boolean;
}) {
  return (
    <input
      type="text"
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => e.target.select()}
      className={styles.editableInput}
    />
  );
}

export default EditableInput;
