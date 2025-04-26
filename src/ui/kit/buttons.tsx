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
    background-color: var(--window-buttons-hover-bg);
    color: var(--base-text-dark);
  }
`;

export const CloseButton = styled.button`
  background-color: transparent;
  color: var(--base-text-light);
  padding: 4px 12px;
  height: 100%;
  &:hover {
    background-color: var(--alert-bg);
    color: var(--alert-text);
  }
`;

export const ButtonPrimary = styled.button`
  background-color: var(--primary-bg);
  color: var(--primary-text);
  border-radius: var(--rounded-lg);
  padding: var(--space-3) var(--space-4);
  &:hover {
    background-color: var(--primary-hover-bg);
    color: var(--primary-hover-text);
  }

  &:disabled{
    background-color: var(--base-bg-disabled);
    color: var(--base-text-disabled);
  }
`;

export const ButtonAlert = styled.button`
  background-color: var(--alert-bg);
  color: var(--alert-text);
  border-radius: var(--rounded-lg);
  padding: var(--space-3) var(--space-4);
  &:hover {
    background-color: var(--alert-hover-bg);
    color: var(--alert-hover-text);
  }
`;

export const ButtonTertiary = styled.button`
  background-color: var(--tertiary-bg);
  color: var(--tertiary-text);
  border-radius: var(--rounded-lg);
  padding: var(--space-3) var(--space-4);
  border: none;
  cursor: pointer;
  &:hover {
    background-color: var(--tertiary-hover-bg);
    color: var(--tertiary-hover-text);
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
      background-color: var(--primary-outline-bg);
      color: var(--primary-outline-text);
      border: var(--primary-outline-border) 1px solid;
    `};

  ${(props) =>
    props.theme === "remove" &&
    css`
      background-color: var(--alert-outline-bg);
      color: var(--alert-outline-text);
      border: var(--alert-outline-border) 1px solid;
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
