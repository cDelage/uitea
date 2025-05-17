import { useFieldArray, useForm } from "react-hook-form";
import styles from "../ComponentDesignSystem.module.css";
import { useDesignSystemContext } from "../DesignSystemContext";
import { Themes } from "../../../domain/DesignSystemDomain";
import { isEqual } from "lodash";
import { useParams } from "react-router-dom";
import { useSaveDesignSystem } from "../DesignSystemQueries";
import classNames from "classnames";
import { useRef } from "react";
import { useTriggerScroll } from "../../../util/TriggerScrollEvent";
import { useRefreshDesignSystemFormsEvent } from "../../../util/RefreshDesignSystemFormsEvent";
import { useSidebarComponentVisible } from "../../../util/SidebarComponentVisible";
import { MdAdd, MdDelete } from "react-icons/md";
import ThemePreview from "./ThemePreview";
import PreviewComponentDesignSystem from "../previews/PreviewComponentDesignSystem";
import Popover from "../../../ui/kit/Popover";
import ColorPickerDesignSystem from "../ColorPickerDesignSystem";
import InputDesignSystem from "../InputDesignSystem";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../../util/DraggableContext";
import MainThemeTokenPopover from "./MainThemeTokenPopover";

function ThemesComponent() {
  const { designSystem, tokenFamilies, editMode } = useDesignSystemContext();
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const { handleSubmit, reset, control, watch, setValue, register } =
    useForm<Themes>({
      defaultValues: designSystem.themes,
    });
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "otherThemes",
  });
  const themesRef = useRef<HTMLFormElement | null>(null);
  useTriggerScroll({
    ref: themesRef,
    triggerId: `themes`,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: designSystem.themes,
  });
  useSidebarComponentVisible(themesRef, "themes");

  const { draggableTools } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: RemovableIndex) => {
      if (
        dragIndex === undefined ||
        hoverIndex === undefined ||
        hoverIndex === dragIndex
      )
        return;
      if (hoverIndex !== "remove") {
        move(dragIndex, hoverIndex);
      } else {
        remove(dragIndex);
      }
      handleSubmit(submitThemes)();
    }
  );

  const sideSettingsClassNames = classNames(
    styles.sideSettings,
    styles.scrollableSettings
  );

  function submitThemes(newTheme: Themes) {
    if (isEqual(designSystem.themes, newTheme)) return;
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        themes: newTheme,
      },
      isTmp: true,
    });
  }

  function handleUpdateMainThemeColor(color: string) {
    setValue(`mainTheme.background`, color);
    handleSubmit(submitThemes)();
  }

  function handleUpdateAdditionalThemeColor(color: string, index: number) {
    setValue(`otherThemes.${index}.background`, color);
    handleSubmit(submitThemes)();
  }

  const { mainTheme } = watch();

  function handleCreateMainTheme(color: string) {
    setValue("mainTheme", {
      name: "main",
      background: color,
    });
    handleSubmit(submitThemes)();
  }

  function handleAppendTheme(color: string) {
    append({
      name: `theme-${fields.length + 1}`,
      background: color,
    });
    handleSubmit(submitThemes)();
  }

  function removeMainTheme() {
    setValue("mainTheme", undefined);
    setValue("otherThemes", []);
    handleSubmit(submitThemes)();
  }

  return (
    <Popover>
      <form
        onSubmit={handleSubmit(submitThemes)}
        className={styles.componentDesignSystem}
        ref={themesRef}
      >
        <div className={sideSettingsClassNames} style={{ maxHeight: "600px" }}>
          <div className={styles.sideSettingsTitle}>
            <h5>Default</h5>
          </div>
          {!mainTheme && (
            <div className={styles.sideSettingsContainer}>
              <Popover.Toggle id="main-picker">
                <button className="add-button w-full align-center p-3">
                  <MdAdd /> Define main theme
                </button>
              </Popover.Toggle>
              <Popover.Body id="main-picker" zIndex={100}>
                <MainThemeTokenPopover
                  onConfirm={(color: string) => handleCreateMainTheme(color)}
                />
              </Popover.Body>
            </div>
          )}
          {mainTheme && (
            <>
              <InputDesignSystem
                label={mainTheme.name}
                value={mainTheme.background}
                isColor={true}
                computedColor={mainTheme.background}
                registerKey={register("mainTheme.name", { required: true })}
                isLocked={fields.length > 0}
                handleSubmit={handleSubmit(submitThemes)}
                popoverEdit={
                  !fields.length ? (
                    <MainThemeTokenPopover
                      onConfirm={(color: string) =>
                        handleUpdateMainThemeColor(color)
                      }
                      defaultColor={mainTheme.background}
                      onRemove={removeMainTheme}
                    />
                  ) : (
                    <></>
                  )
                }
              />
              <div className={styles.sideSettingsTitle}>
                <h5>Additionals</h5>
              </div>
              <div className="column">
                {fields.map((theme, index) => (
                  <InputDesignSystem
                    label={watch(`otherThemes.${index}.name`)}
                    key={`${theme.name}${index}`}
                    value={theme.background}
                    handleSubmit={handleSubmit(submitThemes)}
                    isColor={true}
                    computedColor={theme.background}
                    registerKey={register(`otherThemes.${index}.name`, {
                      required: true,
                    })}
                    draggableTools={draggableTools}
                    isAddRemoveDragAllowed={true}
                    index={index}
                    editText={true}
                    popoverId={watch(`otherThemes.${index}.name`)}
                    popoverEdit={
                      <ColorPickerDesignSystem
                        changeComplete={(color) =>
                          handleUpdateAdditionalThemeColor(color, index)
                        }
                        tokens={tokenFamilies}
                        defaultColor={theme.background}
                      />
                    }
                  />
                ))}
              </div>
              <div className={styles.sideSettingsContainer}>
                {editMode && (
                  <>
                    {draggableTools.dragIndex === undefined ? (
                      <Popover.Toggle id="additional-picker">
                        <button
                          className="add-button w-full align-center button-height-l"
                          type="button"
                        >
                          <MdAdd /> Add a theme
                        </button>
                      </Popover.Toggle>
                    ) : (
                      <button
                        className="remove-button w-full align-center button-height-l"
                        type="button"
                        onMouseEnter={() =>
                          draggableTools.setHoverIndex("remove")
                        }
                      >
                        <MdDelete /> Remove theme
                      </button>
                    )}
                    <Popover.Body id="additional-picker" zIndex={100}>
                      <ColorPickerDesignSystem
                        onConfirm={handleAppendTheme}
                        tokens={tokenFamilies}
                      />
                    </Popover.Body>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <PreviewComponentDesignSystem maxHeight="600px">
          {!mainTheme && <h5 className="p-7">No themes defined</h5>}
          {mainTheme && (
            <ThemePreview
              theme={mainTheme}
              isMain={true}
            />
          )}
          {fields.map((theme, index) => (
            <ThemePreview
              theme={theme}
              key={`${theme.name}${index}`}
              mainTheme={mainTheme}
            />
          ))}
        </PreviewComponentDesignSystem>
        <div className={styles.darkPreviewPlaceholder} />
      </form>
    </Popover>
  );
}

export default ThemesComponent;
