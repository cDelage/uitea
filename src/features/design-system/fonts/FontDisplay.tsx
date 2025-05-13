import { useEffect } from "react";
import WebFont from "webfontloader";

function FontDisplay({ display, font, fontSize, lineHeight }: { display: string; font: string, fontSize?: string, lineHeight?: string }) {
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
        lineHeight
      }}
    >
      {display}
    </div>
  );
}

export default FontDisplay;
