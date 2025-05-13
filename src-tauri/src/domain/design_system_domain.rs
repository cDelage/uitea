use indexmap::IndexMap;
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystem {
    pub metadata: DesignSystemMetadata,
    pub palettes: Vec<Palette>,
    pub themes: Themes,
    pub semantic_color_tokens: SemanticColorTokens,
    pub fonts: Fonts,
    pub typography: Typographies,
    pub spaces: Vec<Space>,
    pub radius: Radius,
    pub effects: Vec<Effect>,
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
    pub preview_component: Option<String>,
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
            default: String::from("'Helvetica', 'Arial', sans-serif"),
            additionals: vec![],
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Typographies {
    paragraph: TypographyScale,
    h1: TypographyScale,
    h2: TypographyScale,
    h3: TypographyScale,
    h4: TypographyScale,
    h5: TypographyScale,
    h6: TypographyScale,
    small: TypographyScale,
    strong: TypographyScale,
    additionals_scales: Vec<AdditionalTypographyScale>,
}

impl Typographies {
    pub fn new() -> Typographies {
        Typographies {
            h1: TypographyScale {
                font_size: "32px".to_string(),
                line_height: "40px".to_string(),
                font_weight: FontWeight::Seven,
                letter_spacing: TypographySpacing::Zero,
                word_spacing: TypographySpacing::Zero,
                font_style: FontStyle::Normal,
                text_transform: TextTransform::None,
                text_decoration: TextDecoration::None,
                padding: "0".to_string(),
                margin: "0".to_string(),
            },
            h2: TypographyScale {
                font_size: "28px".to_string(),
                line_height: "36px".to_string(),
                font_weight: FontWeight::Six,
                letter_spacing: TypographySpacing::Zero,
                word_spacing: TypographySpacing::Zero,
                font_style: FontStyle::Normal,
                text_transform: TextTransform::None,
                text_decoration: TextDecoration::None,
                padding: "0".to_string(),
                margin: "0".to_string(),
            },
            h3: TypographyScale {
                font_size: "24px".to_string(),
                line_height: "32px".to_string(),
                font_weight: FontWeight::Five,
                letter_spacing: TypographySpacing::Zero,
                word_spacing: TypographySpacing::Zero,
                font_style: FontStyle::Normal,
                text_transform: TextTransform::None,
                text_decoration: TextDecoration::None,
                padding: "0".to_string(),
                margin: "0".to_string(),
            },
            h4: TypographyScale {
                font_size: "20px".to_string(),
                line_height: "28px".to_string(),
                font_weight: FontWeight::Five,
                letter_spacing: TypographySpacing::Zero,
                word_spacing: TypographySpacing::Zero,
                font_style: FontStyle::Normal,
                text_transform: TextTransform::None,
                text_decoration: TextDecoration::None,
                padding: "0".to_string(),
                margin: "0".to_string(),
            },
            h5: TypographyScale {
                font_size: "18px".to_string(),
                line_height: "24px".to_string(),
                font_weight: FontWeight::Five,
                letter_spacing: TypographySpacing::Zero,
                word_spacing: TypographySpacing::Zero,
                font_style: FontStyle::Normal,
                text_transform: TextTransform::None,
                text_decoration: TextDecoration::None,
                padding: "0".to_string(),
                margin: "0".to_string(),
            },
            h6: TypographyScale {
                font_size: "16px".to_string(),
                line_height: "22px".to_string(),
                font_weight: FontWeight::Five,
                letter_spacing: TypographySpacing::Zero,
                word_spacing: TypographySpacing::Zero,
                font_style: FontStyle::Normal,
                text_transform: TextTransform::None,
                text_decoration: TextDecoration::None,
                padding: "0".to_string(),
                margin: "0".to_string(),
            },
            paragraph: TypographyScale {
                font_size: "14px".to_string(),
                line_height: "20px".to_string(),
                font_weight: FontWeight::Four,
                letter_spacing: TypographySpacing::Zero,
                word_spacing: TypographySpacing::Zero,
                font_style: FontStyle::Normal,
                text_transform: TextTransform::None,
                text_decoration: TextDecoration::None,
                padding: "0".to_string(),
                margin: "0".to_string(),
            },
            small: TypographyScale {
                font_size: "12px".to_string(),
                line_height: "16px".to_string(),
                font_weight: FontWeight::Four,
                letter_spacing: TypographySpacing::Zero,
                word_spacing: TypographySpacing::Zero,
                font_style: FontStyle::Normal,
                text_transform: TextTransform::None,
                text_decoration: TextDecoration::None,
                padding: "0".to_string(),
                margin: "0".to_string(),
            },
            strong: TypographyScale {
                font_size: "14px".to_string(),
                line_height: "20px".to_string(),
                font_weight: FontWeight::Seven,
                letter_spacing: TypographySpacing::Zero,
                word_spacing: TypographySpacing::Zero,
                font_style: FontStyle::Normal,
                text_transform: TextTransform::None,
                text_decoration: TextDecoration::None,
                padding: "0".to_string(),
                margin: "0".to_string(),
            },
            additionals_scales: vec![],
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalTypographyScale {
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
    font_size: String,
    line_height: String,
    font_weight: FontWeight,
    letter_spacing: TypographySpacing,
    word_spacing: TypographySpacing,
    font_style: FontStyle,
    text_transform: TextTransform,
    text_decoration: TextDecoration,
    padding: String,
    margin: String,
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
#[repr(u16)]
pub enum TypographySpacing {
    #[serde(rename = "-0.05em")]
    MinusTwo,
    #[serde(rename = "-0.02em")]
    MinusOne,
    #[serde(rename = "0em")]
    Zero,
    #[serde(rename = "0.1em")]
    One,
    #[serde(rename = "0.2em")]
    Two,
    #[serde(rename = "0.3em")]
    Three,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Space {
    pub space_key: String,
    pub space_value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpacesFile(pub IndexMap<String, String>);

impl SpacesFile {
    pub fn from(spaces: &Vec<Space>) -> SpacesFile {
        let mut map = IndexMap::new();
        for space in spaces {
            map.insert(space.space_key.clone(), space.space_value.clone());
        }
        SpacesFile(map)
    }

    pub fn new() -> SpacesFile {
        // Valeurs par défaut
        let default_spaces: Vec<Space> = vec![
            Space {
                space_key: "0".to_string(),
                space_value: "0px".to_string(),
            },
            Space {
                space_key: "1".to_string(),
                space_value: "2px".to_string(),
            },
            Space {
                space_key: "2".to_string(),
                space_value: "4px".to_string(),
            },
            Space {
                space_key: "3".to_string(),
                space_value: "8px".to_string(),
            },
            Space {
                space_key: "4".to_string(),
                space_value: "12px".to_string(),
            },
            Space {
                space_key: "5".to_string(),
                space_value: "16px".to_string(),
            },
            Space {
                space_key: "6".to_string(),
                space_value: "20px".to_string(),
            },
            Space {
                space_key: "7".to_string(),
                space_value: "28px".to_string(),
            },
            Space {
                space_key: "8".to_string(),
                space_value: "32px".to_string(),
            },
            Space {
                space_key: "9".to_string(),
                space_value: "40px".to_string(),
            },
            Space {
                space_key: "10".to_string(),
                space_value: "52px".to_string(),
            },
            Space {
                space_key: "11".to_string(),
                space_value: "64px".to_string(),
            },
            Space {
                space_key: "12".to_string(),
                space_value: "80px".to_string(),
            },
            Space {
                space_key: "13".to_string(),
                space_value: "100px".to_string(),
            },
            Space {
                space_key: "14".to_string(),
                space_value: "120px".to_string(),
            },
            Space {
                space_key: "15".to_string(),
                space_value: "160px".to_string(),
            },
        ];

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
    default: String,
    additionals_radius: Vec<RadiusItem>,
}

impl Radius {
    pub fn new() -> Radius {
        Radius {
            default: "0px".to_string(),
            additionals_radius: vec![],
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RadiusItem {
    pub radius_key: String,
    pub radius_value: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Effect {
    pub effect_name: String,
    pub items: Vec<EffectItem>,
    pub bg: Option<String>,
}

impl Effect {
    pub fn new() -> Effect {
        Effect {
            effect_name: "shadow".to_string(),
            bg: None,
            items: vec![
                EffectItem {
                    effect_type: EffectType::BoxShadow,
                    effect_value: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px".to_string(),
                },
                EffectItem {
                    effect_type: EffectType::BoxShadow,
                    effect_value: "rgba(0, 0, 0, 0.06) 0px 1px 2px 0px".to_string(),
                },
            ],
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct EffectItem {
    pub effect_type: EffectType,
    pub effect_value: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum EffectType {
    BoxShadow,
    Blur,
    BackdropFilter,
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
    pub extension: String
}
