import styled, { css } from "styled-components";
import { PositionAbsolute } from "./PositionAbsolute.type";

export const GhostButton = styled.button`
  color: var(--uit-base-text-light);
  cursor: pointer;
  background-color: transparent;
  padding: 4px 8px;
  &:hover {
    color: var(--uit-base-text-dark);
  }
`;

export const WindowButtons = styled.button`
  background-color: transparent;
  color: var(--uit-base-text-light);
  padding: 4px 12px;
  height: 100%;
  &:hover {
    background-color: var(--window-buttons-hover-bg);
    color: var(--uit-base-text-dark);
  }
`;

export const CloseButton = styled.button`
  background-color: transparent;
  color: var(--uit-base-text-light);
  padding: 4px 12px;
  height: 100%;
  &:hover {
    background-color: var(--uit-alert-bg);
    color: var(--uit-alert-text);
  }
`;

export const ButtonPrimary = styled.button`
  background-color: var(--uit-primary-bg);
  color: var(--uit-primary-text);
  border-radius: var(--uit-rounded-lg);
  padding: var(--uit-space-3) var(--uit-space-4);
  &:hover {
    background-color: var(--uit-primary-hover-bg);
    color: var(--uit-primary-hover-text);
  }

  &:disabled{
    background-color: var(--uit-base-background-disabled);
    color: var(--uit-base-text-disabled);
  }
`;

export const ButtonAlert = styled.button`
  background-color: var(--uit-alert-bg);
  color: var(--uit-alert-text);
  border-radius: var(--uit-rounded-lg);
  padding: var(--uit-space-3) var(--uit-space-4);
  &:hover {
    background-color: var(--uit-alert-hover-bg);
    color: var(--uit-alert-hover-text);
  }
`;

export const ButtonTertiary = styled.button`
  background-color: var(--uit-tertiary-bg);
  color: var(--uit-tertiary-text);
  border-radius: var(--uit-rounded-lg);
  padding: var(--uit-space-3) var(--uit-space-4);
  border: none;
  cursor: pointer;
  &:hover {
    background-color: var(--uit-tertiary-hover-bg);
    color: var(--uit-tertiary-hover-text);
  }
`;

export const ButtonSignifiantAction = styled.button<{
  theme: "add" | "remove", position?: PositionAbsolute
}>`
  border-radius: var(--uit-rounded-full);
  border: none;
  padding: var(--uit-space-1);
  ${(props) =>
    props.theme === "add" &&
    css`
      background-color: var(--uit-primary-outline-bg);
      color: var(--uit-primary-outline-text);
      border: var(--uit-primary-outline-border) 1px solid;
    `};

  ${(props) =>
    props.theme === "remove" &&
    css`
      background-color: var(--uit-alert-outline-bg);
      color: var(--uit-alert-outline-text);
      border: var(--uit-alert-outline-border) 1px solid;
    `};

    ${(props) => props.position && css`
      position: absolute;
      z-index: 20;
      top: ${props.position.top}px;
      bottom: ${props.position.bottom}px;
      left: ${props.position.left}px;
      right: ${props.position.right}px;
      transform: ${props.position.transform};
    `}

`;
