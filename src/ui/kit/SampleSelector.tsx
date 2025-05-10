import { useColorPickerStore } from "../../features/color-picker/ColorPickerStore";
import { getRectSize } from "../UiConstants";
import Popover from "./Popover";
import styles from "./TokenSelector.module.css";

function SamplesSelector({ onSelect }: { onSelect?: (value: string) => void }) {
  const { samples } = useColorPickerStore();
  return (
    <Popover.Selector>
      {samples
        .filter((sample) => sample.colors.length)
        .map((sample, index) => (
          <Popover.SelectorTab
            id={index}
            selectNode={
              <div className={styles.tokens}>
                {sample.colors.map((color) => (
                  <Popover.Close closeCallback={() => onSelect?.(color)}>
                    <div className={styles.token}>
                      <div
                        className="palette-color"
                        style={{
                          ...getRectSize({ height: "var(--uidt-space-5)" }),
                          background: color,
                        }}
                      ></div>
                      <strong>{color}</strong>
                    </div>
                  </Popover.Close>
                ))}
              </div>
            }
          >
            <div className="row align-center gap-3">
              <div
                className="palette-color"
                style={{
                  ...getRectSize({ height: "var(--uidt-space-5)" }),
                  background: sample.colors[0],
                }}
              ></div>
              <h6>{sample.name}</h6>
            </div>
          </Popover.SelectorTab>
        ))}
    </Popover.Selector>
  );
}

export default SamplesSelector;
