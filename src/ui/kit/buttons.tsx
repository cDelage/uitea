import styled from "styled-components";

export const GhostButton = styled.button`
    color: var(--default-color-text-light);
    cursor: pointer;
    background-color: transparent;
    border: none;
    padding: 4px 8px;
    &:hover{
        color: var(--default-color-text-dark);
    }
    `

export const WindowButtons = styled.button`
    background-color: transparent;
    border: none;
    color: var(--default-color-text-light);
    padding: 4px 12px;
    height: 100%;
    &:hover{
        background-color: var(--color-theme-window-buttons-hover-bg);
        color: var(--default-color-text-dark);
    }
`

export const CloseButton = styled.button`
    background-color: transparent;
    border: none;
    color: var(--default-color-text-light);
    padding: 4px 12px;
    height: 100%;
    &:hover{
        background-color: var(--color-theme-alert-bg);
        color: var(--color-theme-alert-text);
    }
`