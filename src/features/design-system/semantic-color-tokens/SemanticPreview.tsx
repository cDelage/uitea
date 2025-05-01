import { useMemo } from "react";
import { getRandomQuotesArray } from "../../../util/Quote";
import BorderPreview from "../previews/BorderPreview";
import { useDesignSystemContext } from "../DesignSystemContext";
import QuotePreview from "../previews/QuotePreview";
import TokenPreview from "../TokenPreview";

function SemanticPreview() {
  const { designSystem } = useDesignSystemContext();
  const { semanticColorTokens } = designSystem;
  const quotes = useMemo(() => getRandomQuotesArray(3), []);
  return (
    <div
      className="p-7 gap-8 column"
      style={{
        height: "500px",
      }}
    >
      <div className="column gap-4 w-full">
        <h4 className="text-color-dark">
          {designSystem.metadata.designSystemName}
        </h4>
        <h5>semantic color tokens</h5>
      </div>
      <TokenPreview
        label="background"
        value={semanticColorTokens.background}
        tooltipValue="base-background"
      />
      <div className="row gap-4 align-end">
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
          preview={<BorderPreview color="var(--base-border)" />}
        />
      </div>
    </div>
  );
}

export default SemanticPreview;
