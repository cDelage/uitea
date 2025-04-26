import ColorIO from "colorjs.io";
import styles from "./ColorPicker.module.css";
import { useColorPickerStore } from "./ColorPickerStore";
import ColorPickerLinear from "./ColorPickerLinear";
import { useState } from "react";
import { getRectSize, ICON_SIZE_SM } from "../../ui/UiConstants";
import toast from "react-hot-toast";
import { MdCheck, MdContentCopy, MdPalette } from "react-icons/md";
import { DesignToken, TokenFamily } from "../../domain/DesignSystemDomain";
import Popover from "../../ui/kit/Popover";
import TokenSelector from "../../ui/kit/TokenSelector";

function ColorPicker({
  color,
  index,
  isSidepanelOpen,
  tokens,
}: {
  color: ColorIO;
  index: number;
  isSidepanelOpen: boolean;
  tokens?: TokenFamily[];
}) {
  const { setColor } = useColorPickerStore();
  const [colorStore, setColorStore] = useState(color);
  const hex = colorStore.toString({ format: "hex" });
  const [isCopied, setIsCopied] = useState(false);
  function copy(value: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        toast.error(`Fail to copy ${value}`);
      });
  }

  return (
    <div className={styles.colorPicker} style={{ background: hex }}>
      <div
        className={styles.colorPickerBody}
        style={{
          width: isSidepanelOpen ? "80%" : "60%",
        }}
      >
        <div className="w-full column gap-8">
          <ColorPickerLinear
            color={colorStore}
            onChange={(newColor) => setColorStore(newColor)}
            onChangeComplete={() => setColor(colorStore, index)}
          />
          {tokens && (
            <div className="row justify-end">
              <Popover>
                <Popover.Toggle id="token-selector">
                  <button className="action-button">
                    <MdPalette />
                    token selector
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
                      setColor(new ColorIO(token.value), index)
                    }
                  />
                </Popover.Body>
              </Popover>
            </div>
          )}
          <div className="row align-center justify-center gap-4">
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
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;
