import { ChromePicker } from "react-color";
import { colorToString } from "../../util/DesignSystemUtils";

function ColorPicker({
  color,
  setColor,
  disableAlpha,
}: {
  color?: string;
  setColor?: (value: string) => void;
  disableAlpha?: boolean;
}) {
  return (
    <div className="color-picker">
      <ChromePicker
        color={color}
        onChange={(color) => {
          setColor?.(colorToString(color));
        }}
        disableAlpha={disableAlpha}
        styles={{
          default: {
            picker: {
              background: "#FFFFFF",
              width: "100%",
              boxShadow: "none",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
            },
            body: {
              fontSize: "20px",
            },
          },
        }}
      />
    </div>
  );
}

export default ColorPicker;
