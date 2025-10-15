import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --uit-palette-primary-50: #eff6ff;
    --uit-palette-primary-100: #dbeafe;
    --uit-palette-primary-200: #bfdbfe;
    --uit-palette-primary-300: #93c5fd;
    --uit-palette-primary-400: #60a5fa;
    --uit-palette-primary-500: #3b82f6;
    --uit-palette-primary-600: #2563eb;
    --uit-palette-primary-700: #1d4ed8;
    --uit-palette-primary-800: #1e40af;
    --uit-palette-primary-900: #1e3a8a;
    --uit-palette-primary-950: #172554;
  
    --uit-palette-secondary-50: #fff7ed;
    --uit-palette-secondary-100: #ffedd5;
    --uit-palette-secondary-200: #fed7aa;
    --uit-palette-secondary-300: #fdba74;
    --uit-palette-secondary-400: #fb923c;
    --uit-palette-secondary-500: #f97316;
    --uit-palette-secondary-600: #ea580c;
    --uit-palette-secondary-700: #c2410c;
    --uit-palette-secondary-800: #9a3412;
    --uit-palette-secondary-900: #7c2d12;
    --uit-palette-secondary-950: #431407;
  
    --uit-palette-positive-50: #f0fdf4;
    --uit-palette-positive-100: #dcfce7;
    --uit-palette-positive-200: #bbf7d0;
    --uit-palette-positive-300: #86efac;
    --uit-palette-positive-400: #4ade80;
    --uit-palette-positive-500: #22c55e;
    --uit-palette-positive-600: #16a34a;
    --uit-palette-positive-700: #15803d;
    --uit-palette-positive-800: #166534;
    --uit-palette-positive-900: #14532d;
    --uit-palette-positive-950: #052e16;
  
    --uit-palette-warning-50: #fffbeb;
    --uit-palette-warning-100: #fef3c7;
    --uit-palette-warning-200: #fde68a;
    --uit-palette-warning-300: #fcd34d;
    --uit-palette-warning-400: #fbbf24;
    --uit-palette-warning-500: #f59e0b;
    --uit-palette-warning-600: #d97706;
    --uit-palette-warning-700: #b45309;
    --uit-palette-warning-800: #92400e;
    --uit-palette-warning-900: #78350f;
    --uit-palette-warning-950: #451a03;
  
    --uit-palette-negative-50: #fff1f2;
    --uit-palette-negative-100: #ffe4e6;
    --uit-palette-negative-200: #fecdd3;
    --uit-palette-negative-300: #fda4af;
    --uit-palette-negative-400: #fb7185;
    --uit-palette-negative-500: #f43f5e;
    --uit-palette-negative-600: #e11d48;
    --uit-palette-negative-700: #be123c;
    --uit-palette-negative-800: #9f1239;
    --uit-palette-negative-900: #881337;
    --uit-palette-negative-950: #4c0519;
  
    --uit-palette-gray-50: #fafafa;
    --uit-palette-gray-100: #f4f4f5;
    --uit-palette-gray-200: #e4e4e7;
    --uit-palette-gray-300: #d4d4d8;
    --uit-palette-gray-400: #a1a1aa;
    --uit-palette-gray-500: #71717a;
    --uit-palette-gray-600: #52525b;
    --uit-palette-gray-700: #3f3f46;
    --uit-palette-gray-800: #27272a;
    --uit-palette-gray-900: #18181b;
    --uit-palette-gray-950: #09090b;
  
    --uit-palette-info-50: #f0fdfa;
    --uit-palette-info-100: #ccfbf1;
    --uit-palette-info-200: #99f6e4;
    --uit-palette-info-300: #5eead4;
    --uit-palette-info-400: #2dd4bf;
    --uit-palette-info-500: #14b8a6;
    --uit-palette-info-600: #0d9488;
    --uit-palette-info-700: #0f766e;
    --uit-palette-info-800: #115e59;
    --uit-palette-info-900: #134e4a;
    --uit-palette-info-950: #042f2e;
  
    --uit-palette-single-white: #ffffff;
    --uit-palette-single-black-transparent: rgb(24, 24, 27, 70%);
  
    --uit-base-background: var(--uit-palette-primary-50);
    --uit-base-background-hover: var(--uit-palette-primary-100);
    --uit-base-border: var(--uit-palette-gray-300);
    --uit-base-text-light: var(--uit-palette-gray-500);
    --uit-base-text-default: var(--uit-palette-gray-700);
    --uit-base-text-dark: var(--uit-palette-gray-900);
    --uit-base-background-disabled: var(--uit-palette-gray-50);
    --uit-base-text-disabled: var(--uit-palette-gray-300);
  
    --window-buttons-hover-bg: var(--uit-palette-primary-200);
  
    --uit-alert-bg: var(--uit-palette-negative-700);
    --uit-alert-text: var(--uit-palette-negative-50);
    --uit-alert-hover-bg: var(--uit-palette-negative-900);
    --uit-alert-hover-text: var(--uit-palette-negative-50);
  
    --uit-anchor-bg: var(--uit-palette-negative-600);
  
    --uit-alert-outline-bg: var(--uit-palette-negative-50);
    --uit-alert-outline-text: var(--uit-palette-negative-800);
    --uit-alert-outline-border: var(--uit-palette-negative-700);
  
    --uit-warning-outline-bg: var(--uit-palette-warning-50);
    --uit-warning-outline-text: var(--uit-palette-warning-700);
    --uit-warning-outline-border: var(--uit-palette-warning-700);
  
    --uit-component-bg: var(--uit-palette-single-white);
    --uit-component-text: var(--uit-palette-gray-700);
    --uit-component-border: var(--uit-palette-gray-300);
    --uit-component-hover-bg: var(--uit-palette-gray-100);
    --uit-component-hover-text: var(--uit-palette-gray-900);
    --uit-component-focus-bg: var(--uit-palette-primary-100);
    --uit-component-focus-text: var(--uit-palette-primary-900);
  
    --uit-secondary-hover-bg: var(--uit-palette-secondary-50);
    --uit-secondary-hover-text: var(--uit-palette-secondary-950);
  
  
    --uit-sunny-text: var(--uit-palette-secondary-700);
    --uit-moon-text: var(--uit-palette-primary-900);
    --uit-contrast-off-text: var(--uit-palette-gray-400);
    --uit-contrast-on-text: var(--uit-palette-primary-700);
  
    --uit-tooltip-bg: rgb(23, 23, 23, 80%);
    --uit-tooltip-text: var(--uit-palette-single-white);
  
    --uit-primary-bg: var(--uit-palette-primary-800);
    --uit-primary-text: var(--uit-palette-single-white);
    --uit-primary-border: var(--uit-palette-primary-800);
    --uit-primary-hover-bg: var(--uit-palette-primary-900);
    --uit-primary-hover-text: var(--uit-palette-primary-50);
    --uit-primary-hover-border: var(--uit-palette-primary-950);
  
    --uit-primary-outline-bg: var(--uit-palette-primary-50);
    --uit-primary-outline-text: var(--uit-palette-primary-800);
    --uit-primary-outline-border: var(--uit-palette-primary-600);
    --uit-primary-outline-hover-bg: var(--uit-palette-primary-100);
    --uit-primary-outline-hover-text: var(--uit-palette-primary-950);
    --uit-primary-outline-light-border: var(--uit-palette-primary-300);
  
    --uit-add-bg: var(--uit-palette-primary-100);
    --uit-add-text: var(--uit-palette-primary-500);
    --uit-add-border: var(--uit-palette-primary-300);
    --uit-add-hover-bg: var(--uit-palette-primary-200);
    --uit-add-hover-text: var(--uit-palette-primary-800);
    --uit-add-hover-border: var(--uit-palette-primary-600);
  
    --uit-add-base-text: var(--uit-palette-primary-600);
    --uit-add-base-border: var(--uit-palette-primary-400);
    --uit-add-base-hover-text: var(--uit-palette-primary-900);
    --uit-add-base-hover-border: var(--uit-palette-primary-800);
    --uit-add-base-active-text: var(--uit-palette-primary-700);
    --uit-add-base-active-border: var(--uit-palette-primary-600);
  
    --uit-remove-bg: var(--uit-palette-negative-100);
    --uit-remove-border: var(--uit-palette-negative-300);
    --uit-remove-text: var(--uit-palette-negative-700);
    --uit-remove-hover-text: var(--uit-palette-negative-800);
    --uit-remove-hover-border: var(--uit-palette-negative-600);
  
    --uit-locked-bg: var(--uit-palette-gray-200);
    --uit-drag-bg: var(--uit-palette-primary-200);
    --uit-drag-border: var(--uit-palette-primary-600);
  
    --uit-tertiary-bg: var(--uit-palette-gray-100);
    --uit-tertiary-text: var(--uit-palette-gray-600);
    --uit-tertiary-border: var(--uit-palette-gray-300);
    --uit-tertiary-hover-bg: var(--uit-palette-gray-200);
    --uit-tertiary-hover-text: var(--uit-palette-gray-800);
    --uit-tertiary-hover-border: var(--uit-palette-gray-400);
  
    --uit-base-button-hover-bg: rgb(212, 212, 216, 0.3);
    --uit-base-button-active-bg: rgb(219, 234, 254, 1);
  
    --uit-menu-button-bg: var(--uit-palette-single-white);
    --uit-menu-button-text: var(--uit-palette-gray-700);
    --uit-menu-button-hover-bg: var(--uit-palette-gray-200);
    --uit-menu-button-hover-text: var(--uit-palette-gray-700);
  
    --uit-menu-primary-button-bg: var(--uit-palette-primary-100);
    --uit-menu-primary-button-text: var(--uit-palette-primary-800);
    --uit-menu-primary-button-hover-bg: var(--uit-palette-primary-200);
    --uit-menu-primary-button-hover-text: var(--uit-palette-primary-950);
  
    --uit-action-button-bg: var(--uit-palette-gray-50);
    --uit-action-button-text: var(--uit-palette-gray-500);
    --uit-action-button-border: var(--uit-palette-gray-200);
    --uit-action-button-hover-text: var(--uit-palette-gray-700);
    --uit-action-button-hover-border: var(--uit-palette-gray-400);
    --uit-action-button-active-bg: var(--uit-palette-primary-700);
    --uit-action-button-active-text: var(--uit-palette-primary-50);
    --uit-action-button-active-hover-bg: var(--uit-palette-primary-500);
    --uit-action-button-negative-bg: var(--uit-palette-negative-700);
    --uit-action-button-negative-text: var(--uit-palette-negative-50);
    --uit-action-button-negative-hover-bg: var(--uit-palette-negative-500);
  
    --uit-modal-bg: var(--uit-palette-single-black-transparent);
  
    --uit-space-0: 0px;
    --uit-space-1: 2px;
    --uit-space-2: 4px;
    --uit-space-3: 8px;
    --uit-space-4: 12px;
    --uit-space-5: 16px;
    --uit-space-6: 20px;
    --uit-space-7: 28px;
    --uit-space-8: 32px;
    --uit-space-9: 40px;
    --uit-space-10: 52px;
    --uit-space-11: 64px;
    --uit-space-12: 80px;
    --uit-space-13: 100px;
    --uit-space-14: 120px;
    --uit-space-15: 160px;
    --uit-space-16: 200px;
    --uit-space-17: 240px;
    --uit-space-18: 280px;
    --uit-space-19: 320px;
    --uit-space-20: 360px;
  
    --uit-shadow-button: rgba(0, 0, 0, 0.25) 0px 0px 1px 0px;
    --uit-shadow-sm: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px;
    --uit-shadow-md: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    --uit-shadow-lg: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
      rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
    --uit-shadow-inset: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  
    --uit-font-weight-light: 400;
    --uit-font-weight-default: 500;
    --uit-font-weight-sm-bold: 600;
    --uit-font-weight-bold: 700;
  
    --uit-rounded-md: 4px;
    --uit-rounded-lg: 8px;
    --uit-rounded-full: 50%;
  
    --uit-transition-base: transform 100ms ease-in-out;
  
    --default-font-size: 14px;
    --default-line-height: 16px;
  
  
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: #ffffff;
    }
  
    /* Track de la scrollbar */
    ::-webkit-scrollbar-track {
      background: #ffffff;
    }
  
    /* Thumb de la scrollbar */
    ::-webkit-scrollbar-thumb {
      background-color: var(--uit-palette-gray-500);
      border-radius: 6px;
    }
  
    /* Thumb hover */
    ::-webkit-scrollbar-thumb:hover {
      background-color: var(--uit-palette-gray-500);
    }
  }
  
  html,
  body,
  #root {
    height: 100%;
    max-height: 100vh;
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;
    overflow-x: auto;
    overflow-y: hidden;
    font-size: var(--default-font-size);
    line-height: var(--default-line-height);
  
  }
  
  body {
    background: var(--uit-base-background);
    color: var(--uit-base-text-default);
    font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    padding: var(--uit-space-0);
    margin: var(--uit-space-0);
  }
  
  main {
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  h1 {
    font-size: 52px;
    line-height: 56px;
    margin: 0px;
    font-weight: var(--uit-font-weight-bold);
    user-select: none;
    -webkit-user-select: none;
  }
  
  h2 {
    font-size: 40px;
    line-height: 44px;
    margin: 0px;
    font-weight: var(--uit-font-weight-bold);
    user-select: none;
    -webkit-user-select: none;
    
  }
  
  h3 {
    font-size: 28px;
    line-height: 32px;
    margin: 0px;
    font-weight: var(--uit-font-weight-bold);
    user-select: none;
    -webkit-user-select: none;
  
  }
  
  h4 {
    font-size: 24px;
    line-height: 28px;
    margin: 0px;
    font-weight: var(--uit-font-weight-sm-bold);
    user-select: none;
    -webkit-user-select: none;
  
  }
  
  .h4-placeholder {
    min-height: 28px;
    height: 28px;
    max-height: 28px;
  }
  
  h5 {
    font-size: 18px;
    line-height: 20px;
    margin: 0px;
    font-weight: var(--uit-font-weight-sm-bold);
    user-select: none;
    -webkit-user-select: none;
  
  }
  
  .h5-placeholder {
    min-height: 20px;
    height: 20px;
    max-height: 20px;
  }
  
  h6 {
    font-size: 16px;
    line-height: 18px;
    margin: 0px;
    font-weight: var(--uit-font-weight-sm-bold);
    user-select: none;
    -webkit-user-select: none;
  
  }
  
  .text-xs {
    font-size: 12px;
    line-height: 12px;
    user-select: none;
    -webkit-user-select: none;
  
  }
  
  small {
    font-size: 12px;
    line-height: 16px;
    user-select: none;
    -webkit-user-select: none;
  
  }
  
  .small {
    font-size: 12px;
    line-height: 16px;
    user-select: none;
    -webkit-user-select: none;
  
  }
  
  strong {
    font-size: inherit;
    line-height: inherit;
    user-select: none;
    -webkit-user-select: none;
  
    font-weight: var(--uit-font-weight-bold);
  }
  
  label {
    color: var(--uit-base-text-light);
    font-weight: var(--uit-font-weight-bold);
  }
  
  .bold {
    font-weight: var(--uit-font-weight-bold);
  }
  
  .underline {
    text-decoration: underline;
    text-underline-offset: var(--uit-space-2);
  }
  
  button {
    font-size: 14px;
    line-height: 16px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: var(--uit-space-2);
    gap: var(--uit-space-2);
    font-weight: 600;
    width: fit-content;
  }
  
  p {
    font-size: 16px;
    line-height: 20px;
  }
  
  .row {
    display: flex;
    flex-direction: row;
  }
  
  .column {
    display: flex;
    flex-direction: column;
  }
  
  /* Gap classes */
  .gap-0 {
    gap: var(--uit-space-0);
  }
  
  .gap-1 {
    gap: var(--uit-space-1);
  }
  
  .gap-2 {
    gap: var(--uit-space-2);
  }
  
  .gap-3 {
    gap: var(--uit-space-3);
  }
  
  .gap-4 {
    gap: var(--uit-space-4);
  }
  
  .gap-5 {
    gap: var(--uit-space-5);
  }
  
  .gap-6 {
    gap: var(--uit-space-6);
  }
  
  .gap-7 {
    gap: var(--uit-space-7);
  }
  
  .gap-8 {
    gap: var(--uit-space-8);
  }
  
  .gap-9 {
    gap: var(--uit-space-9);
  }
  
  .gap-10 {
    gap: var(--uit-space-10);
  }
  
  /* Padding classes */
  .p-0 {
    padding: var(--uit-space-0);
  }
  
  .p-1 {
    padding: var(--uit-space-1);
  }
  
  .p-2 {
    padding: var(--uit-space-2);
  }
  
  .py-2 {
    padding-top: var(--uit-space-2);
    padding-bottom: var(--uit-space-2);
  }
  
  .p-3 {
    padding: var(--uit-space-3);
  }
  
  .py-3 {
    padding: var(--uit-space-3) var(--uit-space-0);
  }
  
  .p-4 {
    padding: var(--uit-space-4);
  }
  
  .px-4 {
    padding-left: var(--uit-space-4);
    padding-right: var(--uit-space-4);
  }
  
  .p-5 {
    padding: var(--uit-space-5);
  }
  
  .p-6 {
    padding: var(--uit-space-6);
  }
  
  .p-7 {
    padding: var(--uit-space-7);
  }
  
  .py-7 {
    padding-top: var(--uit-space-7);
    padding-bottom: var(--uit-space-7);
  }
  
  .px-7 {
    padding-left: var(--uit-space-7);
    padding-right: var(--uit-space-7);
  }
  
  .p-8 {
    padding: var(--uit-space-8);
  }
  
  .px-8 {
    padding-left: var(--uit-space-8);
    padding-right: var(--uit-space-8);
  }
  
  .p-9 {
    padding: var(--uit-space-9);
  }
  
  .p-10 {
    padding: var(--uit-space-10);
  }
  
  /* Margin classes */
  .m-0 {
    margin: var(--uit-space-0);
  }
  
  .m-1 {
    margin: var(--uit-space-1);
  }
  
  .m-2 {
    margin: var(--uit-space-2);
  }
  
  .m-3 {
    margin: var(--uit-space-3);
  }
  
  .m-4 {
    margin: var(--uit-space-4);
  }
  
  .m-5 {
    margin: var(--uit-space-5);
  }
  
  .m-6 {
    margin: var(--uit-space-6);
  }
  
  .m-7 {
    margin: var(--uit-space-7);
  }
  
  .m-8 {
    margin: var(--uit-space-8);
  }
  
  .m-9 {
    margin: var(--uit-space-9);
  }
  
  .m-10 {
    margin: var(--uit-space-10);
  }
  
  .w-full {
    width: 100%;
  }
  
  .w-50 {
    width: 50%;
  }
  
  .max-w-50 {
    max-width: 50%;
  }
  
  .max-w-full {
    max-width: 100%;
  }
  
  .w-fit {
    width: fit-content;
  }
  
  .h-fit {
    height: fit-content;
  }
  
  .h-full {
    height: 100%;
  }
  
  .flex-1 {
    flex: 1;
  }
  
  .justify-start {
    justify-content: start;
  }
  
  .justify-center {
    justify-content: center;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .shadow-md {
    box-shadow: var(--uit-shadow-md);
  }
  
  .shadow-lg {
    box-shadow: var(--uit-shadow-lg);
  }
  
  .shadow-inset {
    box-shadow: var(--uit-shadow-inset);
  }
  
  .align-center {
    align-items: center;
  }
  
  .justify-end {
    justify-content: end;
  }
  
  .align-end {
    align-items: end;
  }
  
  .text-color-light {
    color: var(--uit-base-text-light);
  }
  
  .text-color-default {
    color: var(--uit-base-text-default);
  }
  
  .text-color-dark {
    color: var(--uit-base-text-dark);
  }
  
  .uidt-text-color-light {
    color: var(--uit-base-text-light);
  }
  
  .uidt-text-color-default {
    color: var(--uit-base-text-default);
  }
  
  .uidt-text-color-dark {
    color: var(--uit-base-text-dark);
  }
  
  .uidt-text-color-primary {
    color: var(--uit-primary-outline-text);
  }
  
  .h-100 {
    height: 100%;
  }
  
  .menu-button {
    background-color: var(--uit-menu-button-bg);
    color: var(--uit-menu-button-text);
    cursor: pointer;
    padding: var(--uit-space-2);
    border-radius: var(--uit-rounded-md);
    box-shadow: var(--uit-shadow-md);
    font-weight: var(--uit-font-weight-default);
  }
  
  .menu-button:hover {
    background-color: var(--uit-menu-button-hover-bg);
    color: var(--uit-menu-button-hover-text);
  }
  
  .menu-primary-button {
    background-color: var(--uit-menu-primary-button-bg);
    color: var(--uit-menu-primary-button-text);
    cursor: pointer;
    padding: var(--uit-space-2);
    border-radius: var(--uit-rounded-md);
    box-shadow: var(--uit-shadow-md);
    font-weight: var(--uit-font-weight-default);
  }
  
  .menu-primary-button:hover {
    background-color: var(--uit-menu-primary-button-hover-bg);
    color: var(--uit-menu-primary-button-hover-text);
  }
  
  .action-button {
    background-color: var(--uit-action-button-bg);
    color: var(--uit-action-button-text);
    border: var(--uit-action-button-border) 1px solid;
    padding: var(--uit-space-2);
    border-radius: var(--uit-rounded-md);
    height: fit-content;
  }
  
  .action-button:hover {
    color: var(--uit-action-button-hover-text);
    box-shadow: var(--uit-shadow-button);
  }
  
  .action-ghost-button {
    background-color: transparent;
    color: var(--uit-action-button-text);
    padding: var(--uit-space-2);
    border-radius: var(--uit-rounded-md);
    height: fit-content;
  }
  
  .action-ghost-button:hover {
    background-color: var(--uit-base-button-hover-bg);
    box-shadow: transparent;
    color: var(--uit-action-button-hover-text);
  }
  
  .action-ghost-button:disabled {
    color: var(--uit-base-text-disabled);
    background-color: transparent;
    cursor: default;
  }
  
  .action-button:disabled {
    color: var(--uit-base-background-disabled);
    box-shadow: var(--uit-base-background-text);
    cursor: default;
  }
  
  .action-ghost-button[data-active="true"] {
    background-color: var(--uit-action-button-active-bg);
    color: var(--uit-action-button-active-text);
  }
  
  .action-ghost-button[data-active="true"]:hover {
    background-color: var(--uit-action-button-active-bg);
    color: var(--uit-action-button-active-text);
  }
  
  .action-button.active {
    background-color: var(--uit-action-button-active-bg);
    color: var(--uit-action-button-active-text);
    box-shadow: var(--uit-shadow-button);
  }
  
  .action-button.active:hover {
    background-color: var(--uit-action-button-active-hover-bg);
  }
  
  .action-button.negative {
    background-color: var(--uit-action-button-negative-bg);
    color: var(--uit-action-button-negative-text);
    box-shadow: var(--uit-shadow-button);
  }
  
  .action-button.negative:hover {
    background-color: var(--uit-action-button-negative-hover-bg);
  }
  
  .text-tertiary-button {
    color: var(--uit-base-text-light);
    cursor: pointer;
  }
  
  .text-tertiary-button:hover {
    color: var(--uit-base-text-dark);
  }
  
  .add-button {
    display: flex;
    align-items: center;
    padding: var(--uit-space-2);
    background-color: transparent;
    border: dashed 2px var(--uit-add-border);
    color: var(--uit-add-text);
    border-radius: var(--uit-rounded-md);
    font-weight: var(--uit-font-weight-default);
  }
  
  .button-height-l {
    height: var(--uit-space-9);
  }
  
  .add-button:disabled {
    background-color: transparent;
    border: dashed 2px var(--uit-base-background-disabled);
    color: var(--uit-base-text-disabled);
    cursor: not-allowed;
  }
  
  .add-button:disabled {
    background-color: transparent;
    border: dashed 2px var(--uit-base-background-disabled);
    color: var(--uit-base-text-disabled);
    cursor: not-allowed;
  }
  
  .add-button:disabled:hover {
    background-color: transparent;
    border: dashed 2px var(--uit-base-background-disabled);
    color: var(--uit-base-text-disabled);
  }
  
  .add-button:hover {
    border: dashed 2px var(--uit-add-hover-border);
    color: var(--uit-add-hover-text);
  }
  
  .add-base-button {
    display: flex;
    align-items: center;
    padding: var(--uit-space-2);
    background-color: transparent;
    border: dashed 2px var(--uit-add-base-border);
    color: var(--uit-add-base-text);
    border-radius: var(--uit-rounded-md);
    font-weight: var(--uit-font-weight-default);
  }
  
  .add-base-button:hover {
    border: dashed 2px var(--uit-add-base-hover-border);
    color: var(--uit-add-base-hover-text);
  }
  
  .add-base-button.active {
    border: dashed 2px var(--uit-add-base-active-border);
    color: var(--uit-add-base-active-text);
    box-shadow: var(--uit-shadow-md);
  }
  
  .remove-button {
    display: flex;
    align-items: center;
    padding: var(--uit-space-2);
    background-color: transparent;
    border: dashed 2px var(--uit-remove-border);
    color: var(--uit-remove-text);
    border-radius: var(--uit-rounded-md);
    font-weight: var(--uit-font-weight-default);
  }
  
  .remove-button:hover {
    border: dashed 2px var(--uit-remove-hover-border);
    color: var(--uit-remove-hover-text);
  }
  
  .inherit-select {
    padding: var(--uit-space-0) var(--uit-space-0);
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    line-height: inherit;
    border: none;
    width: fit-content;
    color: inherit;
    outline: none;
    cursor: inherit;
    background-color: inherit;
    background: inherit;
    border-bottom: transparent 1px solid;
    box-sizing: border-box;
    box-shadow: none;
    overflow: visible;
    height: 100%;
  }
  
  .left-spinner {
    text-align: right;
    /* chiffre collé à droite */
  }
  
  
  .select-no-arrow {
    -webkit-appearance: none;
    /* Chrome / Safari / iOS */
    -moz-appearance: none;
    /* Firefox */
    appearance: none;
    /* Spécification */
  }
  
  .inherit-input {
    padding: var(--uit-space-1) var(--uit-space-0);
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    line-height: inherit;
    border: none;
    width: 100%;
    color: inherit;
    outline: none;
    cursor: inherit;
    background-color: inherit;
    background: inherit;
    border-bottom: transparent 1px solid;
    box-sizing: border-box;
    overflow: visible;
    height: 100%;
  }
  
  .uidt-input {
    border: 1px solid var(--uit-base-border);
    background-color: var(--uit-component-bg);
    border-radius: var(--uit-rounded-md);
    box-shadow: var(--uit-shadow-sm);
    font-size: inherit;
    height: var(--uit-space-7);
    width: fit-content;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  
  .uidt-input-hover-background:hover {
    background-color: var(--uit-primary-outline-bg);
  }
  
  .input-hover {
    border-bottom: var(--uit-primary-outline-light-border) 0px solid;
    padding: var(--uit-space-2) var(--uit-space-0);
  }
  
  .input-hover:hover {
    border-bottom: var(--uit-primary-outline-light-border) 1px solid;
  }
  
  .uidt-input:hover {
    border: var(--uit-primary-outline-light-border) 1px solid;
  }
  
  .uidt-input[data-readonly="true"]:hover {
    border: 1px solid var(--uit-base-border);
  }
  
  .uidt-input:focus-within {
    border: var(--uit-primary-outline-border) 1px solid;
  }
  
  .uidt-input-select:hover {
    border: none;
  }
  
  .uidt-input-select:focus {
    border: none;
  }
  
  select {
    padding: var(--uit-space-2) var(--uit-space-0);
    margin: 0;
    border: 1px solid var(--uit-base-border);
    box-sizing: border-box;
    background-color: var(--uit-component-bg);
    border-radius: var(--uit-rounded-md);
    box-shadow: var(--uit-shadow-md);
  }
  
  select:hover {
    border: var(--uit-primary-outline-light-border) 1px solid;
  }
  
  select:focus-within {
    border: var(--uit-primary-outline-border) 1px solid;
    outline: none;
  }
  
  .inherit-input-placeholder {
    padding: var(--uit-space-1) var(--uit-space-0);
    margin: 0;
    border-bottom: transparent 1px solid;
    user-select: none;
    -webkit-user-select: none;
  
  }
  
  .inherit-input-size {
    height: 32px;
    padding-left: 4px;
    box-sizing: border-box;
  }
  
  .inherit-input:hover {
    border-bottom: var(--uit-primary-outline-light-border) 1px solid;
  }
  
  .inherit-input:focus {
    border-bottom: var(--uit-primary-outline-border) 1px solid;
  }
  
  .empty-border {
    border-bottom: var(--uit-base-border) 1px transparent !important;
  }
  
  .empty-border:hover {
    border-bottom: var(--uit-base-border) 1px transparent !important;
  }
  
  .empty-border:focus {
    border-bottom: var(--uit-base-border) 1px transparent !important;
  }
  
  .inherit-input:read-only {
    white-space: nowrap;
    text-overflow: ellipsis;
    border-bottom: transparent 1px solid;
    user-select: none;
    -webkit-user-select: none;
  
  }
  
  .nowrap {
    white-space: nowrap;
    text-overflow: ellipsis;
    border-bottom: transparent 1px solid;
    box-sizing: border-box;
    overflow: hidden;
  }
  
  input {
    accent-color: var(--uit-palette-primary-500);
  }
  
  .input-standard {
    padding: 8px;
    height: 48px;
    border: 1px solid transparent;
    background-color: var(--uit-component-bg);
    border-radius: var(--uit-rounded-md);
    box-shadow: var(--uit-shadow-sm);
    font-size: inherit;
    height: var(--uit-space-7);
    box-sizing: border-box;
  }
  
  .input-standard:focus {
    outline: var(--uit-primary-outline-border) 1px solid;
  }
  
  select {
    padding: 0px;
    margin: 0px;
    height: 32px;
  }
  
  select:disabled {
    appearance: none;
    padding: 0px;
    padding-left: 4px;
    margin: 0px;
  }
  
  .text-align-right {
    text-align: right;
  }
  
  .error {
    color: var(--uit-alert-outline-text);
  }
  
  .copyable-label {
    background-color: var(--uit-tertiary-bg);
    color: var(--uit-tertiary-text);
    padding: var(--uit-space-2) var(--uit-space-3);
    cursor: pointer;
    display: flex;
    gap: var(--uit-space-2);
    align-items: center;
    width: fit-content;
    border-radius: var(--uit-rounded-md);
    font-family: "Consolas";
    box-shadow: var(--uit-shadow-sm);
    overflow: hidden;
    max-width: 200px;
  }
  
  .copyable-label:hover {
    background-color: var(--uit-tertiary-hover-bg);
    color: var(--uit-tertiary-hover-text);
  }
  
  .popover-body {
    display: flex;
    flex-direction: column;
    padding: var(--uit-space-3);
    gap: var(--uit-space-3);
    justify-content: end;
  }
  
  .checkbox-container {
    display: flex;
    align-items: center;
    gap: var(--uit-space-2);
    color: var(--uit-base-text-light);
  }
  
  .rotate-chevron,
  .rotate-key {
    transform: rotate(90deg);
  }
  
  .rotate-chevron-left {
    transform: rotate(-90deg);
  }
  
  .container-start {
    flex: 1;
    justify-content: start;
    align-items: center;
  }
  
  .container-center {
    flex: 1;
    justify-self: center;
    align-items: center;
  }
  
  .container-end {
    flex: 1;
    justify-content: end;
    align-items: center;
  }
  
  .add:hover {
    border-bottom: var(--uit-add-border) 2px solid;
    border-radius: 0px;
    cursor: pointer;
  }
  
  .locked:hover {
    background-color: var(--uit-locked-bg);
  }
  
  .add-right:hover {
    border-right: var(--uit-add-border) 2px solid;
    border-radius: 0px;
    cursor: pointer;
  }
  
  .remove {
    background-color: var(--uit-remove-bg);
    cursor: pointer;
  }
  
  .remove-hover:hover {
    background-color: var(--uit-remove-bg);
    cursor: pointer;
  }
  
  .draggable {
    background-color: var(--uit-drag-bg);
    cursor: pointer;
  }
  
  .drag-hover-top:hover {
    border-top: var(--uit-add-border) 2px solid;
    border-radius: 0px;
    cursor: pointer;
  }
  
  .drag-hover-left {
    border-left:  2px solid var(--uit-add-border);
    border-radius: 0px;
    cursor: pointer;
  }
  
  .drag-hover-left-placeholder {
    border-left: transparent 2px solid;
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  
  .remove-text-color {
    color: var(--uit-remove-text);
  }
  
  .cursor-move {
    cursor: move;
  }
  
  .cursor-drag:active {
    cursor: n-resize;
  }
  
  .relative {
    position: relative;
  }
  
  .absolute {
    position: absolute;
  }
  
  .picker {
    width: 100px;
    height: 20px;
  }
  
  .overflow-hidden {
    overflow: hidden;
  }
  
  .overflow-visible {
    overflow: visible;
  }
  
  .border-box {
    box-sizing: border-box;
  }
  
  .table-builder {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
    table-layout: fixed;
  }
  
  .table-builder thead {
    position: sticky;
    top: -1px;
    left: 0;
    background: linear-gradient(to left, #eff6ff, 30%, rgba(239, 246, 255, 0.5));
  }
  
  .table-builder-row-placeholder {
    height: 60px;
    min-height: 60px;
    max-height: 60px;
  }
  
  .table-builder tr,
  td {
    text-align: left;
  }
  
  .table-builder tr {
    border-radius: var(--uit-rounded-md);
    overflow: hidden;
  }
  
  .table-builder tbody tr td {
    background-color: var(--uit-component-bg);
    box-shadow: var(--uit-shadow-md);
    cursor: pointer;
  }
  
  .table-builder tr td:first-child[data-drag-hover="false"] {
    border-top-left-radius: var(--uit-rounded-md);
    border-bottom-left-radius: var(--uit-rounded-md);
    box-shadow: var(--uit-shadow-md);
  }
  
  .table-builder tr td:last-child[data-drag-hover="false"] {
    border-top-right-radius: var(--uit-rounded-md);
    border-bottom-right-radius: var(--uit-rounded-md);
  }
  
  .table-builder tr td:first-child[data-drag-hover="true"] {
    border-bottom-left-radius: var(--uit-rounded-md);
  }
  
  .table-builder tr td:last-child[data-drag-hover="true"] {
    border-bottom-right-radius: var(--uit-rounded-md);
  }
  
  .table-builder tr td {
    margin: var(--uit-space-2) var(--uit-space-0);
  }
  
  .sunny-text {
    color: var(--uit-sunny-text);
  }
  
  .moon-text {
    color: var(--uit-moon-text);
  }
  
  .contrast-on {
    color: var(--uit-contrast-on-text);
  }
  
  .contrast-off {
    color: var(--uit-contrast-off-text);
  }
  
  .table-builder {
    display: table;
  }
  
  .table-builder td[data-drag-hover="true"] {
    border-top: var(--uit-add-hover-border) 2px solid;
  }
  
  .table-builder tr[data-disable="true"] {
    background-color: var(--uit-base-background-disabled);
  }
  
  .table-builder td[data-disable="true"] {
    background-color: var(--uit-base-background-disabled);
  }
  
  .flag {
    background-color: var(--uit-palette-primary-200);
    color: var(--uit-palette-primary-800);
    border-radius: var(--uit-rounded-lg);
    padding: var(--uit-space-1) var(--uit-space-2);
    width: fit-content;
    font-size: 12px;
  }
  
  .padding-right-button {
    padding-right: var(--uit-space-4);
  }
  
  .wrap {
    flex-wrap: wrap;
  }
  
  .select-none {
    user-select: none;
    -webkit-user-select: none;
  }
  
  .color-picker {
    width: 280px;
    user-select: none;
    -webkit-user-select: none;
  
  }
  
  .text-no-wrap {
    white-space: nowrap;
  }
  
  .ellipsis {
    white-space: nowrap;
    text-overflow: "ellipsis";
    overflow: hidden;
  }
  
  .modal-enter {
    transform: translateX(100%);
  }
  
  .modal-enter-active {
    transform: translateX(0%);
    transition: transform 200ms;
  }
  
  .modal-exit {
    transform: translateX(0%);
  }
  
  .modal-exit-active {
    transform: translateX(100%);
    transition: transform 200ms;
  }
  
  .palette-color {
    border-radius: var(--uit-rounded-md);
    box-shadow: var(--uit-shadow-md);
    border: var(--uit-base-border) 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--uit-transition-base);
    overflow: hidden;
  }
  
  .table-transparent td {
    background-color: transparent !important;
    box-shadow: none !important;
  }
  
  .rounded-none {
    border-radius: 0px;
  }
  
  .rounded-md {
    border-radius: var(--uit-rounded-md);
  }
  
  .shadow-md {
    box-shadow: var(--uit-shadow-md);
  }
  
  .red {
    background-color: red;
  }
  
  .blue {
    background-color: blue;
  }
  
  .shrink {
    flex-shrink: 1;
  }
  
  .popover-selector-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--uit-space-7);
    border: 1px solid var(--uit-base-border);
    box-sizing: border-box;
    background-color: var(--uit-component-bg);
    border-radius: var(--uit-rounded-md);
    box-shadow: var(--uit-shadow-md);
    padding: var(--uit-space-2);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  
    overflow: hidden;
  }
  
  .popover-selector-button:hover[data-disabled="false"] {
    border: var(--uit-primary-outline-light-border) 1px solid;
  }
  
  .popover-selector-button[data-focus="true"] {
    border: var(--uit-primary-outline-border) 1px solid;
    outline: none;
  }
  
  .popover-selector-button.disabled {
    color: var(--uit-base-text-disabled);
    background-color: var(--uit-base-background-disabled);
    cursor: default;
  }
  
  .cursor-body {
    background-color: var(--uit-tooltip-bg);
    padding: var(--uit-space-3);
    border-radius: var(--uit-rounded-md);
    color: white;
  }
  
  .transform-tooltip {
    transform: translateY(-100px);
  }
  
  .rect-rounded-left {
    border-top-left-radius: var(--uit-rounded-md);
    border-bottom-left-radius: var(--uit-rounded-md);
  }
  
  .rect-rounded-top-right {
    border-top-right-radius: var(--uit-rounded-md);
  }
  
  .rect-rounded-bottom-right {
    border-bottom-right-radius: var(--uit-rounded-md);
  }
  
  .break-row {
    grid-column: 1 / -1;
  }
  
  .red-border {
    border: 2px solid red;
  }
  
  .tokens-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--uit-space-4);
    align-items: center;
  }
  
  .tokens-grid-sidepanel {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: var(--uit-space-4);
    align-items: center;
  }
  
  .border-bottom {
    border-bottom: 1px solid var(--uit-base-border);
  }
  
  .font-weight-default {
    font-weight: var(--uit-font-weight-default);
  }
  
  .separator {
    display: flex;
    height: 1px;
    min-height: 1px;
    max-height: 1px;
    background-color: var(--uit-base-border);
    box-sizing: border-box;
    }

  .action-text {
    color: var(--uit-tertiary-text);
    text-decoration-line: underline;
    text-decoration-color: var(--uit-tertiary-border);
    background-color: transparent;
    padding: 0px;
  }

  .action-text:hover {
    color: var(--uit-tertiary-hover-text);
    text-decoration-color: var(--uit-tertiary-hover-border);  
  }
`;
