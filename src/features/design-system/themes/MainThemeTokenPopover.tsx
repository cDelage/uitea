import {
  MdBookmark,
  MdCheck,
  MdContentCopy,
  MdSelectAll,
} from "react-icons/md";
import Popover from "../../../ui/kit/Popover";
import { useColorPickerStore } from "../../color-picker/ColorPickerStore";
import { useDesignSystemContext } from "../DesignSystemContext";
import styles from "../InputPopover.module.css";
import { getRectSize, ICON_SIZE_SM } from "../../../ui/UiConstants";
import TokenSelector from "../../../ui/kit/TokenSelector";
import { DesignToken } from "../../../domain/DesignSystemDomain";
import SamplesSelector from "../../../ui/kit/SampleSelector";
import { useState } from "react";
import { ButtonAlert, ButtonPrimary } from "../../../ui/kit/Buttons";
import { useCopy } from "../../../util/CopyUtil";

function MainThemeTokenPopover({
  defaultColor,
  onConfirm,
  onRemove,
}: {
  defaultColor?: string;
  onConfirm?: (color: string) => void;
  onRemove?: () => void;
}) {
  const { tokenFamilies } = useDesignSystemContext();
  const { samples } = useColorPickerStore();
  const { copy, isCopied } = useCopy();
  const filteredTokens = tokenFamilies
    .filter((family) => family.tokens.length)
    .map((family) => family.tokens[0]);

  const [color, setColor] = useState(defaultColor ?? "#1F85DE");

  return (
    <div className={styles.inputPopover}>
      <div className="column gap-8 p-4">
        <div className="row gap-3 wrap">
          {filteredTokens.map((token) => (
            <div className="flex-1">
              <div
                key={token.label}
                className="palette-color cursor-pointer"
                onClick={() => setColor(token.value)}
                style={{
                  background: token.value,
                  ...getRectSize({
                    height: "var(--space-9)",
                  }),
                }}
              ></div>
            </div>
          ))}
        </div>
        <div className="row justify-between">
          <div className="row gap-4">
            <div
              className="palette-color"
              style={{
                background: color,
                ...getRectSize({ height: "var(--space-10)" }),
              }}
            ></div>
            <div className="row align-center gap-2" onClick={() => copy(color)}>
              <strong className="text-color-dark cursor-pointer">
                {color}
              </strong>
              {isCopied ? (
                <MdCheck size={ICON_SIZE_SM} />
              ) : (
                <MdContentCopy size={ICON_SIZE_SM} />
              )}
            </div>
          </div>
          <div className="column gap-2">
            <Popover>
              {tokenFamilies?.length ? (
                <>
                  <Popover.Toggle id="token-selector">
                    <button className="action-ghost-button">
                      <MdSelectAll size={ICON_SIZE_SM} />
                      tokens
                    </button>
                  </Popover.Toggle>
                  <Popover.Body
                    id="token-selector"
                    zIndex={200}
                    skipDisableOutside={true}
                  >
                    <TokenSelector
                      tokensFamilies={tokenFamilies}
                      onSelect={(token: DesignToken) => {
                        setColor(token.value);
                      }}
                    />
                  </Popover.Body>
                </>
              ) : (
                <></>
              )}
              {samples.filter((sample) => sample.colors.length).length > 0 && (
                <>
                  <Popover.Toggle id="sample-selector">
                    <button className="action-ghost-button">
                      <MdBookmark size={ICON_SIZE_SM} />
                      samples
                    </button>
                  </Popover.Toggle>
                  <Popover.Body
                    id="sample-selector"
                    zIndex={200}
                    skipDisableOutside={true}
                  >
                    <SamplesSelector
                      onSelect={(color: string) => {
                        setColor(color);
                      }}
                    />
                  </Popover.Body>
                </>
              )}
            </Popover>
          </div>
        </div>
        <div className="column gap-2 justify-end">
          <ButtonPrimary onClick={() => onConfirm?.(color)}>
            Confirm
          </ButtonPrimary>
          {onRemove && (
            <ButtonAlert onClick={onRemove}>Remove default theme</ButtonAlert>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainThemeTokenPopover;
