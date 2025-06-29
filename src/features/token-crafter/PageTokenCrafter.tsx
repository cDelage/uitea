import { useSearchParams } from "react-router-dom";
import { TokenFamily } from "../../domain/DesignSystemDomain";
import { useFindDesignSystem } from "../design-system/DesignSystemQueries";
import { getDesignSystemTokens } from "../../util/DesignSystemUtils";
import TokenCrafterComponent from "./TokenCrafterComponent";

function PageTokenCrafter() {
  const [searchParams] = useSearchParams();
  const currentDesignSystem = searchParams.get("currentDesignSystem");
  const { designSystem } = useFindDesignSystem(
    currentDesignSystem ?? undefined
  );
  const tokenFamilies: TokenFamily[] = getDesignSystemTokens(designSystem);

  if (!designSystem) return null;
  
  return (
    <div className="w-full h-full">
      <TokenCrafterComponent
        designSystem={designSystem}
        tokenFamilies={tokenFamilies}
      />
    </div>
  );
}

export default PageTokenCrafter;
