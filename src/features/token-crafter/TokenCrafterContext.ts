import { createContext, RefObject, useContext } from "react";
import { DesignSystem, TokenFamily } from "../../domain/DesignSystemDomain";

export type TokenCrafterContextType = {
  designSystem: DesignSystem;
  paletteTokens: TokenFamily[];
  semanticTokens: TokenFamily[];
  tokenFamilies: TokenFamily[];
  styleRef: RefObject<HTMLDivElement | null>;
};

export const TokenCrafterContext = createContext<
  undefined | TokenCrafterContextType
>(undefined);

export function useTokenCrafterContext() {
  const context = useContext(TokenCrafterContext);
  if (!context)
    throw Error("Context tokencrafter was used outside of his scope");
  return context;
}
