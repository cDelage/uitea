import { FcFile } from "react-icons/fc";
import styles from "./SidebarSection.module.css";
import { ICON_SIZE_SM } from "../../ui/UiConstants";
import classNames from "classnames";
import { ReactNode } from "react";

function SidebarFile({
  filename,
  underFolder,
  id,
  icon,
  visible,
}: {
  filename: string;
  underFolder?: boolean;
  id: string;
  icon?: ReactNode;
  visible: string | null;
}) {
  const fileClassname = classNames(styles.sidebarSection, {
    [styles.fileUnderFolder]: underFolder,
    [styles.sidebarSectionVisible]: visible === id,
  });

  function triggerScrollRequest() {
    document.dispatchEvent(
      new CustomEvent("triggerScroll", {
        detail: {
          id,
        },
      })
    );
  }

  return (
    <div className={fileClassname} onClick={triggerScrollRequest}>
      {icon ? icon : <FcFile size={ICON_SIZE_SM} />}
      {filename}
    </div>
  );
}

export default SidebarFile;
