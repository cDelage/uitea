import { MdArrowForward } from "react-icons/md";
import styles from "../SidepanelDesignSystem.module.css";
import { getRectSize, ICON_SIZE_MD } from "../../../ui/UiConstants";
import { useSidepanelContext } from "../../../ui/kit/SidepanelContext";
import { PRESET_SHADOWS } from "../../../ui/ShadowsConstants";
import ShadowPresetPreview from "./ShadowPresetPreview";
import { useState } from "react";
import { ButtonPrimary } from "../../../ui/kit/Buttons";
import {
  buildBoxShadow,
  generateUniqueEffectsKey,
} from "../../../util/DesignSystemUtils";
import { useDesignSystemContext } from "../DesignSystemContext";
import { useSaveDesignSystem } from "../DesignSystemQueries";
import { Shadows } from "../../../domain/DesignSystemDomain";

function ShadowPresetSidepanel() {
  const { closeModal } = useSidepanelContext();
  const { designSystem } = useDesignSystemContext();
  const { saveDesignSystem } = useSaveDesignSystem(designSystem.metadata.designSystemPath);
  const [selectedShadows, setSelectedShadows] = useState<number[]>([]);
  const selectedShadowsMapped = selectedShadows.map((shadow) => {
    return { shadow: PRESET_SHADOWS[shadow], id: shadow };
  });

  function handleInsertShadows() {
    const selectedShadowsArray: Shadows[] = selectedShadowsMapped.map(
      (shadow) => {
        const shadowName: string = generateUniqueEffectsKey(
          designSystem.shadows,
          shadow.shadow.shadowName
        );
        return {
          shadowName,
          shadowsArray: shadow.shadow.shadowsArray,
        };
      }
    );
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        shadows: [...designSystem.shadows, ...selectedShadowsArray],
      },
      isTmp: true,
    });
    setSelectedShadows([]);
    closeModal("presets-shadows");
  }
  return (
    <div className={styles.sidePanel}>
      <div className={styles.sidePanelHeader}>
        <h2>Shadows presets</h2>
        <button
          className="action-ghost-button"
          onClick={() => closeModal("presets-shadows")}
        >
          <MdArrowForward size={ICON_SIZE_MD} />
        </button>
      </div>
      <div className={styles.previewGrid}>
        {PRESET_SHADOWS.map((preset, index) => (
          <ShadowPresetPreview
            key={preset.shadowName}
            effect={preset}
            selectedShadows={selectedShadows}
            setSelectedShadows={setSelectedShadows}
            index={index}
          />
        ))}
      </div>
      {selectedShadows.length && (
        <div className={styles.sidePanelFooter}>
          <div className="column w-full gap-3">
            <label>Selection</label>
            <div className="row gap-6 wrap">
              {selectedShadowsMapped.map((shadowSelect) => (
                <div
                  key={shadowSelect.shadow.shadowName}
                  className="row align-center justify-center"
                  style={{
                    background: "#eff6ff",
                    boxShadow: buildBoxShadow(shadowSelect.shadow, undefined),
                    ...getRectSize({
                      height: "var(--uidt-space-10)",
                      width: "100px",
                    }),
                  }}
                >
                  {shadowSelect.shadow.shadowName}
                </div>
              ))}
            </div>
            <div className="row justify-end">
              <ButtonPrimary onClick={handleInsertShadows}>
                Insert into shadows
              </ButtonPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShadowPresetSidepanel;
