import ColorIO from "colorjs.io";
import styles from "./ColorPicker.module.css";
import { useColorPickerStore } from "./ColorPickerStore";
import ColorPickerLinear from "./ColorPickerLinear";
import { useState } from "react";
import { getRectSize, ICON_SIZE_SM } from "../../ui/UiConstants";
import {
  MdBookmark,
  MdCheck,
  MdContentCopy,
  MdSelectAll,
} from "react-icons/md";
import { DesignToken, TokenFamily } from "../../domain/DesignSystemDomain";
import Popover from "../../ui/kit/Popover";
import TokenSelector from "../../ui/kit/TokenSelector";
import SamplesSelector from "../../ui/kit/SampleSelector";
import { useCopy } from "../../util/CopyUtil";

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
  const { setColor, samples } = useColorPickerStore();
  const [colorStore, setColorStore] = useState(color);
  const hex = colorStore.toString({ format: "hex" });
  const { copy, isCopied } = useCopy();

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
          <div className="row align-center justify-between">
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
                          setColor(new ColorIO(token.value), index)
                        }
                      />
                    </Popover.Body>
                  </>
                ) : (
                  <></>
                )}
                {samples.filter((sample) => sample.colors.length).length >
                  0 && (
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
                        onSelect={(color: string) =>
                          setColor(new ColorIO(color), index)
                        }
                      />
                    </Popover.Body>
                  </>
                )}
              </Popover>
            </div>
            <div className="row gap-4">
              <div
                className="palette-color"
                style={{
                  background: color.toString({
                    format: "hex",
                  }),
                  ...getRectSize({ height: "var(--uidt-space-10)" }),
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
    </div>
  );
}

export default ColorPicker;
