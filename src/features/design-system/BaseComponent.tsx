import { useForm } from "react-hook-form";
import styles from "./ComponentDesignSystem.module.css";
import { useDesignSystemContext } from "./DesignSystemContext";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import { Base } from "../../domain/DesignSystemDomain";
import BasePreview from "./BasePreview";
import { DEFAULT_BASE, ICON_SIZE_SM } from "../../ui/UiConstants";
import { useParams } from "react-router-dom";
import { MdDarkMode, MdSunny } from "react-icons/md";
import { useTriggerScroll } from "../../util/TriggerScrollEvent";
import { useRef } from "react";
import { useRefreshDesignSystemFormsEvent } from "../../util/RefreshDesignSystemFormsEvent";
import { isEqual } from "lodash";
import BaseForm from "./BaseForm";
import { useSidebarComponentVisible } from "../../util/SidebarComponentVisible";

function BaseComponent() {
  const { designSystem } = useDesignSystemContext();
  const {
    metadata: { darkMode },
    base,
  } = designSystem;

  const baseForm = useForm({
    defaultValues: base,
    mode: "onBlur",
  });

  const { watch, handleSubmit, reset } = baseForm;

  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const baseRef = useRef<HTMLFormElement | null>(null);
  useTriggerScroll({
    ref: baseRef,
    triggerId: `base`,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: base,
  });
  useSidebarComponentVisible(baseRef, "base");

  function submitBase(newBase: Base) {
    if (isEqual(newBase, base)) return;

    saveDesignSystem({
      designSystem: {
        ...designSystem,
        base: newBase,
      },
      isTmp: true,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(submitBase)}
      className={styles.componentDesignSystem}
      ref={baseRef}
    >
      <div className={styles.sideSettings}>
        <div className={styles.sideSettingsTitle}>
          <h5 className={styles.titlePadding}>Default</h5>
          <MdSunny size={ICON_SIZE_SM} />
        </div>
        <BaseForm
          form={baseForm}
          darkableCategory="default"
          handleSubmit={handleSubmit(submitBase)}
        />
      </div>
      <div className={styles.previewContainer}>
        <BasePreview
          base={watch()}
          defaultBase={DEFAULT_BASE}
          keyBase="default"
        />
        {darkMode && (
          <BasePreview
            base={watch()}
            keyBase="dark"
            defaultBase={DEFAULT_BASE}
          />
        )}
      </div>
      {darkMode ? (
        <div className={styles.sideSettings}>
          <div className={styles.sideSettingsTitle}>
            <h5 className={styles.titlePadding}>Dark</h5>
            <MdDarkMode size={ICON_SIZE_SM} />
          </div>
          <BaseForm
            form={baseForm}
            darkableCategory="dark"
            handleSubmit={handleSubmit(submitBase)}
          />
        </div>
      ) : (
        <div className={styles.darkPreviewPlaceholder} />
      )}
    </form>
  );
}

export default BaseComponent;
