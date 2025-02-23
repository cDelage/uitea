import { useForm } from "react-hook-form";
import { DesignSystem, ThemeColor } from "../../domain/DesignSystemDomain";
import styles from "./ComponentDesignSystem.module.css";
import { useDesignSystemContext } from "./DesignSystemContext";
import ThemePreview from "./ThemePreview";
import { DEFAULT_BASE, ICON_SIZE_MD, ICON_SIZE_SM } from "../../ui/UiConstants";
import {
  MdArrowDownward,
  MdArrowUpward,
  MdDarkMode,
  MdDelete,
  MdDragIndicator,
  MdMoreHoriz,
  MdSunny,
} from "react-icons/md";
import ThemeStateForm from "./ThemeStateForm";
import classNames from "classnames";
import { useSynchronizedVerticalScroll } from "../../util/SynchronizedScroll";
import { useParams } from "react-router-dom";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import { useParentDraggableContext } from "../../util/DraggableContext";
import {
  generateUniqueThemesKey,
  getDefaultTheme,
} from "../../util/DesignSystemUtils";
import { useRef } from "react";
import { useTriggerScroll } from "../../util/TriggerScrollEvent";
import { useRefreshDesignSystemFormsEvent } from "../../util/RefreshDesignSystemFormsEvent";
import { isEqual } from "lodash";
import Popover from "../../ui/kit/Popover";

function ThemeComponent({
  theme,
  index,
}: {
  theme: ThemeColor;
  index: number;
}) {
  const { designSystem, themesMode, editMode } = useDesignSystemContext();
  const {
    base,
    metadata: { darkMode },
    themes,
  } = designSystem;
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: theme,
  });
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const [scrollableLeft, scrollableRight] = useSynchronizedVerticalScroll();
  const { dragIndex, hoverIndex, setDragIndex, setHoverIndex } =
    useParentDraggableContext();
  const themeRef = useRef<HTMLFormElement | null>(null);
  useTriggerScroll({
    ref: themeRef,
    triggerId: `theme-${theme.themeName}`,
  });
  useRefreshDesignSystemFormsEvent({
    reset,
    originalValue: theme,
  });

  function handleMouseDown() {
    if (editMode) {
      setDragIndex(index);
    }
  }

  function handleMouseEnter() {
    if (editMode && dragIndex !== undefined) {
      setHoverIndex(index);
    }
  }

  function submitTheme(newTheme: ThemeColor) {
    if (isEqual(newTheme, theme)) return;

    const newThemes: ThemeColor[] = [...designSystem.themes];
    newThemes.splice(index, 1, newTheme);
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        themes: newThemes,
      },
      isTmp: true,
    });
  }

  const formClassNames = classNames(
    styles.componentDesignSystemColumn,
    styles.mediumHeight,
    {
      draggable: editMode && dragIndex === index,
    },
    {
      "drag-hover-top":
        dragIndex !== undefined && dragIndex !== index && hoverIndex === index,
    }
  );

  function handleAddTheme(place: "before" | "after") {
    const newIndex = place === "before" ? index : index + 1;
    const themeKey = generateUniqueThemesKey(themes, `theme-${newIndex + 1}`);
    const newTheme: ThemeColor = getDefaultTheme(themeKey);
    designSystem.themes.splice(newIndex, 0, newTheme);
    const newDesignSystem: DesignSystem = {
      ...designSystem,
      themes: Array.from([...designSystem.themes]),
    };
    saveDesignSystem({
      designSystem: newDesignSystem,
      isTmp: true,
    });
  }

  function handleRemoveTheme() {
    const newDesignSystem: DesignSystem = {
      ...designSystem,
      themes: designSystem.themes.filter(
        (_theme, tmIndex) => index !== tmIndex
      ),
    };

    saveDesignSystem({
      designSystem: newDesignSystem,
      isTmp: true,
    });
  }

  return (
    <form
      className={formClassNames}
      onDragStart={(e) => e.preventDefault()}
      onMouseEnter={handleMouseEnter}
      onSubmit={handleSubmit(submitTheme)}
      ref={themeRef}
    >
      <div className={styles.componentHead}>
        <h4>
          {themesMode === "edit" ? (
            <input
              className="inherit-input"
              {...register("themeName")}
              disabled={themesMode !== "edit"}
              onBlur={() => handleSubmit(submitTheme)()}
            />
          ) : (
            <div className="inherit-input-placeholder">
              {watch(`themeName`)}
            </div>
          )}
        </h4>
        {editMode && (
          <div className="row gap-3 align-center">
            <button
              type="button"
              className="action-ghost-button cursor-drag"
              onMouseDown={handleMouseDown}
            >
              <MdDragIndicator size={ICON_SIZE_MD} />
            </button>
            <Popover>
              <Popover.Toggle id="menu-palette" positionPayload="bottom-right">
                <button type="button" className="action-ghost-button">
                  <MdMoreHoriz size={ICON_SIZE_MD} />
                </button>
              </Popover.Toggle>
              <Popover.Body id="menu-palette">
                <Popover.Actions>
                  <Popover.Tab clickEvent={() => handleAddTheme("before")}>
                    <>
                      <MdArrowUpward size={ICON_SIZE_MD} />
                      Insert theme before
                    </>
                  </Popover.Tab>
                  <Popover.Tab clickEvent={() => handleAddTheme("after")}>
                    <>
                      <MdArrowDownward size={ICON_SIZE_MD} />
                      Insert theme after
                    </>
                  </Popover.Tab>
                  <Popover.Tab clickEvent={() => handleRemoveTheme()}>
                    <div className="remove-text-color row align-center gap-3">
                      <MdDelete size={ICON_SIZE_MD} />
                      Remove theme
                    </div>
                  </Popover.Tab>
                </Popover.Actions>
              </Popover.Body>
            </Popover>
          </div>
        )}
      </div>
      <div className={styles.rowHidden}>
        <div className={styles.sideSettings}>
          <div className={styles.sideSettingsTitle}>
            <h5 className={styles.titlePadding}>Default</h5>
            <MdSunny size={ICON_SIZE_SM} />
          </div>
          <div className={styles.scrollableSettings} ref={scrollableLeft}>
            <ThemeStateForm
              register={register}
              darkableCategory="default"
              themeStateCategory="default"
              handleSubmit={handleSubmit(submitTheme)}
              watch={watch}
              setValue={setValue}
            />
            <ThemeStateForm
              register={register}
              darkableCategory="default"
              themeStateCategory="hover"
              handleSubmit={handleSubmit(submitTheme)}
              watch={watch}
              nullableTheme={true}
              setValue={setValue}
            />
            <ThemeStateForm
              register={register}
              darkableCategory="default"
              themeStateCategory="focus"
              handleSubmit={handleSubmit(submitTheme)}
              watch={watch}
              nullableTheme={true}
              setValue={setValue}
            />
            <ThemeStateForm
              register={register}
              darkableCategory="default"
              themeStateCategory="active"
              handleSubmit={handleSubmit(submitTheme)}
              watch={watch}
              nullableTheme={true}
              setValue={setValue}
            />
          </div>
        </div>
        <div className={styles.previewContainer}>
          <ThemePreview
            base={base}
            defaultBase={DEFAULT_BASE}
            keyBase="default"
            theme={watch()}
          />
          {darkMode && (
            <ThemePreview
              base={base}
              defaultBase={DEFAULT_BASE}
              keyBase="dark"
              theme={watch()}
            />
          )}
        </div>
        {darkMode ? (
          <div className={styles.sideSettings}>
            <div className={styles.sideSettingsTitle}>
              <h5 className={styles.titlePadding}>Dark</h5>
              <MdDarkMode size={ICON_SIZE_SM} />
            </div>
            <div className={styles.scrollableSettings} ref={scrollableRight}>
              <ThemeStateForm
                register={register}
                darkableCategory="dark"
                themeStateCategory="default"
                handleSubmit={handleSubmit(submitTheme)}
                watch={watch}
                setValue={setValue}
              />
              <ThemeStateForm
                register={register}
                darkableCategory="dark"
                themeStateCategory="hover"
                handleSubmit={handleSubmit(submitTheme)}
                watch={watch}
                nullableTheme={true}
                setValue={setValue}
              />
              <ThemeStateForm
                register={register}
                darkableCategory="dark"
                themeStateCategory="focus"
                handleSubmit={handleSubmit(submitTheme)}
                watch={watch}
                nullableTheme={true}
                setValue={setValue}
              />
              <ThemeStateForm
                register={register}
                darkableCategory="dark"
                themeStateCategory="active"
                handleSubmit={handleSubmit(submitTheme)}
                watch={watch}
                nullableTheme={true}
                setValue={setValue}
              />
            </div>
          </div>
        ) : (
          <div className={styles.darkPreviewPlaceholder} />
        )}
      </div>
    </form>
  );
}

export default ThemeComponent;
