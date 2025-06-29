import styled, { css } from "styled-components";
import {
  ColorCombination,
  DesignSystem,
  TokenFamily,
} from "../../../domain/DesignSystemDomain";
import { measurementToCss } from "../../../util/DesignSystemUtils";

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
  font-family: ${(props) => props.$designSystem.fonts.default};
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

  --radius: ${(props) => measurementToCss(props.$designSystem.radius.default)};

  .radius {
    border-radius: var(--radius);
  }

  ${(props) => {
    return props.$designSystem.radius.additionalsRadius.map(
      (radius) => css`
    --radius-${radius.radiusKey}:${measurementToCss(radius.radiusValue)};
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
        border: ${props.$defaultCombination.border
            ? `var(--${props.$defaultCombination.border})`
            : "transparent"}
          1px solid;
      }
    `}

  .rect-rounded-left {
    border-top-left-radius: var(--radius);
    border-bottom-left-radius: var(--radius);
  }

  .rect-rounded-top-right {
    border-top-right-radius: var(--radius);
  }

  .rect-rounded-bottom-right {
    border-bottom-right-radius: var(--radius);
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
