import {
  MdArrowBack,
  MdArrowForward,
  MdBrush,
  MdOpenInNew,
  MdOutlineViewSidebar,
} from "react-icons/md";
import styles from "./TokenCrafter.module.css";
import { ICON_SIZE_MD, ICON_SIZE_SM } from "../../ui/UiConstants";
import TokenCrafterGrid from "./TokenCrafterGrid";
import { DesignSystem, TokenFamily } from "../../domain/DesignSystemDomain";
import { TokenCrafterContext } from "./TokenCrafterContext";
import { useRef } from "react";
import Recommandations from "./Recommandations";
import { PreviewStyle } from "../design-system/previews/PreviewStyle";
import { useNavigate } from "react-router-dom";
import { useTokenCrafterStore } from "./TokenCrafterStore";
import SidePanel from "../../ui/kit/SidePanel";
import TokenCrafterSidepanel from "./TokenCrafterSidepanel";

function TokenCrafterComponent({
  isModal,
  designSystem,
  tokenFamilies,
}: {
  isModal?: boolean;
  designSystem: DesignSystem;
  tokenFamilies: TokenFamily[];
}) {
  const paletteTokens = tokenFamilies.filter(
    (family) => family.category === "color"
  );
  const semanticTokens = tokenFamilies.filter(
    (family) => family.category === "semantic"
  );
  const navigate = useNavigate();
  const styleRef = useRef<HTMLDivElement>(null);
  const { canUndoRedo, undoTokenCrafter, redoTokenCrafter } =
    useTokenCrafterStore();

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
            {isModal && (
              <div className={styles.modalHeader}>
                <div className="row gap-2 align-center">
                  <MdBrush size={ICON_SIZE_MD} />
                  <h5>Token crafter</h5>
                </div>
                <div className="row gap-4 align-center">
                  <div className="row gap-2">
                    <button
                      className="action-ghost-button"
                      disabled={!canUndoRedo.canUndo}
                      onClick={() => undoTokenCrafter()}
                    >
                      <MdArrowBack size={ICON_SIZE_SM} />
                    </button>
                    <button
                      className="action-ghost-button"
                      disabled={!canUndoRedo.canRedo}
                      onClick={() => redoTokenCrafter()}
                    >
                      <MdArrowForward size={ICON_SIZE_SM} />
                    </button>
                  </div>
                  <SidePanel.Button id="existing-tokens">
                    <button className="action-ghost-button">
                      <MdOutlineViewSidebar size={ICON_SIZE_MD} /> Existing
                      tokens
                    </button>
                  </SidePanel.Button>
                  <button
                    className="action-ghost-button"
                    onClick={() =>
                      navigate(
                        `/token-crafter?currentDesignSystem=${designSystem.metadata.designSystemPath}`
                      )
                    }
                  >
                    <MdOpenInNew size={ICON_SIZE_MD} /> Full screen
                  </button>
                </div>
              </div>
            )}
            <div className="column flex-1 overflow-hidden relative">
              <TokenCrafterGrid isModal={isModal} />
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
