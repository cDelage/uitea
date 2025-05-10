import CreateDesignSystem from "./CreateDesignSystem";
import LoadDesignSystem from "./LoadDesignSystem";
import RecentFiles from "./RecentFiles";
import styles from "./Home.module.css";
import OpenPaletteBuilder from "./OpenPaletteBuilder";
import OpenColorPicker from "./OpenColorPicker";
import { MdSettings } from "react-icons/md";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import SidePanel from "../../ui/kit/SidePanel";
import HomeSettings from "./HomeSettings";

function HomePage() {
  return (
    <SidePanel>
      <div className={styles.homepage}>
        <div className="row align-center justify-between">
          <h1>New</h1>
          <SidePanel.Button id="settings">
            <button className="action-button">
              <MdSettings size={ICON_SIZE_MD} />
            </button>
          </SidePanel.Button>
          <SidePanel.BodyRelative id="settings">
            <HomeSettings />
          </SidePanel.BodyRelative>
        </div>
        <div className="row gap-4">
          <CreateDesignSystem />
          <LoadDesignSystem />
          <OpenPaletteBuilder />
          <OpenColorPicker />
        </div>
        <h1>Recent</h1>
        <RecentFiles />
      </div>
    </SidePanel>
  );
}

export default HomePage;
