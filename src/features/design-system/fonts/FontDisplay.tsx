import { useEffect } from "react";
import WebFont from "webfontloader";

function FontDisplay({ display, font, fontSize, lineHeight, width }: { display: string; font: string, fontSize?: string, lineHeight?: string, width?: string }) {
  useEffect(() => {
    WebFont.load({
      google: {
        families: [font],
      },
    });
  }, [font]);
  return (
    <div
      style={{
        fontFamily: font,
        fontSize,
        lineHeight,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        width,
        maxWidth: width
      }}
    >
      {display}
    </div>
  );
}

export default FontDisplay;
