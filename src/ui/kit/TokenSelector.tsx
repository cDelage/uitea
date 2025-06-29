import { DesignToken, TokenFamily } from "../../domain/DesignSystemDomain";
import styles from "./TokenSelector.module.css";
import { getRectSize, ICON_SIZE_SM } from "../UiConstants";
import Popover from "./Popover";
import { PreviewEmptyStyle } from "../../features/design-system/previews/PreviewStyle";
import { MdClose } from "react-icons/md";

function TokenSelector({
  tokensFamilies,
  onSelect,
  tokenValue,
  removeToken,
}: {
  tokensFamilies: TokenFamily[];
  onSelect?: (value: DesignToken) => void;
  tokenValue?: string;
  removeToken?: () => void;
}) {
  
  return (
    <PreviewEmptyStyle $tokenFamilies={tokensFamilies}>
      {tokenValue && (
        <div className="row p-2" data-disableoutside={true}>
          <div className={styles.labelColor}>
            <div className="row align-center gap-3">
              <div
                className="palette-color"
                style={{
                  background: `var(--${tokenValue})`,
                  ...getRectSize({ height: "var(--uidt-space-5)" }),
                  border: "none",
                }}
              />
              {tokenValue}
            </div>
            <div className={styles.removeColor} onClick={() => removeToken?.()}>
              <MdClose size={ICON_SIZE_SM} />
            </div>
          </div>
        </div>
      )}
      <Popover.Selector>
        {tokensFamilies
          .filter((family) => family.tokens.length)
          .map((family, index) => (
            <Popover.SelectorTab
              id={index}
              key={`${family.label}-${index}`}
              selectNode={
                <div className={styles.tokens}>
                  {family.tokens.map((token) => (
                    <Popover.Close
                      key={token.label}
                      closeCallback={() => onSelect?.(token)}
                    >
                      <div className={styles.token}>
                        <div
                          className="palette-color"
                          style={{
                            ...getRectSize({ height: "var(--uidt-space-5)" }),
                            background: `var(--${token.label})`,
                          }}
                        ></div>
                        <strong>{token.label}</strong>
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
                    background: `var(--${
                      family.tokens[Math.floor(family.tokens.length / 2)].label
                    })`,
                  }}
                ></div>
                <h6>{family.label}</h6>
              </div>
            </Popover.SelectorTab>
          ))}
      </Popover.Selector>
    </PreviewEmptyStyle>
  );
}

export default TokenSelector;
