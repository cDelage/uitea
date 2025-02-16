import { createContext, useContext } from "react";
import { DesignSystem } from "../../domain/DesignSystemDomain";

export type ComponentMode =
  | "add"
  | "edit"
  | "remove"
  | "delete"
  | "drag"
  | "default";

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
  getActionButtonClassName: (
    mode: ComponentMode,
    componentId: string,
    activeComponent: ActiveComponent | undefined
  ) => string;
  findDesignSystemColor: (props: {
    label?: string;
    defaultValue?: string;
  }) => string | undefined;
  designSystem: DesignSystem;
  palettesMode: ComponentMode;
  shadesMode: ComponentMode;
  themesMode: ComponentMode;
  baseMode: ComponentMode;
  fontsMode: ComponentMode;
  typographyMode: ComponentMode;
};

export const DesignSystemContext =
  createContext<DesignSystemContextType | null>(null);

export function useDesignSystemContext() {
  const context = useContext(DesignSystemContext);
  if (!context)
    throw new Error("Design system context was used outside of his scope");
  return context;
}
