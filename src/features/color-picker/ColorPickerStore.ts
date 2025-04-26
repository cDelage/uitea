import ColorIO from "colorjs.io";
import { create } from "zustand";
import { CanUndoRedo } from "../../util/UndoRedo";
import { invoke } from "@tauri-apps/api";
import {
  ColorPickerStoreData,
  Sample,
  formatPickerStore,
} from "../../domain/ColorPickerDomain";

interface ColorPickerStore {
  colors: ColorIO[];
  canUndoRedo: CanUndoRedo;
  currentColorSample?: string;
  colorSamples: Sample[];
  setColor: (color: ColorIO, index: number) => void;
  initColorPickerStore: () => void;
  registerColorPicker: () => void;
  updateColorSample: (index: number, sample: Sample) => void;
}

export const useColorPickerStore = create<ColorPickerStore>((set, get) => ({
  colors: [],
  currentColorSample: undefined,
  colorSamples: [],
  canUndoRedo: {
    canRedo: false,
    canUndo: false,
  },
  setColor(color: ColorIO, index: number) {
    set((state) => {
      const colors = state.colors;
      colors[index] = color;
      return {
        ...state,
        colors,
      };
    });
    get().registerColorPicker();
  },
  initColorPickerStore: async () => {
    console.log("init");
    const colorPickerStore = await invoke<ColorPickerStoreData>(
      "fetch_color_picker_store"
    );
    console.log("color picker store", colorPickerStore);
    set((state) => {
      return {
        ...state,
        ...colorPickerStore,
        colors: colorPickerStore.colors.map((color) => new ColorIO(color)),
      };
    });
  },
  registerColorPicker: async () => {
    const { colors, colorSamples, currentColorSample } = get();
    await invoke<ColorPickerStoreData>("save_color_picker_store", {
      colorStore: {
        ...formatPickerStore({ colors, colorSamples, currentColorSample }),
      },
    });
  },
  updateColorSample(index: number, sample: Sample) {
    set((state) => {
      const colorSamples = state.colorSamples;
      colorSamples[index] = sample;
      return {
        ...state,
        colorSamples,
      };
    });
    get().registerColorPicker();
  },
}));
