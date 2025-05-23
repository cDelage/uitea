import { ComponentType } from "react";
import { IconType } from "react-icons/lib";
import {
  MdFormatQuote,
  MdLabelOutline,
  MdOutlinePlayArrow,
  MdOutlineTableRows,
  MdOutlineViewList,
} from "react-icons/md";
import QuoteCombinationPreview from "../features/design-system/previews/combination-preview/QuoteCombinationPreview";
import ButtonCombinationPreview from "../features/design-system/previews/combination-preview/ButtonCombinationPreview";
import LabelCombinationPreview from "../features/design-system/previews/combination-preview/LabelCombinationPreview";
import ArrayRowCombinationPreview from "../features/design-system/previews/combination-preview/ArrayRowCombinationPreview";
import ArrayHeaderCombinationPreview from "../features/design-system/previews/combination-preview/ArrayHeaderCombinationPreview";
import ColorIO from "colorjs.io";

export interface DesignSystem {
  metadata: DesignSystemMetadata;
  palettes: Palette[];
  themes: Themes;
  semanticColorTokens: SemanticColorTokens;
  fonts: Fonts;
  typography: Typographies;
  spaces: Space[];
  radius: Radius;
  shadows: Shadows[];
}

export interface DesignSystemCreationPayload {
  name: string;
  folderPath: string;
  banner?: string;
  logo?: string;
}

export type DesignSystemMetadataHome = DesignSystemMetadata & {
  editMode: boolean;
};

export interface DesignSystemMetadata {
  designSystemId: string;
  designSystemName: string;
  designSystemPath: string;
  isTmp: boolean;
  canUndo: boolean;
  canRedo: boolean;
  banner: string;
  logo: string;
}

export interface Palette {
  paletteName: string;
  tints: Tint[];
}

export interface Tint {
  label: string;
  color: string;
}

export interface DesignToken {
  label: string;
  value: string;
}

export interface TokenFamily {
  label: string;
  tokens: DesignToken[];
  colorPreview?: string;
  category: "color" | "semantic";
}

export interface Themes {
  mainTheme?: Theme;
  otherThemes: Theme[];
}

export interface Theme {
  name: string;
  background: string;
}

export type ThemeStateCategory = "default" | "hover" | "active" | "focus";

export type ThemeItem = "background" | "border" | "text";

export interface ColorDarkable {
  default?: string;
  dark?: string;
}

export interface Fonts {
  default: string;
  additionals: AdditionalFont[];
}

export interface AdditionalFont {
  fontName: string;
  value: string;
}

export interface Typographies {
  root: TypographyScale;
  paragraph: TypographyScale;
  h1: TypographyScale;
  h2: TypographyScale;
  h3: TypographyScale;
  h4: TypographyScale;
  h5: TypographyScale;
  h6: TypographyScale;
  small: TypographyScale;
  strong: TypographyScale;
  customScales: CustomTypographyScale[];
}

export interface CustomTypographyScale {
  scaleName: string;
  scale: TypographyScale;
}

export interface TypographyScale {
  fontSize: Measurement;
  lineHeight: Measurement;
  fontWeight: FontWeight;
  letterSpacing: TypographySpacing;
  wordSpacing: TypographySpacing;
  fontStyle: FontStyle;
  textTransform: TextTransform;
  textDecoration: TextDecoration;
  padding: Measurement;
  margin: Measurement;
  font?: string;
  color?: string;
}

export type DefaultTypography =
  | "root"
  | "paragraph"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "small"
  | "strong";

export type TypographyScaleFieldPath =
  | DefaultTypography
  | `customScales.${number}.scale`;

export type FontStyle = "normal" | "italic" | "oblique";
export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";
export type TextDecoration = "none" | "underline" | "overline" | "line-through";
export type FontWeight =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

export type TypographySpacing =
  | "-1em"
  | "-0.9em"
  | "-0.8em"
  | "-0.7em"
  | "-0.6em"
  | "-0.5em"
  | "-0.4em"
  | "-0.3em"
  | "-0.2em"
  | "-0.1em"
  | "-0.09em"
  | "-0.08em"
  | "-0.07em"
  | "-0.06em"
  | "-0.05em"
  | "-0.02em"
  | "0em"
  | "0.02em"
  | "0.05em"
  | "0.06em"
  | "0.07em"
  | "0.08em"
  | "0.09em"
  | "0.1em"
  | "0.2em"
  | "0.3em"
  | "0.4em"
  | "0.5em"
  | "0.6em"
  | "0.7em"
  | "0.8em"
  | "0.9em"
  | "1em";

export interface PresetSpaces {
  presetName: string;
  spaces: Space[];
}

export interface Space {
  spaceKey: string;
  spaceValue: Measurement;
}

export interface Radius {
  default: Measurement;
  additionalsRadius: RadiusItem[];
}

export interface RadiusItem {
  radiusKey: string;
  radiusValue: Measurement;
}

export type ShadowsPreset = Shadows & {
  author?: string;
};

export interface Shadows {
  shadowName: string;
  shadowsArray: Shadow[];
}

export interface Shadow {
  shadowX: number;
  shadowY: number;
  blur: number;
  spread: number;
  color: string;
  colorOpacity: number;
  inset: boolean;
}

export interface SemanticColorTokens {
  background?: string;
  textLight?: string;
  textDefault?: string;
  textDark?: string;
  border?: string;
  colorCombinationCollections: ColorCombinationCollection[];
}

export type ColorCombinationState = "default" | "hover" | "active" | "focus";

export type PreviewComponent =
  | "quote"
  | "button"
  | "label"
  | "array-header"
  | "array-row";

export type PreviewComponentIcon = {
  icon: IconType;
  previewComponent: PreviewComponent;
  component: ComponentType<{ combination: ColorCombinationCollection }>;
};

export const PREVIEW_COMPONENT_ICONS: PreviewComponentIcon[] = [
  {
    previewComponent: "button",
    icon: MdOutlinePlayArrow,
    component: ButtonCombinationPreview,
  },
  {
    previewComponent: "label",
    icon: MdLabelOutline,
    component: LabelCombinationPreview,
  },
  {
    previewComponent: "array-header",
    icon: MdOutlineViewList,
    component: ArrayHeaderCombinationPreview,
  },
  {
    previewComponent: "array-row",
    icon: MdOutlineTableRows,
    component: ArrayRowCombinationPreview,
  },
  {
    previewComponent: "quote",
    icon: MdFormatQuote,
    component: QuoteCombinationPreview,
  },
];

export interface ColorCombinationCollection {
  combinationName?: string;
  default?: ColorCombination;
  hover?: ColorCombination;
  active?: ColorCombination;
  focus?: ColorCombination;
  group?: string;
  defaultCombination?: boolean;
}

export interface ColorCombinationCollectionGroup {
  combinationName?: string;
  default?: ColorCombination;
  hover?: ColorCombination;
  active?: ColorCombination;
  focus?: ColorCombination;
  group?: string;
  previewComponent?: PreviewComponent;
  childs: ColorCombinationCollectionGroup[];
}

export interface ColorCombinationCollectionAndGroup {
  collection: ColorCombinationCollection;
  group?: ColorCombination;
}

export type TokenColorUsage = "background" | "border" | "text";

export interface ColorCombination {
  background?: string;
  border?: string;
  text?: string;
}

export interface RecommandationRow {
  label: string;
  combinations: RecommandationMetadata[];
}

export interface RecommandationMetadata {
  combinationName: ColorCombination;
  combinationTokens: ColorCombination;
  contrasts: CombinationContrasts;
  backgroundRgba: string;
}

export interface CombinationContrasts {
  backgroundText?: number;
  backgroundBorder?: number;
}

export interface RecommandationContrastPayload {
  text: number;
  border: number;
}

export interface PaletteAndColor {
  mainColor: ColorIO;
  palette: Palette;
}

export interface HandleUpdateColorPayload {
  usage: TokenColorUsage;
  state: ColorCombinationState;
  value: string | undefined;
}

export interface GenerateExportPayload {
  designSystemPath: string;
  exportName: string;
  value: string;
  extension: string;
}

export type UnitOfMeasurement = "REM" | "PX";

export interface Measurement {
  unit: UnitOfMeasurement;
  value: number;
}
