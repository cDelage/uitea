import { createContext, useContext } from "react";
import { DesignSystem, TokenFamily } from "../../domain/DesignSystemDomain";

export type TokenCrafterContextType = {
  designSystem: DesignSystem;
  paletteTokens: TokenFamily[];
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
