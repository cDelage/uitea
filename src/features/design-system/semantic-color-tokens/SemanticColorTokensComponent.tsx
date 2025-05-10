import classNames from "classnames";
import styles from "../ComponentDesignSystem.module.css";
import PreviewComponentDesignSystem from "../previews/PreviewComponentDesignSystem";
import SemanticPreview from "./SemanticPreview";
import { useDesignSystemContext } from "../DesignSystemContext";
import { useParams } from "react-router-dom";
import { useSaveDesignSystem } from "../DesignSystemQueries";
import { isEqual } from "lodash";
import { SemanticColorTokens } from "../../../domain/DesignSystemDomain";
import { useForm } from "react-hook-form";
import SemanticBaseInput from "./SemanticBaseInput";
import { useRef } from "react";
import { useTriggerScroll } from "../../../util/TriggerScrollEvent";
import { useRefreshDesignSystemFormsEvent } from "../../../util/RefreshDesignSystemFormsEvent";
import { useSidebarComponentVisible } from "../../../util/SidebarComponentVisible";

function SemanticColorTokensComponent() {
  const { designSystem, tokenFamilies } = useDesignSystemContext();
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const { watch, setValue, handleSubmit, reset } = useForm({
    defaultValues: designSystem.semanticColorTokens,
  });

  const semanticTokensRef = useRef<HTMLFormElement | null>(null);
  useTriggerScroll({
    ref: semanticTokensRef,
    triggerId: `semantic-color-tokens`,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: designSystem.semanticColorTokens,
  });
  useSidebarComponentVisible(semanticTokensRef, "semantic-color-tokens");

  const tokenFamiliesAccessible = tokenFamilies.filter(
    (family) => family.category === "color"
  );

  const sideSettingsClassNames = classNames(
    styles.sideSettings,
    styles.scrollableSettings
  );

  function submitSemanticColorTokens(newTokens: SemanticColorTokens) {
    if (isEqual(designSystem.semanticColorTokens, newTokens)) return;
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        semanticColorTokens: newTokens,
      },
      isTmp: true,
    });
  }

  return (
    <form ref={semanticTokensRef} className={styles.componentDesignSystem}>
      <div className={sideSettingsClassNames} style={{ maxHeight: "500px" }}>
        <div className={styles.sideSettingsTitle}>
          <h5>Base</h5>
        </div>
        <div className="column">
          <SemanticBaseInput
            token="background"
            label="background"
            watch={watch}
            setValue={setValue}
            onSubmit={handleSubmit(submitSemanticColorTokens)}
            tokenFamilies={tokenFamiliesAccessible}
          />
          <SemanticBaseInput
            token="textLight"
            label="text-light"
            watch={watch}
            setValue={setValue}
            onSubmit={handleSubmit(submitSemanticColorTokens)}
            tokenFamilies={tokenFamiliesAccessible}
          />
          <SemanticBaseInput
            token="textDefault"
            label="text-default"
            watch={watch}
            setValue={setValue}
            onSubmit={handleSubmit(submitSemanticColorTokens)}
            tokenFamilies={tokenFamiliesAccessible}
          />
          <SemanticBaseInput
            token="textDark"
            label="text-dark"
            watch={watch}
            setValue={setValue}
            onSubmit={handleSubmit(submitSemanticColorTokens)}
            tokenFamilies={tokenFamiliesAccessible}
          />
          <SemanticBaseInput
            token="border"
            label="border"
            watch={watch}
            setValue={setValue}
            onSubmit={handleSubmit(submitSemanticColorTokens)}
            tokenFamilies={tokenFamiliesAccessible}
          />
        </div>
      </div>
      <PreviewComponentDesignSystem maxHeight="600px">
        <SemanticPreview />
      </PreviewComponentDesignSystem>
      <div className={styles.darkPreviewPlaceholder} />
    </form>
  );
}

export default SemanticColorTokensComponent;
