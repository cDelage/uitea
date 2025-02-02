import { useCurrentDesignSystem } from "./DesignSystemQueries";
import styles from "./HeaderDesignSystem.module.css";

function HeaderDesignSystem() {
  const { designSystem } = useCurrentDesignSystem();

  if (!designSystem) return null;

  return (
    <div className={styles.headerDesignSystem}>
      <div className={styles.shadowTitleContainer}>
        <h1 className={styles.titleDesignSystem}>
          {designSystem.metadata.designSystemName}
        </h1>
      </div>
    </div>
  );
}

export default HeaderDesignSystem;
