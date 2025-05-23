import ModalCreateDesignSystem from "./ModalCreateDesignSystem";
import LoadDesignSystem from "./LoadDesignSystem";
import RecentFiles from "./RecentFiles";
import styles from "./Home.module.css";
import OpenPaletteBuilder from "./OpenPaletteBuilder";
import SidePanel from "../../ui/kit/SidePanel";

function HomePage() {
  return (
    <SidePanel>
      <div className={styles.homepage}>
        <div className="row align-center justify-between">
          <h1>New</h1>
        </div>
        <div className="row gap-4">
          <ModalCreateDesignSystem />
          <LoadDesignSystem />
          <OpenPaletteBuilder />
        </div>
        <h1>Recent</h1>
        <div
          style={{
            overflowY: "auto",
          }}
        >
          <RecentFiles />
        </div>
      </div>
    </SidePanel>
  );
}

export default HomePage;
