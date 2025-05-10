import {
  ColorCombination,
  ColorCombinationState,
} from "../../domain/DesignSystemDomain";
import styles from "./TokenCrafter.module.css";
import { useTokenCrafterStore } from "./TokenCrafterStore";
import CrafterColorButton from "./CrafterColorButton";
import { useMemo, useState } from "react";
import {
  MdBorderAll,
  MdContrast,
  MdDelete,
  MdFormatColorFill,
  MdTitle,
} from "react-icons/md";
import { ICON_SIZE_SM } from "../../ui/UiConstants";
import { getCssVariableValue } from "../../util/DesignSystemUtils";
import { useTokenCrafterContext } from "./TokenCrafterContext";
import ColorIO from "colorjs.io";

function CrafterColorCombination({
  combination,
}: {
  combination: ColorCombinationState;
}) {
  const { collection, dragTools, setDragTools, setCollection } =
    useTokenCrafterStore();
  const { styleRef } = useTokenCrafterContext();
  const colorCombinationTokens: ColorCombination | undefined =
    collection[combination];

  const [showActions, setShowActions] = useState(false);

  const textContrast = useMemo(() => {
    if (colorCombinationTokens?.background && colorCombinationTokens?.text) {
      const background = getCssVariableValue(
        colorCombinationTokens.background,
        styleRef
      );
      const text = getCssVariableValue(colorCombinationTokens.text, styleRef);
      if (!background || !text) return undefined;
      return new ColorIO(background).contrastWCAG21(text);
    } else {
      return undefined;
    }
  }, [colorCombinationTokens, styleRef]);

  const borderContrast = useMemo(() => {
    if (colorCombinationTokens?.background && colorCombinationTokens?.border) {
      const background = getCssVariableValue(
        colorCombinationTokens.background,
        styleRef
      );
      const border = getCssVariableValue(
        colorCombinationTokens.border,
        styleRef
      );
      if (!background || !border) return undefined;
      return new ColorIO(background).contrastWCAG21(border);
    } else {
      return undefined;
    }
  }, [colorCombinationTokens, styleRef]);

  function handleDragHover() {
    if (dragTools.dragIndex !== undefined) {
      setDragTools({
        ...dragTools,
        hoverIndex: combination,
      });
    }
  }

  function handleDragLeave() {
    if (dragTools.dragIndex) {
      setDragTools({
        ...dragTools,
        hoverIndex: undefined,
      });
    }
  }

  function handleRemoveAll() {
    setCollection({
      ...collection,
      [combination]: undefined,
    });
  }

  function getBorder() {
    if (dragTools.hoverIndex === combination) {
      return undefined;
    } else if (colorCombinationTokens?.border) {
      return `2px solid var(--${colorCombinationTokens.border})`;
    } else if (colorCombinationTokens?.background) {
      return "none";
    } else {
      return undefined;
    }
  }

  function getColor() {
    if (dragTools.hoverIndex === combination) {
      return undefined;
    } else if (colorCombinationTokens?.text) {
      return `var(--${colorCombinationTokens.text})`;
    } else {
      return undefined;
    }
  }

  return (
    <div
      className={styles.colorCombination}
      onMouseEnter={handleDragHover}
      onMouseLeave={handleDragLeave}
    >
      <div className="row justify-between align-center">
        <strong className="text-color-light">{combination}</strong>
      </div>
      <div className="column gap-1">
        <div
          className={styles.crafterColorCombinationPreview}
          data-active={dragTools.hoverIndex === combination}
          style={{
            background:
              colorCombinationTokens?.background &&
              `var(--${colorCombinationTokens.background})`,
            color: getColor(),
            border: getBorder(),
          }}
        >
          {colorCombinationTokens?.background ? (
            <div className="h-full w-full row justify-start align-end">
              <div className={styles.colorDataContainer}>
                <div>
                  <MdFormatColorFill size={ICON_SIZE_SM} />
                </div>
                <div>
                  {colorCombinationTokens.background.replace("palette-", "")}
                </div>
                <div style={{ justifySelf: "end" }}>
                  <MdContrast size={ICON_SIZE_SM} />
                </div>
                {colorCombinationTokens.text && (
                  <>
                    <div>
                      <MdTitle size={ICON_SIZE_SM} />
                    </div>
                    <div>
                      {colorCombinationTokens?.text.replace("palette-", "")}
                    </div>
                    <div style={{ justifySelf: "end" }}>{textContrast?.toFixed(2)}</div>
                  </>
                )}
                {colorCombinationTokens.border && (
                  <>
                    <div>
                      <MdBorderAll size={ICON_SIZE_SM} />
                    </div>
                    <div>
                      {colorCombinationTokens.border.replace("palette-", "")}
                    </div>
                    <div style={{ justifySelf: "end" }}>{borderContrast?.toFixed(2)}</div>
                  </>
                )}
              </div>
            </div>
          ) : (
            combination
          )}
        </div>
        <div className={styles.previewActions} data-show={showActions}>
          <div className="row gap-1">
            <CrafterColorButton
              category="background"
              colorCombinationTokens={colorCombinationTokens}
              combination={combination}
              showActions={showActions}
              setShowActions={setShowActions}
            />
            <CrafterColorButton
              category="text"
              colorCombinationTokens={colorCombinationTokens}
              combination={combination}
              showActions={showActions}
              setShowActions={setShowActions}
            />
            <CrafterColorButton
              category="border"
              colorCombinationTokens={colorCombinationTokens}
              combination={combination}
              showActions={showActions}
              setShowActions={setShowActions}
            />
          </div>
          {(colorCombinationTokens?.background ||
            colorCombinationTokens?.border ||
            colorCombinationTokens?.text) && (
            <button className="action-ghost-button" onClick={handleRemoveAll}>
              <MdDelete size={ICON_SIZE_SM} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CrafterColorCombination;
