import { PositionAbsolute, PositionPayload } from "./PositionAbsolute.type";

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
