import { createContext, useContext } from "react";

export type ModalContextType = {
  openModalId: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<null | ModalContextType>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext) as ModalContextType;
  if (!context) throw new Error("Modal context was used outside of his scope");
  return context;
};