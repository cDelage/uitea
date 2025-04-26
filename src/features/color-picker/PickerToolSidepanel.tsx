import {
  MdArrowForward,
  MdRefresh,
  MdStar,
  MdStarOutline,
} from "react-icons/md";
import FormComponent from "../../ui/kit/FormComponent";
import { useSidepanelContext } from "../../ui/kit/SidepanelContext";
import { getRectSize, ICON_SIZE_MD, ICON_SIZE_SM } from "../../ui/UiConstants";
import styles from "./ColorPicker.module.css";
import { useColorPickerStore } from "./ColorPickerStore";
import { getRandomQuote } from "../../util/Quote";
import { useMemo, useState } from "react";
import { getContrastInfo, STAR_ARRAY } from "../../util/PickerUtil";
import { TokenFamily } from "../../domain/DesignSystemDomain";
import ColorSample from "./ColorSample";

function PickerToolSidepanel({ tokens }: { tokens?: TokenFamily[] }) {
  const { colors, colorSamples } = useColorPickerStore();
  const { closeModal } = useSidepanelContext();
  const [quote, setQuote] = useState(getRandomQuote);
  const contrastInfo = getContrastInfo(colors);
  const firstColor = colors[0];
  const secondColor = colors[1];
  const colorsTokens = useMemo(() => {
    if (firstColor && secondColor) {
      return colors.map((color) => {
        return {
          hex: color.toString({ format: "hex" }),
          tokens:
            tokens
              ?.flatMap((family) => family.tokens)
              .filter(
                (token) =>
                  token.value.toUpperCase() ===
                  color.toString({ format: "hex" }).toUpperCase()
              ) ?? [],
        };
      });
    } else {
      return [];
    }
  }, [firstColor, secondColor, colors, tokens]);

  return (
    <div className={styles.sidePanel}>
      <div className={styles.sidePanelHeader}>
        <h2 className="text-color-dark">Picker tools</h2>
        <button
          className="action-ghost-button"
          onClick={() => closeModal("picker-tool")}
        >
          <MdArrowForward size={ICON_SIZE_MD} />
        </button>
      </div>
      <div className={styles.sidePanelBodyContainer}>
        <FormComponent label="Contrast">
          <div
            className="palette-color column gap-5 justify-start align-start relative"
            style={{
              background: colors[0].toString({
                format: "hex",
              }),
              color: colors[1].toString({
                format: "hex",
              }),
              ...getRectSize({
                height: "140px",
                flex: true,
              }),
              padding: "var(--space-6) var(--space-6)",
            }}
          >
            <div className={styles.actionsContainer}>
              <button
                className="action-button"
                onClick={() => setQuote(getRandomQuote())}
              >
                <MdRefresh size={ICON_SIZE_SM} />
              </button>
            </div>
            <h2>Quote {quote.index}</h2>
            <div>{quote.quote.text}</div>
            <div className="row w-full justify-end">{quote.quote.author}</div>
          </div>
          <div
            style={{
              backgroundColor: `var(--palette-${contrastInfo.palette}-100)`,
              color: `var(--palette-${contrastInfo.palette}-900)`,
            }}
            className="row justify-between align-center p-4 rounded-md shadow-md"
          >
            <h2>{contrastInfo.contrast}</h2>
            <div className="column gap-2 align-end">
              <strong>{contrastInfo.quality}</strong>
              <div className="row">
                {STAR_ARRAY.map((star, index) => (
                  <div key={star}>
                    {index <= contrastInfo.starCount - 1 ? (
                      <MdStar size={ICON_SIZE_SM} />
                    ) : (
                      <MdStarOutline size={ICON_SIZE_SM} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FormComponent>
        <FormComponent label="Correspondences">
          {colorsTokens.map((color, index) => (
            <div
              key={`${color.hex}${index}`}
              className="row align-center gap-4"
            >
              <div
                className="palette-color"
                style={{
                  background: color.hex,
                  ...getRectSize({
                    height: "var(--space-7)",
                  }),
                }}
              ></div>
              <strong>{color.hex} :</strong>
              {color.tokens.map((token, index) => (
                <>
                  <div key={token.label}>
                    {token.label} {index !== color.tokens.length - 1 && <>,</>}
                  </div>
                </>
              ))}
              {color.tokens.length === 0 && <div>No corresponding founded</div>}
            </div>
          ))}
        </FormComponent>
        <FormComponent label="Sampler">
          {colorSamples.map((sample, index) => (
            <ColorSample sample={sample} key={sample.name} index={index} />
          ))}
        </FormComponent>
      </div>
    </div>
  );
}

export default PickerToolSidepanel;
