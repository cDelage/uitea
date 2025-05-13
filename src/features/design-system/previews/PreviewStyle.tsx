import styled, { css } from "styled-components";
import { DesignSystem, TokenFamily } from "../../../domain/DesignSystemDomain";

export const PreviewStyle = styled.div<{
  $tokenFamilies: TokenFamily[];
  $designSystem: DesignSystem;
}>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-y: auto;
  height: 100%;
  ${(props) =>
    props.$tokenFamilies.flatMap((tokenFamily) => {
      return tokenFamily.tokens.map(
        (token) => css`
    --${token.label}:${
          tokenFamily.category === "color"
            ? token.value
            : `var(--${token.value})`
        };
  `
      );
    })};

  color: var(--base-text-default);
  font-family: ${(props) => props.$designSystem.fonts.default};

  .text-color-light {
    color: var(--base-text-light);
  }

  .text-color-default {
    color: var(--base-text-default);
  }

  .text-color-dark {
    color: var(--base-text-dark);
  }
`;

export const PreviewEmptyStyle = styled.div<{
  $tokenFamilies: TokenFamily[];
  $height?: string;
}>`
  ${(props) =>
    props.$tokenFamilies.flatMap((tokenFamily) => {
      return tokenFamily.tokens.map(
        (token) => css`
    --${token.label}:${
          tokenFamily.category === "color"
            ? token.value
            : `var(--${token.value})`
        };
  `
      );
    })};

  height: ${(props) => props.$height};

  .text-color-light {
    color: var(--base-text-light);
  }

  .text-color-default {
    color: var(--base-text-default);
  }

  .text-color-dark {
    color: var(--base-text-dark);
  }
`;
