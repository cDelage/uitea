import { appWindow } from "@tauri-apps/api/window";
import styles from "./header.module.css";
import { IoHomeOutline, IoHomeSharp, IoRemove } from "react-icons/io5";
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeRestore,
} from "react-icons/vsc";
import { useEffect, useMemo, useState } from "react";
import { CloseButton, GhostButton, WindowButtons } from "../kit/Buttons";
import { ICON_SIZE_MD, ICON_SIZE_SM } from "../UiConstants";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  useFindDesignSystem,
  useUndoRedoDesignSystem,
} from "../../features/design-system/DesignSystemQueries";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { usePaletteBuilderStore } from "../../features/palette-builder/PaletteBuilderStore";
import { HeaderTools } from "../../util/HeaderTools";
import { useColorPickerStore } from "../../features/color-picker/ColorPickerStore";
import { useTokenCrafterStore } from "../../features/token-crafter/TokenCrafterStore";

function Header() {
  const [isMax, setIsMax] = useState(false);
  const navigate = useNavigate();
  const { designSystemPath } = useParams();
  const { designSystem } = useFindDesignSystem(designSystemPath);
  const { pathname } = useLocation();
  const { undoDesignSystem, redoDesignSystem } =
    useUndoRedoDesignSystem(designSystemPath);
  const {
    canUndoRedo: canUndoRedoPaletteBuilder,
    undoPaletteBuilder,
    redoPaletteBuilder,
  } = usePaletteBuilderStore();
  const [searchParams] = useSearchParams();
  const {
    canUndoRedo: canUndoRedoTokenCrafter,
    undoTokenCrafter,
    redoTokenCrafter,
  } = useTokenCrafterStore();
  const isEditMode: boolean = JSON.parse(
    searchParams.get("editMode") || "false"
  ) as boolean;
  const {
    canUndoRedo: canUndoRedoColorPicker,
    undoColorPicker,
    redoColorPicker,
  } = useColorPickerStore();

  const headerTools = useMemo<HeaderTools>(() => {
    if (
      pathname.startsWith("/palette-builder") ||
      searchParams.get("paletteBuilderOpen") === "true"
    ) {
      return {
        pageName: "palette builder",
        canUndoRedo: canUndoRedoPaletteBuilder,
        undo: undoPaletteBuilder,
        redo: redoPaletteBuilder,
      };
    } else if (
      pathname.startsWith("/color-picker") ||
      searchParams.get("colorPickerOpen") === "true"
    ) {
      return {
        pageName: "color picker",
        canUndoRedo: canUndoRedoColorPicker,
        undo: undoColorPicker,
        redo: redoColorPicker,
      };
    } else if (
      pathname.startsWith("/token-crafter") ||
      searchParams.get("tokenCrafterOpen") === "true"
    ) {
      return {
        pageName: "token crafter",
        canUndoRedo: canUndoRedoTokenCrafter,
        undo: undoTokenCrafter,
        redo: redoTokenCrafter,
      };
    } else if (pathname.startsWith("/design-system")) {
      if (!isEditMode) {
        return {
          pageName: designSystem?.metadata.designSystemName ?? "design system",
        };
      }
      return {
        pageName: designSystem?.metadata.designSystemName ?? "design system",
        canUndoRedo: {
          canRedo: designSystem?.metadata.canRedo ?? false,
          canUndo: designSystem?.metadata.canUndo ?? false,
        },
        undo: undoDesignSystem,
        redo: redoDesignSystem,
        isTmp: designSystem?.metadata.isTmp,
      };
    } else if (pathname === "/") {
      return {
        pageName: "home",
        isHome: true,
      };
    }

    return {
      pageName: "undefined",
    };
  }, [
    pathname,
    isEditMode,
    canUndoRedoColorPicker,
    canUndoRedoPaletteBuilder,
    designSystem,
    redoColorPicker,
    redoDesignSystem,
    redoPaletteBuilder,
    searchParams,
    undoColorPicker,
    undoDesignSystem,
    undoPaletteBuilder,
    canUndoRedoTokenCrafter,
    undoTokenCrafter,
    redoTokenCrafter,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "z" && headerTools.canUndoRedo?.canUndo) {
        headerTools.undo?.();
      }
      if (event.ctrlKey && event.key === "y" && headerTools.canUndoRedo?.canRedo) {
        headerTools.redo?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [headerTools]);

  useEffect(() => {
    const updateMaximizedState = async () => {
      const newMax = await appWindow.isMaximized();
      setIsMax(newMax);
    };

    updateMaximizedState();

    const unlisten = appWindow.listen("tauri://resize", updateMaximizedState);

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  return (
    <header data-tauri-drag-region={true} className={styles.header}>
      <div className="container-start" data-tauri-drag-region={true}>
        <GhostButton onClick={() => navigate("/")}>
          {headerTools.isHome ? (
            <IoHomeSharp size={ICON_SIZE_MD} />
          ) : (
            <IoHomeOutline size={ICON_SIZE_MD} />
          )}
        </GhostButton>
      </div>
      <div className="container-center" data-tauri-drag-region={true}>
        {headerTools.isTmp ? (
          <strong>{headerTools.pageName}*</strong>
        ) : (
          <>{headerTools.pageName}</>
        )}
      </div>
      <div className={styles.buttons}>
        {headerTools.canUndoRedo && (
          <div className={styles.undoRedoButtons}>
            <button
              className="action-ghost-button"
              disabled={!headerTools.canUndoRedo.canUndo}
              onClick={headerTools.undo}
            >
              <MdArrowBack size={ICON_SIZE_SM} />
            </button>
            <button
              className="action-ghost-button"
              disabled={!headerTools.canUndoRedo.canRedo}
              onClick={headerTools.redo}
            >
              <MdArrowForward size={ICON_SIZE_SM} />
            </button>
          </div>
        )}
        <div className={styles.windowButtons} data-tauri-drag-region={true}>
          <WindowButtons onClick={() => appWindow.minimize()}>
            <IoRemove size={ICON_SIZE_MD} />
          </WindowButtons>
          {isMax ? (
            <WindowButtons onClick={() => appWindow.unmaximize()}>
              <VscChromeRestore size={ICON_SIZE_MD} />
            </WindowButtons>
          ) : (
            <WindowButtons onClick={() => appWindow.maximize()}>
              <VscChromeMaximize size={ICON_SIZE_MD} />
            </WindowButtons>
          )}
          <CloseButton onClick={() => appWindow.close()}>
            <VscChromeClose size={ICON_SIZE_MD} />
          </CloseButton>
        </div>
      </div>
    </header>
  );
}

export default Header;
