import { MdBorderAll, MdFormatColorFill, MdTitle } from "react-icons/md";
import CopyableTopTooltip from "../../../ui/kit/CopyableTopTooltip";
import { getRectSize, ICON_SIZE_SM } from "../../../ui/UiConstants";
import { getContrastColor } from "../../../util/PickerUtil";
import {
  ColorCombinationState,
  HandleUpdateColorPayload,
  TokenColorUsage,
} from "../../../domain/DesignSystemDomain";
import { usePreviewContext } from "../previews/PreviewContext";
import { getCssVariableValue } from "../../../util/DesignSystemUtils";
import Popover from "../../../ui/kit/Popover";
import TokenSelector from "../../../ui/kit/TokenSelector";

function CombinationTokenPreview({
  token,
  usage,
  classNames,
  state,
  value,
  handleUpdateColor,
}: {
  token: string;
  classNames?: string;
  usage: TokenColorUsage;
  value?: string;
  state: ColorCombinationState;
  handleUpdateColor?: (payload: HandleUpdateColorPayload) => void;
}) {
  const { styleRef, tokenFamilies } = usePreviewContext();
  return (
    <CopyableTopTooltip
      tooltipValue={token}
      transformBody="translate(-50%, -128%)"
    >
      <Popover.Toggle
        id={`color-${state}-${usage}`}
        positionPayload="bottom-right"
        disabled={handleUpdateColor === undefined}
      >
        <div
          className={`border-box row align-center justify-center ${classNames}`}
          style={{
            ...getRectSize({ height: "32px", width: "32px" }),
            background: `var(--${token})`,
            color: getContrastColor(getCssVariableValue(token, styleRef)),
          }}
        >
          {usage === "background" && <MdFormatColorFill size={ICON_SIZE_SM} />}
          {usage === "text" && <MdTitle size={ICON_SIZE_SM} />}
          {usage === "border" && <MdBorderAll size={ICON_SIZE_SM} />}
        </div>
      </Popover.Toggle>
      <Popover.Body id={`color-${state}-${usage}`} zIndex={500}>
        <TokenSelector
          tokensFamilies={tokenFamilies.filter(
            (family) => family.category === "color"
          )}
          tokenValue={value}
          onSelect={(t) =>
            handleUpdateColor?.({
              state,
              usage,
              value: t.label,
            })
          }
          removeToken={() =>
            handleUpdateColor?.({
              state,
              usage,
              value: undefined,
            })
          }
        />
      </Popover.Body>
    </CopyableTopTooltip>
  );
}

export default CombinationTokenPreview;
