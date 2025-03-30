import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useDesignSystemContext } from "./DesignSystemContext";
import InputDesignSystem from "./InputDesignSystem";
import {
  DarkableCategory,
  ThemeColor,
  ThemeStateCategory,
} from "../../domain/DesignSystemDomain";
import styles from "./ThemeStateForm.module.css";
import { getThemeToken } from "../../util/DesignSystemUtils";
import { RefObject } from "react";

function ThemeStateForm({
  handleSubmit,
  register,
  themeStateCategory,
  darkableCategory,
  watch,
  setValue,
  portalTooltip,
}: {
  handleSubmit: () => void;
  register: UseFormRegister<ThemeColor>;
  themeStateCategory: ThemeStateCategory;
  darkableCategory: DarkableCategory;
  watch: UseFormWatch<ThemeColor>;
  setValue: UseFormSetValue<ThemeColor>;
  portalTooltip?: RefObject<HTMLDivElement | null>;
}) {
  const { findDesignSystemColor, editMode } =
    useDesignSystemContext();
  const themeUndefined = watch(themeStateCategory) == undefined;

  function handleCheck(checked: boolean) {
    if (checked) {
      setValue(themeStateCategory, {
        background: {},
        border: {},
        text: {},
      });
    } else {
      setValue(themeStateCategory, undefined);
    }
    handleSubmit();
  }

  return (
    <div className="column">
      {themeStateCategory !== "default" && (editMode || !themeUndefined) && (
        <div className={styles.checkboxThemeContainer}>
          {editMode && (
            <input
              checked={!themeUndefined}
              type="checkbox"
              onChange={(e) => handleCheck(e.target.checked)}
            />
          )}
          <strong>
            {themeStateCategory}
          </strong>
        </div>
      )}
      {!themeUndefined && (
        <>
          <InputDesignSystem
            handleSubmit={handleSubmit}
            label="background"
            register={register(
              `${themeStateCategory}.background.${darkableCategory}`
            )}
            value={watch(
              `${themeStateCategory}.background.${darkableCategory}`
            )}
            isColor={true}
            computedColor={findDesignSystemColor({
              label: watch(
                `${themeStateCategory}.background.${darkableCategory}`
              ),
            })}
            tooltipValue={getThemeToken({
              themeItem: "background",
              themeName: watch("themeName"),
              themeStateCategory,
            })}
            portalTooltip={
              themeStateCategory === "default" ? portalTooltip : undefined
            }
          />
          <InputDesignSystem
            handleSubmit={handleSubmit}
            label="border"
            value={watch(`${themeStateCategory}.border.${darkableCategory}`)}
            register={register(
              `${themeStateCategory}.border.${darkableCategory}`
            )}
            isColor={true}
            computedColor={findDesignSystemColor({
              label: watch(`${themeStateCategory}.border.${darkableCategory}`),
            })}
            tooltipValue={getThemeToken({
              themeItem: "border",
              themeName: watch("themeName"),
              themeStateCategory,
            })}
          />
          <InputDesignSystem
            handleSubmit={handleSubmit}
            label="text"
            value={watch(`${themeStateCategory}.text.${darkableCategory}`)}
            register={register(
              `${themeStateCategory}.text.${darkableCategory}`
            )}
            isColor={true}
            computedColor={findDesignSystemColor({
              label: watch(`${themeStateCategory}.text.${darkableCategory}`),
            })}
            tooltipValue={getThemeToken({
              themeItem: "text",
              themeName: watch("themeName"),
              themeStateCategory,
            })}
          />
        </>
      )}
    </div>
  );
}

export default ThemeStateForm;
