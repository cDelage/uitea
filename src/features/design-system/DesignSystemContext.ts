import { createContext, useContext } from "react";
import { DesignSystem } from "../../domain/DesignSystemDomain";

export type ComponentMode =
  | "add"
  | "edit"
  | "remove"
  | "delete"
  | "drag"
  | "default";

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
    label: string;
    defaultValue?: string;
  }) => string;
  designSystem: DesignSystem;
};

export const DesignSystemContext =
  createContext<DesignSystemContextType | null>(null);

export function useDesignSystemContext() {
  const context = useContext(DesignSystemContext);
  if (!context)
    throw new Error("Design system context was used outside of his scope");
  return context;
}
