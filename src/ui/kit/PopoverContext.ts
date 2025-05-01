import { createContext, useContext } from "react";
import { PositionAbsolute, PositionPayload } from "./PositionAbsolute.type";

export type PopoverContextType = {
  position: PositionAbsolute | null;
  openPopover: (pos: PositionAbsolute, id: string, domRect: DOMRect) => void;
  closePopover: (id: string) => void;
  openPopoverId: string | null;
  setPosition: (pos: PositionAbsolute) => void;
  toggleRect?: DOMRect;
  setToggleRect: (value: DOMRect | undefined) => void;
};

export const PopoverContext = createContext<PopoverContextType | null>(null);

export function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context)
    throw new Error("Popover context was used outside of his scope");
  return context;
}

export type PopoverSelectorContext = {
  activeSelectTab: number | undefined;
  setActiveSelectTab: (value: number | undefined) => void;
  position: PositionPayload;
  setPosition: (pos: PositionPayload) => void;
  initialPosition: PositionPayload;
  setInitialPosition: (pos: PositionPayload) => void;
};

export const PopoverSelectorContext =
  createContext<PopoverSelectorContext | null>(null);

export function usePopoverSelectorContext() {
  const context = useContext(PopoverSelectorContext);
  if (!context)
    throw new Error("Popover selector context was used outside of his scope");
  return context;
}
