import { MdPlayArrow } from "react-icons/md";
import { ColorCombinationCollection } from "../../../../domain/DesignSystemDomain";
import styles from "./CombinationPreview.module.css";
import styled from "styled-components";

const ButtonPreview = styled.button<{
  $combination: ColorCombinationCollection;
}>`
  border-radius: var(--uidt-rounded-md);
  width: 120px;
  height: 40px;
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

function ButtonCombinationPreview({
  combination,
}: {
  combination: ColorCombinationCollection;
}) {
  return (
    <div className={styles.previewContainer}>
      <ButtonPreview $combination={combination} type="button">
        <MdPlayArrow /> BUTTON
      </ButtonPreview>
    </div>
  );
}

export default ButtonCombinationPreview;
