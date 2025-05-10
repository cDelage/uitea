import styled, { css } from "styled-components";
import { PositionAbsolute } from "./PositionAbsolute.type";

export const GhostButton = styled.button`
  color: var(--uidt-base-text-light);
  cursor: pointer;
  background-color: transparent;
  padding: 4px 8px;
  &:hover {
    color: var(--uidt-base-text-dark);
  }
`;

export const WindowButtons = styled.button`
  background-color: transparent;
  color: var(--uidt-base-text-light);
  padding: 4px 12px;
  height: 100%;
  &:hover {
    background-color: var(--window-buttons-hover-bg);
    color: var(--uidt-base-text-dark);
  }
`;

export const CloseButton = styled.button`
  background-color: transparent;
  color: var(--uidt-base-text-light);
  padding: 4px 12px;
  height: 100%;
  &:hover {
    background-color: var(--uidt-alert-bg);
    color: var(--uidt-alert-text);
  }
`;

export const ButtonPrimary = styled.button`
  background-color: var(--uidt-primary-bg);
  color: var(--uidt-primary-text);
  border-radius: var(--uidt-rounded-lg);
  padding: var(--uidt-space-3) var(--uidt-space-4);
  &:hover {
    background-color: var(--uidt-primary-hover-bg);
    color: var(--uidt-primary-hover-text);
  }

  &:disabled{
    background-color: var(--uidt-base-background-disabled);
    color: var(--uidt-base-text-disabled);
  }
`;

export const ButtonAlert = styled.button`
  background-color: var(--uidt-alert-bg);
  color: var(--uidt-alert-text);
  border-radius: var(--uidt-rounded-lg);
  padding: var(--uidt-space-3) var(--uidt-space-4);
  &:hover {
    background-color: var(--uidt-alert-hover-bg);
    color: var(--uidt-alert-hover-text);
  }
`;

export const ButtonTertiary = styled.button`
  background-color: var(--uidt-tertiary-bg);
  color: var(--uidt-tertiary-text);
  border-radius: var(--uidt-rounded-lg);
  padding: var(--uidt-space-3) var(--uidt-space-4);
  border: none;
  cursor: pointer;
  &:hover {
    background-color: var(--uidt-tertiary-hover-bg);
    color: var(--uidt-tertiary-hover-text);
  }
`;

export const ButtonSignifiantAction = styled.button<{
  theme: "add" | "remove", position?: PositionAbsolute
}>`
  border-radius: var(--uidt-rounded-full);
  border: none;
  padding: var(--uidt-space-1);
  ${(props) =>
    props.theme === "add" &&
    css`
      background-color: var(--uidt-primary-outline-bg);
      color: var(--uidt-primary-outline-text);
      border: var(--uidt-primary-outline-border) 1px solid;
    `};

  ${(props) =>
    props.theme === "remove" &&
    css`
      background-color: var(--uidt-alert-outline-bg);
      color: var(--uidt-alert-outline-text);
      border: var(--uidt-alert-outline-border) 1px solid;
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
