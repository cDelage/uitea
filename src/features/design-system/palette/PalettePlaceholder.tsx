import { MdConstruction } from "react-icons/md";
import { DEFAULT_PALETTE, ICON_SIZE_XXL } from "../../../ui/UiConstants";
import { useDesignSystemContext } from "../DesignSystemContext";
import { useSaveDesignSystem } from "../DesignSystemQueries";
import styles from "./PalettePlaceholder.module.css";
import { useNavigate } from "react-router-dom";

function PalettePlaceholder() {
  const { designSystem } = useDesignSystemContext();
  const { saveDesignSystem } = useSaveDesignSystem(
    designSystem.metadata.designSystemPath
  );
  const navigate = useNavigate();
  function initPalette() {
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        palettes: [...designSystem.palettes, DEFAULT_PALETTE],
      },
      isTmp: true,
    });
  }
  return (
    <div className={styles.placeholderContainer}>
      <div
        className="add-button w-full h-full align-center justify-center cursor-pointer"
        onClick={() =>
          navigate(
            `/palette-builder?currentDesignSystem=${designSystem.metadata.designSystemPath}`
          )
        }
      >
        <div className="row gap-4 align-center">
          <MdConstruction size={ICON_SIZE_XXL} />
          <h3
            style={{
              fontWeight: "400",
            }}
          >
            Start to build with palette builder
          </h3>
        </div>
      </div>
      <div className="row w-full justify-end">
        <div className="text-tertiary-button" onClick={initPalette}>
          Or create a palette manually
        </div>
      </div>
    </div>
  );
}

export default PalettePlaceholder;
