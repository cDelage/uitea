export type PositionAbsolute = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  transform?: string;
};

export type PositionPayload =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  // ⇓⇓⇓ nouvelles positions ⇓⇓⇓
  | "top-left-outer"
  | "top-right-outer"
  | "bottom-left-outer"
  | "bottom-right-outer";