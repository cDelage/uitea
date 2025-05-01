import { useSearchParams } from "react-router-dom";
import ColorPickerComponent from "./ColorPickerComponent";
import { TokenFamily } from "../../domain/DesignSystemDomain";
import { useFindDesignSystem } from "../design-system/DesignSystemQueries";
import { getDesignSystemTokens } from "../../util/DesignSystemUtils";

function PageColorPicker() {
  const [searchParams] = useSearchParams();
  const currentDesignSystem = searchParams.get("currentDesignSystem");
  const { designSystem } = useFindDesignSystem(
    currentDesignSystem ?? undefined
  );
  const tokenFamilies: TokenFamily[] = getDesignSystemTokens(designSystem);
  return (
    <div className="w-full h-full">
      <ColorPickerComponent tokens={tokenFamilies} />
    </div>
  );
}

export default PageColorPicker;
