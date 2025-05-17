import {
  ColorCombination,
  ColorCombinationCollectionGroup,
} from "../../../domain/DesignSystemDomain";
import CombinationPreview from "./CombinationPreview";
import styles from "./SemanticPreview.module.css";

function CombinationGroup({
  combinationGroup,
}: {
  combinationGroup: ColorCombinationCollectionGroup;
}) {
  function shouldDisplayCombination(
    combination?: ColorCombination
  ): combination is ColorCombination {
    return (
      combination?.background !== undefined ||
      combination?.text !== undefined ||
      combination?.border !== undefined
    );
  }

  return (
    <>
      {!combinationGroup.childs.length ? (
        <div>
          <div className="column gap-3">
            <h4>{combinationGroup.combinationName}</h4>
            <div className="tokens-grid">
              {shouldDisplayCombination(combinationGroup.default) && (
                <CombinationPreview
                  combination={combinationGroup.default}
                  combinationName={combinationGroup.combinationName ?? ""}
                  state="default"
                />
              )}
              {shouldDisplayCombination(combinationGroup.hover) && (
                <CombinationPreview
                  combination={combinationGroup.hover}
                  combinationName={combinationGroup.combinationName ?? ""}
                  state="hover"
                />
              )}
              {shouldDisplayCombination(combinationGroup.active) && (
                <CombinationPreview
                  combination={combinationGroup.active}
                  combinationName={combinationGroup.combinationName ?? ""}
                  state="active"
                />
              )}
              {shouldDisplayCombination(combinationGroup.focus) && (
                <CombinationPreview
                  combination={combinationGroup.focus}
                  combinationName={combinationGroup.combinationName ?? ""}
                  state="focus"
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={styles.combinationGroupWithChild}
          style={{
            background:
              combinationGroup.default?.background &&
              `var(--${combinationGroup.default?.background})`,
            color:
              combinationGroup.default?.text &&
              `var(--${combinationGroup.default?.text})`,
            border:
              combinationGroup.default?.border &&
              `2px solid var(--${combinationGroup.default?.border})`,
            zIndex: 0,
          }}
        >
          <div className="column gap-3 w-full">
            <h4>{combinationGroup.combinationName}</h4>
            <div className="tokens-grid">
              {shouldDisplayCombination(combinationGroup.default) && (
                <CombinationPreview
                  combination={combinationGroup.default}
                  combinationName={combinationGroup.combinationName ?? ""}
                  state="default"
                />
              )}
              {shouldDisplayCombination(combinationGroup.hover) && (
                <CombinationPreview
                  combination={combinationGroup.hover}
                  combinationName={combinationGroup.combinationName ?? ""}
                  state="hover"
                />
              )}
              {shouldDisplayCombination(combinationGroup.active) && (
                <CombinationPreview
                  combination={combinationGroup.active}
                  combinationName={combinationGroup.combinationName ?? ""}
                  state="active"
                />
              )}
              {shouldDisplayCombination(combinationGroup.focus) && (
                <CombinationPreview
                  combination={combinationGroup.focus}
                  combinationName={combinationGroup.combinationName ?? ""}
                  state="focus"
                />
              )}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              borderBottom: `1px solid ${
                combinationGroup.default?.border
                  ? `var(--${combinationGroup.default?.border})`
                  : "var(--base-border)"
              }`,
            }}
          />
          <div className="column gap-8" style={{ width: "100%" }}>
            {combinationGroup.childs.map((combinationGroupChild) => (
              <CombinationGroup
                key={combinationGroupChild.combinationName}
                combinationGroup={combinationGroupChild}
              ></CombinationGroup>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default CombinationGroup;
