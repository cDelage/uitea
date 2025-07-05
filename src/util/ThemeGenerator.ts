import { IndependantColors, Palette } from "../domain/DesignSystemDomain";
import ColorIO from "colorjs.io";
import { computeValueByCenter, interpolateHueRelative } from "./Interpolation";

function recolorWithNewBackground({
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
  if (defaultColor.toString({ format: "hex" }) === "#fff") {
    console.log("hsl:", h, s, l, {
      initialCenter: defaultCenter.okhsl[2],
      initialValue: defaultColor.okhsl[2],
      newCenter: newCenter.okhsl[2],
    })
  }

  const result = new ColorIO("okhsl", [h, s, l]);

  return result;
}

export interface RecolorPaletteResult {
  palettes: Palette[];
  independantColors: IndependantColors;
}

/**
 * Compute a new color theme from original palette, with a default background, to new background.
 * @param param0 
 * @returns 
 */
export function recolorPalettes({
  palettes,
  defaultBackground,
  newBackground,
  independantColors
}: {
  palettes: Palette[];
  defaultBackground: string;
  newBackground: string;
  independantColors: IndependantColors;
}): RecolorPaletteResult {
  const palettesToUpdate = [...palettes];
  let defaultBgColor = new ColorIO(defaultBackground);
  const newBgColor = new ColorIO(newBackground);
  const isReversed: boolean =
    defaultBgColor.okhsl[2] >= 0.5 !== newBgColor.okhsl[2] >= 0.5;

  //Reverse manipulation: when pass from a light theme to dark theme, then compute differently the background
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
    defaultBgColor = recolorWithNewBackground({
      defaultColor: defaultBgColor,
      newCenter: paletteMax,
      defaultCenter: paletteMin,
    });
  }

  const palettesRecolor: Palette[] = palettesToUpdate.map((palette) => {
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
          color: recolorWithNewBackground({
            defaultCenter: defaultBgColor,
            defaultColor: new ColorIO(tint.color),
            newCenter: newBgColor,
          }).toString({ format: "hex" }),
        };
      }),
    };
  });
  const independantRecolor: IndependantColors = {
    white: recolorWithNewBackground({
      defaultCenter: new ColorIO(defaultBackground),
      defaultColor: new ColorIO(independantColors.white),
      newCenter: newBgColor,
    }).toString({ format: "hex" }),
    independantColors: independantColors.independantColors.map(tint => {
      return {
        label: tint.label,
        color: recolorWithNewBackground({
          defaultCenter: new ColorIO(defaultBackground),
          defaultColor: new ColorIO(tint.color),
          newCenter: newBgColor,
        }).toString({ format: "hex" })
      }
    })
  }
  return {
    palettes: palettesRecolor,
    independantColors: independantRecolor
  };
}
