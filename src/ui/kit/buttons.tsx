import styled from "styled-components";

export const GhostButton = styled.button`
  color: var(--default-color-text-light);
  cursor: pointer;
  background-color: transparent;
  padding: 4px 8px;
  &:hover {
    color: var(--default-color-text-dark);
  }
`;

export const WindowButtons = styled.button`
  background-color: transparent;
  color: var(--default-color-text-light);
  padding: 4px 12px;
  height: 100%;
  &:hover {
    background-color: var(--color-theme-window-buttons-hover-bg);
    color: var(--default-color-text-dark);
  }
`;

export const CloseButton = styled.button`
  background-color: transparent;
  color: var(--default-color-text-light);
  padding: 4px 12px;
  height: 100%;
  &:hover {
    background-color: var(--color-theme-alert-bg);
    color: var(--color-theme-alert-text);
  }
`;

export const ButtonPrimary = styled.button`
  background-color: var(--color-theme-primary-bg);
  color: var(--color-theme-primary-text);
  border-radius: var(--rounded-lg);
  padding: var(--space-3) var(--space-4);
  &:hover {
    background-color: var(--color-theme-primary-hover-bg);
    color: var(--color-theme-primary-hover-text);
  }
`;

export const ButtonTertiary = styled.button`
  background-color: var(--color-theme-tertiary-bg);
  color: var(--color-theme-tertiary-text);
  border-radius: var(--rounded-lg);
  padding: var(--space-3) var(--space-4);
  border: none;
  cursor: pointer;
  &:hover {
    background-color: var(--color-theme-tertiary-hover-bg);
    color: var(--color-theme-tertiary-hover-text);
  }
`;
