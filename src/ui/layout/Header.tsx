import { appWindow } from "@tauri-apps/api/window";
import styles from "./header.module.css";
import { IoHomeSharp, IoRemove } from "react-icons/io5";
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeRestore,
} from "react-icons/vsc";
import { useEffect, useState } from "react";
import { CloseButton, GhostButton, WindowButtons } from "../kit/Buttons";
import { ICON_SIZE_MD } from "../UiConstants";
import { useNavigate } from "react-router-dom";

function Header() {
  const [isMax, setIsMax] = useState(false);
  const navigate = useNavigate();

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
      <GhostButton onClick={() => navigate("/")}>
        <IoHomeSharp size={ICON_SIZE_MD} />
      </GhostButton>
      <strong>Home</strong>
      <div className={styles.buttons}>
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
