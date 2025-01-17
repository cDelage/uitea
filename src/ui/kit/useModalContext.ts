import { createContext, useContext } from "react";

export type ModalContextType = {
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
};

export const ModalContext = createContext<null | ModalContextType>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext) as ModalContextType;
  if (!context) throw new Error("Modal context was used outside of his scope");
  return context;
};