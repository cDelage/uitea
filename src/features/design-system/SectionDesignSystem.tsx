import { ReactNode, useRef } from "react";
import styles from "./SectionDesignSystem.module.css";
import { ComponentMode, useDesignSystemContext } from "./DesignSystemContext";
import { useSearchParams } from "react-router-dom";
import { useTriggerScroll } from "../../util/TriggerScrollEvent";
import { ButtonPrimary } from "../../ui/kit/Buttons";
import classNames from "classnames";

function Section({
  sectionTitle,
  children,
  sectionName,
}: {
  children?: ReactNode;
  sectionTitle: ReactNode;
  sectionName: string;
}) {
  const sectionRef = useRef(null);

  useTriggerScroll({
    ref: sectionRef,
    triggerId: sectionName,
  });

  return (
    <section className={styles.dsSection} ref={sectionRef}>
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
  const refSubsection = useRef(null);
  const [searchParams] = useSearchParams();
  const isEditMode: boolean = JSON.parse(
    searchParams.get("editMode") || "false"
  ) as boolean;

  return (
    <div ref={refSubsection} className={styles.subSection}>
      <div className={styles.subSectionHeader}>
        <div className={styles.subSectionTitle}>
          <h3>{subSectionName}</h3>
        </div>
        {isEditMode && (
          <div className={styles.subSectionHeaderRight}>{actions}</div>
        )}
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

function EmptySection({
  sectionName,
  itemToInsert,
  onInsert,
  sectionLength,
  mediumHeight,
  hFull,
}: {
  sectionName: string;
  itemToInsert: string;
  onInsert: () => void;
  sectionLength: number;
  mediumHeight?: boolean;
  hFull?: boolean;
}) {
  const emptyContainerClassNames = classNames(
    styles.emptyContentContainer,
    {
      [styles.mediumHeight]: mediumHeight,
    },
    {
      "h-full": hFull,
    }
  );
  if (sectionLength) return null;
  return (
    <div className={emptyContainerClassNames}>
      Empty {sectionName}
      <ButtonPrimary onClick={onInsert}>Insert a {itemToInsert}</ButtonPrimary>
    </div>
  );
}

Section.Subsection = SubSection;
Section.ActionButton = ActionButton;
Section.Actions = Actions;
Section.EmptySection = EmptySection;
export default Section;
