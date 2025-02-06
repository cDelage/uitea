import { useForm } from "react-hook-form";
import styles from "./ComponentDesignSystem.module.css";
import InputDesignSystem from "./InputDesignSystem";
import { ComponentMode, useDesignSystemContext } from "./DesignSystemContext";

function BaseComponent() {
  const { activeComponent, findDesignSystemColor, designSystem } =
    useDesignSystemContext();
  const {
    metadata: { darkMode },
    base,
  } = designSystem;

  const { register, watch } = useForm({ defaultValues: base });
  const mode: ComponentMode =
    activeComponent?.componentId === "base" ? activeComponent.mode : "default";

  return (
    <div className={styles.componentDesignSystem}>
      <div className={styles.sideSettings}>
        <h4 className={styles.sideSettingsTitle}>Default</h4>
        <div className="column gap-5">
          <InputDesignSystem
            label="background"
            mode={mode}
            register={register("default.background")}
          />
          <InputDesignSystem
            label="border"
            mode={mode}
            register={register("default.border")}
          />
          <InputDesignSystem
            label="text-light"
            mode={mode}
            register={register("default.textLight")}
          />
          <InputDesignSystem
            label="text-default"
            mode={mode}
            register={register("default.textDefault")}
          />
          <InputDesignSystem
            label="text-dark"
            mode={mode}
            register={register("default.textDark")}
          />
          <InputDesignSystem
            label="background-disabled"
            mode={mode}
            register={register("default.backgroundDisabled")}
          />
          <InputDesignSystem
            label="border-disabled"
            mode={mode}
            register={register("default.borderDisabled")}
          />
          <InputDesignSystem
            label="text-disabled"
            mode={mode}
            register={register("default.textDisabled")}
          />
        </div>
      </div>
      <div className={styles.previewContainer}>
        <div
          className={styles.previewElement}
          style={{
            background: findDesignSystemColor({
              label: watch("default.background"),
            }),
          }}
        ></div>
        {darkMode && (
          <>
            <div
              className={styles.previewElement}
              style={{
                background: "var(--palette-gray-950)",
              }}
            ></div>
          </>
        )}
      </div>
      {darkMode && (
        <div className={styles.sideSettings}>
          <h4 className={styles.sideSettingsTitle}>Dark</h4>
          <div className="column gap-5">
            <InputDesignSystem
              label="background"
              mode={mode}
              register={register("dark.background")}
            />
            <InputDesignSystem
              label="border"
              mode={mode}
              register={register("dark.border")}
            />
            <InputDesignSystem
              label="text-light"
              mode={mode}
              register={register("dark.textLight")}
            />
            <InputDesignSystem
              label="text-default"
              mode={mode}
              register={register("dark.textDefault")}
            />
            <InputDesignSystem
              label="text-dark"
              mode={mode}
              register={register("dark.textDark")}
            />
            <InputDesignSystem
              label="background-disabled"
              mode={mode}
              register={register("dark.backgroundDisabled")}
            />
            <InputDesignSystem
              label="border-disabled"
              mode={mode}
              register={register("dark.borderDisabled")}
            />
            <InputDesignSystem
              label="text-disabled"
              mode={mode}
              register={register("dark.textDisabled")}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BaseComponent;
