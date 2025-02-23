import {
  useCurrentDesignSystem,
  useSaveDesignSystem,
} from "./DesignSystemQueries";
import Loader from "../../ui/kit/Loader";
import SidebarDesignSystem from "./SidebarDesignSystem";
import BodyDesignSystem from "./BodyDesignSystem";
import styles from "./PageDesignSystem.module.css";
import {
  ActiveComponent,
  ComponentMode,
  DesignSystemContext,
} from "./DesignSystemContext";
import { useEffect, useState } from "react";
import { DesignToken } from "../../domain/DesignSystemDomain";
import { isValidCssColorOrGradient } from "../../util/DesignSystemUtils";
import { useParams, useSearchParams } from "react-router-dom";

function DesignSystemPage() {
  const { designSystem, isLoadingDesignSystem } = useCurrentDesignSystem();
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const [activeComponent, setActiveComponent] = useState<
    ActiveComponent | undefined
  >(undefined);
  const [searchParams] = useSearchParams();
  const editMode: boolean = JSON.parse(
    searchParams.get("editMode") || "false"
  ) as boolean;

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
    label?: string;
    defaultValue?: string;
  }) {
    return (
      colorTokens?.find((token) => token.label === label)?.value ??
      isValidCssColorOrGradient(label) ??
      defaultValue
    );
  }

  function getMode(componentId: string): ComponentMode {
    if (
      activeComponent?.componentId === componentId ||
      activeComponent?.componentId === "all"
    ) {
      return activeComponent.mode;
    } else {
      return "default";
    }
  }

  const shadesMode: ComponentMode = getMode("shades");

  const palettesMode: ComponentMode = getMode("palettes");

  const themesMode: ComponentMode = getMode("themes");

  const baseMode: ComponentMode = getMode("base");

  const fontsMode: ComponentMode = getMode("fonts");

  const typographyMode: ComponentMode = getMode("typography");

  const spacesMode: ComponentMode = getMode("spaces");

  const radiusMode: ComponentMode = getMode("radius");

  const effectsMode: ComponentMode = getMode("effects");

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        if (designSystem?.metadata.isTmp) {
          saveDesignSystem({
            designSystem,
            isTmp: false,
          });
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [designSystem, saveDesignSystem]);

  if (isLoadingDesignSystem) return <Loader />;
  if (!designSystem) return null;

  return (
    <DesignSystemContext
      value={{
        activeComponent,
        setActiveComponent: handleSetActiveComponent,
        getActionButtonClassName,
        findDesignSystemColor,
        designSystem,
        palettesMode,
        shadesMode,
        themesMode,
        baseMode,
        fontsMode,
        typographyMode,
        spacesMode,
        radiusMode,
        effectsMode,
        editMode,
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
