import { useEffect, useState } from "react";
import ColorPickerLinear from "../color-picker/ColorPickerLinear";
import ColorIO from "colorjs.io";
import Popover from "../../ui/kit/Popover";
import {
  MdBookmark,
  MdCheck,
  MdContentCopy,
  MdSelectAll,
} from "react-icons/md";
import { getRectSize, ICON_SIZE_MD, ICON_SIZE_SM } from "../../ui/UiConstants";
import TokenSelector from "../../ui/kit/TokenSelector";
import { DesignToken, TokenFamily } from "../../domain/DesignSystemDomain";
import { useColorPickerStore } from "../color-picker/ColorPickerStore";
import SamplesSelector from "../../ui/kit/SampleSelector";
import { useCopy } from "../../util/CopyUtil";
import styles from "./InputPopover.module.css";
import { ButtonPrimary } from "../../ui/kit/Buttons";

function ColorPickerDesignSystem({
  defaultColor,
  changeComplete,
  onChange,
  onConfirm,
  tokens,
}: {
  defaultColor?: string;
  changeComplete?: (color: string) => void;
  onChange?: (color: string) => void;
  onConfirm?: (color: string) => void;
  tokens?: TokenFamily[];
}) {
  const { samples, initColorPickerStore, colors } = useColorPickerStore();
  const [color, setColor] = useState(new ColorIO(defaultColor ?? "#1F85DE"));
  const { copy, isCopied } = useCopy();

  useEffect(() => {
    onChange?.(color.toString({ format: "hex" }));
  }, [color, onChange]);

  useEffect(() => {
    if (!colors.length) {
      initColorPickerStore();
    }
  }, [colors, initColorPickerStore]);

  if (!colors.length) return null;

  return (
    <div className={styles.inputPopoverBox}>
      <div className="w-full column gap-4">
        <ColorPickerLinear
          color={color}
          onChange={setColor}
          onChangeComplete={() =>
            changeComplete?.(color.toString({ format: "hex" }))
          }
        />
        <div className="row align-center justify-end">
          <div className="column gap-2">
            <Popover>
              {tokens?.length ? (
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
                      tokensFamilies={tokens}
                      onSelect={(token: DesignToken) =>
                        setColor(new ColorIO(token.value))
                      }
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
                      onSelect={(color: string) => setColor(new ColorIO(color))}
                    />
                  </Popover.Body>
                </>
              )}
            </Popover>
          </div>
        </div>
        <div className="row align-center justify-between">
          <div className="row gap-4">
            <div
              className="palette-color"
              style={{
                background: color.toString({
                  format: "hex",
                }),
                ...getRectSize({ height: "var(--space-10)" }),
              }}
            ></div>
            <div
              className="row align-center gap-2"
              onClick={() => copy(color.toString({ format: "hex" }))}
            >
              <strong className="text-color-dark cursor-pointer">
                {color.toString({ format: "hex" })}
              </strong>
              {isCopied ? (
                <MdCheck size={ICON_SIZE_SM} />
              ) : (
                <MdContentCopy size={ICON_SIZE_SM} />
              )}
            </div>
          </div>

          {onConfirm && (
            <Popover.Close
              closeCallback={() => onConfirm(color.toString({ format: "hex" }))}
            >
              <ButtonPrimary>
                <MdCheck size={ICON_SIZE_MD} />
                Confirm
              </ButtonPrimary>
            </Popover.Close>
          )}
        </div>
      </div>
    </div>
  );
}

export default ColorPickerDesignSystem;
