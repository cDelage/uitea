import {
  MdArrowBack,
  MdArrowForward,
  MdBuild,
  MdChevronLeft,
  MdOpenInNew,
  MdPalette,
} from "react-icons/md";
import ColorPicker from "./ColorPicker";
import styles from "./ColorPicker.module.css";
import { useColorPickerStore } from "./ColorPickerStore";
import { ICON_SIZE_MD, ICON_SIZE_SM } from "../../ui/UiConstants";
import PickerToolSidepanel from "./PickerToolSidepanel";
import SidePanel from "../../ui/kit/SidePanel";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { TokenFamily } from "../../domain/DesignSystemDomain";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ButtonTertiary } from "../../ui/kit/Buttons";

function ColorPickerComponent({
  tokens,
  isModal,
}: {
  tokens?: TokenFamily[];
  isModal?: boolean;
}) {
  const {
    colors,
    initColorPickerStore,
    undoColorPicker,
    redoColorPicker,
    canUndoRedo,
  } = useColorPickerStore();
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(false);
  const navigate = useNavigate();
  const { designSystemPath } = useParams();
  const [searchParams] = useSearchParams();
  const currentDesignSystem = searchParams.get("currentDesignSystem");
  const colorPickerStyle = classNames("h-full row relative", {
    [styles.rightSidepanelSpace]: isSidepanelOpen,
  });

  useEffect(() => {
    if (!colors.length) {
      initColorPickerStore();
    }
  }, [colors, initColorPickerStore]);

  if (!colors.length) return null;

  return (
    <SidePanel
      isOpenToSync={isSidepanelOpen}
      setIsOpenToSync={setIsSidepanelOpen}
      defaultOpen="picker-tool"
    >
      <div className={styles.colorPickerComponent} data-disableoutside={true}>
        {isModal && (
          <div className={styles.modalHeader}>
            <div className="row gap-2 align-center">
              <MdPalette size={ICON_SIZE_MD} />
              <h5>Color picker</h5>
            </div>
            <div className="row gap-4 align-center">
              <div className="row gap-2">
                <button
                  className="action-ghost-button"
                  disabled={!canUndoRedo.canUndo}
                  onClick={() => undoColorPicker()}
                >
                  <MdArrowBack size={ICON_SIZE_SM} />
                </button>
                <button
                  className="action-ghost-button"
                  disabled={!canUndoRedo.canRedo}
                  onClick={() => redoColorPicker()}
                >
                  <MdArrowForward size={ICON_SIZE_SM} />
                </button>
              </div>
              <button
                className="action-ghost-button"
                onClick={() =>
                  navigate(
                    `/color-picker?currentDesignSystem=${designSystemPath}`
                  )
                }
              >
                <MdOpenInNew size={ICON_SIZE_MD} /> Full screen
              </button>
            </div>
          </div>
        )}
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
        {currentDesignSystem && (
          <div className={styles.leftActionsContainer}>
            <ButtonTertiary
              onClick={() =>
                navigate(
                  `/design-system/${encodeURIComponent(
                    currentDesignSystem
                  )}?editMode=true`
                )
              }
            >
              <MdChevronLeft size={ICON_SIZE_MD} /> Back to design system
            </ButtonTertiary>
          </div>
        )}
      </div>
    </SidePanel>
  );
}

export default ColorPickerComponent;
