import Popover from "../../ui/kit/Popover";
import { PreviewStyle } from "../design-system/previews/PreviewStyle";
import CrafterColorCombination from "./CrafterColorCombination";
import { useTokenCrafterContext } from "./TokenCrafterContext";

function TokenCrafterGrid() {
  const { paletteTokens } = useTokenCrafterContext();
  return (
    <Popover>
      <PreviewStyle tokenFamilies={paletteTokens}>
        <div className="row gap-6 p-6 align-center w-full justify-center">
          <CrafterColorCombination combination="default" />
          <CrafterColorCombination combination="hover" />
          <CrafterColorCombination combination="focus" />
          <CrafterColorCombination combination="active" />
        </div>
      </PreviewStyle>
    </Popover>
  );
}

export default TokenCrafterGrid;
