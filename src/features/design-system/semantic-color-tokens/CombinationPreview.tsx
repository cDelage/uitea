import {
  ColorCombination,
  ColorCombinationState,
  HandleUpdateColorPayload,
} from "../../../domain/DesignSystemDomain";
import Popover from "../../../ui/kit/Popover";
import { getRectSize } from "../../../ui/UiConstants";
import CombinationTokenPreview from "./CombinationTokenPreview";

function CombinationPreview({
  combination,
  state,
  combinationName,
  handleUpdateColor,
}: {
  combination: ColorCombination;
  state: ColorCombinationState;
  combinationName: string;
  handleUpdateColor?: (payload: HandleUpdateColorPayload) => void;
}) {
  function getToken(ends: string) {
    return `${combinationName}-${
      state !== "default" ? `${state}-` : ""
    }${ends}`;
  }

  return (
    <Popover>
      <div className="row shadow-md rounded-md w-full h-fit">
        <div
          className="border-box row align-center justify-center rect-rounded-left"
          style={{
            ...getRectSize({ height: "96px", flex: true }),
            background:
              combination.background && `var(--${combination.background})`,
            color: combination.text && `var(--${combination.text})`,
            border:
              combination.border && `2px solid var(--${combination.border})`,
          }}
        >
          {state}
        </div>
        <div className="column">
          <CombinationTokenPreview
            usage="background"
            token={getToken("background")}
            classNames="rect-rounded-top-right"
            handleUpdateColor={handleUpdateColor}
            state={state}
            value={combination.background}
          />
          <CombinationTokenPreview
            usage="text"
            token={getToken("text")}
            handleUpdateColor={handleUpdateColor}
            state={state}
            value={combination.text}
          />
          <CombinationTokenPreview
            usage="border"
            token={getToken("border")}
            classNames="rect-rounded-bottom-right"
            handleUpdateColor={handleUpdateColor}
            state={state}
            value={combination.border}
          />
        </div>
      </div>
    </Popover>
  );
}

export default CombinationPreview;
