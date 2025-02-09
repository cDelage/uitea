import { useForm } from "react-hook-form";
import styles from "./ComponentDesignSystem.module.css";
import InputDesignSystem from "./InputDesignSystem";
import { ComponentMode, useDesignSystemContext } from "./DesignSystemContext";
import CopyableLabel from "../../ui/kit/CopyableLabel";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import { Base } from "../../domain/DesignSystemDomain";
import BasePreview from "./BasePreview";
import { DEFAULT_BASE, ICON_SIZE_SM } from "../../ui/UiConstants";
import { useParams } from "react-router-dom";
import { MdDarkMode, MdSunny } from "react-icons/md";
import { useTriggerScroll } from "../../util/TriggerScrollEvent";
import { useRef } from "react";

function BaseComponent() {
  const { activeComponent, designSystem, findDesignSystemColor } =
    useDesignSystemContext();
  const {
    metadata: { darkMode },
    base,
  } = designSystem;

  const { register, watch, handleSubmit } = useForm({
    defaultValues: base,
    mode: "onBlur",
  });
  const mode: ComponentMode =
    activeComponent?.componentId === "base" ? activeComponent.mode : "default";
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const baseRef = useRef<HTMLFormElement | null>(null);
  useTriggerScroll({
    ref: baseRef,
    triggerId: `base`,
  });

  function submitBase(newBase: Base) {
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
        <div className="column">
          <InputDesignSystem
            label="background"
            value={watch("background.default")}
            mode={mode}
            register={register("background.default")}
            popoverCopy={
              <div className="popover-body">
                <CopyableLabel copyable="base-background" />
                <CopyableLabel copyable={watch("background.default")} />
              </div>
            }
            handleSubmit={handleSubmit(submitBase)}
            isColor={true}
            computedColor={findDesignSystemColor({
              label: watch("background.default"),
            })}
          />
          <InputDesignSystem
            label="border"
            mode={mode}
            value={watch("border.default")}
            register={register("border.default")}
            popoverCopy={
              <div className="popover-body">
                <CopyableLabel copyable="base-border" />
                <CopyableLabel copyable={watch("border.default")} />
              </div>
            }
            handleSubmit={handleSubmit(submitBase)}
            isColor={true}
            computedColor={findDesignSystemColor({
              label: watch("border.default"),
            })}
          />
          <InputDesignSystem
            label="text-light"
            value={watch("textLight.default")}
            mode={mode}
            register={register("textLight.default")}
            popoverCopy={
              <div className="popover-body">
                <CopyableLabel copyable="base-text-light" />
                <CopyableLabel copyable={watch("textLight.default")} />
              </div>
            }
            handleSubmit={handleSubmit(submitBase)}
            isColor={true}
            computedColor={findDesignSystemColor({
              label: watch("textLight.default"),
            })}
          />
          <InputDesignSystem
            label="text-default"
            value={watch("textDefault.default")}
            mode={mode}
            register={register("textDefault.default")}
            popoverCopy={
              <div className="popover-body">
                <CopyableLabel copyable="base-text" />
                <CopyableLabel copyable={watch("textDefault.default")} />
              </div>
            }
            handleSubmit={handleSubmit(submitBase)}
            isColor={true}
            computedColor={findDesignSystemColor({
              label: watch("textDefault.default"),
            })}
          />
          <InputDesignSystem
            label="text-dark"
            value={watch("textDark.default")}
            mode={mode}
            register={register("textDark.default")}
            popoverCopy={
              <div className="popover-body">
                <CopyableLabel copyable="base-text-dark" />
                <CopyableLabel copyable={watch("textDark.default")} />
              </div>
            }
            handleSubmit={handleSubmit(submitBase)}
            isColor={true}
            computedColor={findDesignSystemColor({
              label: watch("textDark.default"),
            })}
          />
          <InputDesignSystem
            label="background-disabled"
            value={watch("backgroundDisabled.default")}
            mode={mode}
            register={register("backgroundDisabled.default")}
            popoverCopy={
              <div className="popover-body">
                <CopyableLabel copyable="base-background-disabled" />
                <CopyableLabel copyable={watch("backgroundDisabled.default")} />
              </div>
            }
            handleSubmit={handleSubmit(submitBase)}
            isColor={true}
            computedColor={findDesignSystemColor({
              label: watch("backgroundDisabled.default"),
            })}
          />
          <InputDesignSystem
            label="border-disabled"
            value={watch("borderDisabled.default")}
            mode={mode}
            register={register("borderDisabled.default")}
            popoverCopy={
              <div className="popover-body">
                <CopyableLabel copyable="base-border-disabled" />
                <CopyableLabel copyable={watch("borderDisabled.default")} />
              </div>
            }
            handleSubmit={handleSubmit(submitBase)}
            isColor={true}
            computedColor={findDesignSystemColor({
              label: watch("borderDisabled.default"),
            })}
          />
          <InputDesignSystem
            label="text-disabled"
            value={watch("textDisabled.default")}
            mode={mode}
            register={register("textDisabled.default")}
            popoverCopy={
              <div className="popover-body">
                <CopyableLabel copyable="base-text-disabled" />
                <CopyableLabel copyable={watch("textDisabled.default")} />
              </div>
            }
            handleSubmit={handleSubmit(submitBase)}
            isColor={true}
            computedColor={findDesignSystemColor({
              label: watch("textDisabled.default"),
            })}
          />
        </div>
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
      {darkMode && (
        <div className={styles.sideSettings}>
          <div className={styles.sideSettingsTitle}>
            <h5 className={styles.titlePadding}>Dark</h5>
            <MdDarkMode size={ICON_SIZE_SM} />
          </div>
          <div className="column">
            <InputDesignSystem
              label="background"
              value={watch("background.dark")}
              mode={mode}
              register={register("background.dark")}
              popoverCopy={
                <div className="popover-body">
                  <CopyableLabel copyable="base-background" />
                  <CopyableLabel copyable={watch("background.dark")} />
                </div>
              }
              handleSubmit={handleSubmit(submitBase)}
              isColor={true}
              computedColor={findDesignSystemColor({
                label: watch("background.dark"),
              })}
            />
            <InputDesignSystem
              label="border"
              value={watch("border.dark")}
              mode={mode}
              register={register("border.dark")}
              popoverCopy={
                <div className="popover-body">
                  <CopyableLabel copyable="base-border" />
                  <CopyableLabel copyable={watch("border.dark")} />
                </div>
              }
              handleSubmit={handleSubmit(submitBase)}
              isColor={true}
              computedColor={findDesignSystemColor({
                label: watch("border.dark"),
              })}
            />
            <InputDesignSystem
              label="text-light"
              value={watch("textLight.dark")}
              mode={mode}
              register={register("textLight.dark")}
              popoverCopy={
                <div className="popover-body">
                  <CopyableLabel copyable="base-text-light" />
                  <CopyableLabel copyable={watch("textLight.dark")} />
                </div>
              }
              handleSubmit={handleSubmit(submitBase)}
              isColor={true}
              computedColor={findDesignSystemColor({
                label: watch("textLight.dark"),
              })}
            />
            <InputDesignSystem
              label="text-default"
              value={watch("textDefault.dark")}
              mode={mode}
              register={register("textDefault.dark")}
              popoverCopy={
                <div className="popover-body">
                  <CopyableLabel copyable="base-text" />
                  <CopyableLabel copyable={watch("textDefault.dark")} />
                </div>
              }
              handleSubmit={handleSubmit(submitBase)}
              isColor={true}
              computedColor={findDesignSystemColor({
                label: watch("textDefault.dark"),
              })}
            />
            <InputDesignSystem
              label="text-dark"
              value={watch("textDark.dark")}
              mode={mode}
              register={register("textDark.dark")}
              popoverCopy={
                <div className="popover-body">
                  <CopyableLabel copyable="base-text-dark" />
                  <CopyableLabel copyable={watch("textDark.dark")} />
                </div>
              }
              handleSubmit={handleSubmit(submitBase)}
              isColor={true}
              computedColor={findDesignSystemColor({
                label: watch("textDark.dark"),
              })}
            />
            <InputDesignSystem
              label="background-disabled"
              value={watch("backgroundDisabled.dark")}
              mode={mode}
              register={register("backgroundDisabled.dark")}
              popoverCopy={
                <div className="popover-body">
                  <CopyableLabel copyable="base-background-disabled" />
                  <CopyableLabel copyable={watch("backgroundDisabled.dark")} />
                </div>
              }
              handleSubmit={handleSubmit(submitBase)}
              isColor={true}
              computedColor={findDesignSystemColor({
                label: watch("backgroundDisabled.dark"),
              })}
            />
            <InputDesignSystem
              label="border-disabled"
              value={watch("borderDisabled.dark")}
              mode={mode}
              register={register("borderDisabled.dark")}
              popoverCopy={
                <div className="popover-body">
                  <CopyableLabel copyable="base-border-disabled" />
                  <CopyableLabel copyable={watch("borderDisabled.dark")} />
                </div>
              }
              handleSubmit={handleSubmit(submitBase)}
              isColor={true}
              computedColor={findDesignSystemColor({
                label: watch("borderDisabled.dark"),
              })}
            />
            <InputDesignSystem
              label="text-disabled"
              value={watch("textDisabled.dark")}
              mode={mode}
              register={register("textDisabled.dark")}
              popoverCopy={
                <div className="popover-body">
                  <CopyableLabel copyable="base-text-disabled" />
                  <CopyableLabel copyable={watch("textDisabled.dark")} />
                </div>
              }
              handleSubmit={handleSubmit(submitBase)}
              isColor={true}
              computedColor={findDesignSystemColor({
                label: watch("textDisabled.dark"),
              })}
            />
          </div>
        </div>
      )}
    </form>
  );
}

export default BaseComponent;
