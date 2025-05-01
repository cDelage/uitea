import { create } from "zustand";
import { ColorCombinationCollection } from "../../domain/DesignSystemDomain";

interface TokenCrafterStore {
  collection: ColorCombinationCollection;
  setCollection: (collection: ColorCombinationCollection) => void;
  applyCollection: () => void;
}

export const useTokenCrafterStore = create<TokenCrafterStore>((set) => ({
  collection: {},
  setCollection(collection) {
    set((state) => {
      return {
        ...state,
        collection,
      };
    });
  },
  applyCollection() {
    set((state) => {
      return {
        ...state,
        collection: {
          context: state.collection.context,
        },
      };
    });
  },
}));
