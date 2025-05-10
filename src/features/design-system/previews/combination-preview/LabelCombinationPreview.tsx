import styled from "styled-components";
import { ColorCombinationCollection } from "../../../../domain/DesignSystemDomain";
import styles from "./CombinationPreview.module.css";

const LabelPreview = styled.div<{ $combination: ColorCombinationCollection }>`
  border-radius: var(--uidt-rounded-md);
  cursor:default;
  padding: var(--uidt-space-2) var(--uidt-space-3);
  font-size: 14px;
  line-height: 20px;
  box-shadow: var(--uidt-shadow-md);
  display: flex;
  align-items: center;
  gap: var(--uidt-space-3);
  justify-content: center;
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

function LabelCombinationPreview({
  combination,
}: {
  combination: ColorCombinationCollection;
}) {
  return (
    <div className={styles.previewContainer}>
      <LabelPreview $combination={combination}>Label</LabelPreview>
    </div>
  );
}

export default LabelCombinationPreview;
