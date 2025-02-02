export type DesignSystemCreationPayload = {
  name: string;
  folderPath: string;
};

export type DesignSystemMetadata = {
  designSystemId: string;
  designSystemName: string;
  darkMode: boolean;
  designSystemPath: string;
  isTmp: boolean;
};

export type DesignSystem = {
  metadata: DesignSystemMetadata;
  colorPalettes: ColorPalette[];
};

export type ColorPalette = {
  paletteName: string;
  palettePath?: string;
  shades: Shade[];
};

export type Shade = {
  label: string;
  color: string;
};
