import { useNavigate } from "react-router-dom";
import { ICON_SIZE_XXL } from "../../ui/UiConstants";
import styles from "./homeActionButtons.module.css";
import { MdConstruction } from "react-icons/md";

function OpenPaletteBuilder() {
  const navigate = useNavigate();
  return (
    <button
      className={styles.homeActionButton}
      onClick={() => navigate("palette-builder")}
    >
      <div className={styles.centerContainer}>
        <div className={styles.iconContainer}>
          <MdConstruction size={ICON_SIZE_XXL} />
        </div>
      </div>
      <div>Palette <br/> builder</div>
    </button>
  );
}

export default OpenPaletteBuilder;
