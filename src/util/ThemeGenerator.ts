import { Palette } from "../domain/DesignSystemDomain";
import ColorIO from "colorjs.io";
import { computeValueByCenter, interpolateHueRelative } from "./Interpolation";

function recolor({
  defaultColor,
  newCenter,
  defaultCenter,
}: {
  defaultColor: ColorIO;
  defaultCenter: ColorIO;
  newCenter: ColorIO;
}): ColorIO {
  const h = interpolateHueRelative({
    initialCenter: defaultCenter.okhsl[0],
    initialValue: defaultColor.okhsl[0],
    newCenter: newCenter.okhsl[0],
  });

  const s = computeValueByCenter({
    min: 0,
    max: 1,
    initialCenter: defaultCenter.okhsl[1],
    initialValue: defaultColor.okhsl[1],
    newCenter: newCenter.okhsl[1],
  });

  const l = computeValueByCenter({
    min: 0,
    max: 1,
    initialCenter: defaultCenter.okhsl[2],
    initialValue: defaultColor.okhsl[2],
    newCenter: newCenter.okhsl[2],
  });

  const result = new ColorIO("okhsl", [h, s, l]);

  return result;
}

export function recolorPalettes({
  palettes,
  defaultBackground,
  newBackground,
}: {
  palettes: Palette[];
  defaultBackground: string;
  newBackground: string;
}): Palette[] {
  const palettesToUpdate = [...palettes];
  let defaultBgColor = new ColorIO(defaultBackground);
  const newBgColor = new ColorIO(newBackground);
  const isReversed: boolean =
    defaultBgColor.okhsl[2] >= 0.5 !== newBgColor.okhsl[2] >= 0.5;
  if (isReversed) {
    const [paletteMin, paletteMax] = palettes.reduce<ColorIO[]>(
      (acc, current) => {
        const paletteMin = new ColorIO(current.tints[0].color);
        if (
          !acc.length ||
          defaultBgColor.deltaE76(acc[0]) > defaultBgColor.deltaE76(paletteMin)
        ) {
          return [
            new ColorIO(current.tints[0].color),
            new ColorIO(current.tints[current.tints.length - 1].color),
          ];
        } else {
          return acc;
        }
      },
      []
    );
    defaultBgColor = recolor({
      defaultColor: defaultBgColor,
      newCenter: paletteMax,
      defaultCenter: paletteMin,
    });
  }

  return palettesToUpdate.map((palette) => {
    let newTints = [...palette.tints];
    if (isReversed) {
      newTints.reverse()
      newTints = newTints.map((tint, index) => {
        return {
          ...tint,
          label: palette.tints[index].label
        }
      });
    }
    return {
      ...palette,
      tints: newTints.map((tint) => {
        return {
          ...tint,
          color: recolor({
            defaultCenter: defaultBgColor,
            defaultColor: new ColorIO(tint.color),
            newCenter: newBgColor,
          }).toString({ format: "hex" }),
        };
      }),
    };
  });
}
