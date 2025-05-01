import { useDesignSystemContext } from "../design-system/DesignSystemContext";
import styles from "./ColorPicker.module.css";
import ColorPickerComponent from "./ColorPickerComponent";

function ColorPickerModal() {
  const { tokenFamilies } = useDesignSystemContext();

  return (
    <div className={styles.modal}>
      <ColorPickerComponent tokens={tokenFamilies} isModal={true} />
    </div>
  );
}

export default ColorPickerModal;
