import { DesignSystemMetadataHome } from "./DesignSystemDomain";

export type InsertFilePayload = {
  filePath: string;
};

export type RecentFiles =
  | { DesignSystem: DesignSystemMetadataHome }
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
