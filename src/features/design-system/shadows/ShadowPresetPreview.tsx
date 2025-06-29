import { ShadowsPreset } from "../../../domain/DesignSystemDomain";
import { buildBoxShadow } from "../../../util/DesignSystemUtils";
import styles from "../SidepanelDesignSystem.module.css";

function ShadowPresetPreview({
  effect,
  index,
  setSelectedShadows,
  selectedShadows,
}: {
  effect: ShadowsPreset;
  index: number;
  setSelectedShadows: (value: number[]) => void;
  selectedShadows: number[];
}) {
  const isSelected = selectedShadows.includes(index);

  function toggleSelection() {
    if (isSelected) {
      setSelectedShadows(selectedShadows.filter((x) => x !== index));
    } else {
      setSelectedShadows([...selectedShadows, index]);
    }
  }
  return (
    <div
      className={styles.previewGridElement}
      style={{
        height: "200px",
        cursor: "pointer",
      }}
      data-selected={isSelected}
      onClick={toggleSelection}
    >
      <div
        className={styles.previewElement}
        style={{
          boxShadow: buildBoxShadow(effect, undefined),
        }}
      >
        {effect.shadowName}
        <div className={styles.actionHover}>
          <div
            style={{
              position: "absolute",
              bottom: "var(--uidt-space-2)",
              right: "var(--uidt-space-2)",
            }}
          >
            {effect.author}
          </div>
        </div>
      </div>
      <div className={styles.actionHover} data-display={isSelected}>
        <div className={styles.rightActions}>
          <div className="row gap-2 align-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={toggleSelection}
            />
            <label
              style={{
                color: "inherit",
              }}
            >
              insert
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShadowPresetPreview;
