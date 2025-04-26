import { DesignToken, TokenFamily } from "../../domain/DesignSystemDomain";
import styles from "./TokenSelector.module.css";
import { getRectSize } from "../UiConstants";
import Popover from "./Popover";
function TokenSelector({
  tokensFamilies,
  onSelect,
}: {
  tokensFamilies: TokenFamily[];
  onSelect?: (value: DesignToken) => void;
}) {
  return (
    <Popover.Selector>
      {tokensFamilies
        .filter((family) => family.tokens.length)
        .map((family, index) => (
          <Popover.SelectorTab
            id={index}
            selectNode={
              <div className={styles.tokens}>
                {family.tokens.map((token) => (
                  <Popover.Close closeCallback={() => onSelect?.(token)}>
                    <div className={styles.token}>
                      <div
                        className="palette-color"
                        style={{
                          ...getRectSize({ height: "var(--space-5)" }),
                          background: token.value,
                        }}
                      ></div>
                      <strong>{token.label}</strong>
                    </div>
                  </Popover.Close>
                ))}
              </div>
            }
            key={`${family.label}-${index}`}
          >
            <div className="row align-center gap-3">
              <div
                className="palette-color"
                style={{
                  ...getRectSize({ height: "var(--space-5)" }),
                  background:
                    family.tokens[Math.floor(family.tokens.length / 2)].value,
                }}
              ></div>
              <h6>{family.label}</h6>
            </div>
          </Popover.SelectorTab>
        ))}
    </Popover.Selector>
  );
}

export default TokenSelector;
