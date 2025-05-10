import { MdOpenInFull, MdPictureInPictureAlt } from "react-icons/md";
import { PluginDisplayMode } from "../../domain/HomeDomain";
import FormComponent from "../../ui/kit/FormComponent";
import styles from "./Home.module.css";
import { useUpdateUserSettings, useUserSettings } from "./HomeQueries";
import { ICON_SIZE_MD } from "../../ui/UiConstants";

function HomeSettings() {
  const { userSettings } = useUserSettings();
  const { updateUserSettings } = useUpdateUserSettings();

  function handleChangePluginDisplayMode(pluginDisplayMode: PluginDisplayMode) {
    updateUserSettings({
      ...userSettings,
      pluginDisplayMode,
    });
  }
  return (
    <div className={styles.sidePanel}>
      <div className={styles.sidePanelHeader}>
        <h2>User settings</h2>
      </div>
      <div className={styles.sidePanelBodyContainer}>
        <FormComponent label="Plugin display mode">
          <div className="row gap-3 align-center strong">
            <input
              type="radio"
              checked={userSettings?.pluginDisplayMode === "fullscreen"}
              onChange={(e) => {
                if (e.target.checked) {
                  handleChangePluginDisplayMode("fullscreen");
                }
              }}
            />
            <MdOpenInFull size={ICON_SIZE_MD} /> Full screen mode
          </div>
          <div className="row gap-3 align-center strong">
            <input
              type="radio"
              checked={userSettings?.pluginDisplayMode === "modal"}
              onChange={(e) => {
                if (e.target.checked) {
                  handleChangePluginDisplayMode("modal");
                }
              }}
            />
            <MdPictureInPictureAlt size={ICON_SIZE_MD}/>Modal mode
          </div>
        </FormComponent>
      </div>
    </div>
  );
}

export default HomeSettings;
