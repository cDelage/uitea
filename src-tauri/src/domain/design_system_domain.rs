use indexmap::IndexMap;
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

use crate::domain::FileMetadata;

use super::{image_domain::ImageLocal, FileInfos};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystem {
    pub metadata: DesignSystemMetadata,
    pub palettes: Vec<Palette>,
    pub independant_colors: IndependantColors,
    pub themes: Themes,
    pub semantic_color_tokens: SemanticColorTokens,
    pub spaces: Vec<Space>,
    pub fonts: Fonts,
    pub typography: Typographies,
    pub radius: Radius,
    pub shadows: Vec<Shadows>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystemCreationPayload {
    pub name: String,
    pub folder_path: String,
    pub banner: String,
    pub logo: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystemMetadataHome {
    pub design_system_id: String,
    pub design_system_name: String,
    pub design_system_path: PathBuf,
    pub is_tmp: bool,
    pub edit_mode: Option<bool>,
    pub can_undo: bool,
    pub can_redo: bool,
}

impl DesignSystemMetadataHome {
    pub fn from(
        metadata: DesignSystemMetadata,
        edit_mode: Option<bool>,
    ) -> DesignSystemMetadataHome {
        let DesignSystemMetadata {
            design_system_id,
            design_system_name,
            design_system_path,
            is_tmp,
            can_redo,
            can_undo,
            ..
        } = metadata;

        DesignSystemMetadataHome {
            design_system_id,
            design_system_name,
            design_system_path,
            edit_mode,
            is_tmp,
            can_redo,
            can_undo,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystemMetadata {
    pub design_system_id: String,
    pub design_system_name: String,
    pub design_system_path: PathBuf,
    pub is_tmp: bool,
    pub can_undo: bool,
    pub can_redo: bool,
    pub banner: String,
    pub logo: String,
    pub readme: Option<String>,
    pub preview_images: Vec<ImageLocal>,
    pub fonts: Vec<FileInfos>,
    pub exports: ExportsMetadata,
    pub update_date: String
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ExportsMetadata {
    pub css: Option<FileMetadata>,
    pub figma_token_studio: Option<FileMetadata>,
    pub readme: Option<FileMetadata>
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DesignSystemMetadataFile {
    pub design_system_id: String,
    pub design_system_name: String,
    #[serde(default = "default_string")]
    pub banner: String,
    #[serde(default = "default_string")]
    pub logo: String,
}

fn default_string() -> String {
    String::from("")
}

impl DesignSystemMetadataFile {
    pub fn from(design_system_metadata: &DesignSystemMetadata) -> DesignSystemMetadataFile {
        let DesignSystemMetadata {
            design_system_id,
            design_system_name,
            banner,
            logo,
            ..
        } = design_system_metadata;
        let banner_filename: &str = Path::new(banner).file_name().unwrap().to_str().unwrap();
        let logo_filename: &str = Path::new(logo).file_name().unwrap().to_str().unwrap();
        DesignSystemMetadataFile {
            design_system_id: design_system_id.to_string(),
            design_system_name: design_system_name.to_string(),
            banner: String::from(banner_filename),
            logo: String::from(logo_filename),
        }
    }
}

impl DesignSystemMetadata {
    pub fn from(
        design_system_file: &DesignSystemMetadataFile,
        path: &PathBuf,
        is_tmp: bool,
        image_pathbuf: &PathBuf,
        exports: ExportsMetadata,
        update_date: String
    ) -> DesignSystemMetadata {
        let DesignSystemMetadataFile {
            design_system_id,
            design_system_name,
            banner,
            logo,
        } = design_system_file;

        let banner_path: PathBuf = image_pathbuf.join(banner);
        let logo_path: PathBuf = image_pathbuf.join(logo);

        DesignSystemMetadata {
            design_system_id: design_system_id.to_string(),
            design_system_name: design_system_name.to_string(),
            design_system_path: path.to_owned(),
            banner: banner_path.to_string_lossy().into_owned(),
            logo: logo_path.to_string_lossy().into_owned(),
            is_tmp,
            can_redo: false,
            can_undo: false,
            readme: None,
            preview_images: vec![],
            fonts: vec![],
            exports,
            update_date
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Palette {
    pub palette_name: String,
    pub palette_path: Option<PathBuf>,
    pub tints: Vec<Tint>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IndependantColors {
    pub white: String,
    pub independant_colors: Vec<Tint>,
}

impl IndependantColors {
    pub fn new() -> IndependantColors {
        IndependantColors {
            white: String::from("#ffffff"),
            independant_colors: vec![],
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PalettesMetadataFile {
    pub palettes_order: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SemanticColorTokens {
    pub background: Option<String>,
    pub border: Option<String>,
    pub text_light: Option<String>,
    pub text_default: Option<String>,
    pub text_dark: Option<String>,
    pub color_combination_collections: Vec<ColorCombinationCollection>,
}

impl SemanticColorTokens {
    pub fn new() -> SemanticColorTokens {
        SemanticColorTokens {
            background: None,
            text_light: None,
            text_default: None,
            text_dark: None,
            border: None,
            color_combination_collections: vec![],
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ColorCombinationCollection {
    pub combination_name: Option<String>,
    pub default: Option<ColorCombination>,
    pub hover: Option<ColorCombination>,
    pub active: Option<ColorCombination>,
    pub focus: Option<ColorCombination>,
    pub group: Option<String>,
    pub default_combination: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ColorCombination {
    pub background: Option<String>,
    pub border: Option<String>,
    pub text: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Tint {
    pub label: String,
    pub color: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TintsFile(pub IndexMap<String, String>);

impl TintsFile {
    pub fn from(tints: &Vec<Tint>) -> TintsFile {
        use indexmap::IndexMap;
        let mut map = IndexMap::new();

        for tint in tints {
            map.insert(tint.label.clone(), tint.color.clone());
        }

        TintsFile(map)
    }

    pub fn to(tints_file: &TintsFile) -> Vec<Tint> {
        tints_file
            .0
            .iter()
            .map(|(key, value)| Tint {
                label: key.clone(),
                color: value.clone(),
            })
            .collect::<Vec<Tint>>()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ThemesMetadataFile {
    pub themes_order: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Fonts {
    pub default: String,
    pub additionals: Vec<AdditionalFont>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFont {
    pub font_name: String,
    pub value: String,
}

impl Fonts {
    pub fn new() -> Fonts {
        Fonts {
            default: String::from("Roboto"),
            additionals: vec![],
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Typographies {
    root: TypographyScale,
    paragraph: TypographyScale,
    h1: TypographyScale,
    h2: TypographyScale,
    h3: TypographyScale,
    h4: TypographyScale,
    h5: TypographyScale,
    h6: TypographyScale,
    small: TypographyScale,
    strong: TypographyScale,
    custom_scales: Vec<CustomTypographyScale>,
}
impl Typographies {
    /// Standard web‑app typographic scale — pixel‑based, multiples of 4 px
    pub fn new() -> Typographies {
        Typographies {
            // ----- Root (body / html) -----
            root: TypographyScale {
                font_size: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 16.0, // base 16 px
                },
                line_height: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 24.0, // 1.5× → 24 px
                },
                font_weight: FontWeight::Four,
                letter_spacing: TypographySpacing::Zero,
                word_spacing: TypographySpacing::Zero,
                font_style: FontStyle::Normal,
                text_transform: TextTransform::None,
                text_decoration: TextDecoration::None,
                padding: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 0.0,
                },
                margin: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 0.0,
                },
                font: None,
                color: None,
            },

            // ----- Headings -----
            h1: TypographyScale {
                font_size: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 32.0,
                },
                line_height: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 40.0,
                },
                font_weight: FontWeight::Seven,
                ..Default::default()
            },

            h2: TypographyScale {
                font_size: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 28.0,
                },
                line_height: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 36.0,
                },
                font_weight: FontWeight::Six,
                ..Default::default()
            },

            h3: TypographyScale {
                font_size: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 24.0,
                },
                line_height: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 32.0,
                },
                font_weight: FontWeight::Five,
                ..Default::default()
            },

            h4: TypographyScale {
                font_size: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 20.0,
                },
                line_height: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 28.0,
                },
                font_weight: FontWeight::Five,
                ..Default::default()
            },

            h5: TypographyScale {
                font_size: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 16.0,
                },
                line_height: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 24.0,
                },
                font_weight: FontWeight::Five,
                ..Default::default()
            },

            h6: TypographyScale {
                font_size: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 16.0, // duplicate size, lower hierarchy conveyed by style/weight
                },
                line_height: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 24.0,
                },
                font_weight: FontWeight::Five,
                ..Default::default()
            },

            // ----- Paragraph -----
            paragraph: TypographyScale {
                font_size: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 16.0,
                },
                line_height: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 24.0,
                },
                font_weight: FontWeight::Four,
                ..Default::default()
            },

            // ----- Small text -----
            small: TypographyScale {
                font_size: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 12.0,
                },
                line_height: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 16.0,
                },
                font_weight: FontWeight::Four,
                ..Default::default()
            },

            // ----- Strong text -----
            strong: TypographyScale {
                font_size: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 16.0,
                },
                line_height: Measurement {
                    unit: UnitOfMeasurement::PX,
                    value: 24.0,
                },
                font_weight: FontWeight::Seven,
                ..Default::default()
            },

            custom_scales: vec![],
        }
    }
}

// Provide sensible defaults for fields we leave unchanged
impl Default for TypographyScale {
    fn default() -> Self {
        TypographyScale {
            font_size: Measurement {
                unit: UnitOfMeasurement::PX,
                value: 0.0,
            },
            line_height: Measurement {
                unit: UnitOfMeasurement::PX,
                value: 0.0,
            },
            font_weight: FontWeight::Four,
            letter_spacing: TypographySpacing::Zero,
            word_spacing: TypographySpacing::Zero,
            font_style: FontStyle::Normal,
            text_transform: TextTransform::None,
            text_decoration: TextDecoration::None,
            padding: Measurement {
                unit: UnitOfMeasurement::PX,
                value: 0.0,
            },
            margin: Measurement {
                unit: UnitOfMeasurement::PX,
                value: 0.0,
            },
            font: None,
            color: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CustomTypographyScale {
    scale_name: String,
    scale: TypographyScale,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFontWeight {
    weight_name: String,
    font_weight: FontWeight,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TypographyScale {
    font_size: Measurement,
    line_height: Measurement,
    font_weight: FontWeight,
    letter_spacing: TypographySpacing,
    word_spacing: TypographySpacing,
    font_style: FontStyle,
    text_transform: TextTransform,
    text_decoration: TextDecoration,
    padding: Measurement,
    margin: Measurement,
    font: Option<String>,
    color: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Measurement {
    pub unit: UnitOfMeasurement,
    pub value: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UnitOfMeasurement {
    REM,
    PX,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum FontStyle {
    #[serde(rename = "normal")]
    Normal,
    #[serde(rename = "italic")]
    Italic,
    #[serde(rename = "oblique")]
    Oblique,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum TextTransform {
    #[serde(rename = "none")]
    None,
    #[serde(rename = "uppercase")]
    Uppercase,
    #[serde(rename = "lowercase")]
    Lowercase,
    #[serde(rename = "capitalize")]
    Capitalize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum TextDecoration {
    #[serde(rename = "none")]
    None,
    #[serde(rename = "underline")]
    Underline,
    #[serde(rename = "overline")]
    Overline,
    #[serde(rename = "line-through")]
    LineThrough,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[repr(u16)]
pub enum FontWeight {
    #[serde(rename = "100")]
    One = 100,
    #[serde(rename = "200")]
    Two = 200,
    #[serde(rename = "300")]
    Three = 300,
    #[serde(rename = "400")]
    Four = 400,
    #[serde(rename = "500")]
    Five = 500,
    #[serde(rename = "600")]
    Six = 600,
    #[serde(rename = "700")]
    Seven = 700,
    #[serde(rename = "800")]
    Eight = 800,
    #[serde(rename = "900")]
    Nine = 900,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[repr(u8)]
pub enum TypographySpacing {
    #[serde(rename = "-1em")]
    Neg1_0,
    #[serde(rename = "-0.9em")]
    Neg0_9,
    #[serde(rename = "-0.8em")]
    Neg0_8,
    #[serde(rename = "-0.7em")]
    Neg0_7,
    #[serde(rename = "-0.6em")]
    Neg0_6,
    #[serde(rename = "-0.5em")]
    Neg0_5,
    #[serde(rename = "-0.4em")]
    Neg0_4,
    #[serde(rename = "-0.3em")]
    Neg0_3,
    #[serde(rename = "-0.2em")]
    Neg0_2,
    #[serde(rename = "-0.1em")]
    Neg0_1,
    #[serde(rename = "-0.09em")]
    Neg0_09,
    #[serde(rename = "-0.08em")]
    Neg0_08,
    #[serde(rename = "-0.07em")]
    Neg0_07,
    #[serde(rename = "-0.06em")]
    Neg0_06,
    #[serde(rename = "-0.05em")]
    Neg0_05,
    #[serde(rename = "-0.02em")]
    Neg0_02,
    #[serde(rename = "0em")]
    Zero,
    #[serde(rename = "0.02em")]
    Pos0_02,
    #[serde(rename = "0.05em")]
    Pos0_05,
    #[serde(rename = "0.06em")]
    Pos0_06,
    #[serde(rename = "0.07em")]
    Pos0_07,
    #[serde(rename = "0.08em")]
    Pos0_08,
    #[serde(rename = "0.09em")]
    Pos0_09,
    #[serde(rename = "0.1em")]
    Pos0_1,
    #[serde(rename = "0.2em")]
    Pos0_2,
    #[serde(rename = "0.3em")]
    Pos0_3,
    #[serde(rename = "0.4em")]
    Pos0_4,
    #[serde(rename = "0.5em")]
    Pos0_5,
    #[serde(rename = "0.6em")]
    Pos0_6,
    #[serde(rename = "0.7em")]
    Pos0_7,
    #[serde(rename = "0.8em")]
    Pos0_8,
    #[serde(rename = "0.9em")]
    Pos0_9,
    #[serde(rename = "1em")]
    Pos1_0,
}

/// Un espace (token de spacing) : clé + mesure
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Space {
    pub space_key: String,
    pub space_value: Measurement,
}

/// Fichier regroupant tous les spacings
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpacesFile(pub IndexMap<String, Measurement>);

impl SpacesFile {
    /// Construit un `SpacesFile` à partir d’une liste de `Space`
    pub fn from(spaces: &[Space]) -> SpacesFile {
        let mut map = IndexMap::new();
        for space in spaces {
            map.insert(space.space_key.clone(), space.space_value.clone());
        }
        SpacesFile(map)
    }

    /// Valeurs par défaut (mêmes paliers qu’avant, exprimés en `PX`)
    pub fn new() -> SpacesFile {
        use UnitOfMeasurement::PX;

        let default_spaces = vec![
            ("0", 0.0),
            ("1", 2.0),
            ("2", 4.0),
            ("3", 8.0),
            ("4", 12.0),
            ("5", 16.0),
            ("6", 20.0),
            ("7", 28.0),
            ("8", 32.0),
            ("9", 40.0),
            ("10", 52.0),
            ("11", 64.0),
            ("12", 80.0),
        ]
        .into_iter()
        .map(|(k, v)| Space {
            space_key: k.to_string(),
            space_value: Measurement { unit: PX, value: v },
        })
        .collect::<Vec<_>>();

        SpacesFile::from(&default_spaces)
    }

    pub fn to(spaces_file: &SpacesFile) -> Vec<Space> {
        spaces_file
            .0
            .iter()
            .map(|(key, value)| Space {
                space_key: key.clone(),
                space_value: value.clone(),
            })
            .collect::<Vec<Space>>()
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Radius {
    default: Measurement,
    additionals_radius: Vec<RadiusItem>,
}

impl Radius {
    pub fn new() -> Radius {
        Radius {
            default: Measurement {
                unit: UnitOfMeasurement::PX,
                value: 4.0,
            },
            additionals_radius: vec![],
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RadiusItem {
    pub radius_key: String,
    pub radius_value: Measurement,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Shadows {
    pub shadow_name: String,
    pub shadows_array: Vec<Shadow>,
}

impl Shadows {
    pub fn new() -> Shadows {
        Shadows {
            shadow_name: "shadow".to_string(),
            shadows_array: vec![Shadow {
                shadow_x: 0.0,
                shadow_y: 4.0,
                color: String::from("#000000"),
                color_opacity: 0.25,
                blur: 4.0,
                spread: 0.0,
                inset: false,
            }],
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Shadow {
    pub color: String,
    pub color_opacity: f32,
    pub shadow_x: f32,
    pub shadow_y: f32,
    pub blur: f32,
    pub spread: f32,
    pub inset: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Themes {
    pub main_theme: Option<Theme>,
    pub other_themes: Vec<Theme>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Theme {
    pub name: String,
    pub background: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ExportPayload {
    pub design_system_path: PathBuf,
    pub export_name: String,
    pub value: String,
    pub extension: String,
}
