import { useNavigate } from "react-router-dom";
import styles from "./homeActionButtons.module.css";
import { MdPalette } from "react-icons/md";
import { ICON_SIZE_XXL } from "../../ui/UiConstants";

function OpenColorPicker() {
  const navigate = useNavigate();
  return (
    <button
      className={styles.homeActionButton}
      onClick={() => navigate("color-picker")}
    >
      <div className={styles.centerContainer}>
        <div className={styles.iconContainer}>
          <MdPalette size={ICON_SIZE_XXL} />
        </div>
      </div>
      <div>Color picker</div>
    </button>
  );
}

export default OpenColorPicker;
