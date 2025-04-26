import { MdBuild, MdPalette } from "react-icons/md";
import ColorPicker from "./ColorPicker";
import styles from "./ColorPicker.module.css";
import { useColorPickerStore } from "./ColorPickerStore";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import PickerToolSidepanel from "./PickerToolSidepanel";
import SidePanel from "../../ui/kit/SidePanel";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { TokenFamily } from "../../domain/DesignSystemDomain";

function ColorPickerComponent({ tokens }: { tokens?: TokenFamily[] }) {
  const { colors, initColorPickerStore } = useColorPickerStore();
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(false);

  const colorPickerStyle = classNames("h-full row relative", {
    [styles.rightSidepanelSpace]: isSidepanelOpen,
  });

  useEffect(() => {
    console.log("try to init")
    if (!colors.length) {
      initColorPickerStore();
    }
  }, [colors, initColorPickerStore]);

  if(!colors.length) return null;

  return (
    <SidePanel
      isOpenToSync={isSidepanelOpen}
      setIsOpenToSync={setIsSidepanelOpen}
      defaultOpen="picker-tool"
    >
      <div className={styles.colorPickerComponent} data-disableoutside={true}>
        <div className={styles.modalHeader}>
          <div className="row gap-2 align-center">
            <MdPalette size={ICON_SIZE_MD} />
            <h5>Color picker</h5>
          </div>
        </div>
        <div className={colorPickerStyle}>
          {colors.map((color, index) => (
            <ColorPicker
              color={color}
              isSidepanelOpen={isSidepanelOpen}
              key={`${color.toString({ format: "hex" })}${index}`}
              index={index}
              tokens={tokens}
            />
          ))}
          <div className={styles.actionsContainer}>
            <SidePanel.Button id="picker-tool">
              <button className="action-button">
                <MdBuild size={ICON_SIZE_MD} />
                Picker tools
              </button>
            </SidePanel.Button>
          </div>
          <SidePanel.BodyRelative id="picker-tool" width="33.3%">
            <PickerToolSidepanel tokens={tokens} />
          </SidePanel.BodyRelative>
        </div>
      </div>
    </SidePanel>
  );
}

export default ColorPickerComponent;
