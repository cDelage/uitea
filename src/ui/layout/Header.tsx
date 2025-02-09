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
import { ICON_SIZE_MD } from "../UiConstants";
import { useLocation, useNavigate } from "react-router-dom";
import { useCurrentDesignSystem } from "../../features/design-system/DesignSystemQueries";

function Header() {
  const [isMax, setIsMax] = useState(false);
  const navigate = useNavigate();
  const { designSystem } = useCurrentDesignSystem();
  const { pathname } = useLocation();
  const isHomepageActive: boolean = pathname === "/";
  const headerName: string = isHomepageActive
    ? "Home"
    : designSystem?.metadata.designSystemName ?? "undefined";
  const isTmp: boolean | undefined = designSystem?.metadata.isTmp;

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
      <div className={styles.buttons} data-tauri-drag-region={true}>
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
    </header>
  );
}

export default Header;
