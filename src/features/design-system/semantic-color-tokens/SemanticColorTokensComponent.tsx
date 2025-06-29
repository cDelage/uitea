import styles from "../ComponentDesignSystem.module.css";
import PreviewComponentDesignSystem from "../previews/PreviewComponentDesignSystem";
import SemanticPreview from "./SemanticPreview";
import { useDesignSystemContext } from "../DesignSystemContext";
import { useParams } from "react-router-dom";
import { useSaveDesignSystem } from "../DesignSystemQueries";
import { isEqual } from "lodash";
import {
  DesignToken,
  Palette,
  SemanticColorTokens,
  Tint,
} from "../../../domain/DesignSystemDomain";
import { useForm } from "react-hook-form";
import SemanticBaseInput from "./SemanticBaseInput";
import { useRef } from "react";
import { useTriggerScroll } from "../../../util/TriggerScrollEvent";
import { useRefreshDesignSystemFormsEvent } from "../../../util/RefreshDesignSystemFormsEvent";
import { useSidebarComponentVisible } from "../../../util/SidebarComponentVisible";
import Popover from "../../../ui/kit/Popover";
import TokenSelector from "../../../ui/kit/TokenSelector";
import ColorIO from "colorjs.io";

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

  function handleSetBaseBackground(token: DesignToken) {
    const backgroundColor = new ColorIO(token.value);
    const textPalette: Palette | undefined =
      designSystem.palettes
        .filter((palette) => {
          const centerTint =
            palette.tints[Math.floor(palette.tints.length / 2)];
          const colorCenterTint = new ColorIO(centerTint.color);
          return colorCenterTint.get("okhsl.s") < 0.25;
        })
        .reduce((acc: Palette | undefined, cur) => {
          if (!acc) return cur;
          const accCenterTint = acc.tints[Math.floor(acc.tints.length / 2)];
          const curCenterTint = cur.tints[Math.floor(cur.tints.length / 2)];
          const accCenterColor = new ColorIO(accCenterTint.color);
          const curCenterColor = new ColorIO(curCenterTint.color);
          return accCenterColor.get("okhsl.s") > curCenterColor.get("okhsl.s")
            ? acc
            : cur;
        }, undefined) ??
      designSystem.palettes.find((palette) => {
        const tokens = palette.tints.map((tint) => {
          return `palette-${palette.paletteName}-${tint.label}`;
        });
        return tokens.includes(token.label);
      });

    if (textPalette) {
      const lightToken: Tint | undefined = textPalette.tints.find((tint) => {
        const tintColor = new ColorIO(tint.color);
        return tintColor.contrastWCAG21(backgroundColor) > 4.5;
      });

      if (lightToken) {
        setValue(
          "textLight",
          `palette-${textPalette.paletteName}-${lightToken.label}`
        );
        const darkToken: Tint | undefined = textPalette.tints.reduce(
          (acc: Tint | undefined, cur) => {
            if (!acc) return cur;
            const tintColor = new ColorIO(cur.color);
            const accColor = new ColorIO(acc.color);

            return backgroundColor.contrastWCAG21(tintColor) >
              backgroundColor.contrastWCAG21(accColor)
              ? cur
              : acc;
          },
          undefined
        );

        if (darkToken) {
          setValue(
            "textDark",
            `palette-${textPalette.paletteName}-${darkToken.label}`
          );

          const lightContrast = backgroundColor.contrastWCAG21(
            new ColorIO(lightToken.color)
          );
          const darkContrast = backgroundColor.contrastWCAG21(
            new ColorIO(darkToken.color)
          );
          const defaultTargetContrast =
            lightContrast + ((darkContrast - lightContrast) / 2);
          const defaultToken: Tint | undefined = textPalette.tints.reduce(
            (acc: Tint | undefined, cur) => {
              if (!acc) return cur;
              const tintColor = new ColorIO(cur.color);
              const accColor = new ColorIO(acc.color);

              return Math.abs(
                backgroundColor.contrastWCAG21(tintColor) -
                  defaultTargetContrast
              ) <
                Math.abs(
                  backgroundColor.contrastWCAG21(accColor) -
                    defaultTargetContrast
                )
                ? cur
                : acc;
            },
            undefined
          );
          if (defaultToken) {
            setValue(
              "textDefault",
              `palette-${textPalette.paletteName}-${defaultToken.label}`
            );
          }
        }
      }

      const borderToken: Tint | undefined = textPalette.tints.find((tint) => {
        const tintColor = new ColorIO(tint.color);
        return tintColor.contrastWCAG21(backgroundColor) > 2.5;
      });

      if (borderToken) {
        setValue(
          "border",
          `palette-${textPalette.paletteName}-${borderToken.label}`
        );
      }
    }

    setValue("background", token.label);
    handleSubmit(submitSemanticColorTokens)();
  }

  const tokenExist =
    watch("background") ||
    watch("border") ||
    watch("textDark") ||
    watch("textDefault") ||
    watch("textLight") ||
    designSystem.semanticColorTokens.colorCombinationCollections.length;

  return (
    <Popover>
      <form ref={semanticTokensRef} className={styles.componentDesignSystem}>
        {tokenExist ? (
          <>
            <div
              className={styles.sideSettings}
              style={{ maxHeight: "600px" }}
            >
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
            <PreviewComponentDesignSystem>
              <SemanticPreview />
            </PreviewComponentDesignSystem>
            <div className={styles.darkPreviewPlaceholder} />
          </>
        ) : (
          <div className={styles.componentHead}>
            <Popover.Toggle id="background">
              <div
                className="add-button w-full row justify-center"
                style={{
                  height: "120px",
                }}
              >
                <h4
                  style={{
                    fontWeight: "400",
                  }}
                >
                  Select your page background color
                </h4>
              </div>
            </Popover.Toggle>
            <Popover.Body id="background" zIndex={100}>
              <TokenSelector
                tokensFamilies={tokenFamilies}
                onSelect={handleSetBaseBackground}
              />
            </Popover.Body>
          </div>
        )}
      </form>
    </Popover>
  );
}

export default SemanticColorTokensComponent;
