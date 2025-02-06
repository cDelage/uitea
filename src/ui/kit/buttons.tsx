import styled, { css } from "styled-components";
import { PositionAbsolute } from "./PositionAbsolute.type";

export const GhostButton = styled.button`
  color: var(--base-text-light);
  cursor: pointer;
  background-color: transparent;
  padding: 4px 8px;
  &:hover {
    color: var(--base-text-dark);
  }
`;

export const WindowButtons = styled.button`
  background-color: transparent;
  color: var(--base-text-light);
  padding: 4px 12px;
  height: 100%;
  &:hover {
    background-color: var(--theme-window-buttons-hover-bg);
    color: var(--base-text-dark);
  }
`;

export const CloseButton = styled.button`
  background-color: transparent;
  color: var(--base-text-light);
  padding: 4px 12px;
  height: 100%;
  &:hover {
    background-color: var(--theme-alert-bg);
    color: var(--theme-alert-text);
  }
`;

export const ButtonPrimary = styled.button`
  background-color: var(--theme-primary-bg);
  color: var(--theme-primary-text);
  border-radius: var(--rounded-lg);
  padding: var(--space-3) var(--space-4);
  &:hover {
    background-color: var(--theme-primary-hover-bg);
    color: var(--theme-primary-hover-text);
  }
`;

export const ButtonAlert = styled.button`
  background-color: var(--theme-alert-bg);
  color: var(--theme-alert-text);
  border-radius: var(--rounded-lg);
  padding: var(--space-3) var(--space-4);
  &:hover {
    background-color: var(--theme-alert-hover-bg);
    color: var(--theme-alert-hover-text);
  }
`;

export const ButtonTertiary = styled.button`
  background-color: var(--theme-tertiary-bg);
  color: var(--theme-tertiary-text);
  border-radius: var(--rounded-lg);
  padding: var(--space-3) var(--space-4);
  border: none;
  cursor: pointer;
  &:hover {
    background-color: var(--theme-tertiary-hover-bg);
    color: var(--theme-tertiary-hover-text);
  }
`;

export const ButtonSignifiantAction = styled.button<{
  theme: "add" | "remove", position?: PositionAbsolute
}>`
  border-radius: var(--rounded-full);
  border: none;
  padding: var(--space-1);
  ${(props) =>
    props.theme === "add" &&
    css`
      background-color: var(--theme-primary-outline-bg);
      color: var(--theme-primary-outline-text);
      border: var(--theme-primary-outline-border) 1px solid;
    `};

  ${(props) =>
    props.theme === "remove" &&
    css`
      background-color: var(--theme-alert-outline-bg);
      color: var(--theme-alert-outline-text);
      border: var(--theme-alert-outline-border) 1px solid;
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
