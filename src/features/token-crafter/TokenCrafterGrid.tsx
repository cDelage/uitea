import Popover from "../../ui/kit/Popover";
import CrafterColorCombination from "./CrafterColorCombination";
import { useTokenCrafterContext } from "./TokenCrafterContext";
import styles from "./TokenCrafter.module.css";
import {
  MdArrowForward,
  MdChevronLeft,
  MdClose,
  MdFolder,
  MdOutlineViewSidebar,
} from "react-icons/md";
import { ICON_SIZE_MD, ICON_SIZE_SM } from "../../ui/UiConstants";
import { useTokenCrafterStore } from "./TokenCrafterStore";
import { ColorCombinationCollection } from "../../domain/DesignSystemDomain";
import TokenGroupPopover from "./TokenGroupPopover";
import InputText from "../../ui/kit/InputText";
import { useMemo } from "react";
import CombinationComponentPlaceholder from "../design-system/previews/combination-preview/CombinationComponentPlaceholder";
import { ButtonPrimary, ButtonTertiary } from "../../ui/kit/Buttons";
import {
  getTokenAvailableGroups,
  hasAnyColor,
} from "../../util/DesignSystemUtils";
import { useSaveDesignSystem } from "../design-system/DesignSystemQueries";
import FormComponent from "../../ui/kit/FormComponent";
import { useNavigate } from "react-router-dom";
import SidePanel from "../../ui/kit/SidePanel";

function TokenCrafterGrid({ isModal }: { isModal?: boolean }) {
  const { designSystem } = useTokenCrafterContext();
  const { saveDesignSystem } = useSaveDesignSystem(
    designSystem.metadata.designSystemPath
  );
  const { collection, setCollection, applyCollection } = useTokenCrafterStore();
  const navigate = useNavigate();

  const isCreatable = useMemo<boolean>(() => {
    return hasAnyColor(collection);
  }, [collection]);

  const contextCombination: ColorCombinationCollection | undefined =
    collection.group
      ? designSystem.semanticColorTokens.colorCombinationCollections.find(
          (combination) => combination.combinationName === collection.group
        )
      : undefined;

  const semanticWithBackground =
    designSystem.semanticColorTokens.colorCombinationCollections.filter(
      (token) => token.default?.background
    );

  function handleSetGroup(context: string | undefined) {
    setCollection({
      ...collection,
      group: context,
    });
  }

  function updateName(combinationName: string) {
    setCollection({
      ...collection,
      combinationName,
    });
  }

  function handleCreateColorCombination() {
    if (isCreatable && collection.combinationName) {
      saveDesignSystem({
        designSystem: {
          ...designSystem,

          semanticColorTokens: {
            ...designSystem.semanticColorTokens,

            colorCombinationCollections: [
              ...designSystem.semanticColorTokens.colorCombinationCollections.filter(
                (comb) => comb.combinationName !== collection.combinationName
              ),
              collection,
            ],
          },
        },
        isTmp: true,
      });
      applyCollection();
    }
  }

  const tokenAvailableGroups = getTokenAvailableGroups({
    combinationName: collection.combinationName,
    collections: designSystem.semanticColorTokens.colorCombinationCollections,
  });

  const existingToken =
    designSystem.semanticColorTokens.colorCombinationCollections.find(
      (e) => e.combinationName === collection.combinationName
    );

  return (
    <Popover>
      <div
        className="column"
        style={{
          background: "var(--base-background)",
        }}
      >
        {!isModal && (
          <div className="row justify-between p-2">
            <ButtonTertiary
              onClick={() =>
                navigate(
                  `/design-system/${encodeURIComponent(
                    designSystem.metadata.designSystemPath
                  )}?editMode=true`
                )
              }
            >
              <MdChevronLeft size={ICON_SIZE_MD} /> Back to design system
            </ButtonTertiary>
            <SidePanel.Button id="existing-tokens">
              <ButtonTertiary>
                <MdOutlineViewSidebar size={ICON_SIZE_MD} /> Existing tokens
              </ButtonTertiary>
            </SidePanel.Button>
          </div>
        )}
        <div className={styles.tokenCrafterGrid}>
          <div className="row gap-4">
            <div className="column h-fit gap-4 justify-between">
              <FormComponent label="combination-name">
                <InputText
                  type="text"
                  value={collection.combinationName ?? ""}
                  onChange={(e) => updateName(e.target.value)}
                />
              </FormComponent>
              <FormComponent label="group">
                <div className="row align-center gap-2">
                  <Popover.Toggle
                    id="context"
                    positionPayload="bottom-right"
                    disabled={!semanticWithBackground.length}
                  >
                    <button className="action-ghost-button">
                      <MdFolder size={ICON_SIZE_SM} />
                      {collection.group || "base"}
                    </button>
                  </Popover.Toggle>
                  <Popover.Body id="context" zIndex={2000}>
                    <TokenGroupPopover
                      handleSetGroup={handleSetGroup}
                      colorCombinationCollections={tokenAvailableGroups}
                    />
                  </Popover.Body>
                  {collection.group && (
                    <button
                      className="action-ghost-button"
                      onClick={() => handleSetGroup(undefined)}
                    >
                      <MdClose size={ICON_SIZE_SM} />
                    </button>
                  )}
                </div>
              </FormComponent>
            </div>
            <CrafterColorCombination combination="default" />
            <CrafterColorCombination combination="hover" />
            <CrafterColorCombination combination="active" />
            <CrafterColorCombination combination="focus" />
          </div>
          <div className="column justify-center">
            <MdArrowForward size={ICON_SIZE_MD} color="text-color-dark" />
          </div>
          <FormComponent label="result">
            <div
              className={styles.tokenPreviewContainer}
              style={
                contextCombination && {
                  background:
                    contextCombination.default?.background &&
                    `var(--${contextCombination.default?.background})`,
                  border:
                    contextCombination.default?.border &&
                    `var(--${contextCombination.default?.border}) 2px solid`,
                }
              }
            >
              {isCreatable ? (
                <div className="row w-full flex-1">
                  <CombinationComponentPlaceholder combination={collection} />
                </div>
              ) : (
                <div>Fill a color combination</div>
              )}
            </div>
            <div className="row w-full justify-end">
              <ButtonPrimary
                disabled={!isCreatable || !collection.combinationName}
                onClick={handleCreateColorCombination}
              >
                {existingToken ? "Overwrite" : "Confirm Creation"}
              </ButtonPrimary>
            </div>
          </FormComponent>
        </div>
      </div>
    </Popover>
  );
}

export default TokenCrafterGrid;
