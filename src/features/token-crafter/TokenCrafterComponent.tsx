import styles from "./TokenCrafter.module.css";
import TokenCrafterGrid from "./TokenCrafterGrid";
import { DesignSystem, TokenFamily } from "../../domain/DesignSystemDomain";
import { TokenCrafterContext } from "./TokenCrafterContext";
import { useRef } from "react";
import Recommandations from "./Recommandations";
import { PreviewStyle } from "../design-system/previews/PreviewStyle";
import SidePanel from "../../ui/kit/SidePanel";
import TokenCrafterSidepanel from "./TokenCrafterSidepanel";

function TokenCrafterComponent({
  designSystem,
  tokenFamilies,
}: {
  designSystem: DesignSystem;
  tokenFamilies: TokenFamily[];
}) {
  const paletteTokens = tokenFamilies.filter(
    (family) => family.category === "color"
  );
  const semanticTokens = tokenFamilies.filter(
    (family) => family.category === "semantic"
  );
  const styleRef = useRef<HTMLDivElement>(null);

  return (
    <SidePanel>
      <TokenCrafterContext.Provider
        value={{
          designSystem,
          paletteTokens,
          tokenFamilies,
          semanticTokens,
          styleRef,
        }}
      >
        <div className={styles.tokenCrafter}>
          <PreviewStyle
            $tokenFamilies={tokenFamilies}
            $designSystem={designSystem}
            ref={styleRef}
          >
            <div className="column flex-1 overflow-hidden relative">
              <TokenCrafterGrid />
              <Recommandations />
              <SidePanel.BodyRelative width={"800px"} id="existing-tokens">
                <TokenCrafterSidepanel />
              </SidePanel.BodyRelative>
            </div>
          </PreviewStyle>
        </div>
      </TokenCrafterContext.Provider>
    </SidePanel>
  );
}

export default TokenCrafterComponent;
