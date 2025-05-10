import { useMemo } from "react";
import ColorIO from "colorjs.io";
import { MdContrast } from "react-icons/md";
import { ICON_SIZE_SM } from "../../ui/UiConstants";

function ContrastResult({
  color1,
  color2,
}: {
  color1?: string;
  color2?: string;
}) {
  const contrast = useMemo<string | undefined>(() => {
    if (color1 && color2) {
      try {
        return new ColorIO(color1).contrastWCAG21(new ColorIO(color2)).toFixed(2);
      } catch (e) {
        console.error("fail to parse color", e);
        return undefined;
      }
    } else {
      return undefined;
    }
  }, [color1, color2]);
  return (
    <small className="row gap-2 align-center">
      {contrast !== undefined && (
        <MdContrast size={ICON_SIZE_SM} color="text-color-light" />
      )}
      {contrast}
    </small>
  );
}

export default ContrastResult;
