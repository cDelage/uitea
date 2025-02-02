export type PositionAbsolute = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  transform?: string;
};

export type PositionPayload = "top-left" | "top-right" | "bottom-left" | "bottom-right";
