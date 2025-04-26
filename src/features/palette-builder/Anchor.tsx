import { FaDiamond } from "react-icons/fa6";
import ColorIO from "colorjs.io";
import { ICON_SIZE_SM } from "../../ui/UiConstants";
import { getContrastColor } from "../../util/PickerUtil";
import styles from "./Anchor.module.css";

function Anchor({ background }: { background: ColorIO }) {
  return (
    <div className={styles.anchorContainer}>
      <FaDiamond
        size={ICON_SIZE_SM}
        color={getContrastColor(background.toString({ format: "hex" }))}
        className={styles.iconBorder}
      />
      <FaDiamond
        size={ICON_SIZE_SM}
        className={styles.iconFill}
      />
    </div>
  );
}

export default Anchor;
