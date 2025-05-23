import {
  PositionAbsolute,
  PositionPayload,
} from "../ui/kit/PositionAbsolute.type";


export function getRectPosition(
  position: PositionPayload,
  rect?: DOMRect,
  transform?: string
): PositionAbsolute {
  const pos: PositionAbsolute = {};

  if (!rect) {
    return {
      top: 0,
      left: 0,
    };
  }

  switch (position) {
    // ————————————————————————————————————————————
    // positions classiques
    // ————————————————————————————————————————————
    case "top-left":
      pos.left = rect.x;
      pos.top = rect.y;
      pos.transform = transform ?? "translateY(-100%)";
      break;
    case "top-right":
      pos.right = window.innerWidth - rect.x - rect.width;
      pos.top = rect.y;
      pos.transform = transform ?? "translateY(-100%)";
      break;
    case "bottom-left":
      pos.left = rect.x;
      pos.top = rect.y + rect.height;
      pos.transform = transform;
      break;
    case "bottom-right":
      pos.right = window.innerWidth - rect.x - rect.width;
      pos.top = rect.y + rect.height;
      pos.transform = transform;
      break;

    // ————————————————————————————————————————————
    // nouvelles positions « outer »
    // collées sur le côté X du rect au lieu du côté Y
    // ————————————————————————————————————————————
    case "top-left-outer":
      // popover à gauche du rect, aligné sur son sommet
      pos.left = rect.x;
      pos.top = rect.y;
      pos.transform = transform ?? "translateX(-100%)";
      break;
    case "top-right-outer":
      // popover à droite du rect, aligné sur son sommet
      pos.right = window.innerWidth - rect.x - rect.width;
      pos.top = rect.y;
      pos.transform = transform ?? "translateX(100%)";
      break;
    case "bottom-left-outer":
      // popover à gauche du rect, aligné sur son bas
      pos.left = rect.x;
      pos.top = rect.y + rect.height;
      pos.transform = transform ?? "translateX(-100%)";
      break;
    case "bottom-right-outer":
      // popover à droite du rect, aligné sur son bas
      pos.right = window.innerWidth - rect.x - rect.width;
      pos.top = rect.y + rect.height;
      pos.transform = transform ?? "translateX(100%)";
      break;
  }

  return pos;
}


export function calcPositionVisible(
  initialPosition: PositionAbsolute,
  popoverBoundingRect?: DOMRect,
  toggleButtonRect?: DOMRect
): PositionAbsolute {
  if (!popoverBoundingRect || !toggleButtonRect) return initialPosition;

  const { innerWidth, innerHeight } = window;
  const finalPos: PositionAbsolute = { ...initialPosition };
  // Gestion verticale (Y)
  if (finalPos.top !== undefined) {
    const popoverBottom = finalPos.top + popoverBoundingRect.height;
    if (
      popoverBottom > innerHeight &&
      initialPosition.transform !== "translateY(-100%)"
    ) {
      // Si ça déborde en bas, essayer de le placer au-dessus du toggleButton
      const newTop = toggleButtonRect.top - popoverBoundingRect.height;
      if (newTop >= 0) {
        finalPos.top = newTop;
      } else {
        // Si pas possible, rester collé en bas (sans déborder si possible)
        finalPos.top = Math.max(innerHeight - popoverBoundingRect.height, 0);
      }
    } else if (
      initialPosition.top &&
      initialPosition.transform === "translateY(-100%)" &&
      toggleButtonRect.y - popoverBoundingRect.height < 0
    ) {
      finalPos.top = toggleButtonRect.y + toggleButtonRect.height;
      finalPos.transform = undefined;
    }
  }

  // Gestion horizontale (X)
  if (finalPos.left !== undefined) {
    const popoverRight = finalPos.left + popoverBoundingRect.width;
    if (popoverRight > innerWidth) {
      // Si ça déborde à droite, essayer de le caler à gauche du toggle
      const newLeft = toggleButtonRect.right - popoverBoundingRect.width;
      if (newLeft + popoverBoundingRect.width <= innerWidth) {
        finalPos.left = Math.max(newLeft, 0);
      } else {
        // Sinon coller contre la droite de l'écran
        finalPos.left = Math.max(innerWidth - popoverBoundingRect.width, 0);
      }
    }
  } else if (finalPos.right !== undefined) {
    const popoverLeft = innerWidth - finalPos.right - popoverBoundingRect.width;
    if (popoverLeft < 0) {
      // Si ça déborde à gauche, essayer de le caler à droite du toggle
      const newRight =
        innerWidth - toggleButtonRect.left - popoverBoundingRect.width;
      if (newRight >= 0) {
        finalPos.right = newRight;
      } else {
        // Sinon coller contre la gauche de l'écran
        finalPos.right = Math.max(innerWidth - popoverBoundingRect.width, 0);
      }
    }
  }

  return finalPos;
}

export function getAbsolutePosition(
  position: PositionPayload
): PositionAbsolute {
  const pos: PositionAbsolute = {};

  switch (position) {
    case "top-left":
      pos.left = 0;
      pos.top = 0;
      pos.transform = "translate(-50%, -50%)";
      break;
    case "top-right":
      pos.right = 0;
      pos.top = 0;
      pos.transform = "translate(50%, -50%)";
      break;
    case "bottom-left":
      pos.left = 0;
      pos.bottom = 0;
      pos.transform = "translate(-50%, 50%)";
      break;
    case "bottom-right":
      pos.right = 0;
      pos.bottom = 0;
      pos.transform = "translate(50%, 50%)";
      break;
  }

  return pos;
}

export function getOutsideAbsolutePosition(
  position: PositionPayload
): PositionAbsolute {
  const pos: PositionAbsolute = {};

  switch (position) {
    case "top-left":
      pos.left = 0;
      pos.top = 0;
      pos.transform = "translate(-100%, 0%)";
      break;
    case "top-right":
      pos.right = 0;
      pos.top = 0;
      pos.transform = "translate(100%, 0%)";
      break;
    case "bottom-left":
      pos.left = 0;
      pos.bottom = 0;
      pos.transform = "translate(-100%, 0%)";
      break;
    case "bottom-right":
      pos.right = 0;
      pos.bottom = 0;
      pos.transform = "translate(100%, 0%)";
      break;
  }

  return pos;
}

export function checkPositionPayload(
  position: PositionPayload,
  rect: DOMRect
): PositionPayload {
  const { innerWidth, innerHeight } = window;
  const overflowX: boolean =
    (rect.x + rect.width > innerWidth &&
      (position === "top-right" || position === "bottom-right")) ||
    (rect.x < 0 && (position === "bottom-left" || position === "top-left"));

  const overflowY: boolean =
    (rect.y + rect.height > innerHeight &&
      (position === "top-left" || position === "top-right")) ||
    (rect.y < 0 && (position === "bottom-right" || position === "bottom-left"));


  if (overflowX || overflowY) {
    const [yPos, xPos] = position.split("-");
    return recalcPosition({
      x: xPos as XPosition,
      y: yPos as YPosition,
      overflowX,
      overflowY,
    });
  }
  return position;
}

export type XPosition = "left" | "right";
export type YPosition = "top" | "bottom";

function recalcPosition({
  x,
  y,
  overflowX,
  overflowY,
}: {
  x: XPosition;
  y: YPosition;
  overflowX: boolean;
  overflowY: boolean;
}): PositionPayload {
  if (overflowY) {
    return `${getYOpposite(y)}-${overflowX ? getXOpposite(x) : x}`;
  } else if (overflowX) {
    return `${y}-${getXOpposite(x)}`;
  }
  return `${y}-${x}`;
}

function getXOpposite(x: XPosition): XPosition {
  return x === "left" ? "right" : "left";
}

function getYOpposite(y: YPosition): YPosition {
  return y === "top" ? "bottom" : "top";
}
