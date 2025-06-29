import { DesignSystemMetadataHome } from "./DesignSystemDomain";
import { PaletteBuilderMetadata } from "./PaletteBuilderDomain";

export type InsertFilePayload = {
  filePath: string;
};

export type RecentFilesMetadata =
  | { DesignSystem: DesignSystemMetadataHome }
  | { PaletteBuilder: PaletteBuilderMetadata }
  | { Unknown: string };

export type RemoveRecentFilesPayload = {
  filePath: string;
  isDeleteFromComputer: boolean;
};

export interface RecentFile {
  filePath: string;
  editMode: string;
  category: RecentFileCategory;
}

export type RecentFileCategory =
  | "PaletteBuilderCategory"
  | "DesignSystemCategory";

export interface PresetDressing {
  banners: string[];
  logos: string[];
}

export interface UserSettings {
  pluginDisplayMode: PluginDisplayMode;
}

export type PluginDisplayMode = "fullscreen" | "modal";
