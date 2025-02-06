import { useCurrentDesignSystem } from "./DesignSystemQueries";
import Loader from "../../ui/kit/Loader";
import SidebarDesignSystem from "./SidebarDesignSystem";
import BodyDesignSystem from "./BodyDesignSystem";
import styles from "./PageDesignSystem.module.css";
import {
  ActiveComponent,
  ComponentMode,
  DesignSystemContext,
} from "./DesignSystemContext";
import { useState } from "react";
import { DesignToken } from "../../domain/DesignSystemDomain";

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

  const colorTokens: DesignToken[] | undefined = designSystem?.palettes.flatMap(
    (palette) => {
      return palette.shades.map((shade) => {
        return {
          label: `palette-${palette.paletteName}-${shade.label}`,
          value: shade.color,
        } as DesignToken;
      });
    }
  );

  function findDesignSystemColor({
    label,
    defaultValue,
  }: {
    label: string;
    defaultValue?: string;
  }) {
    return (
      colorTokens?.find((token) => token.label === label)?.value ??
      defaultValue ??
      label
    );
  }

  if (isLoadingDesignSystem) return <Loader />;
  if (!designSystem) return null;

  return (
    <DesignSystemContext
      value={{
        activeComponent,
        setActiveComponent: handleSetActiveComponent,
        getActionButtonClassName,
        findDesignSystemColor,
        designSystem
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
