import Slider from 'rc-slider';
import FormComponent from '../../ui/kit/FormComponent';
import { HANDLE_SLIDER_VERTICAL, ICON_SIZE_MD, RAIL_SLIDER_VERTICAL } from '../../ui/UiConstants';
import { Line } from 'react-chartjs-2';
import { ChangeEvent, useMemo } from 'react';
import { AxeData, ChartAxeData, getPaletteChart } from './PaletteChartsUtil';
import { MdRestartAlt } from 'react-icons/md';
import { InterpolationColorSpace, PaletteBuild } from '../../domain/PaletteBuilderDomain';

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
    [axeName, interpolationColorSpace, palette],
  );

  function updateValue(e: ChangeEvent<HTMLInputElement>, axeData: AxeData) {
    let value = e.target.valueAsNumber;
    if (Number.isNaN(value)) {
      console.error('Fail to convert number');
    } else {
      value = Math.min(axeData.max, value);
      value = Math.max(axeData.min, value);
      axeData.update(value);
      axeData.onComplete?.();
    }
  }

  return (
    <FormComponent label={axeLabel} className="w-full">
      <>
        <div className="row justify-between">
          <input
            type="number"
            className="uidt-input"
            min={leftAxeData.min}
            max={leftAxeData.max}
            value={leftAxeData.value}
            onChange={(e) => {
              updateValue(e, leftAxeData);
            }}
            step={0.01}
            style={{
              width: '60px',
            }}
          />
          <input
            type="number"
            className="uidt-input"
            min={rightAxeData.min}
            max={rightAxeData.max}
            value={rightAxeData.value}
            onChange={(e) => {
              updateValue(e, leftAxeData);
            }}
            step={0.01}
            style={{
              width: '60px',
            }}
          />
        </div>
        <div className="row align-center w-full justify-between">
          <div className="column h-full gap-3 justify-center">
            <Slider
              value={leftAxeData.value}
              min={leftAxeData.min}
              max={leftAxeData.max}
              step={leftAxeData.step}
              vertical={true}
              included={false}
              reverse={leftAxeData.reverse}
              onChange={leftAxeData.update}
              onChangeComplete={leftAxeData.onComplete}
              styles={{
                handle: {
                  ...HANDLE_SLIDER_VERTICAL,
                  background: palette.tints[0].color.toString({
                    format: 'hex',
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
            width={'380px'}
            height={'240px'}
          />
          <div className="column h-full justify-center">
            <Slider
              value={rightAxeData.value}
              min={rightAxeData.min}
              max={rightAxeData.max}
              step={rightAxeData.step}
              onChange={rightAxeData.update}
              vertical={true}
              reverse={rightAxeData.reverse}
              onChangeComplete={rightAxeData.onComplete}
              included={false}
              styles={{
                handle: {
                  ...HANDLE_SLIDER_VERTICAL,
                  background: palette.tints[palette.tints.length - 1].color.toString({
                    format: 'hex',
                  }),
                },
                rail: {
                  ...RAIL_SLIDER_VERTICAL,
                  background: `linear-gradient(to bottom, ${rightAxeData.gradient})`,
                },
              }}
            />
            <button className="action-ghost-button" onClick={rightAxeData.reset}>
              <MdRestartAlt size={ICON_SIZE_MD} />
            </button>
          </div>
        </div>
      </>
    </FormComponent>
  );
}

export default PaletteChart;
