import { UseFormRegister, UseFormWatch } from "react-hook-form";
import {
  Typography,
  TypographyScaleFieldPath,
} from "../../domain/DesignSystemDomain";
import { useDesignSystemContext } from "./DesignSystemContext";
import styles from "./InputPopover.module.css";
import {
  FONT_STYLES,
  FONT_WEIGHTS,
  ICON_SIZE_MD,
  TEXT_TRANSFORMS,
  TYPOGRAPHY_SPACING,
} from "../../ui/UiConstants";
import { MdFormatSize } from "react-icons/md";
import Tabs from "./Tabs";

function TypographyPopover({
  register,
  fieldPath,
  watch,
  scaleName
}: {
  register: UseFormRegister<Typography>;
  fieldPath: TypographyScaleFieldPath;
  watch: UseFormWatch<Typography>;
  scaleName: string;
}) {
  const { editMode } = useDesignSystemContext();
  return (
    <div className={styles.inputPopover}>
      <div className={styles.popoverHeader}>
        <MdFormatSize size={ICON_SIZE_MD} />
        <h5>Typography</h5>
      </div>
      <div className={styles.previewContainer} style={{ ...watch(fieldPath) }}>
        <div className={styles.previewText}>{scaleName} Typography scale sample</div>
      </div>
      <div className={styles.popoverBody}>
        <div className={styles.importantValuesContainer}>
          <div className={styles.keyValueImportant}>
            <h6>font-size</h6>
            <div>
              <input
                readOnly={!editMode}
                onMouseDown={(e) => {
                  if (e.currentTarget.readOnly) {
                    e.preventDefault();
                  }
                }}
                className="inherit-input"
                {...register(`${fieldPath}.fontSize`)}
              />
            </div>
          </div>
          <div className={styles.keyValueImportant}>
            <h6>line-height</h6>
            <div>
              <input
                readOnly={!editMode}
                onMouseDown={(e) => {
                  if (e.currentTarget.readOnly) {
                    e.preventDefault();
                  }
                }}
                className="inherit-input"
                {...register(`${fieldPath}.lineHeight`)}
              />
            </div>
          </div>
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
          <div className={styles.minorValuesContainer}>
            <Tabs.TabBody id="default">
              <strong>font-weight</strong>
              <div>
                <select
                  disabled={!editMode}
                  className="inherit-input"
                  {...register(`${fieldPath}.fontWeight`)}
                >
                  {FONT_WEIGHTS.map((fontWeight) => (
                    <option
                      key={fontWeight}
                      style={{
                        fontWeight,
                      }}
                    >
                      {fontWeight}
                    </option>
                  ))}
                </select>
              </div>
              <strong>padding</strong>
              <div>
                <input
                  className="inherit-input inherit-input-size"
                  readOnly={!editMode}
                  onMouseDown={(e) => {
                    if (e.currentTarget.readOnly) {
                      e.preventDefault();
                    }
                  }}
                  {...register(`${fieldPath}.padding`)}
                />
              </div>
              <strong>margin</strong>
              <div>
                <input
                  className="inherit-input inherit-input-size"
                  readOnly={!editMode}
                  onMouseDown={(e) => {
                    if (e.currentTarget.readOnly) {
                      e.preventDefault();
                    }
                  }}
                  {...register(`${fieldPath}.margin`)}
                />
              </div>
            </Tabs.TabBody>
            <Tabs.TabBody id="text-transform">
              <strong>letter-spacing</strong>
              <div>
                <select
                  disabled={!editMode}
                  className="inherit-input"
                  {...register(`${fieldPath}.letterSpacing`)}
                >
                  {TYPOGRAPHY_SPACING.map((typographySpacing) => (
                    <option
                      key={typographySpacing}
                      style={{
                        letterSpacing: typographySpacing,
                      }}
                    >
                      {typographySpacing}
                    </option>
                  ))}
                </select>
              </div>
              <strong>word-spacing</strong>
              <div>
                <select
                  disabled={!editMode}
                  className="inherit-input"
                  {...register(`${fieldPath}.wordSpacing`)}
                >
                  {TYPOGRAPHY_SPACING.map((typographySpacing) => (
                    <option
                      key={typographySpacing}
                      style={{
                        wordSpacing: typographySpacing,
                      }}
                    >
                      {typographySpacing}
                    </option>
                  ))}
                </select>
              </div>
              <strong>font-styles</strong>
              <div>
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
              </div>
              <strong>text-transform</strong>
              <div>
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
              </div>
            </Tabs.TabBody>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default TypographyPopover;
