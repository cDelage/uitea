import ColorIO from "colorjs.io";
import { create } from "zustand";
import { CanUndoRedo } from "../../util/UndoRedo";
import { invoke } from "@tauri-apps/api/core";
import {
  ColorPickerStoreData,
  Sample,
  formatPickerStore,
} from "../../domain/ColorPickerDomain";
import { PickerFallback, ColorSpace } from "../../util/PickerUtil";

interface ColorPickerStore {
  colors: ColorIO[];
  canUndoRedo: CanUndoRedo;
  samples: Sample[];
  pickerFallbacks: PickerFallback[];
  activePipette?: number;
  setActivePipette: (index: number | undefined) => void;
  setColor: (color: ColorIO, index: number) => void;
  initColorPickerStore: () => void;
  registerColorPicker: () => void;
  updateColorSample: (index: number, sample: Sample) => void;
  createColorSample: () => void;
  removeColorSample: (index: number) => void;
  undoColorPicker: () => void;
  redoColorPicker: () => void;
  setPickerFallback: (color: ColorIO, colorSpace: ColorSpace) => void;
  
}

export const useColorPickerStore = create<ColorPickerStore>((set, get) => ({
  colors: [],
  samples: [],
  canUndoRedo: {
    canRedo: false,
    canUndo: false,
  },
  pickerFallbacks: [],
  setActivePipette(index: number | undefined) {
    set((state) => {
      return {
        ...state,
        activePipette: index,
      };
    });
  },
  setColor(color: ColorIO, index: number) {
    set((state) => {
      const colors = state.colors;
      colors[index] = color;
      return {
        ...state,
        colors,
        activePipette: undefined,
      };
    });
    get().registerColorPicker();
  },
  initColorPickerStore: async () => {
    const colorPickerStore = await invoke<ColorPickerStoreData>(
      "fetch_color_picker_store"
    );
    set((state) => {
      return {
        ...state,
        ...colorPickerStore,
        colors: colorPickerStore.colors.map((color) => new ColorIO(color)),
      };
    });
  },
  registerColorPicker: async () => {
    const { colors, samples } = get();
    await invoke<ColorPickerStoreData>("save_color_picker_store", {
      colorStore: {
        ...formatPickerStore({ colors, samples }),
      },
    });
    const canUndoRedo = await invoke<CanUndoRedo>("can_undo_redo_color_picker");
    set((state) => {
      return {
        ...state,
        canUndoRedo,
      };
    });
  },
  updateColorSample(index: number, sample: Sample) {
    set((state) => {
      const samples = state.samples;
      samples[index] = sample;
      return {
        ...state,
        samples,
      };
    });
    get().registerColorPicker();
  },
  createColorSample() {
    set((state) => {
      return {
        ...state,
        samples: [
          ...state.samples,
          {
            name: `sample-${state.samples.length + 1}`,
            colors: [],
          },
        ],
      };
    });
    get().registerColorPicker();
  },
  removeColorSample(index: number) {
    set((state) => {
      const samples = state.samples;
      samples.splice(index, 1);
      return {
        ...state,
        samples,
      };
    });
    get().registerColorPicker();
  },
  undoColorPicker: async () => {
    const colorPicker = await invoke<ColorPickerStoreData>("undo_color_picker");
    const canUndoRedo = await invoke<CanUndoRedo>("can_undo_redo_color_picker");
    set((state) => {
      return {
        ...state,
        samples: colorPicker.samples,
        canUndoRedo,
        colors: colorPicker.colors.map((color) => new ColorIO(color)),
      };
    });
  },
  redoColorPicker: async () => {
    const colorPicker = await invoke<ColorPickerStoreData>("redo_color_picker");
    const canUndoRedo = await invoke<CanUndoRedo>("can_undo_redo_color_picker");
    set((state) => {
      return {
        ...state,
        ...colorPicker,
        samples: colorPicker.samples,
        canUndoRedo,
        colors: colorPicker.colors.map((color) => new ColorIO(color)),
      };
    });
  },
  setPickerFallback(color, colorSpace) {
    const axesFallback: PickerFallback[] = colorSpace.axes
      .map((axe) => {
        const value: number = color.get(`${colorSpace.space}.${axe.name}`);
        return {
          axe: axe.name,
          space: colorSpace.space,
          value,
        };
      })
      .filter((x) => x.value);
    const newAxes = axesFallback.map((x) => x.axe);
    set((state) => {
      return {
        ...state,
        pickerFallbacks: [
          ...state.pickerFallbacks.filter(
            (fallback) => !newAxes.includes(fallback.axe) && fallback.space === colorSpace.space
          ),
          ...axesFallback,
        ],
      };
    });
  },
}));
