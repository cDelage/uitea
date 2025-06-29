import ImageLocalComponent from "../../ui/kit/ImageLocal";
import { useDesignSystemContext } from "./DesignSystemContext";
import styles from "./HeaderDesignSystem.module.css";

function HeaderDesignSystem() {
  const { designSystem } = useDesignSystemContext();
  const {
    metadata: { designSystemName, banner, logo },
  } = designSystem;
  return (
    <div className={styles.headerDesignSystem}>
      <ImageLocalComponent srcPath={banner} />
      <div className={styles.shadowTitleContainer}>
        <h1 className={styles.titleDesignSystem}>{designSystemName}</h1>
      </div>
      <div className={styles.logoContainer}>
        <ImageLocalComponent srcPath={logo} />
      </div>
    </div>
  );
}

export default HeaderDesignSystem;
