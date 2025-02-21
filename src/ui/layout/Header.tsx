import { appWindow } from "@tauri-apps/api/window";
import styles from "./header.module.css";
import { IoHomeOutline, IoHomeSharp, IoRemove } from "react-icons/io5";
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeRestore,
} from "react-icons/vsc";
import { useEffect, useState } from "react";
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

function Header() {
  const [isMax, setIsMax] = useState(false);
  const navigate = useNavigate();
  const { designSystemPath } = useParams();
  const { designSystem } = useFindDesignSystem(designSystemPath);
  const { pathname } = useLocation();
  const { undoDesignSystem, redoDesignSystem } =
    useUndoRedoDesignSystem(designSystemPath);
  const [searchParams] = useSearchParams();
  const isEditMode: boolean = JSON.parse(
    searchParams.get("editMode") || "false"
  ) as boolean;

  const isHomepageActive: boolean = pathname === "/";
  const headerName: string = isHomepageActive
    ? "Home"
    : designSystem?.metadata.designSystemName ?? "undefined";
  const isTmp: boolean | undefined = designSystem?.metadata.isTmp;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "z") {
        if (designSystem?.metadata.canUndo) {
          event.preventDefault(); // Empêche le comportement par défaut du navigateur
          undoDesignSystem();
        }
      }
      if (event.ctrlKey && event.key === "y") {
        if (designSystem?.metadata.canRedo) {
          event.preventDefault();
          redoDesignSystem();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [undoDesignSystem, redoDesignSystem, designSystem]);

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
          {isHomepageActive ? (
            <IoHomeSharp size={ICON_SIZE_MD} />
          ) : (
            <IoHomeOutline size={ICON_SIZE_MD} />
          )}
        </GhostButton>
      </div>
      <div className="container-center" data-tauri-drag-region={true}>
        {isTmp && !isHomepageActive ? (
          <strong>{headerName}*</strong>
        ) : (
          <>{headerName}</>
        )}
      </div>
      <div className={styles.buttons}>
        {!isHomepageActive && isEditMode && (
          <div className={styles.undoRedoButtons}>
            <button
              className="action-ghost-button"
              disabled={!designSystem?.metadata.canUndo}
              onClick={() => undoDesignSystem()}
            >
              <MdArrowBack size={ICON_SIZE_SM} />
            </button>
            <button
              className="action-ghost-button"
              disabled={!designSystem?.metadata.canRedo}
              onClick={() => redoDesignSystem()}
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
