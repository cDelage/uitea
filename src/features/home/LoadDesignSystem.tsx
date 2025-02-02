import { open } from "@tauri-apps/api/dialog";
import { ICON_SIZE_XXL } from "../../ui/UiConstants";
import styles from "./homeActionButtons.module.css";
import { MdUploadFile } from "react-icons/md";
import { useInsertRecentFile } from "./HomeQueries";
import toast from "react-hot-toast";

function LoadDesignSystem() {
  const { insertRecentFile } = useInsertRecentFile();
  async function handlePickFolder() {
    try {
      const folder = (await open({
        directory: true, // Permet de sélectionner uniquement les dossiers
        multiple: false, // Empêche la sélection multiple
        title: "Sélectionnez un dossier",
        defaultPath: ".", // Chemin par défaut
      })) as null | string;

      if (folder) {
        insertRecentFile(folder);
      }
    } catch (error) {
      toast.error(`Error while selecting the folder : ${error}`);
    }
  };

  return (
    <button
      className={styles.homeActionButton}
      onClick={() => handlePickFolder()}
    >
      <div className={styles.centerContainer}>
        <div className={styles.iconContainer}>
          <MdUploadFile size={ICON_SIZE_XXL} />
        </div>
      </div>
      <div>load design system </div>
    </button>
  );
}

export default LoadDesignSystem;
