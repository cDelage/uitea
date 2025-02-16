import { ElementType, ReactNode } from "react";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import styles from "./SidebarSection.module.css";

function SidebarSection({
  SectionIcon,
  name,
  scrollName,
  children
}: {
  SectionIcon: ElementType;
  name: string;
  scrollName: string;
  children: ReactNode
}) {
  function triggerScrollRequest() {
    document.dispatchEvent(
      new CustomEvent("triggerScroll", {
        detail: {
          id: scrollName,
        },
      })
    );
  }

  return (
    <div className="column">
    <div className={styles.sidebarSection} onClick={triggerScrollRequest}>
      <SectionIcon size={ICON_SIZE_MD} />
      <h5>{name}</h5>
    </div>
    <div className="column">
      {children}
    </div>
    </div>
  );
}

export default SidebarSection;
