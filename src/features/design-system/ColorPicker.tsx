import { ChromePicker } from "react-color";
import { colorToString } from "../../util/DesignSystemUtils";

function ColorPicker({
  color,
  setColor,
}: {
  color?: string;
  setColor?: (value: string) => void;
}) {
  return (
    <ChromePicker
      color={color}
      onChange={(color) => {
        setColor?.(colorToString(color));
      }}
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
  );
}

export default ColorPicker;
