import { MdBrush } from "react-icons/md";
import styles from "./TokenCrafter.module.css";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import TokenCrafterGrid from "./TokenCrafterGrid";
import { DesignSystem, TokenFamily } from "../../domain/DesignSystemDomain";
import { TokenCrafterContext } from "./TokenCrafterContext";

function TokenCrafterComponent({
  isModal,
  designSystem,
  tokenFamilies
}: {
  isModal?: boolean;
  designSystem: DesignSystem;
  tokenFamilies: TokenFamily[];
}) {
  const paletteTokens = tokenFamilies.filter(family => family.category === "color");
  return (
    <TokenCrafterContext.Provider value={{
      designSystem,
      paletteTokens
    }}>
      <div className={styles.tokenCrafter}>
        {isModal && (
          <div className={styles.modalHeader}>
            <div className="row gap-2 align-center">
              <MdBrush size={ICON_SIZE_MD} />
              <h5>Token crafter</h5>
            </div>
          </div>
        )}
        <div className="row">
          <TokenCrafterGrid />
        </div>
      </div>
    </TokenCrafterContext.Provider>
  );
}

export default TokenCrafterComponent;
