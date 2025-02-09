use indexmap::IndexMap;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystem {
    pub metadata: DesignSystemMetadata,
    pub palettes: Vec<Palette>,
    pub base: Base,
    pub themes: Vec<ThemeColor>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystemCreationPayload {
    pub name: String,
    pub folder_path: String,
    pub dark_mode: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystemMetadataHome {
    pub design_system_id: String,
    pub design_system_name: String,
    pub dark_mode: bool,
    pub design_system_path: PathBuf,
    pub is_tmp: bool,
    pub edit_mode: Option<bool>,
}

impl DesignSystemMetadataHome {
    pub fn from(metadata: DesignSystemMetadata, edit_mode: Option<bool>) -> DesignSystemMetadataHome {
        let DesignSystemMetadata {
            dark_mode,
            design_system_id,
            design_system_name,
            design_system_path,
            is_tmp,
        } = metadata;

        DesignSystemMetadataHome {
            dark_mode,
            design_system_id,
            design_system_name,
            design_system_path,
            edit_mode,
            is_tmp,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystemMetadata {
    pub design_system_id: String,
    pub design_system_name: String,
    pub dark_mode: bool,
    pub design_system_path: PathBuf,
    pub is_tmp: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DesignSystemMetadataFile {
    pub design_system_id: String,
    pub design_system_name: String,
    pub dark_mode: bool,
}

impl DesignSystemMetadataFile {
    pub fn from(design_system_metadata: &DesignSystemMetadata) -> DesignSystemMetadataFile {
        let DesignSystemMetadata {
            design_system_id,
            design_system_name,
            dark_mode,
            ..
        } = design_system_metadata;
        DesignSystemMetadataFile {
            design_system_id: design_system_id.to_string(),
            dark_mode: dark_mode.to_owned(),
            design_system_name: design_system_name.to_string(),
        }
    }
}

impl DesignSystemMetadata {
    pub fn from(
        design_system_file: &DesignSystemMetadataFile,
        path: &PathBuf,
        is_tmp: bool,
    ) -> DesignSystemMetadata {
        let DesignSystemMetadataFile {
            design_system_id,
            design_system_name,
            dark_mode,
        } = design_system_file;
        DesignSystemMetadata {
            dark_mode: dark_mode.to_owned(),
            design_system_id: design_system_id.to_string(),
            design_system_name: design_system_name.to_string(),
            design_system_path: path.to_owned(),
            is_tmp,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Palette {
    pub palette_name: String,
    pub palette_path: Option<PathBuf>,
    pub shades: Vec<Shade>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PalettesMetadataFile {
    pub palettes_order: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Base {
    pub background: ColorDarkable,
    pub border: ColorDarkable,
    pub text_light: ColorDarkable,
    pub text_default: ColorDarkable,
    pub text_dark: ColorDarkable,
    pub background_disabled: ColorDarkable,
    pub text_disabled: ColorDarkable,
    pub border_disabled: ColorDarkable,
}

impl Base {
    pub fn new() -> Base {
        Base {
            background: ColorDarkable {
                default: Some(String::from("palette-neutral-50")),
                dark: Some(String::from("palette-neutral-950")),
            },
            border: ColorDarkable {
                default: Some(String::from("palette-neutral-300")),
                dark: Some(String::from("palette-neutral-700")),
            },
            text_dark: ColorDarkable {
                default: Some(String::from("palette-neutral-900")),
                dark: Some(String::from("palette-neutral-100")),
            },
            text_default: ColorDarkable {
                default: Some(String::from("palette-neutral-700")),
                dark: Some(String::from("palette-neutral-300")),
            },
            text_light: ColorDarkable {
                default: Some(String::from("palette-neutral-500")),
                dark: Some(String::from("palette-neutral-500")),
            },
            background_disabled: ColorDarkable {
                default: Some(String::from("palette-neutral-200")),
                dark: Some(String::from("palette-neutral-700")),
            },
            border_disabled: ColorDarkable {
                default: Some(String::from("palette-neutral-300")),
                dark: Some(String::from("palette-neutral-600")),
            },
            text_disabled: ColorDarkable {
                default: Some(String::from("palette-neutral-500")),
                dark: Some(String::from("palette-neutral-500")),
            },
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Shade {
    pub label: String,
    pub color: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShadesFile(pub IndexMap<String, String>);

impl ShadesFile {
    pub fn from(shades: &Vec<Shade>) -> ShadesFile {
        use indexmap::IndexMap;
        let mut map = IndexMap::new();

        for shade in shades {
            map.insert(shade.label.clone(), shade.color.clone());
        }

        ShadesFile(map)
    }

    pub fn new() -> ShadesFile {
        let neutral_palette: Vec<Shade> = vec![
            Shade {
                label: "50".to_string(),
                color: "#FAFAFA".to_string(),
            },
            Shade {
                label: "100".to_string(),
                color: "#F5F5F5".to_string(),
            },
            Shade {
                label: "200".to_string(),
                color: "#E5E5E5".to_string(),
            },
            Shade {
                label: "300".to_string(),
                color: "#D4D4D4".to_string(),
            },
            Shade {
                label: "400".to_string(),
                color: "#A3A3A3".to_string(),
            },
            Shade {
                label: "500".to_string(),
                color: "#737373".to_string(),
            },
            Shade {
                label: "600".to_string(),
                color: "#525252".to_string(),
            },
            Shade {
                label: "700".to_string(),
                color: "#404040".to_string(),
            },
            Shade {
                label: "800".to_string(),
                color: "#262626".to_string(),
            },
            Shade {
                label: "900".to_string(),
                color: "#171717".to_string(),
            },
            Shade {
                label: "950".to_string(),
                color: "#0A0A0A".to_string(),
            },
        ];

        ShadesFile::from(&neutral_palette)
    }

    pub fn to(shades_file: &ShadesFile) -> Vec<Shade> {
        shades_file
            .0
            .iter()
            .map(|(key, value)| Shade {
                label: key.clone(),
                color: value.clone(),
            })
            .collect::<Vec<Shade>>()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ThemesMetadataFile {
    pub themes_order: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ThemeColor {
    pub theme_name: String,
    pub default: ThemeColorSet,
    pub hover: Option<ThemeColorSet>,
    pub active: Option<ThemeColorSet>,
    pub focus: Option<ThemeColorSet>,
}

impl ThemeColor {
    pub fn new() -> ThemeColor {
        ThemeColor {
            theme_name: String::from("neutral"),
            default: ThemeColorSet {
                background: ColorDarkable {
                    default: Some(String::from("palette-neutral-50")),
                    dark: Some(String::from("palette-neutral-950")),
                },
                border: ColorDarkable {
                    default: Some(String::from("palette-neutral-300")),
                    dark: Some(String::from("palette-neutral-700")),
                },
                text: ColorDarkable {
                    default: Some(String::from("palette-neutral-700")),
                    dark: Some(String::from("palette-neutral-300")),
                },
            },
            hover: Some(ThemeColorSet {
                background: ColorDarkable {
                    default: Some(String::from("palette-neutral-200")),
                    dark: Some(String::from("palette-neutral-800")),
                },
                border: ColorDarkable {
                    default: Some(String::from("palette-neutral-300")),
                    dark: Some(String::from("palette-neutral-700")),
                },
                text: ColorDarkable {
                    default: Some(String::from("palette-neutral-700")),
                    dark: Some(String::from("palette-neutral-100")),
                },
            }),
            active: None,
            focus: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ThemeColorFile {
    pub default_state: ThemeColorSet,
    pub hover: Option<ThemeColorSet>,
    pub active: Option<ThemeColorSet>,
    pub focus: Option<ThemeColorSet>,
}

impl ThemeColorFile {
    pub fn from(theme_color: &ThemeColor) -> ThemeColorFile {
        let ThemeColor {
            default: default_state,
            hover,
            active,
            focus,
            ..
        } = theme_color;
        ThemeColorFile {
            default_state: default_state.to_owned(),
            hover: hover.to_owned(),
            active: active.to_owned(),
            focus: focus.to_owned(),
        }
    }

    pub fn to(theme_file: &ThemeColorFile, theme_name: &str) -> ThemeColor {
        let ThemeColorFile {
            default_state,
            hover,
            active,
            focus,
        } = theme_file;
        ThemeColor {
            default: default_state.to_owned(),
            hover: hover.to_owned(),
            active: active.to_owned(),
            focus: focus.to_owned(),
            theme_name: String::from(theme_name),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ThemeColorSet {
    pub background: ColorDarkable,
    pub border: ColorDarkable,
    pub text: ColorDarkable,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ColorDarkable {
    pub default: Option<String>,
    pub dark: Option<String>,
}
