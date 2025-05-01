import classNames from "classnames";
import {
  ColorCombination,
  ColorCombinationType,
  TokenColorCategory,
} from "../../domain/DesignSystemDomain";
import Popover from "../../ui/kit/Popover";
import TokenSelector from "../../ui/kit/TokenSelector";
import styles from "./TokenCrafter.module.css";
import { useTokenCrafterContext } from "./TokenCrafterContext";
import { useTokenCrafterStore } from "./TokenCrafterStore";
import { MdDelete } from "react-icons/md";
import { ICON_SIZE_SM } from "../../ui/UiConstants";
import CopyableTopTooltip from "../../ui/kit/CopyableTopTooltip";
function CrafterColorCombination({
  combination,
}: {
  combination: ColorCombinationType;
}) {
  const { collection, setCollection } = useTokenCrafterStore();
  const colorCombinationTokens: ColorCombination | undefined =
    collection[combination];
  const { paletteTokens } = useTokenCrafterContext();

  function updateColorCombination(category: TokenColorCategory, value: string) {
    const colorCombination = {
      ...colorCombinationTokens,
      [category]: value,
    };
    setCollection({
      ...collection,
      [combination]: colorCombination,
    });
  }

  function handleRemoveColorCombination() {
    setCollection({
      ...collection,
      [combination]: undefined,
    });
  }

  const backgroundStyle = classNames(styles.crafterColorCombinationToken, {
    [styles.tokenBackground]: !colorCombinationTokens?.background,
  });
  const textStyle = classNames(styles.crafterColorCombinationToken, {
    [styles.tokenText]: !colorCombinationTokens?.text,
  });
  const borderStyle = classNames(styles.crafterColorCombinationToken, {
    [styles.tokenBorder]: !colorCombinationTokens?.border,
  });

  return (
    <div className={styles.colorCombination}>
      <div className="row justify-between align-center">
        <strong className="text-color-light">{combination}</strong>
        <div
          className={styles.actions}
          data-removable={
            colorCombinationTokens?.background ||
            colorCombinationTokens?.border ||
            colorCombinationTokens?.text
              ? true
              : false
          }
        >
          <button
            className="action-ghost-button"
            type="button"
            onClick={handleRemoveColorCombination}
          >
            <MdDelete size={ICON_SIZE_SM} />
          </button>
        </div>
      </div>
      <div className="row align-center">
        <div
          className={styles.crafterColorCombinationPreview}
          style={{
            background:
              colorCombinationTokens?.background &&
              `var(--${colorCombinationTokens.background})`,
            color:
              colorCombinationTokens?.text &&
              `var(--${colorCombinationTokens.text})`,
            border:
              colorCombinationTokens?.border &&
              `2px solid var(--${colorCombinationTokens.border})`,
          }}
        >
          {collection.combinationName ? (
            <>
              {collection.combinationName}
              {combination !== "default" && "-" + combination}
            </>
          ) : (
            <>no-name{combination !== "default" && "-" + combination}</>
          )}
        </div>
        <div className="column">
          <CopyableTopTooltip
            tooltipValue={
              colorCombinationTokens?.background &&
              `${collection.combinationName ?? "no-name"}${
                combination !== "default" ? `-${combination}` : ""
              }-background`
            }
          >
            <Popover.Toggle id={`${combination}-bg`}>
              <div
                className={backgroundStyle}
                style={{
                  background:
                    colorCombinationTokens?.background &&
                    `var(--${colorCombinationTokens.background})`,
                  borderStyle: colorCombinationTokens?.border
                    ? `solid`
                    : undefined,
                  borderColor: colorCombinationTokens?.border
                    ? `var(--${colorCombinationTokens.border})`
                    : undefined,
                  borderTopRightRadius: "var(--rounded-md)",
                }}
              >
                {!colorCombinationTokens?.background && (
                  <small className="text-color-light">bg</small>
                )}
              </div>
            </Popover.Toggle>
          </CopyableTopTooltip>
          <CopyableTopTooltip
            tooltipValue={
              colorCombinationTokens?.background &&
              `${collection.combinationName ?? "no-name"}${
                combination !== "default" ? `-${combination}` : ""
              }-text`
            }
          >
            <Popover.Toggle id={`${combination}-text`}>
              <div
                className={textStyle}
                style={{
                  background:
                    colorCombinationTokens?.text &&
                    `var(--${colorCombinationTokens.text})`,
                  borderStyle: colorCombinationTokens?.border
                    ? `solid`
                    : undefined,
                  borderColor: colorCombinationTokens?.border
                    ? `var(--${colorCombinationTokens.border})`
                    : undefined,
                }}
              >
                {!colorCombinationTokens?.text && (
                  <small className="text-color-light">text</small>
                )}
              </div>
            </Popover.Toggle>
          </CopyableTopTooltip>
          <CopyableTopTooltip
            tooltipValue={
              colorCombinationTokens?.background &&
              `${collection.combinationName ?? "no-name"}${
                combination !== "default" ? `-${combination}` : ""
              }-border`
            }
          >
            <Popover.Toggle id={`${combination}-border`}>
              <div
                className={borderStyle}
                style={{
                  background:
                    colorCombinationTokens?.border &&
                    `var(--${colorCombinationTokens.border})`,
                  borderStyle: colorCombinationTokens?.border
                    ? `solid`
                    : undefined,
                  borderColor: colorCombinationTokens?.border
                    ? `var(--${colorCombinationTokens.border})`
                    : undefined,
                  borderBottomRightRadius: "var(--rounded-md)",
                }}
              >
                {!colorCombinationTokens?.border && (
                  <small className="text-color-light">border</small>
                )}
              </div>
            </Popover.Toggle>
          </CopyableTopTooltip>
          <Popover.Body id={`${combination}-bg`} zIndex={200}>
            <TokenSelector
              tokensFamilies={paletteTokens}
              onSelect={(token) =>
                updateColorCombination("background", token.label)
              }
            />
          </Popover.Body>
          <Popover.Body id={`${combination}-text`} zIndex={200}>
            <TokenSelector
              tokensFamilies={paletteTokens}
              onSelect={(token) => updateColorCombination("text", token.label)}
            />
          </Popover.Body>
          <Popover.Body id={`${combination}-border`} zIndex={200}>
            <TokenSelector
              tokensFamilies={paletteTokens}
              onSelect={(token) =>
                updateColorCombination("border", token.label)
              }
            />
          </Popover.Body>
        </div>
      </div>
      <div className="row justify-end">
        <small></small>
      </div>
    </div>
  );
}

export default CrafterColorCombination;
