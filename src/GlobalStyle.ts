import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --uidt-palette-primary-50: #eff6ff;
    --uidt-palette-primary-100: #dbeafe;
    --uidt-palette-primary-200: #bfdbfe;
    --uidt-palette-primary-300: #93c5fd;
    --uidt-palette-primary-400: #60a5fa;
    --uidt-palette-primary-500: #3b82f6;
    --uidt-palette-primary-600: #2563eb;
    --uidt-palette-primary-700: #1d4ed8;
    --uidt-palette-primary-800: #1e40af;
    --uidt-palette-primary-900: #1e3a8a;
    --uidt-palette-primary-950: #172554;
  
    --uidt-palette-secondary-50: #fff7ed;
    --uidt-palette-secondary-100: #ffedd5;
    --uidt-palette-secondary-200: #fed7aa;
    --uidt-palette-secondary-300: #fdba74;
    --uidt-palette-secondary-400: #fb923c;
    --uidt-palette-secondary-500: #f97316;
    --uidt-palette-secondary-600: #ea580c;
    --uidt-palette-secondary-700: #c2410c;
    --uidt-palette-secondary-800: #9a3412;
    --uidt-palette-secondary-900: #7c2d12;
    --uidt-palette-secondary-950: #431407;
  
    --uidt-palette-positive-50: #f0fdf4;
    --uidt-palette-positive-100: #dcfce7;
    --uidt-palette-positive-200: #bbf7d0;
    --uidt-palette-positive-300: #86efac;
    --uidt-palette-positive-400: #4ade80;
    --uidt-palette-positive-500: #22c55e;
    --uidt-palette-positive-600: #16a34a;
    --uidt-palette-positive-700: #15803d;
    --uidt-palette-positive-800: #166534;
    --uidt-palette-positive-900: #14532d;
    --uidt-palette-positive-950: #052e16;
  
    --uidt-palette-warning-50: #fffbeb;
    --uidt-palette-warning-100: #fef3c7;
    --uidt-palette-warning-200: #fde68a;
    --uidt-palette-warning-300: #fcd34d;
    --uidt-palette-warning-400: #fbbf24;
    --uidt-palette-warning-500: #f59e0b;
    --uidt-palette-warning-600: #d97706;
    --uidt-palette-warning-700: #b45309;
    --uidt-palette-warning-800: #92400e;
    --uidt-palette-warning-900: #78350f;
    --uidt-palette-warning-950: #451a03;
  
    --uidt-palette-negative-50: #fff1f2;
    --uidt-palette-negative-100: #ffe4e6;
    --uidt-palette-negative-200: #fecdd3;
    --uidt-palette-negative-300: #fda4af;
    --uidt-palette-negative-400: #fb7185;
    --uidt-palette-negative-500: #f43f5e;
    --uidt-palette-negative-600: #e11d48;
    --uidt-palette-negative-700: #be123c;
    --uidt-palette-negative-800: #9f1239;
    --uidt-palette-negative-900: #881337;
    --uidt-palette-negative-950: #4c0519;
  
    --uidt-palette-gray-50: #fafafa;
    --uidt-palette-gray-100: #f4f4f5;
    --uidt-palette-gray-200: #e4e4e7;
    --uidt-palette-gray-300: #d4d4d8;
    --uidt-palette-gray-400: #a1a1aa;
    --uidt-palette-gray-500: #71717a;
    --uidt-palette-gray-600: #52525b;
    --uidt-palette-gray-700: #3f3f46;
    --uidt-palette-gray-800: #27272a;
    --uidt-palette-gray-900: #18181b;
    --uidt-palette-gray-950: #09090b;
  
    --uidt-palette-info-50: #f0fdfa;
    --uidt-palette-info-100: #ccfbf1;
    --uidt-palette-info-200: #99f6e4;
    --uidt-palette-info-300: #5eead4;
    --uidt-palette-info-400: #2dd4bf;
    --uidt-palette-info-500: #14b8a6;
    --uidt-palette-info-600: #0d9488;
    --uidt-palette-info-700: #0f766e;
    --uidt-palette-info-800: #115e59;
    --uidt-palette-info-900: #134e4a;
    --uidt-palette-info-950: #042f2e;
  
    --uidt-palette-single-white: #ffffff;
    --uidt-palette-single-black-transparent: rgb(24, 24, 27, 70%);
  
    --uidt-base-background: var(--uidt-palette-primary-50);
    --uidt-base-background-hover: var(--uidt-palette-primary-100);
    --uidt-base-border: var(--uidt-palette-gray-300);
    --uidt-base-text-light: var(--uidt-palette-gray-500);
    --uidt-base-text-default: var(--uidt-palette-gray-700);
    --uidt-base-text-dark: var(--uidt-palette-gray-900);
    --uidt-base-background-disabled: var(--uidt-palette-gray-50);
    --uidt-base-text-disabled: var(--uidt-palette-gray-300);
  
    --window-buttons-hover-bg: var(--uidt-palette-primary-200);
  
    --uidt-alert-bg: var(--uidt-palette-negative-700);
    --uidt-alert-text: var(--uidt-palette-negative-50);
    --uidt-alert-hover-bg: var(--uidt-palette-negative-900);
    --uidt-alert-hover-text: var(--uidt-palette-negative-50);
  
    --uidt-anchor-bg: var(--uidt-palette-negative-600);
  
    --uidt-alert-outline-bg: var(--uidt-palette-negative-50);
    --uidt-alert-outline-text: var(--uidt-palette-negative-800);
    --uidt-alert-outline-border: var(--uidt-palette-negative-700);
  
    --uidt-warning-outline-bg: var(--uidt-palette-warning-50);
    --uidt-warning-outline-text: var(--uidt-palette-warning-700);
    --uidt-warning-outline-border: var(--uidt-palette-warning-700);
  
    --uidt-component-bg: var(--uidt-palette-single-white);
    --uidt-component-text: var(--uidt-palette-gray-700);
    --uidt-component-border: var(--uidt-palette-gray-300);
    --uidt-component-hover-bg: var(--uidt-palette-gray-100);
    --uidt-component-hover-text: var(--uidt-palette-gray-900);
  
    --uidt-secondary-hover-bg: var(--uidt-palette-secondary-50);
    --uidt-secondary-hover-text: var(--uidt-palette-secondary-950);
  
  
    --uidt-sunny-text: var(--uidt-palette-secondary-700);
    --uidt-moon-text: var(--uidt-palette-primary-900);
    --uidt-contrast-off-text: var(--uidt-palette-gray-400);
    --uidt-contrast-on-text: var(--uidt-palette-primary-700);
  
    --uidt-tooltip-bg: rgb(23, 23, 23, 80%);
    --uidt-tooltip-text: var(--uidt-palette-single-white);
  
    --uidt-primary-bg: var(--uidt-palette-primary-800);
    --uidt-primary-text: var(--uidt-palette-single-white);
    --uidt-primary-border: var(--uidt-palette-primary-800);
    --uidt-primary-hover-bg: var(--uidt-palette-primary-900);
    --uidt-primary-hover-text: var(--uidt-palette-primary-50);
    --uidt-primary-hover-border: var(--uidt-palette-primary-950);
  
    --uidt-primary-outline-bg: var(--uidt-palette-primary-50);
    --uidt-primary-outline-text: var(--uidt-palette-primary-800);
    --uidt-primary-outline-border: var(--uidt-palette-primary-600);
    --uidt-primary-outline-hover-bg: var(--uidt-palette-primary-100);
    --uidt-primary-outline-hover-text: var(--uidt-palette-primary-950);
    --uidt-primary-outline-light-border: var(--uidt-palette-primary-300);
  
    --uidt-add-bg: var(--uidt-palette-primary-100);
    --uidt-add-text: var(--uidt-palette-primary-500);
    --uidt-add-border: var(--uidt-palette-primary-300);
    --uidt-add-hover-bg: var(--uidt-palette-primary-200);
    --uidt-add-hover-text: var(--uidt-palette-primary-800);
    --uidt-add-hover-border: var(--uidt-palette-primary-600);
  
    --uidt-add-base-text: var(--uidt-palette-primary-600);
    --uidt-add-base-border: var(--uidt-palette-primary-400);
    --uidt-add-base-hover-text: var(--uidt-palette-primary-900);
    --uidt-add-base-hover-border: var(--uidt-palette-primary-800);
    --uidt-add-base-active-text: var(--uidt-palette-primary-700);
    --uidt-add-base-active-border: var(--uidt-palette-primary-600);
  
    --uidt-remove-bg: var(--uidt-palette-negative-100);
    --uidt-remove-border: var(--uidt-palette-negative-300);
    --uidt-remove-text: var(--uidt-palette-negative-700);
    --uidt-remove-hover-text: var(--uidt-palette-negative-800);
    --uidt-remove-hover-border: var(--uidt-palette-negative-600);
  
    --uidt-locked-bg: var(--uidt-palette-gray-200);
    --uidt-drag-bg: var(--uidt-palette-primary-200);
    --uidt-drag-border: var(--uidt-palette-primary-600);
  
    --uidt-tertiary-bg: var(--uidt-palette-gray-100);
    --uidt-tertiary-text: var(--uidt-palette-gray-600);
    --uidt-tertiary-border: var(--uidt-palette-gray-300);
    --uidt-tertiary-hover-bg: var(--uidt-palette-gray-200);
    --uidt-tertiary-hover-text: var(--uidt-palette-gray-700);
    --uidt-tertiary-hover-border: var(--uidt-palette-gray-400);
  
    --uidt-base-button-hover-bg: rgb(212, 212, 216, 0.3);
    --uidt-base-button-active-bg: rgb(219, 234, 254, 1);
  
    --uidt-menu-button-bg: var(--uidt-palette-single-white);
    --uidt-menu-button-text: var(--uidt-palette-gray-700);
    --uidt-menu-button-hover-bg: var(--uidt-palette-gray-200);
    --uidt-menu-button-hover-text: var(--uidt-palette-gray-700);
  
    --uidt-menu-primary-button-bg: var(--uidt-palette-primary-100);
    --uidt-menu-primary-button-text: var(--uidt-palette-primary-800);
    --uidt-menu-primary-button-hover-bg: var(--uidt-palette-primary-200);
    --uidt-menu-primary-button-hover-text: var(--uidt-palette-primary-950);
  
    --uidt-action-button-bg: var(--uidt-palette-gray-50);
    --uidt-action-button-text: var(--uidt-palette-gray-500);
    --uidt-action-button-border: var(--uidt-palette-gray-200);
    --uidt-action-button-hover-text: var(--uidt-palette-gray-700);
    --uidt-action-button-hover-border: var(--uidt-palette-gray-400);
    --uidt-action-button-active-bg: var(--uidt-palette-primary-700);
    --uidt-action-button-active-text: var(--uidt-palette-primary-50);
    --uidt-action-button-active-hover-bg: var(--uidt-palette-primary-500);
    --uidt-action-button-negative-bg: var(--uidt-palette-negative-700);
    --uidt-action-button-negative-text: var(--uidt-palette-negative-50);
    --uidt-action-button-negative-hover-bg: var(--uidt-palette-negative-500);
  
    --uidt-modal-bg: var(--uidt-palette-single-black-transparent);
  
    --uidt-space-0: 0px;
    --uidt-space-1: 2px;
    --uidt-space-2: 4px;
    --uidt-space-3: 8px;
    --uidt-space-4: 12px;
    --uidt-space-5: 16px;
    --uidt-space-6: 20px;
    --uidt-space-7: 28px;
    --uidt-space-8: 32px;
    --uidt-space-9: 40px;
    --uidt-space-10: 52px;
    --uidt-space-11: 64px;
    --uidt-space-12: 80px;
    --uidt-space-13: 100px;
    --uidt-space-14: 120px;
    --uidt-space-15: 160px;
    --uidt-space-16: 200px;
    --uidt-space-17: 240px;
    --uidt-space-18: 280px;
    --uidt-space-19: 320px;
    --uidt-space-20: 360px;
  
    --uidt-shadow-button: rgba(0, 0, 0, 0.25) 0px 0px 1px 0px;
    --uidt-shadow-sm: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px;
    --uidt-shadow-md: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    --uidt-shadow-lg: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
      rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
    --uidt-shadow-inset: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  
    --uidt-font-weight-light: 400;
    --uidt-font-weight-default: 500;
    --uidt-font-weight-sm-bold: 600;
    --uidt-font-weight-bold: 700;
  
    --uidt-rounded-md: 4px;
    --uidt-rounded-lg: 8px;
    --uidt-rounded-full: 50%;
  
    --uidt-transition-base: transform 100ms ease-in-out;
  
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
      background-color: var(--uidt-palette-gray-500);
      border-radius: 6px;
    }
  
    /* Thumb hover */
    ::-webkit-scrollbar-thumb:hover {
      background-color: var(--uidt-palette-gray-500);
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
    background-color: var(--uidt-base-background);
    color: var(--uidt-base-text-default);
    font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    padding: var(--uidt-space-0);
    margin: var(--uidt-space-0);
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
    font-weight: var(--uidt-font-weight-bold);
    user-select: none;
    -webkit-user-select: none;
  }
  
  h2 {
    font-size: 40px;
    line-height: 44px;
    margin: 0px;
    font-weight: var(--uidt-font-weight-bold);
    user-select: none;
    -webkit-user-select: none;
  
  }
  
  h3 {
    font-size: 28px;
    line-height: 32px;
    margin: 0px;
    font-weight: var(--uidt-font-weight-bold);
    user-select: none;
    -webkit-user-select: none;
  
  }
  
  h4 {
    font-size: 24px;
    line-height: 28px;
    margin: 0px;
    font-weight: var(--uidt-font-weight-sm-bold);
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
    font-weight: var(--uidt-font-weight-sm-bold);
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
    font-weight: var(--uidt-font-weight-sm-bold);
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
  
    font-weight: var(--uidt-font-weight-bold);
  }
  
  label {
    color: var(--uidt-base-text-light);
    font-weight: var(--uidt-font-weight-bold);
  }
  
  .bold {
    font-weight: var(--uidt-font-weight-bold);
  }
  
  .underline {
    text-decoration: underline;
    text-underline-offset: var(--uidt-space-2);
  }
  
  button {
    font-size: 14px;
    line-height: 16px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: var(--uidt-space-2);
    gap: var(--uidt-space-2);
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
    gap: var(--uidt-space-0);
  }
  
  .gap-1 {
    gap: var(--uidt-space-1);
  }
  
  .gap-2 {
    gap: var(--uidt-space-2);
  }
  
  .gap-3 {
    gap: var(--uidt-space-3);
  }
  
  .gap-4 {
    gap: var(--uidt-space-4);
  }
  
  .gap-5 {
    gap: var(--uidt-space-5);
  }
  
  .gap-6 {
    gap: var(--uidt-space-6);
  }
  
  .gap-7 {
    gap: var(--uidt-space-7);
  }
  
  .gap-8 {
    gap: var(--uidt-space-8);
  }
  
  .gap-9 {
    gap: var(--uidt-space-9);
  }
  
  .gap-10 {
    gap: var(--uidt-space-10);
  }
  
  /* Padding classes */
  .p-0 {
    padding: var(--uidt-space-0);
  }
  
  .p-1 {
    padding: var(--uidt-space-1);
  }
  
  .p-2 {
    padding: var(--uidt-space-2);
  }
  
  .py-2 {
    padding-top: var(--uidt-space-2);
    padding-bottom: var(--uidt-space-2);
  }
  
  .p-3 {
    padding: var(--uidt-space-3);
  }
  
  .py-3 {
    padding: var(--uidt-space-3) var(--uidt-space-0);
  }
  
  .p-4 {
    padding: var(--uidt-space-4);
  }
  
  .px-4 {
    padding-left: var(--uidt-space-4);
    padding-right: var(--uidt-space-4);
  }
  
  .p-5 {
    padding: var(--uidt-space-5);
  }
  
  .p-6 {
    padding: var(--uidt-space-6);
  }
  
  .p-7 {
    padding: var(--uidt-space-7);
  }
  
  .py-7 {
    padding-top: var(--uidt-space-7);
    padding-bottom: var(--uidt-space-7);
  }
  
  .px-7 {
    padding-left: var(--uidt-space-7);
    padding-right: var(--uidt-space-7);
  }
  
  .p-8 {
    padding: var(--uidt-space-8);
  }
  
  .px-8 {
    padding-left: var(--uidt-space-8);
    padding-right: var(--uidt-space-8);
  }
  
  .p-9 {
    padding: var(--uidt-space-9);
  }
  
  .p-10 {
    padding: var(--uidt-space-10);
  }
  
  /* Margin classes */
  .m-0 {
    margin: var(--uidt-space-0);
  }
  
  .m-1 {
    margin: var(--uidt-space-1);
  }
  
  .m-2 {
    margin: var(--uidt-space-2);
  }
  
  .m-3 {
    margin: var(--uidt-space-3);
  }
  
  .m-4 {
    margin: var(--uidt-space-4);
  }
  
  .m-5 {
    margin: var(--uidt-space-5);
  }
  
  .m-6 {
    margin: var(--uidt-space-6);
  }
  
  .m-7 {
    margin: var(--uidt-space-7);
  }
  
  .m-8 {
    margin: var(--uidt-space-8);
  }
  
  .m-9 {
    margin: var(--uidt-space-9);
  }
  
  .m-10 {
    margin: var(--uidt-space-10);
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
    box-shadow: var(--uidt-shadow-md);
  }
  
  .shadow-lg {
    box-shadow: var(--uidt-shadow-lg);
  }
  
  .shadow-inset {
    box-shadow: var(--uidt-shadow-inset);
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
    color: var(--uidt-base-text-light);
  }
  
  .text-color-default {
    color: var(--uidt-base-text-default);
  }
  
  .text-color-dark {
    color: var(--uidt-base-text-dark);
  }
  
  .uidt-text-color-light {
    color: var(--uidt-base-text-light);
  }
  
  .uidt-text-color-default {
    color: var(--uidt-base-text-default);
  }
  
  .uidt-text-color-dark {
    color: var(--uidt-base-text-dark);
  }
  
  .uidt-text-color-primary {
    color: var(--uidt-primary-outline-text);
  }
  
  .h-100 {
    height: 100%;
  }
  
  .menu-button {
    background-color: var(--uidt-menu-button-bg);
    color: var(--uidt-menu-button-text);
    cursor: pointer;
    padding: var(--uidt-space-2);
    border-radius: var(--uidt-rounded-md);
    box-shadow: var(--uidt-shadow-md);
    font-weight: var(--uidt-font-weight-default);
  }
  
  .menu-button:hover {
    background-color: var(--uidt-menu-button-hover-bg);
    color: var(--uidt-menu-button-hover-text);
  }
  
  .menu-primary-button {
    background-color: var(--uidt-menu-primary-button-bg);
    color: var(--uidt-menu-primary-button-text);
    cursor: pointer;
    padding: var(--uidt-space-2);
    border-radius: var(--uidt-rounded-md);
    box-shadow: var(--uidt-shadow-md);
    font-weight: var(--uidt-font-weight-default);
  }
  
  .menu-primary-button:hover {
    background-color: var(--uidt-menu-primary-button-hover-bg);
    color: var(--uidt-menu-primary-button-hover-text);
  }
  
  .action-button {
    background-color: var(--uidt-action-button-bg);
    color: var(--uidt-action-button-text);
    border: var(--uidt-action-button-border) 1px solid;
    padding: var(--uidt-space-2);
    border-radius: var(--uidt-rounded-md);
    height: fit-content;
  }
  
  .action-button:hover {
    color: var(--uidt-action-button-hover-text);
    box-shadow: var(--uidt-shadow-button);
  }
  
  .action-ghost-button {
    background-color: transparent;
    color: var(--uidt-action-button-text);
    padding: var(--uidt-space-2);
    border-radius: var(--uidt-rounded-md);
    height: fit-content;
  }
  
  .action-ghost-button:hover {
    background-color: var(--uidt-base-button-hover-bg);
    box-shadow: transparent;
    color: var(--uidt-action-button-hover-text);
  }
  
  .action-ghost-button:disabled {
    color: var(--uidt-base-text-disabled);
    background-color: transparent;
    cursor: default;
  }
  
  .action-button:disabled {
    color: var(--uidt-base-background-disabled);
    box-shadow: var(--uidt-base-background-text);
    cursor: default;
  }
  
  .action-ghost-button[data-active="true"] {
    background-color: var(--uidt-action-button-active-bg);
    color: var(--uidt-action-button-active-text);
  }
  
  .action-ghost-button[data-active="true"]:hover {
    background-color: var(--uidt-action-button-active-bg);
    color: var(--uidt-action-button-active-text);
  }
  
  .action-button.active {
    background-color: var(--uidt-action-button-active-bg);
    color: var(--uidt-action-button-active-text);
    box-shadow: var(--uidt-shadow-button);
  }
  
  .action-button.active:hover {
    background-color: var(--uidt-action-button-active-hover-bg);
  }
  
  .action-button.negative {
    background-color: var(--uidt-action-button-negative-bg);
    color: var(--uidt-action-button-negative-text);
    box-shadow: var(--uidt-shadow-button);
  }
  
  .action-button.negative:hover {
    background-color: var(--uidt-action-button-negative-hover-bg);
  }
  
  .text-tertiary-button {
    color: var(--uidt-base-text-light);
    cursor: pointer;
  }
  
  .text-tertiary-button:hover {
    color: var(--uidt-base-text-dark);
  }
  
  .add-button {
    display: flex;
    align-items: center;
    padding: var(--uidt-space-2);
    background-color: transparent;
    border: dashed 2px var(--uidt-add-border);
    color: var(--uidt-add-text);
    border-radius: var(--uidt-rounded-md);
    font-weight: var(--uidt-font-weight-default);
  }
  
  .button-height-l {
    height: var(--uidt-space-9);
  }
  
  .add-button:disabled {
    background-color: transparent;
    border: dashed 2px var(--uidt-base-background-disabled);
    color: var(--uidt-base-text-disabled);
    cursor: not-allowed;
  }
  
  .add-button:disabled {
    background-color: transparent;
    border: dashed 2px var(--uidt-base-background-disabled);
    color: var(--uidt-base-text-disabled);
    cursor: not-allowed;
  }
  
  .add-button:disabled:hover {
    background-color: transparent;
    border: dashed 2px var(--uidt-base-background-disabled);
    color: var(--uidt-base-text-disabled);
  }
  
  .add-button:hover {
    border: dashed 2px var(--uidt-add-hover-border);
    color: var(--uidt-add-hover-text);
  }
  
  .add-base-button {
    display: flex;
    align-items: center;
    padding: var(--uidt-space-2);
    background-color: transparent;
    border: dashed 2px var(--uidt-add-base-border);
    color: var(--uidt-add-base-text);
    border-radius: var(--uidt-rounded-md);
    font-weight: var(--uidt-font-weight-default);
  }
  
  .add-base-button:hover {
    border: dashed 2px var(--uidt-add-base-hover-border);
    color: var(--uidt-add-base-hover-text);
  }
  
  .add-base-button.active {
    border: dashed 2px var(--uidt-add-base-active-border);
    color: var(--uidt-add-base-active-text);
    box-shadow: var(--uidt-shadow-md);
  }
  
  .remove-button {
    display: flex;
    align-items: center;
    padding: var(--uidt-space-2);
    background-color: transparent;
    border: dashed 2px var(--uidt-remove-border);
    color: var(--uidt-remove-text);
    border-radius: var(--uidt-rounded-md);
    font-weight: var(--uidt-font-weight-default);
  }
  
  .remove-button:hover {
    border: dashed 2px var(--uidt-remove-hover-border);
    color: var(--uidt-remove-hover-text);
  }
  
  .inherit-select {
    padding: var(--uidt-space-0) var(--uidt-space-0);
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
  
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
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
    padding: var(--uidt-space-1) var(--uidt-space-0);
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
    border: 1px solid var(--uidt-base-border);
    background-color: var(--uidt-component-bg);
    border-radius: var(--uidt-rounded-md);
    box-shadow: var(--uidt-shadow-sm);
    font-size: inherit;
    height: var(--uidt-space-7);
    width: fit-content;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  
  .uidt-input-hover-background:hover {
    background-color: var(--uidt-primary-outline-bg);
  }
  
  .input-hover {
    border-bottom: var(--uidt-primary-outline-light-border) 0px solid;
    padding: var(--uidt-space-2) var(--uidt-space-0);
  }
  
  .input-hover:hover {
    border-bottom: var(--uidt-primary-outline-light-border) 1px solid;
  }
  
  .uidt-input:hover {
    border: var(--uidt-primary-outline-light-border) 1px solid;
  }
  
  .uidt-input[data-readonly="true"]:hover {
    border: 1px solid var(--uidt-base-border);
  }
  
  .uidt-input:focus-within {
    border: var(--uidt-primary-outline-border) 1px solid;
  }
  
  .uidt-input-select:hover {
    border: none;
  }
  
  .uidt-input-select:focus {
    border: none;
  }
  
  select {
    padding: var(--uidt-space-2) var(--uidt-space-0);
    margin: 0;
    border: 1px solid var(--uidt-base-border);
    box-sizing: border-box;
    background-color: var(--uidt-component-bg);
    border-radius: var(--uidt-rounded-md);
    box-shadow: var(--uidt-shadow-md);
  }
  
  select:hover {
    border: var(--uidt-primary-outline-light-border) 1px solid;
  }
  
  select:focus-within {
    border: var(--uidt-primary-outline-border) 1px solid;
    outline: none;
  }
  
  .inherit-input-placeholder {
    padding: var(--uidt-space-1) var(--uidt-space-0);
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
    border-bottom: var(--uidt-primary-outline-light-border) 1px solid;
  }
  
  .inherit-input:focus {
    border-bottom: var(--uidt-primary-outline-border) 1px solid;
  }
  
  .empty-border {
    border-bottom: var(--uidt-base-border) 1px transparent !important;
  }
  
  .empty-border:hover {
    border-bottom: var(--uidt-base-border) 1px transparent !important;
  }
  
  .empty-border:focus {
    border-bottom: var(--uidt-base-border) 1px transparent !important;
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
    accent-color: var(--uidt-palette-primary-500);
  }
  
  .input-standard {
    padding: 8px;
    height: 48px;
    border: 1px solid transparent;
    background-color: var(--uidt-component-bg);
    border-radius: var(--uidt-rounded-md);
    box-shadow: var(--uidt-shadow-sm);
    font-size: inherit;
    height: var(--uidt-space-7);
    box-sizing: border-box;
  }
  
  .input-standard:focus {
    outline: var(--uidt-primary-outline-border) 1px solid;
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
    color: var(--uidt-alert-outline-text);
  }
  
  .copyable-label {
    background-color: var(--uidt-tertiary-bg);
    color: var(--uidt-tertiary-text);
    padding: var(--uidt-space-2) var(--uidt-space-3);
    cursor: pointer;
    display: flex;
    gap: var(--uidt-space-2);
    align-items: center;
    width: fit-content;
    border-radius: var(--uidt-rounded-md);
    font-family: "Consolas";
    box-shadow: var(--uidt-shadow-sm);
    overflow: hidden;
    max-width: 200px;
  }
  
  .copyable-label:hover {
    background-color: var(--uidt-tertiary-hover-bg);
    color: var(--uidt-tertiary-hover-text);
  }
  
  .popover-body {
    display: flex;
    flex-direction: column;
    padding: var(--uidt-space-3);
    gap: var(--uidt-space-3);
    justify-content: end;
  }
  
  .checkbox-container {
    display: flex;
    align-items: center;
    gap: var(--uidt-space-2);
    color: var(--uidt-base-text-light);
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
    border-bottom: var(--uidt-add-border) 2px solid;
    border-radius: 0px;
    cursor: pointer;
  }
  
  .locked:hover {
    background-color: var(--uidt-locked-bg);
  }
  
  .add-right:hover {
    border-right: var(--uidt-add-border) 2px solid;
    border-radius: 0px;
    cursor: pointer;
  }
  
  .remove {
    background-color: var(--uidt-remove-bg);
    cursor: pointer;
  }
  
  .remove-hover:hover {
    background-color: var(--uidt-remove-bg);
    cursor: pointer;
  }
  
  .draggable {
    background-color: var(--uidt-drag-bg);
    cursor: pointer;
  }
  
  .drag-hover-top:hover {
    border-top: var(--uidt-add-border) 2px solid;
    border-radius: 0px;
    cursor: pointer;
  }
  
  .drag-hover-left {
    border-left:  2px solid var(--uidt-add-border);
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
    color: var(--uidt-remove-text);
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
    border-radius: var(--uidt-rounded-md);
    overflow: hidden;
  }
  
  .table-builder tbody tr td {
    background-color: var(--uidt-component-bg);
    box-shadow: var(--uidt-shadow-md);
    cursor: pointer;
  }
  
  .table-builder tr td:first-child[data-drag-hover="false"] {
    border-top-left-radius: var(--uidt-rounded-md);
    border-bottom-left-radius: var(--uidt-rounded-md);
    box-shadow: var(--uidt-shadow-md);
  }
  
  .table-builder tr td:last-child[data-drag-hover="false"] {
    border-top-right-radius: var(--uidt-rounded-md);
    border-bottom-right-radius: var(--uidt-rounded-md);
  }
  
  .table-builder tr td:first-child[data-drag-hover="true"] {
    border-bottom-left-radius: var(--uidt-rounded-md);
  }
  
  .table-builder tr td:last-child[data-drag-hover="true"] {
    border-bottom-right-radius: var(--uidt-rounded-md);
  }
  
  .table-builder tr td {
    margin: var(--uidt-space-2) var(--uidt-space-0);
  }
  
  .sunny-text {
    color: var(--uidt-sunny-text);
  }
  
  .moon-text {
    color: var(--uidt-moon-text);
  }
  
  .contrast-on {
    color: var(--uidt-contrast-on-text);
  }
  
  .contrast-off {
    color: var(--uidt-contrast-off-text);
  }
  
  .table-builder {
    display: table;
  }
  
  .table-builder td[data-drag-hover="true"] {
    border-top: var(--uidt-add-hover-border) 2px solid;
  }
  
  .table-builder tr[data-disable="true"] {
    background-color: var(--uidt-base-background-disabled);
  }
  
  .table-builder td[data-disable="true"] {
    background-color: var(--uidt-base-background-disabled);
  }
  
  .flag {
    background-color: var(--uidt-palette-primary-200);
    color: var(--uidt-palette-primary-800);
    border-radius: var(--uidt-rounded-lg);
    padding: var(--uidt-space-1) var(--uidt-space-2);
    width: fit-content;
    font-size: 12px;
  }
  
  .padding-right-button {
    padding-right: var(--uidt-space-4);
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
    border-radius: var(--uidt-rounded-md);
    box-shadow: var(--uidt-shadow-md);
    border: var(--uidt-base-border) 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--uidt-transition-base);
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
    border-radius: var(--uidt-rounded-md);
  }
  
  .shadow-md {
    box-shadow: var(--uidt-shadow-md);
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
    height: var(--uidt-space-7);
    border: 1px solid var(--uidt-base-border);
    box-sizing: border-box;
    background-color: var(--uidt-component-bg);
    border-radius: var(--uidt-rounded-md);
    box-shadow: var(--uidt-shadow-md);
    padding: var(--uidt-space-2);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  
    overflow: hidden;
  }
  
  .popover-selector-button:hover[data-disabled="false"] {
    border: var(--uidt-primary-outline-light-border) 1px solid;
  }
  
  .popover-selector-button[data-focus="true"] {
    border: var(--uidt-primary-outline-border) 1px solid;
    outline: none;
  }
  
  .popover-selector-button.disabled {
    color: var(--uidt-base-text-disabled);
    background-color: var(--uidt-base-background-disabled);
    cursor: default;
  }
  
  .cursor-body {
    background-color: var(--uidt-tooltip-bg);
    padding: var(--uidt-space-3);
    border-radius: var(--uidt-rounded-md);
    color: white;
  }
  
  .transform-tooltip {
    transform: translateY(-100px);
  }
  
  .rect-rounded-left {
    border-top-left-radius: var(--uidt-rounded-md);
    border-bottom-left-radius: var(--uidt-rounded-md);
  }
  
  .rect-rounded-top-right {
    border-top-right-radius: var(--uidt-rounded-md);
  }
  
  .rect-rounded-bottom-right {
    border-bottom-right-radius: var(--uidt-rounded-md);
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
    gap: var(--uidt-space-4);
    align-items: center;
  }
  
  .tokens-grid-sidepanel {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: var(--uidt-space-4);
    align-items: center;
  }
  
  .border-bottom {
    border-bottom: 1px solid var(--uidt-base-border);
  }
  
  .font-weight-default {
    font-weight: var(--uidt-font-weight-default);
  }
  
  .separator {
    display: flex;
    height: 1px;
    min-height: 1px;
    max-height: 1px;
    background-color: var(--uidt-base-border);
    box-sizing: border-box;
    }
`;