import { createContext, useContext } from "react";
import { DesignSystem, DesignToken, Theme, TokenFamily } from "../../domain/DesignSystemDomain";

export type ComponentMode =
  | "add"
  | "edit"
  | "remove"
  | "delete"
  | "drag"
  | "default"
  | "drag-hover";

export type EffectsPopoverMode = "default" | "drag" | "remove";

export const ModificationsMode: ComponentMode[] = [
  "edit",
  "add",
  "remove",
  "drag",
];

export type ActiveComponent = {
  componentId: string;
  mode: ComponentMode;
};

export type DesignSystemContextType = {
  activeComponent?: ActiveComponent;
  setActiveComponent: (activeComponent: ActiveComponent) => void;
  findDesignSystemColor: (props: {
    label?: string;
    defaultValue?: string;
  }) => string | undefined;
  designSystem: DesignSystem;
  editMode: boolean;
  colorTokens?: DesignToken[];
  tokenFamilies: TokenFamily[];
  theme: Theme | undefined;
  themeTokenFamilies: TokenFamily[];
  setTheme: (theme: Theme | undefined) => void;
};

export const DesignSystemContext =
  createContext<DesignSystemContextType | null>(null);

export function useDesignSystemContext() {
  const context = useContext(DesignSystemContext);
  if (!context)
    throw new Error("Design system context was used outside of his scope");
  return context;
}
