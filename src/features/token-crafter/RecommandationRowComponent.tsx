import {
  ColorCombination,
  ColorCombinationState,
  RecommandationMetadata,
  RecommandationRow,
} from "../../domain/DesignSystemDomain";
import { ICON_SIZE_SM } from "../../ui/UiConstants";
import styles from "./TokenCrafter.module.css";
import {
  MdAdd,
  MdBorderAll,
  MdContrast,
  MdFormatColorFill,
  MdTitle,
} from "react-icons/md";
import { RecommandationStyled } from "./RecommandationStyled";
import Popover from "../../ui/kit/Popover";
import { useTokenCrafterStore } from "./TokenCrafterStore";

function RecommandationRowComponent({
  recommandationRow,
  rowIndex,
}: {
  recommandationRow: RecommandationRow;
  rowIndex: number;
}) {
  const { collection, setCollection, dragTools, setDragTools, applyBorder } =
    useTokenCrafterStore();

  function appendRecommandation(
    type: ColorCombinationState,
    combination: ColorCombination
  ) {
    setCollection({
      ...collection,
      [type]: {
        ...combination,
        border: applyBorder ? combination.border : undefined,
      },
    });
  }

  function handleDragStart(
    recommandation: RecommandationMetadata,
    recommandationIndex: number
  ) {
    setDragTools({
      recommandation,
      dragIndex: recommandationIndex,
      rowDragIndex: rowIndex,
      hoverIndex: undefined,
    });
  }

  return (
    <Popover>
      <div className="column">
        <h4>{recommandationRow.label}</h4>
        <div className={styles.recommandationRow}>
          {recommandationRow.combinations.map((combinationMetadata, index) => (
            <RecommandationStyled
              $combination={combinationMetadata}
              key={`${combinationMetadata.combinationName}${index}`}
              $applyBorder={applyBorder}
              $isDragged={
                index === dragTools.dragIndex &&
                rowIndex === dragTools.rowDragIndex
              }
              onDragStart={(event) => {
                event.preventDefault();
              }}
              onMouseDown={() => handleDragStart(combinationMetadata, index)}
              className={styles.colorRecommanded}
            >
              <div className="row justify-between align-center">
                <div className={styles.actionPopover}>
                  <Popover.Toggle id={`reco-${rowIndex}-${index}`}>
                    <button className="action-ghost-button">
                      <MdAdd size={ICON_SIZE_SM} />
                    </button>
                  </Popover.Toggle>
                  <Popover.Body id={`reco-${rowIndex}-${index}`} zIndex={200}>
                    <Popover.Actions>
                      <Popover.Tab
                        clickEvent={() =>
                          appendRecommandation(
                            "default",
                            combinationMetadata.combinationTokens
                          )
                        }
                      >
                        default
                      </Popover.Tab>
                      <Popover.Tab
                        clickEvent={() =>
                          appendRecommandation(
                            "hover",
                            combinationMetadata.combinationTokens
                          )
                        }
                      >
                        hover
                      </Popover.Tab>
                      <Popover.Tab
                        clickEvent={() =>
                          appendRecommandation(
                            "active",
                            combinationMetadata.combinationTokens
                          )
                        }
                      >
                        active
                      </Popover.Tab>
                      <Popover.Tab
                        clickEvent={() =>
                          appendRecommandation(
                            "focus",
                            combinationMetadata.combinationTokens
                          )
                        }
                      >
                        focus
                      </Popover.Tab>
                    </Popover.Actions>
                  </Popover.Body>
                </div>
                <strong>
                  {rowIndex + 1}-{index + 1}
                </strong>
              </div>
              <div className={styles.colorDataContainer}>
                <div>
                  <MdFormatColorFill size={ICON_SIZE_SM} />
                </div>
                <div>{combinationMetadata.combinationName.background}</div>
                <div style={{ justifySelf: "end" }}>
                  <MdContrast size={ICON_SIZE_SM} />
                </div>
                <div>
                  <MdTitle size={ICON_SIZE_SM} />
                </div>
                <div>{combinationMetadata.combinationName.text}</div>
                <div style={{ justifySelf: "end" }}>
                  {combinationMetadata.contrasts.backgroundText?.toFixed(2)}
                </div>
                {applyBorder && (
                  <>
                    <div>
                      <MdBorderAll size={ICON_SIZE_SM} />
                    </div>
                    <div>{combinationMetadata.combinationName.border}</div>
                    <div style={{ justifySelf: "end" }}>
                      {combinationMetadata.contrasts.backgroundBorder?.toFixed(
                        2
                      )}
                    </div>
                  </>
                )}
              </div>
            </RecommandationStyled>
          ))}
        </div>
      </div>
    </Popover>
  );
}

export default RecommandationRowComponent;
