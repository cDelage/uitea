import {
  getColorsRecommanded,
  getEndsTints,
  getHueName,
  getPaletteCharts,
  huesName,
  PaletteBuild,
  PaletteChartsData,
  PaletteColor,
  TintBuild,
  usePaletteBuilder3Store,
} from "./PaletteBuilder3Store";
import styles from "./PaletteBuilder3.module.css";
import { useMemo } from "react";
import "rc-slider/assets/index.css";
import ColorPickerLinear from "../../../ui/kit/picker/ColorPickerLinear";
import FormComponent from "../../../ui/kit/FormComponent";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { Chart } from "chart.js";
import Slider from "rc-slider";
import {
  getRectSize,
  HANDLE_SLIDER,
  ICON_SIZE_MD,
} from "../../../ui/UiConstants";
import { MdAnchor } from "react-icons/md";
import { getContrastColor } from "../../../util/PaletteBuilderTwoStore";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

function PaletteSidePanel({
  palette,
  index,
}: {
  palette?: PaletteBuild;
  index?: number;
}) {
  const {
    updatePalette,
    createPaletteFromExisting,
    settings: { interpolationColorSpace },
  } = usePaletteBuilder3Store();
  const centerTint = useMemo<TintBuild | undefined>(
    () => (palette ? palette.tints.find((color) => color.isCenter) : undefined),
    [palette]
  );

  const chartsData = useMemo<PaletteChartsData | undefined>(
    () =>
      palette ? getPaletteCharts(palette, interpolationColorSpace) : undefined,
    [palette, interpolationColorSpace]
  );

  const colorsRecommanded = useMemo(
    () => getColorsRecommanded(centerTint?.color),
    [centerTint]
  );

  function setPaletteName(name: string) {
    if (index !== undefined && palette && name) {
      updatePalette(index, {
        ...palette,
        name,
      });
    }
  }

  function updateColor({
    newTint,
    value,
  }: {
    newTint: TintBuild;
    value: PaletteColor;
  }) {
    if (palette && index !== undefined) {
      const newTintUpdated: TintBuild = {
        ...newTint,
        color: value,
      };
      const newPalette: PaletteBuild = {
        ...palette,
        tints: palette.tints.map((tint) =>
          tint.name === newTint.name ? newTintUpdated : tint
        ),
      };
      const newCenter = newPalette.tints.find((tint) => tint.isCenter)?.color;
      newPalette.name =
        newCenter && huesName.includes(newPalette.name)
          ? getHueName(newCenter.hex())
          : newPalette.name;
      if (newTintUpdated.isCenter && centerTint) {
        const [startColor, endColor] = getEndsTints(
          centerTint.color,
          palette.settings
        );
        newPalette.tints[0] = {
          ...newPalette.tints[0],
          color: startColor as PaletteColor,
        };
        newPalette.tints[newPalette.tints.length - 1] = {
          ...newPalette.tints[newPalette.tints.length - 1],
          color: endColor as PaletteColor,
        };
      }
      updatePalette(index, newPalette);
    }
  }

  function handleUpdateMaxLightness(lightnessMax: number | number[]) {
    if (typeof lightnessMax === "number" && palette && index !== undefined) {
      updatePalette(index, {
        ...palette,
        settings: {
          ...palette.settings,
          lightnessMax: lightnessMax / 100,
        },
      });
    }
  }

  function handleUpdateMinLightness(lightnessMin: number | number[]) {
    if (typeof lightnessMin === "number" && palette && index !== undefined) {
      updatePalette(index, {
        ...palette,
        settings: {
          ...palette.settings,
          lightnessMin: 1 - lightnessMin / 100,
        },
      });
    }
  }

  function toggleAnchorTint(tintIndex: number) {
    if (palette && index !== undefined) {
      updatePalette(index, {
        ...palette,
        tints: palette.tints.map((tint, i) => {
          return {
            ...tint,
            isAnchor:
              i === tintIndex ? (!tint.isAnchor ? true : false) : tint.isAnchor,
          };
        }),
      });
    }
  }

  console.log(palette);

  if (!palette) return;
  return (
    <div className={styles.sidePanel}>
      {centerTint && (
        <>
          <div className={styles.sidePanelHeader}>
            <div className="column gap-6">
              <div className="row gap-6">
                <div
                  className="paletteColor"
                  style={{
                    background: centerTint?.color.hex(),
                    ...getRectSize({ height: "var(--space-10)" }),
                  }}
                ></div>
                <h2 className="text-color-dark">
                  <input
                    className="inherit-input"
                    value={palette.name}
                    onChange={(e) => setPaletteName(e.target.value)}
                  />
                </h2>
              </div>
              <div className="row">
                {palette.tints.map((tint) => (
                  <div
                    key={tint.name}
                    className="flex-1"
                    style={{
                      background: tint.color.hex(),
                      height: "32px",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.sidePanelBodyContainer}>
            <div className={styles.sidePanelContainer}>
              <h5 className="text-color-dark">Main color</h5>
              <ColorPickerLinear
                color={centerTint.color}
                onChange={(color: PaletteColor) => {
                  updateColor({ newTint: centerTint, value: color });
                }}
              />
              <div className="row w-full align-center justify-center gap-4">
                <div
                  className="paletteColor"
                  style={{
                    background: centerTint.color.hex(),
                    ...getRectSize({ height: "var(--space-10)" }),
                  }}
                ></div>
                <div className="column gap-2">
                  <strong className="text-color-dark">{centerTint.name}</strong>
                  <div className="text-color-light">
                    {centerTint.color.hex()}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.separator} />
            {chartsData && (
              <>
                <h5 className="text-color-dark">Palette charts</h5>
                <div className={styles.chartContainer}>
                  <FormComponent label="lightness">
                    <>
                      <div className="row gap-4 align-center">
                        <div className={styles.percentContainer}>
                          {(palette.settings.lightnessMax * 100).toFixed()}%
                        </div>
                        <div className="row w-full">
                          <Slider
                            value={palette.settings.lightnessMax * 100}
                            min={0}
                            max={100}
                            step={1}
                            reverse={true}
                            onChange={handleUpdateMaxLightness}
                            styles={{
                              handle: {
                                ...HANDLE_SLIDER,
                                background: palette.tints[0].color.hex(),
                              },
                              rail: {
                                background: "var(--palette-gray-200)",
                              },
                              track: {
                                background: `linear-gradient(to right, #ffffff,  ${centerTint.color.hex()})`,
                              },
                            }}
                          />
                          <div
                            className="paletteColor"
                            style={{
                              background: centerTint.color.hex(),
                              ...getRectSize({ height: "var(--space-5)" }),
                            }}
                          ></div>
                          <Slider
                            value={(1 - palette.settings.lightnessMin) * 100}
                            min={0}
                            max={100}
                            step={1}
                            onChange={handleUpdateMinLightness}
                            styles={{
                              handle: {
                                ...HANDLE_SLIDER,
                                background:
                                  palette.tints[
                                    palette.tints.length - 1
                                  ].color.hex(),
                              },
                              rail: {
                                background: "var(--palette-gray-200)",
                              },
                              track: {
                                background: `linear-gradient(to right, ${centerTint.color.hex()}, #000000)`,
                              },
                            }}
                          />
                        </div>
                        <div className={styles.percentContainer}>
                          {(palette.settings.lightnessMin * 100).toFixed()}%
                        </div>
                      </div>
                      <Line
                        data={chartsData.lightness}
                        options={chartsData.ligSatOptions}
                        width={"440px"}
                        height={"240px"}
                      />
                    </>
                  </FormComponent>
                  {chartsData.saturation && (
                    <FormComponent label="saturation">
                      <Line
                        data={chartsData.saturation}
                        options={chartsData.ligSatOptions}
                        width={"440px"}
                        height={"240px"}
                      />
                    </FormComponent>
                  )}
                  {chartsData.chroma && (
                    <FormComponent label="chroma">
                      <Line
                        data={chartsData.chroma}
                        options={chartsData.chromaOptions}
                        width={"440px"}
                        height={"240px"}
                      />
                    </FormComponent>
                  )}
                  <FormComponent label="hue">
                    <Line
                      data={chartsData.hue}
                      options={chartsData.hueOptions}
                      width={"440px"}
                      height={"240px"}
                    />
                  </FormComponent>
                </div>
                <div className={styles.separator} />
              </>
            )}
            <h5 className="text-color-dark">Anchor tints</h5>
            <div className="row gap-2">
              {palette.tints.map((tint, i) => (
                <div
                  key={tint.name}
                  className="paletteColor cursor-pointer"
                  style={{
                    background: tint.color.hex(),
                    ...getRectSize({ height: "var(--space-7)", flex: true }),
                  }}
                  onClick={() => toggleAnchorTint(i)}
                >
                  {tint.isAnchor && (
                    <MdAnchor
                      size={ICON_SIZE_MD}
                      color={getContrastColor(tint.color.hex())}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className={styles.separator} />
            <h5 className="text-color-dark">Recommanded colors</h5>
            {colorsRecommanded.map((colorSet) => (
              <div key={colorSet.flag}>
                <FormComponent label={colorSet.flag}>
                  <div className="row wrap">
                    {colorSet.colors.map((color) => (
                      <div
                        className={styles.recommandedHueButton}
                        key={`${color.name}${color.color.hex()}`}
                        onClick={() =>
                          createPaletteFromExisting(palette, color)
                        }
                      >
                        <div
                          className="paletteColor"
                          style={{
                            background: color.color.hex(),
                            ...getRectSize({ height: "var(--space-7)" }),
                          }}
                        ></div>
                        {color.name}
                      </div>
                    ))}
                  </div>
                </FormComponent>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PaletteSidePanel;
