import { MdArrowUpward } from "react-icons/md";
import styles from "./PalettePlaceholder.module.css";
import { ICON_SIZE_XL } from "../../../ui/UiConstants";

function EmptyPalettes() {
  function triggerScrollRequest() {
    document.dispatchEvent(
      new CustomEvent("triggerScroll", {
        detail: {
          id: "colors",
        },
      })
    );
  }

  return (
    <div className={styles.placeholderContainer}>
      <div className="row align-center justify-center gap-4 text-tertiary-button" onClick={triggerScrollRequest}>
        <MdArrowUpward size={ICON_SIZE_XL} />
        <h4
          style={{
            fontWeight: "400",
          }}
        >
          Build palettes before
        </h4>
        <MdArrowUpward size={ICON_SIZE_XL} />
      </div>
    </div>
  );
}

export default EmptyPalettes;
