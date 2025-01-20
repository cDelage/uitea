import { DesignSystemMetadata } from "./DesignSystemDomain";

export type InsertFilePayload = {
  filePath: string;
};

export type RecentFile =
  | { DesignSystem: DesignSystemMetadata }
  | { Unknown: string };

export type RemoveRecentFilesPayload = {
  filePath: string;
  isDeleteFromComputer: boolean;
};
