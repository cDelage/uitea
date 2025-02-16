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
import CopyableLabel from "../../ui/kit/CopyableLabel";
import { getThemeToken } from "../../util/DesignSystemUtils";

function ThemeStateForm({
  handleSubmit,
  register,
  themeStateCategory,
  darkableCategory,
  watch,
  nullableTheme,
  setValue,
}: {
  handleSubmit: () => void;
  register: UseFormRegister<ThemeColor>;
  themeStateCategory: ThemeStateCategory;
  darkableCategory: DarkableCategory;
  watch: UseFormWatch<ThemeColor>;
  nullableTheme?: boolean;
  setValue: UseFormSetValue<ThemeColor>;
}) {
  const { themesMode, findDesignSystemColor } = useDesignSystemContext();
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
  }

  return (
    <div className="column">
      {((nullableTheme && themesMode === "edit") || !themeUndefined) &&
        themeStateCategory !== "default" && (
          <div className={styles.checkboxThemeContainer}>
            {themesMode === "edit" && (
              <input
                checked={!themeUndefined}
                type="checkbox"
                disabled={themesMode !== "edit"}
                onChange={(e) => handleCheck(e.target.checked)}
              />
            )}
            <strong>
              {themesMode !== "edit" && <>:</>}
              {themeStateCategory}
            </strong>
          </div>
        )}
      {!themeUndefined && (
        <>
          <InputDesignSystem
            mode={themesMode}
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
            popoverCopy={
              <>
                <div className="popover-body">
                  <CopyableLabel
                    copyable={getThemeToken({
                      themeItem: "background",
                      themeName: watch("themeName"),
                      themeStateCategory,
                    })}
                  />
                  <CopyableLabel
                    copyable={watch(
                      `${themeStateCategory}.background.${darkableCategory}`
                    )}
                  />
                </div>
              </>
            }
          />
          <InputDesignSystem
            mode={themesMode}
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
            popoverCopy={
              <>
                <div className="popover-body">
                  <CopyableLabel
                    copyable={getThemeToken({
                      themeItem: "border",
                      themeName: watch("themeName"),
                      themeStateCategory,
                    })}
                  />
                  <CopyableLabel
                    copyable={watch(
                      `${themeStateCategory}.border.${darkableCategory}`
                    )}
                  />
                </div>
              </>
            }
          />
          <InputDesignSystem
            mode={themesMode}
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
            popoverCopy={
              <>
                <div className="popover-body">
                  <CopyableLabel
                    copyable={getThemeToken({
                      themeItem: "text",
                      themeName: watch("themeName"),
                      themeStateCategory,
                    })}
                  />
                  <CopyableLabel
                    copyable={watch(
                      `${themeStateCategory}.text.${darkableCategory}`
                    )}
                  />
                </div>
              </>
            }
          />
        </>
      )}
    </div>
  );
}

export default ThemeStateForm;
