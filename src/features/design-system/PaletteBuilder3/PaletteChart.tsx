import Slider from "rc-slider";
import FormComponent from "../../../ui/kit/FormComponent";
import {
  HANDLE_SLIDER_VERTICAL,
  ICON_SIZE_MD,
  RAIL_SLIDER_VERTICAL,
} from "../../../ui/UiConstants";
import { Line } from "react-chartjs-2";
import { useMemo } from "react";
import { InterpolationColorSpace, PaletteBuild } from "./PaletteBuilder3Store";
import { ChartAxeData, getPaletteChart } from "./PaletteChartsUtil";
import { MdRestartAlt } from "react-icons/md";

function PaletteChart({
  palette,
  interpolationColorSpace,
  chartAxeData: { axeName, axeLabel, leftAxeData, rightAxeData },
}: {
  interpolationColorSpace: InterpolationColorSpace;
  palette: PaletteBuild;
  chartAxeData: ChartAxeData;
}) {
  const paletteChartData = useMemo(
    () => getPaletteChart({ axeName, interpolationColorSpace, palette }),
    [axeName, interpolationColorSpace, palette]
  );

  if (axeName === "h") {
    console.log(paletteChartData);
  }

  return (
    <FormComponent label={axeLabel} className="w-full">
      <>
        <div className="row align-center w-full justify-between">
          <div className="column h-full gap-2 justify-center">
            <Slider
              value={leftAxeData.value}
              min={leftAxeData.min}
              max={leftAxeData.max}
              step={leftAxeData.step}
              vertical={true}
              included={false}
              reverse={leftAxeData.reverse}
              onChange={leftAxeData.update}
              styles={{
                handle: {
                  ...HANDLE_SLIDER_VERTICAL,
                  background: palette.tints[0].color.toString({
                    format: "hex",
                  }),
                },
                rail: {
                  ...RAIL_SLIDER_VERTICAL,
                  background: `linear-gradient(to bottom, ${leftAxeData.gradient})`,
                },
              }}
            />
            <button className="action-ghost-button" onClick={leftAxeData.reset}>
              <MdRestartAlt size={ICON_SIZE_MD} />
            </button>
          </div>
          <Line
            data={paletteChartData.line}
            options={paletteChartData.options}
            width={"380px"}
            height={"240px"}
          />
          <div className="column h-full justify-center">
            <Slider
              value={rightAxeData.value}
              min={rightAxeData.min}
              max={rightAxeData.max}
              step={rightAxeData.step}
              onChange={rightAxeData.update}
              vertical={true}
              included={false}
              styles={{
                handle: {
                  ...HANDLE_SLIDER_VERTICAL,
                  background: palette.tints[
                    palette.tints.length - 1
                  ].color.toString({ format: "hex" }),
                },
                rail: {
                  ...RAIL_SLIDER_VERTICAL,
                  background: `linear-gradient(to bottom, ${rightAxeData.gradient})`,
                },
              }}
            />
            <button
              className="action-ghost-button"
              onClick={rightAxeData.reset}
            >
              <MdRestartAlt size={ICON_SIZE_MD} />
            </button>
          </div>
        </div>
      </>
    </FormComponent>
  );
}

export default PaletteChart;
