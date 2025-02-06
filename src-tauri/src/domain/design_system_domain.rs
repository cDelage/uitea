use indexmap::IndexMap;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystem {
    pub metadata: DesignSystemMetadata,
    pub palettes: Vec<Palette>,
    pub base: BaseDarkable,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystemCreationPayload {
    pub name: String,
    pub folder_path: String,
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
#[serde(rename_all = "camelCase")]
pub struct BaseDarkable {
    pub default: Base,
    pub dark: Option<Base>,
}

impl BaseDarkable {
    pub fn new(dark_mode: &bool) -> BaseDarkable {
        let dark = if *dark_mode { Some(Base::new()) } else { None };
        BaseDarkable {
            default: Base::new(),
            dark,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Base {
    pub background: String,
    pub border: String,
    pub text_light: String,
    pub text_default: String,
    pub text_dark: String,
    pub background_disabled: String,
    pub text_disabled: String,
    pub border_disabled: String,
}

impl Base {
    pub fn new() -> Base {
        Base {
            background: String::new(),
            border: String::new(),
            text_dark: String::new(),
            text_default: String::new(),
            text_light: String::new(),
            background_disabled: String::new(),
            border_disabled: String::new(),
            text_disabled: String::new(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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
