import { useMemo } from "react";
import { ColorCombinationCollection } from "../../../../domain/DesignSystemDomain";
import { getRandomQuote } from "../../../../util/Quote";
import styles from "./CombinationPreview.module.css";
import styled from "styled-components";

const QuotePreview = styled.div<{ $combination: ColorCombinationCollection }>`
  border-radius: var(--uidt-rounded-md);
  cursor: default;
  user-select: none;  
  -webkit-user-select: none;
  padding: var(--uidt-space-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: var(--uidt-space-3);
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background-color: var(--${(props) => props.$combination.default?.background});
  color: var(--${(props) => props.$combination.default?.text});
  border: var(--${(props) => props.$combination.default?.border}) 1px solid;

  &:hover {
    background-color: var(--${(props) => props.$combination.hover?.background});
    color: var(--${(props) => props.$combination.hover?.text});
    border: var(--${(props) => props.$combination.hover?.border}) 1px solid;
  }

  &:focus {
    background-color: var(--${(props) => props.$combination.focus?.background});
    color: var(--${(props) => props.$combination.focus?.text});
    border: var(--${(props) => props.$combination.focus?.border}) 1px solid;
  }

  &:active {
    background-color: var(
      --${(props) => props.$combination.active?.background}
    );
    color: var(--${(props) => props.$combination.active?.text});
    border: var(--${(props) => props.$combination.active?.border}) 1px solid;
  }
`;

function QuoteCombinationPreview({
  combination,
}: {
  combination: ColorCombinationCollection;
}) {
  const quoteData = useMemo(getRandomQuote, []);
  return (
    <div className={styles.previewContainer}>
      <QuotePreview $combination={combination}>
        <div>{quoteData.quote.text}</div>
        <strong className="row w-full justify-end">
          {quoteData.quote.author}
        </strong>
      </QuotePreview>
    </div>
  );
}

export default QuoteCombinationPreview;
