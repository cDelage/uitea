import { cloneElement, ReactElement, ReactNode, useState } from "react";
import { TabsContext, useTabsContext } from "./TabsContext";

function Tabs({
  children,
  defaultTab,
}: {
  children: ReactNode;
  defaultTab: string;
}) {
  const [openId, setOpenId] = useState<string | undefined>(defaultTab);
  return (
    <TabsContext
      value={{
        openId,
        setOpenId,
      }}
    >
      {children}
    </TabsContext>
  );
}

function Tab({ children, id }: { children: ReactNode; id: string }) {
  const { openId, setOpenId } = useTabsContext();
  return cloneElement(
    children as ReactElement<{ onClick?: () => void; "data-active": string }>,
    {
      onClick: () => setOpenId(id),
      "data-active": openId === id ? "true" : "false",
    }
  );
}

function TabBody({ children, id }: { children: ReactNode; id: string }) {
  const { openId } = useTabsContext();
  if (openId !== id) return null;
  return children;
}

Tabs.Tab = Tab;
Tabs.TabBody = TabBody;
export default Tabs;
