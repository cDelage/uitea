import {
  useCurrentDesignSystem,
  useSaveDesignSystem,
} from "./DesignSystemQueries";
import Loader from "../../ui/kit/Loader";
import SidebarDesignSystem from "./SidebarDesignSystem";
import BodyDesignSystem from "./BodyDesignSystem";
import styles from "./PageDesignSystem.module.css";
import { ActiveComponent, DesignSystemContext } from "./DesignSystemContext";
import { useEffect, useMemo, useState } from "react";
import { ColorCombination, DesignToken, Theme, TokenFamily } from "../../domain/DesignSystemDomain";
import {
  getDesignSystemTokens,
  getPaletteTokens,
  KEYBOARD_ACTIONS,
} from "../../util/DesignSystemUtils";
import { useParams, useSearchParams } from "react-router-dom";
import { recolorPalettes } from "../../util/ThemeGenerator";

function PageDesignSystem() {
  const { designSystem, isLoadingDesignSystem } = useCurrentDesignSystem();
  const { designSystemPath } = useParams();
  const { saveDesignSystem, isSavingDesignSystem } =
    useSaveDesignSystem(designSystemPath);
  const [activeComponent, setActiveComponent] = useState<
    ActiveComponent | undefined
  >(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
  const editMode: boolean = JSON.parse(
    searchParams.get("editMode") || "false"
  ) as boolean;
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  function handleSetActiveComponent(newActiveComponent?: ActiveComponent) {
    setActiveComponent((active) =>
      active?.componentId === newActiveComponent?.componentId &&
      active?.mode === newActiveComponent?.mode
        ? undefined
        : newActiveComponent
    );
  }

  const colorTokens: DesignToken[] | undefined =
    designSystem?.palettes.flatMap(getPaletteTokens);

  const tokenFamilies: TokenFamily[] = useMemo(
    () => getDesignSystemTokens(designSystem),
    [designSystem]
  );

  const themeTokenFamilies: TokenFamily[] = useMemo(() => {
    return theme !== undefined && designSystem !== undefined
      ? getDesignSystemTokens({
          ...designSystem,
          palettes: recolorPalettes({
            palettes: designSystem?.palettes,
            defaultBackground:
              designSystem?.themes.mainTheme?.background ?? "#DDDDDD",
            newBackground: theme?.background ?? "#DDDDDD",
          }),
        })
      : tokenFamilies;
  }, [designSystem, theme, tokenFamilies]);

  const defaultCombination = useMemo<ColorCombination>(() => {
    if (designSystem?.semanticColorTokens.colorCombinationCollections.length) {
      const collection =
        designSystem?.semanticColorTokens.colorCombinationCollections.find(
          (collection) => collection.defaultCombination
        )?.default ??
        designSystem?.semanticColorTokens.colorCombinationCollections.find(
          (collection) => collection.default
        )?.default;
      if (collection) return collection;
    }
    return {
      background: "uidt-primary-bg",
      text: "uidt-primary-text",
    };
  }, [designSystem]);

  useEffect(() => {
    const clearKeyboardAction = () => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (next.has("keyboardAction")) {
          next.delete("keyboardAction");
        }
        return next;
      });
    };

    function handleKeyDown(event: KeyboardEvent) {
      if (
        !event.repeat &&
        KEYBOARD_ACTIONS.includes(event.key.toLowerCase()) &&
        !(
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement
        )
      ) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set("keyboardAction", event.key.toLowerCase());
          return next;
        });
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (KEYBOARD_ACTIONS.includes(event.key.toLowerCase())) {
        clearKeyboardAction();
      }
    }

    // ⌨️ clavier
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // 🚪 la fenêtre sort / entre
    window.addEventListener("blur", clearKeyboardAction); // perte de focus
    window.addEventListener("focus", clearKeyboardAction); // retour au focus
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") clearKeyboardAction();
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearKeyboardAction);
      window.removeEventListener("focus", clearKeyboardAction);
      document.removeEventListener("visibilitychange", clearKeyboardAction);
    };
  }, [setSearchParams]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        if (designSystem?.metadata.isTmp && !isSavingDesignSystem) {
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
  }, [designSystem, saveDesignSystem, isSavingDesignSystem]);

  if (isLoadingDesignSystem) return <Loader />;
  if (!designSystem) return null;

  return (
    <DesignSystemContext
      value={{
        activeComponent,
        setActiveComponent: handleSetActiveComponent,
        designSystem,
        editMode,
        colorTokens,
        tokenFamilies,
        theme,
        setTheme,
        themeTokenFamilies,
        defaultCombination
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
