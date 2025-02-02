import { createContext, useContext } from "react";
import { PositionAbsolute } from "./PositionAbsolute.type";

export type PopoverContextType = {
  position: PositionAbsolute | null;
  openPopover: (pos: PositionAbsolute, id: string) => void;
  closePopover: () => void;
  openPopoverId: string | null;
};

export const PopoverContext = createContext<PopoverContextType | null>(null);

export function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context)
    throw new Error("Popover context was used outside of his scope");
  return context;
}
