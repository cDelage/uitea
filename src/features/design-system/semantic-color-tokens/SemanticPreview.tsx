import { useMemo } from "react";
import { getRandomQuotesArray } from "../../../util/Quote";
import BorderPreview from "../previews/BorderPreview";
import { useDesignSystemContext } from "../DesignSystemContext";
import QuotePreview from "../previews/QuotePreview";
import TokenPreview from "../TokenPreview";
import { ColorCombinationCollectionGroup } from "../../../domain/DesignSystemDomain";
import { buildCombinationHierarchy } from "../../../util/DesignSystemUtils";
import CombinationGroup from "./CombinationGroup";

function SemanticPreview() {
  const { designSystem } = useDesignSystemContext();
  const { semanticColorTokens } = designSystem;
  const quotes = useMemo(() => getRandomQuotesArray(3), []);
  const combinationsGroup = useMemo<ColorCombinationCollectionGroup[]>(
    () =>
      buildCombinationHierarchy(
        semanticColorTokens.colorCombinationCollections
      ),
    [semanticColorTokens]
  );
  return (
    <div
      className="gap-10 p-8 border-box column"
      style={{
        height: "600px",
      }}
    >
      <h1 className="text-color-dark">
        {designSystem.metadata.designSystemName}
      </h1>
      <div className="column gap-7">
        <h3>base</h3>
        <TokenPreview
          label="background"
          value={semanticColorTokens.background}
          tooltipValue="base-background"
        />
        <div className="row gap-4 align-end border-box">
          <TokenPreview
            label="text-light"
            value={semanticColorTokens.textLight}
            tooltipValue="base-text-light"
            flex={true}
            preview={
              <QuotePreview
                quoteData={quotes[0]}
                className="text-color-light small"
              />
            }
          />
          <TokenPreview
            label="text-default"
            flex={true}
            value={semanticColorTokens.textDefault}
            tooltipValue="base-text-default"
            preview={
              <QuotePreview
                quoteData={quotes[1]}
                className="text-color-default small"
              />
            }
          />
          <TokenPreview
            label="text-dark"
            flex={true}
            value={semanticColorTokens.textDark}
            tooltipValue="base-text-dark"
            preview={
              <QuotePreview
                quoteData={quotes[2]}
                className="text-color-dark small"
              />
            }
          />
          <TokenPreview
            label="border"
            flex={true}
            value={semanticColorTokens.border}
            tooltipValue="base-border"
            preview={<BorderPreview color="var(--uidt-base-border)" />}
          />
        </div>
      </div>
      <div className="column gap-7">
        <h3>semantic color tokens</h3>
        {combinationsGroup.map((combinationGroup) => (
          <CombinationGroup
            key={combinationGroup.combinationName}
            combinationGroup={combinationGroup}
          ></CombinationGroup>
        ))}
        <div style={{ minHeight: "32px" }} />
      </div>
    </div>
  );
}

export default SemanticPreview;
