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
  ICON_SIZE_MD,
  TEXT_TRANSFORMS,
  TYPOGRAPHY_SPACING,
} from "../../../ui/UiConstants";
import { MdFormatSize } from "react-icons/md";
import Tabs from "../Tabs";
import InputMeasurement from "../../../ui/kit/InputMeasurement";
import ValueSlider from "../../../ui/kit/ValueSlider";
import FormComponent from "../../../ui/kit/FormComponent";

function TypographyPopover({
  register,
  fieldPath,
  watch,
  scaleName,
  setValue,
}: {
  register: UseFormRegister<Typographies>;
  fieldPath: TypographyScaleFieldPath;
  watch: UseFormWatch<Typographies>;
  setValue: UseFormSetValue<Typographies>;
  scaleName: string;
}) {
  const { editMode } = useDesignSystemContext();
  return (
    <div className={styles.inputPopover}>
      <div className={styles.popoverHeader}>
        <MdFormatSize size={ICON_SIZE_MD} />
        <h5>Typography</h5>
      </div>
      <div className={styles.previewContainer}>
        <div className={styles.previewText}>
          {scaleName} Typography scale sample
        </div>
      </div>
      <div className={styles.popoverBody}>
        <div className="row gap-6 p-3 border-bottom">
          <FormComponent label="font-size">
            <InputMeasurement
              measurement={watch(`${fieldPath}.fontSize`)}
              setMeasurement={(value) => {
                setValue(`${fieldPath}.fontSize`, value);
              }}
            />
          </FormComponent>
          <FormComponent label="line-height">
            <InputMeasurement
              measurement={watch(`${fieldPath}.lineHeight`)}
              setMeasurement={(value) => {
                setValue(`${fieldPath}.lineHeight`, value);
              }}
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
            <div className="column gap-6 p-3">
              <FormComponent label="font-weight">
                <div className="row align-center gap-3">
                  <ValueSlider
                    value={watch(`${fieldPath}.fontWeight`)}
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
              <div className="row gap-6">
                <FormComponent label="padding">
                  <InputMeasurement
                    measurement={watch(`${fieldPath}.padding`)}
                    setMeasurement={(value) => {
                      setValue(`${fieldPath}.padding`, value);
                    }}
                  />
                </FormComponent>
                <FormComponent label="margin">
                  <InputMeasurement
                    measurement={watch(`${fieldPath}.margin`)}
                    setMeasurement={(value) => {
                      setValue(`${fieldPath}.margin`, value);
                    }}
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
                  />
                  <div>{watch(`${fieldPath}.wordSpacing`)}</div>
                </div>
              </FormComponent>
              <div className="row gap-6">
                <FormComponent label="font-styles" className="flex-1">
                  <select
                    disabled={!editMode}
                    className="inherit-input"
                    {...register(`${fieldPath}.fontStyle`)}
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
                    className="inherit-input"
                    {...register(`${fieldPath}.textTransform`)}
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
