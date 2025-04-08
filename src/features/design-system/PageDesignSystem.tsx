import {
  useCurrentDesignSystem,
  useSaveDesignSystem,
} from "./DesignSystemQueries";
import Loader from "../../ui/kit/Loader";
import SidebarDesignSystem from "./SidebarDesignSystem";
import BodyDesignSystem from "./BodyDesignSystem";
import styles from "./PageDesignSystem.module.css";
import { ActiveComponent, DesignSystemContext } from "./DesignSystemContext";
import { useEffect, useState } from "react";
import { DesignToken } from "../../domain/DesignSystemDomain";
import {
  isValidCssColorOrGradient,
  KEYBOARD_ACTIONS,
} from "../../util/DesignSystemUtils";
import { useParams, useSearchParams } from "react-router-dom";

function PageDesignSystem() {
  const { designSystem, isLoadingDesignSystem } = useCurrentDesignSystem();
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const [activeComponent, setActiveComponent] = useState<
    ActiveComponent | undefined
  >(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!event.repeat && KEYBOARD_ACTIONS.includes(event.key.toLowerCase())) {
        const target = event.target as HTMLElement;

        if (
          (target.tagName.toLowerCase() === "input" ||
            target.tagName.toLowerCase() === "textarea") &&
          target === document.activeElement
        ) {
          return; // On ignore le keydown
        }
        searchParams.set("keyboardAction", event.key.toLowerCase());
        setSearchParams(searchParams);
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (
        searchParams.get("keyboardAction") &&
        KEYBOARD_ACTIONS.includes(event.key.toLowerCase())
      ) {
        searchParams.delete("keyboardAction");
        setSearchParams(searchParams);
      }
    }

    // On écoute les événements sur la fenêtre entière
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // On nettoie en retirant les listeners à la fin du cycle de vie
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [searchParams, setSearchParams]);

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
        findDesignSystemColor,
        designSystem,
        editMode,
        colorTokens,
      }}
    >
      <div className={styles.designSystemPage}>
        <SidebarDesignSystem />
        <BodyDesignSystem />
      </div>
    </DesignSystemContext>
  );
}

export default PageDesignSystem;
