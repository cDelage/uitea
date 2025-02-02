import { useParams } from "react-router-dom";
import {
  useCurrentDesignSystem,
  useSaveDesignSystem,
} from "./DesignSystemQueries";
import styles from "./SidebarDesignSystem.module.css";

function SidebarDesignSystem() {
  const { designSystem } = useCurrentDesignSystem();
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  function handleSave() {
    if (!designSystem) return;
    saveDesignSystem({ designSystem, isTmp: false });
  }
  return (
    <div className={styles.sidebarDesignSystem}>
      <button onClick={() => handleSave()}>Save</button>
    </div>
  );
}

export default SidebarDesignSystem;
