import { MdBorderAll, MdFormatColorFill, MdTitle } from "react-icons/md";
import {
  ColorCombination,
  ColorCombinationState,
  TokenColorUsage,
} from "../../domain/DesignSystemDomain";
import Popover from "../../ui/kit/Popover";
import { getCssVariableValue } from "../../util/DesignSystemUtils";
import { getContrastColor } from "../../util/PickerUtil";
import { useTokenCrafterContext } from "./TokenCrafterContext";
import { ICON_SIZE_SM } from "../../ui/UiConstants";
import { useTokenCrafterStore } from "./TokenCrafterStore";
import TokenSelector from "../../ui/kit/TokenSelector";

function CrafterColorButton({
  combination,
  colorCombinationTokens,
  category,
  showActions,
  setShowActions,
}: {
  combination: ColorCombinationState;
  colorCombinationTokens: ColorCombination | undefined;
  category: TokenColorUsage;
  showActions: boolean;
  setShowActions: (act: boolean) => void;
}) {
  const { styleRef, paletteTokens } = useTokenCrafterContext();
  const { setCollection, collection } = useTokenCrafterStore();

  function removeColor() {
    setCollection({
      ...collection,
      [combination]: {
        ...colorCombinationTokens,
        [category]: undefined,
      },
    });
  }

  function updateColorCombination(value: string) {
    const colorCombination = {
      ...colorCombinationTokens,
      [category]: value,
    };
    setCollection({
      ...collection,
      [combination]: colorCombination,
    });
  }

  const tokenValue = colorCombinationTokens?.[category];

  return (
    <>
      <Popover.Toggle id={`${combination}-${category}`}>
        <button
          className="action-ghost-button"
          style={{
            background: tokenValue && `var(--${tokenValue})`,
            color:
              tokenValue &&
              getContrastColor(getCssVariableValue(tokenValue, styleRef)),
          }}
        >
          {category === "background" && (
            <MdFormatColorFill size={ICON_SIZE_SM} />
          )}
          {category === "text" && <MdTitle size={ICON_SIZE_SM} />}
          {category === "border" && <MdBorderAll size={ICON_SIZE_SM} />}
        </button>
      </Popover.Toggle>
      <Popover.Body
        id={`${combination}-${category}`}
        zIndex={200}
        isOpenToSync={showActions}
        setIsOpenToSync={setShowActions}
      >
        <TokenSelector
          tokensFamilies={paletteTokens}
          onSelect={(token) => updateColorCombination(token.label)}
          tokenValue={tokenValue}
          removeToken={removeColor}
        />
      </Popover.Body>
    </>
  );
}

export default CrafterColorButton;
