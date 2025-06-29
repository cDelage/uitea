import { createContext, useContext } from "react";

export type TabsContextType = {
  openId: string | undefined;
  setOpenId: (id: string) => void;
};

export const TabsContext = createContext<TabsContextType | undefined>(
  undefined
);

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContext was used outside of his scope");
  return context;
}
