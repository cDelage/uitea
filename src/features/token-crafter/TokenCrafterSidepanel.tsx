import { useRef } from "react";
import { PreviewEmptyStyle } from "../design-system/previews/PreviewStyle";
import styles from "./TokenCrafter.module.css";
import { useTokenCrafterContext } from "./TokenCrafterContext";
import { PreviewContext } from "../design-system/previews/PreviewContext";
import ExistingCombinationSettings from "./ExistingCombinationSettings";
import { ColorCombinationCollection } from "../../domain/DesignSystemDomain";
import Popover from "../../ui/kit/Popover";
import { useSaveDesignSystem } from "../design-system/DesignSystemQueries";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../util/DraggableContext";
import { moveItem } from "../../util/ArrayMove";
import { MdArrowForward } from "react-icons/md";
import { useSidepanelContext } from "../../ui/kit/SidepanelContext";
import { ICON_SIZE_MD } from "../../ui/UiConstants";

function TokenCrafterSidepanel() {
  const styleRef = useRef<HTMLDivElement>(null);

  const { tokenFamilies, designSystem } = useTokenCrafterContext();

  const {
    semanticColorTokens,
    metadata: { designSystemPath },
  } = designSystem;
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const { closeModal } = useSidepanelContext();

  function handleRemoveCollection(index: number) {
    const collectionName =
      semanticColorTokens.colorCombinationCollections[index].combinationName;

    saveDesignSystem({
      designSystem: {
        ...designSystem,
        semanticColorTokens: {
          ...semanticColorTokens,
          colorCombinationCollections:
            semanticColorTokens.colorCombinationCollections
              .map((collection) => {
                return {
                  ...collection,
                  group:
                    collection.group === collectionName
                      ? undefined
                      : collection.group,
                };
              })
              .filter((_, i) => i !== index),
        },
      },
      isTmp: true,
    });
  }

  const { draggableTools } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: RemovableIndex) => {
      if (
        dragIndex === undefined ||
        hoverIndex === undefined ||
        hoverIndex === dragIndex ||
        hoverIndex === "remove"
      )
        return;
      saveDesignSystem({
        designSystem: {
          ...designSystem,
          semanticColorTokens: {
            ...semanticColorTokens,
            colorCombinationCollections: moveItem(
              semanticColorTokens.colorCombinationCollections,
              dragIndex,
              hoverIndex
            ),
          },
        },
        isTmp: true,
      });
    }
  );

  function handleUpdateCollection(
    index: number,
    newValue: ColorCombinationCollection
  ) {
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        semanticColorTokens: {
          ...semanticColorTokens,
          colorCombinationCollections:
            semanticColorTokens.colorCombinationCollections.map((original, i) =>
              i === index ? newValue : original
            ),
        },
      },
      isTmp: true,
    });
  }

  function handleRenameCollection(
    fromName: string,
    toName: string,
    index: number
  ) {
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        semanticColorTokens: {
          ...semanticColorTokens,
          colorCombinationCollections:
            semanticColorTokens.colorCombinationCollections.map(
              (original, i) => {
                return {
                  ...original,
                  group: original.group === fromName ? toName : original.group,
                  combinationName:
                    i === index ? toName : original.combinationName,
                };
              }
            ),
        },
      },
      isTmp: true,
    });
  }

  const semanticColorTokensAndGroup =
    semanticColorTokens.colorCombinationCollections.map((collection) => {
      return {
        collection,
        group: semanticColorTokens.colorCombinationCollections.find(
          (combination) => combination.combinationName === collection.group
        )?.default,
      };
    });

  return (
    <PreviewContext
      value={{
        styleRef,
        tokenFamilies
      }}
    >
      <Popover>
        <PreviewEmptyStyle
          $tokenFamilies={tokenFamilies}
          $height="100%"
          ref={styleRef}
        >
          <div className={styles.sidePanel}>
            <div className={styles.sidePanelHeader}>
              <h2>Existing tokens</h2>
              <button
                className="action-ghost-button"
                onClick={() => closeModal("existing-tokens")}
              >
                <MdArrowForward size={ICON_SIZE_MD} />
              </button>
            </div>
            <div className="column">
              {semanticColorTokensAndGroup.map((collection, index) => (
                <ExistingCombinationSettings
                  collectionAndGroup={collection}
                  index={index}
                  key={collection.collection.combinationName}
                  handleRemoveCollection={handleRemoveCollection}
                  handleUpdateCollection={handleUpdateCollection}
                  draggableTools={draggableTools}
                  handleRenameCollection={handleRenameCollection}
                />
              ))}
            </div>
          </div>
        </PreviewEmptyStyle>
      </Popover>
    </PreviewContext>
  );
}

export default TokenCrafterSidepanel;
