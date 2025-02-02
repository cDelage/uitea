import { useCurrentDesignSystem } from "./DesignSystemQueries";
import Loader from "../../ui/kit/Loader";
import SidebarDesignSystem from "./SidebarDesignSystem";
import BodyDesignSystem from "./BodyDesignSystem";
import styles from "./DesignSystemPage.module.css";
import {
  ActiveComponent,
  ComponentMode,
  DesignSystemContext,
} from "./DesignSystemContext";
import { useState } from "react";

function DesignSystemPage() {
  const { designSystem, isLoadingDesignSystem } = useCurrentDesignSystem();
  const [activeComponent, setActiveComponent] = useState<
    ActiveComponent | undefined
  >(undefined);

  function handleSetActiveComponent(newActiveComponent?: ActiveComponent) {
    setActiveComponent((active) =>
      active?.componentId === newActiveComponent?.componentId &&
      active?.mode === newActiveComponent?.mode
        ? undefined
        : newActiveComponent
    );
  }

  function getActionButtonClassName(
    mode: ComponentMode,
    componentId: string,
    activeComponent: ActiveComponent | undefined
  ) {
    let buttonClassName = "action-button ";
    if (activeComponent?.componentId === componentId) {
      if (activeComponent.mode === mode) {
        if (mode !== "remove" && mode !== "delete") {
          buttonClassName += "active";
        } else {
          buttonClassName += "negative";
        }
      }
    }

    return buttonClassName;
  }

  if (isLoadingDesignSystem) return <Loader />;
  if (!designSystem) return null;

  return (
    <DesignSystemContext
      value={{
        activeComponent,
        setActiveComponent: handleSetActiveComponent,
        getActionButtonClassName,
      }}
    >
      <div className={styles.designSystemPage}>
        <SidebarDesignSystem />
        <BodyDesignSystem />
      </div>
    </DesignSystemContext>
  );
}

export default DesignSystemPage;
