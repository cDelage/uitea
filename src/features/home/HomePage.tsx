import CreateDesignSystem from "./CreateDesignSystem";
import LoadDesignSystem from "./LoadDesignSystem";
import RecentFiles from "./RecentFiles";
import styles from "./Home.module.css";
import OpenPaletteBuilder from "./OpenPaletteBuilder";
import OpenColorPicker from "./OpenColorPicker";

function HomePage() {
  return (
    <div className={styles.homepage}>
      <h1>New</h1>
      <div className="row gap-4">
        <CreateDesignSystem />
        <LoadDesignSystem />
        <OpenPaletteBuilder />
        <OpenColorPicker />
      </div>
      <h1>Recent</h1>
      <RecentFiles />
    </div>
  );
}

export default HomePage;
