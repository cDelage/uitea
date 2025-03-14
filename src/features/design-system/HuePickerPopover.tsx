import { HuePicker } from "react-color";
import styles from "./HuePickerPopover.module.css";
import FormComponent from "../../ui/kit/FormComponent";
import InputText from "../../ui/kit/InputText";
import { useEffect, useState } from "react";
import chroma from "chroma-js";
import Popover from "../../ui/kit/Popover";
import { getProximateHues, isValidColor } from "../../util/PaletteBuilderStore";
import styled, { css } from "styled-components";

const PickerContainer = styled.div<{ saturation?: number }>`
  ${(props) =>
    props.saturation !== undefined &&
    css`
      filter: saturate(${props.saturation});
    `}
`;

function HuePickerPopover({
  onClose,
  color,
  saturation,
}: {
  onClose?: (color: string) => void;
  color?: string;
  saturation?: number;
}) {
  const [hue, setHue] = useState(color ?? "#0C00FF");
  const [colorCode, setColorCode] = useState("");
  const [hueArray, setHueArray] = useState<string[]>([]);

  function handleSetHue(hexCode: string){
    const hsl = chroma(hexCode).hsl();
    const newColorHex = chroma.hsl(hsl[0], saturation ?? 1, 0.5).hex();
    setHue(newColorHex);
  }

  useEffect(() => {
    if (isValidColor(colorCode)) {
      const hsl = chroma(colorCode).hsl();
      const hue = hsl[0];

      const newColorHex = chroma.hsl(hue, saturation ?? 1, 0.5).hex();
      setHue(newColorHex);
    }
  }, [colorCode, saturation]);

  useEffect(() => {
    setHueArray(getProximateHues(hue));
  }, [hue]);

  return (
    <Popover.Body
      id="hue-popover"
      zIndex={40}
      key={color}
      closeCallback={() => {
        onClose?.(hue);
      }}
    >
      <div className={styles.huePickerContainer} data-disableoutside={true}>
        <div className={styles.headerContainer}>
          <PickerContainer saturation={saturation}>
            <HuePicker
              width="100%"
              color={hue}
              onChange={(picker) => handleSetHue(picker.hex)}
            />
          </PickerContainer>
          <div className={styles.hueArrayContainer}>
            {hueArray.map((hueInstance) => (
              <div
                key={hueInstance}
                className={styles.hueInstance}
                data-active={hueInstance === hue}
                onClick={() => handleSetHue(hueInstance)}
                style={{
                  backgroundColor: hueInstance,
                  filter: `saturate(${saturation})`
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className={styles.hexPreviewContainer}>
          <div className={styles.colorCodeContainer}>
            <FormComponent label="Color code">
              <InputText
                value={colorCode}
                onChange={(e) => setColorCode(e.target.value)}
              />
            </FormComponent>
          </div>
          <div className={styles.previewContainer}>
            <FormComponent label="Computed hue">
              <div className="row align-center justify-center">
                <div className="column gap-3">
                  <div
                    className={styles.colorContainer}
                    style={{
                      backgroundColor: hue,
                    }}
                  ></div>
                  <strong>{hue}</strong>
                </div>
              </div>
            </FormComponent>
          </div>
        </div>
      </div>
    </Popover.Body>
  );
}

export default HuePickerPopover;
