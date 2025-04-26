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
}

export interface PresetDressing {
  banners: string[];
  logos: string[];
}
