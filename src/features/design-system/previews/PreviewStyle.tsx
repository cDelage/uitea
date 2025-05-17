import styled, { css } from "styled-components";
import {
  ColorCombination,
  DesignSystem,
  TokenFamily,
} from "../../../domain/DesignSystemDomain";

export const PreviewStyle = styled.div<{
  $tokenFamilies: TokenFamily[];
  $designSystem: DesignSystem;
  $defaultCombination?: ColorCombination;
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

  ${(props) => {
    return props.$designSystem.fonts.additionals.map(
      (font) => css`
    --font-${font.fontName}:${font.value};
      `
    );
  }};

  .text-color-light {
    color: var(--base-text-light);
  }

  .text-color-default {
    color: var(--base-text-default);
  }

  .text-color-dark {
    color: var(--base-text-dark);
  }

  ${(props) =>
    props.$defaultCombination &&
    css`
      .default-combination {
        background: var(--${props.$defaultCombination.background});
        color: var(--${props.$defaultCombination.text});
      }
    `}
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
