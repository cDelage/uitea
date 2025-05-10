import { createContext, RefObject, useContext } from "react";
import { TokenFamily } from "../../../domain/DesignSystemDomain";

export type PreviewContextType = {
  styleRef: RefObject<HTMLDivElement | null>;
  tokenFamilies: TokenFamily[];
};

export const PreviewContext = createContext<
  undefined | PreviewContextType
>(undefined);

export function usePreviewContext() {
  const context = useContext(PreviewContext);
  if (!context)
    throw Error("Context preview was used outside of his scope");
  return context;
}
