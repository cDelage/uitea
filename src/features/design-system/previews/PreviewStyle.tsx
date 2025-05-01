import styled, { css } from "styled-components";
import { TokenFamily } from "../../../domain/DesignSystemDomain";

export const PreviewStyle = styled.div<{tokenFamilies: TokenFamily[]}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-y: auto;
  ${(props) => props.tokenFamilies.flatMap(tokenFamily => tokenFamily.tokens).map(token => css`
    --${token.label}:${token.value};
  `)}
`;
