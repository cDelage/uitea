import { ReactNode, useState } from "react";
import styles from "./SidebarSection.module.css";
import { MdChevronRight } from "react-icons/md";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import { ICON_SIZE_SM } from "../../ui/UiConstants";

function SidebarFolder({
  children,
  name,
}: {
  children?: ReactNode;
  name: string;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const FolderIcon = isOpen ? FcOpenedFolder : FcFolder;
  const chevronClassname = isOpen ? "rotate-chevron" : "";

  return (
    <>
      <div
        className={styles.sidebarSection}
        onClick={() => setIsOpen((open) => !open)}
      >
        <div className={styles.iconChevronContainer}>
          <MdChevronRight className={chevronClassname} />
          <FolderIcon size={ICON_SIZE_SM} />
        </div>
        <strong>{name}</strong>
      </div>
      {isOpen && children}
    </>
  );
}

export default SidebarFolder;
