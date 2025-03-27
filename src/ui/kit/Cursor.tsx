import { PositionAbsolute } from "./PositionAbsolute.type";
import { ReactNode } from "react";

function Cursor({
  position,
  zIndex,
  children,
  theme
}: {
  position: PositionAbsolute;
  zIndex?: number;
  children?: ReactNode;
  theme: "add" | "remove";
}) {
  return (
    <div
      style={{
        zIndex: zIndex,
        position: "absolute",
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        right: position.right,
        transform: position.transform,
        background: `var(--${theme}-bg)`,
        border:  `var(--${theme}-border) 1px solid`,
        color:  `var(--${theme}-text)`,
        borderRadius: "50%",
        padding: "var(--space-2)"
      }}
    >
      {children}
    </div>
  );
}

export default Cursor;
