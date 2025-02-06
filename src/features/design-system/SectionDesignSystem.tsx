import { ReactNode } from "react";
import styles from "./SectionDesignSystem.module.css";
import { ComponentMode, useDesignSystemContext } from "./DesignSystemContext";

function Section({
  sectionTitle,
  children,
}: {
  children?: ReactNode;
  sectionTitle: ReactNode;
}) {
  return (
    <section className={styles.dsSection}>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      {children}
    </section>
  );
}

function SubSection({
  subSectionName,
  actions,
  children,
}: {
  subSectionName: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles.subSection}>
      <div className={styles.subSectionHeader}>
        <div className={styles.subSectionTitle}>
          <h3>{subSectionName}</h3>
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {children}
    </div>
  );
}

function ActionButton({
  children,
  componentId,
  mode,
  type,
}: {
  children: ReactNode;
  componentId: string;
  mode: ComponentMode;
  type?: "button" | "submit";
}) {
  const { getActionButtonClassName, setActiveComponent, activeComponent } =
    useDesignSystemContext();

  return (
    <button
      type={type ? type : "button"}
      className={getActionButtonClassName(mode, componentId, activeComponent)}
      onClick={(e) => {
        e.stopPropagation();
        setActiveComponent({
          componentId,
          mode,
        });
      }}
    >
      {children}
    </button>
  );
}

function Actions({ children }: { children: ReactNode }) {
  return <div className={styles.actions}>{children}</div>;
}

Section.Subsection = SubSection;
Section.ActionButton = ActionButton;
Section.Actions = Actions;
export default Section;
