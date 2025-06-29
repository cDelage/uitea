import styled, { css } from "styled-components";
import { RecommandationMetadata } from "../../domain/DesignSystemDomain";

export const RecommandationStyled = styled.div<{
  $combination: RecommandationMetadata;
  $isDragged: boolean;
  $applyBorder: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 200ms;
  z-index: 0;
  padding: var(--uidt-space-2);
  box-sizing: border-box;
  background-color: var(
    --${(props) => props.$combination.combinationTokens.background}
  );
  color: var(--${(props) => props.$combination.combinationTokens.text});
  border: var(--${(props) => props.$combination.combinationTokens.border}) 1px
    solid;
  ${(props) =>
    !props.$applyBorder &&
    css`
      border: none;
    `}
  width: 200px;
  min-width: 200px;
  max-width: 200px;
  height: 112px;
  user-select: none;
  border-radius: var(--uidt-rounded-md);
  &:hover {
    transform: scale(1.09);
    z-index: 1;
    box-shadow: ${(props) => props.$combination.backgroundRgba} 0px 8px 20px;
  }

  ${(props) =>
    props.$isDragged &&
    css`
      border: 2px solid #2563eb;
      transform: scale(1.09);
      z-index: 1;
      box-shadow: ${props.$combination.backgroundRgba} 0px 8px 20px;
    `}
`;
