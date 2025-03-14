import { PositionAbsolute, PositionPayload } from "../ui/kit/PositionAbsolute.type";

export function getRectPosition(
  position: PositionPayload,
  rect?: DOMRect,
  transform?: string
): PositionAbsolute {
  const pos: PositionAbsolute = {};

  if(!rect){
    return {
      top: 0,
      left:0
    }
  }
  switch (position) {
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
      pos.transform = transform
      break;
    case "bottom-right":
      pos.right = window.innerWidth - rect.x - rect.width;
      pos.top = rect.y + rect.height;
      pos.transform = transform
      break;
  }

  return pos;
}

/**
 * Calcule la position pour que le popover reste visible
 * @param initialPosition Position initiale calculée (ex. via getRectPosition)
 * @param popoverBoundingRect Bounding rect du popover
 * @param toggleButtonRect Bounding rect du bouton toggle
 * @returns Position ajustée
 */
export function calcPositionVisible(
  initialPosition: PositionAbsolute,
  popoverBoundingRect?: DOMRect,
  toggleButtonRect?: DOMRect
): PositionAbsolute {
  if (!popoverBoundingRect || !toggleButtonRect) return initialPosition;

  const { innerWidth, innerHeight } = window;
  const finalPos: PositionAbsolute = { ...initialPosition };

  const toggleVisibleX =
    toggleButtonRect.x >= 0 &&
    toggleButtonRect.x + toggleButtonRect.width <= innerWidth;

  if (toggleVisibleX) {
    if (finalPos.left !== undefined) {
      if (finalPos.left + popoverBoundingRect.width > innerWidth) {
        finalPos.left = innerWidth - popoverBoundingRect.width;
      }
      if (finalPos.left < 0) {
        finalPos.left = 0;
      }
    }
    // Sinon, s'il est positionné via "right", on convertit en "left"
    else if (finalPos.right !== undefined) {
      let computedLeft = innerWidth - finalPos.right - popoverBoundingRect.width;
      if (computedLeft < 0) {
        computedLeft = 0;
      } else if (computedLeft + popoverBoundingRect.width > innerWidth) {
        computedLeft = innerWidth - popoverBoundingRect.width;
      }
      finalPos.left = computedLeft;
      delete finalPos.right;
    }
  }
  const toggleVisibleY =
    toggleButtonRect.top >= 0 &&
    toggleButtonRect.top + toggleButtonRect.height <= innerHeight;

  if (toggleVisibleY) {
    if (finalPos.top !== undefined) {
      // S'il déborde en bas
      if (finalPos.top + popoverBoundingRect.height > innerHeight) {
        finalPos.top = innerHeight - popoverBoundingRect.height;
      }
      // S'il déborde en haut
      if (finalPos.top < 0) {
        finalPos.top = 0;
      }
    } else if (finalPos.bottom !== undefined) {
      let computedTop = innerHeight - finalPos.bottom - popoverBoundingRect.height;
      if (computedTop < 0) {
        computedTop = 0;
      } else if (computedTop + popoverBoundingRect.height > innerHeight) {
        computedTop = innerHeight - popoverBoundingRect.height;
      }
      finalPos.top = computedTop;
      delete finalPos.bottom;
    }
  }
  // Sinon, si le bouton n'est pas totalement visible verticalement,
  // le popover suit le bouton (position initiale).

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
