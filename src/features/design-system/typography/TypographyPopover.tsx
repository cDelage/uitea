import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import {
  FontWeight,
  Typographies,
  TypographyScaleFieldPath,
  TypographySpacing,
} from "../../../domain/DesignSystemDomain";
import { useDesignSystemContext } from "../DesignSystemContext";
import styles from "../InputPopover.module.css";
import {
  FONT_STYLES,
  FONT_WEIGHTS,
  getRectSize,
  ICON_SIZE_MD,
  TEXT_TRANSFORMS,
  TYPOGRAPHY_SPACING,
} from "../../../ui/UiConstants";
import { MdFormatSize } from "react-icons/md";
import Tabs from "../Tabs";
import InputMeasurement from "../../../ui/kit/InputMeasurement";
import ValueSlider from "../../../ui/kit/ValueSlider";
import FormComponent from "../../../ui/kit/FormComponent";
import Popover from "../../../ui/kit/Popover";
import FontDisplay from "../fonts/FontDisplay";
import { PreviewEmptyStyle, PreviewStyle } from "../previews/PreviewStyle";
import { getTypoCssProperties } from "../../../util/DesignSystemUtils";

function TypographyPopover({
  register,
  fieldPath,
  watch,
  scaleName,
  setValue,
  handleSubmit,
}: {
  register: UseFormRegister<Typographies>;
  fieldPath: TypographyScaleFieldPath;
  watch: UseFormWatch<Typographies>;
  setValue: UseFormSetValue<Typographies>;
  scaleName: string;
  handleSubmit: () => void;
}) {
  const { editMode, tokenFamilies, designSystem } = useDesignSystemContext();
  const { fonts, semanticColorTokens } = designSystem;
  const selectedFont = watch(`${fieldPath}.font`);
  const selectedFontValue: string | undefined =
    selectedFont &&
    fonts.additionals.find((font) => font.fontName === selectedFont)?.value;

  const selectedColor = watch(`${fieldPath}.color`);

  const textColors: string[] = [
    "base-text-light",
    "base-text-default",
    "base-text-dark",
    ...semanticColorTokens.colorCombinationCollections
      .filter((collection) => collection.default?.text)
      .map((collection) => `${collection.combinationName}-text`),
  ];

  return (
    <div className={styles.inputPopover}>
      <div className={styles.popoverHeader}>
        <MdFormatSize size={ICON_SIZE_MD} />
        <h5>Typography</h5>
      </div>
      <PreviewStyle $tokenFamilies={tokenFamilies} $designSystem={designSystem}>
        <div className={styles.previewContainer}>
          <div
            className={styles.previewText}
            style={{
              ...getTypoCssProperties(watch(fieldPath)),
            }}
          >
            {scaleName} Typography scale sample
          </div>
        </div>
      </PreviewStyle>
      <div className={styles.popoverBody}>
        <div className="row gap-6 p-3 border-bottom">
          <FormComponent label="font-size">
            <InputMeasurement
              measurement={watch(`${fieldPath}.fontSize`)}
              setMeasurement={(value) => {
                setValue(`${fieldPath}.fontSize`, value);
              }}
              onBlur={handleSubmit}
            />
          </FormComponent>
          <FormComponent label="line-height">
            <InputMeasurement
              measurement={watch(`${fieldPath}.lineHeight`)}
              setMeasurement={(value) => {
                setValue(`${fieldPath}.lineHeight`, value);
              }}
              onBlur={handleSubmit}
            />
          </FormComponent>
        </div>
        <Tabs defaultTab="default">
          <div className={styles.tabsContainer}>
            <Tabs.Tab id="default">
              <button className={styles.tab}>Default</button>
            </Tabs.Tab>
            <Tabs.Tab id="text-transform">
              <button className={styles.tab}>Text transform</button>
            </Tabs.Tab>
          </div>
          <Tabs.TabBody id="default">
            <div className="column gap-6 p-3 border-box overflow-hidden">
              <FormComponent label="font-weight">
                <div className="row align-center gap-3">
                  <ValueSlider
                    value={watch(`${fieldPath}.fontWeight`)}
                    onChangeComplete={handleSubmit}
                    setValue={(value) => {
                      setValue(`${fieldPath}.fontWeight`, value as FontWeight);
                    }}
                    values={FONT_WEIGHTS}
                  />
                  <div
                    style={{
                      fontWeight: watch(`${fieldPath}.fontWeight`),
                    }}
                  >
                    {watch(`${fieldPath}.fontWeight`)}
                  </div>
                </div>
              </FormComponent>
              <div className="row gap-6 border-box">
                <Popover>
                  <div
                    className="flex-1"
                    style={{
                      width: "calc(50% - 10px)",
                      maxWidth: "calc(50% - 10px)",
                    }}
                  >
                    <FormComponent label="font" className="w-100 max-w-100">
                      <Popover.Toggle
                        id="font-selector"
                        disabled={!fonts.additionals.length}
                      >
                        <div>
                          <Popover.SelectorButton
                            id="font-selector"
                            disabled={!fonts.additionals.length}
                            value={
                              selectedFont &&
                              selectedFontValue && (
                                <FontDisplay
                                  display={selectedFont}
                                  font={selectedFontValue}
                                  width="100px"
                                />
                              )
                            }
                            placeholder="default"
                            onRemove={
                              selectedFont
                                ? () => {
                                    setValue(`${fieldPath}.font`, undefined);
                                    handleSubmit();
                                  }
                                : undefined
                            }
                          />
                        </div>
                      </Popover.Toggle>
                      <Popover.Body id="font-selector" zIndex={2000}>
                        <Popover.Actions width="157px">
                          <Popover.Tab
                            clickEvent={() => {
                              setValue(`${fieldPath}.font`, undefined);
                              handleSubmit();
                            }}
                            theme={selectedFont ? undefined : "primary"}
                          >
                            <FontDisplay
                              display="default"
                              font={fonts.default}
                              width="110px"
                            />
                          </Popover.Tab>
                          {fonts.additionals.map((font) => (
                            <Popover.Tab
                              clickEvent={() => {
                                setValue(`${fieldPath}.font`, font.fontName);
                                handleSubmit();
                              }}
                              key={font.fontName}
                              width="157px"
                              theme={
                                selectedFont === font.fontName
                                  ? "primary"
                                  : undefined
                              }
                            >
                              <FontDisplay
                                display={font.fontName}
                                font={font.value}
                                fontSize="20px"
                                lineHeight="24px"
                              />
                            </Popover.Tab>
                          ))}
                        </Popover.Actions>
                      </Popover.Body>
                    </FormComponent>
                  </div>
                  <div
                    className="flex-1"
                    style={{
                      width: "calc(50% - 10px)",
                      maxWidth: "calc(50% - 10px)",
                    }}
                  >
                    <FormComponent
                      label="text-color"
                      className="w-100 max-w-100"
                    >
                      <Popover.Toggle id="text-color">
                        <div>
                          <Popover.SelectorButton
                            id="text-color"
                            value={
                              selectedColor ? (
                                <div
                                  className="row align-center gap-2 ellipsis overflow-hidden"
                                  style={{
                                    maxWidth: "110px",
                                  }}
                                >
                                  <div
                                    className="palette-color"
                                    style={{
                                      background: `var(--${selectedColor})`,
                                      ...getRectSize({
                                        height: "var(--uidt-space-5)",
                                      }),
                                    }}
                                  ></div>
                                  {selectedColor}
                                </div>
                              ) : undefined
                            }
                            onRemove={
                              selectedColor
                                ? () =>
                                    setValue(`${fieldPath}.color`, undefined)
                                : undefined
                            }
                            placeholder="default"
                          />
                        </div>
                      </Popover.Toggle>
                      <Popover.Body id="text-color" zIndex={2000}>
                        <PreviewEmptyStyle $tokenFamilies={tokenFamilies}>
                          <Popover.Actions width="157px">
                            {textColors.map((color) => (
                              <Popover.Tab
                                key={color}
                                clickEvent={() =>
                                  setValue(`${fieldPath}.color`, color)
                                }
                                theme={
                                  selectedColor === color
                                    ? "primary"
                                    : undefined
                                }
                              >
                                <div className="row align-center gap-2">
                                  <div
                                    className="palette-color"
                                    style={{
                                      background: `var(--${color})`,
                                      ...getRectSize({
                                        height: "var(--uidt-space-5)",
                                      }),
                                    }}
                                  ></div>
                                  {color}
                                </div>
                              </Popover.Tab>
                            ))}
                          </Popover.Actions>
                        </PreviewEmptyStyle>
                      </Popover.Body>
                    </FormComponent>
                  </div>
                </Popover>
              </div>
              <div className="row gap-6">
                <FormComponent label="padding">
                  <InputMeasurement
                    measurement={watch(`${fieldPath}.padding`)}
                    setMeasurement={(value) => {
                      setValue(`${fieldPath}.padding`, value);
                    }}
                    onBlur={handleSubmit}
                  />
                </FormComponent>
                <FormComponent label="margin">
                  <InputMeasurement
                    measurement={watch(`${fieldPath}.margin`)}
                    setMeasurement={(value) => {
                      setValue(`${fieldPath}.margin`, value);
                    }}
                    onBlur={handleSubmit}
                  />
                </FormComponent>
              </div>
            </div>
          </Tabs.TabBody>
          <Tabs.TabBody id="text-transform">
            <div className="column gap-6 p-3">
              <FormComponent label="letter-spacing">
                <div className="row gap-3 align-center">
                  <ValueSlider
                    value={watch(`${fieldPath}.letterSpacing`)}
                    setValue={(val) =>
                      setValue(
                        `${fieldPath}.letterSpacing`,
                        val as TypographySpacing
                      )
                    }
                    values={TYPOGRAPHY_SPACING}
                    onChangeComplete={handleSubmit}
                  />
                  <div>{watch(`${fieldPath}.letterSpacing`)}</div>
                </div>
              </FormComponent>
              <FormComponent label="word-spacing">
                <div className="row gap-3 align-center">
                  <ValueSlider
                    value={watch(`${fieldPath}.wordSpacing`)}
                    setValue={(val) =>
                      setValue(
                        `${fieldPath}.wordSpacing`,
                        val as TypographySpacing
                      )
                    }
                    values={TYPOGRAPHY_SPACING}
                    onChangeComplete={handleSubmit}
                  />
                  <div>{watch(`${fieldPath}.wordSpacing`)}</div>
                </div>
              </FormComponent>
              <div className="row gap-6">
                <FormComponent label="font-styles" className="flex-1">
                  <select
                    disabled={!editMode}
                    {...register(`${fieldPath}.fontStyle`)}
                    onBlur={handleSubmit}
                  >
                    {FONT_STYLES.map((fontStyle) => (
                      <option
                        key={fontStyle}
                        style={{
                          fontStyle: fontStyle,
                        }}
                      >
                        {fontStyle}
                      </option>
                    ))}
                  </select>
                </FormComponent>
                <FormComponent label="text-transform" className="flex-1">
                  <select
                    disabled={!editMode}
                    {...register(`${fieldPath}.textTransform`)}
                    onBlur={handleSubmit}
                  >
                    {TEXT_TRANSFORMS.map((textTransform) => (
                      <option
                        key={textTransform}
                        style={{
                          textTransform: textTransform,
                        }}
                      >
                        {textTransform}
                      </option>
                    ))}
                  </select>
                </FormComponent>
              </div>
            </div>
          </Tabs.TabBody>
        </Tabs>
      </div>
    </div>
  );
}

export default TypographyPopover;
