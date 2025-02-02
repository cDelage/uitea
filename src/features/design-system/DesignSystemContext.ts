import { createContext, useContext } from "react";

export type ComponentMode = "add" | "edit" | "remove" | "delete" | "drag" | "default";

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
};

export const DesignSystemContext =
  createContext<DesignSystemContextType | null>(null);

export function useDesignSystemContext() {
  const context = useContext(DesignSystemContext);
  if (!context)
    throw new Error("Design system context was used outside of his scope");
  return context;
}
