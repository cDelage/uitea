import { ElementType } from "react";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import styles from "./SidebarSection.module.css";

function SidebarSection({
  SectionIcon,
  name,
}: {
  SectionIcon: ElementType;
  name: string;
}) {
  return (
    <div className={styles.sidebarSection}>
      <SectionIcon size={ICON_SIZE_MD} />
      <h5>{name}</h5>
    </div>
  );
}

export default SidebarSection;
