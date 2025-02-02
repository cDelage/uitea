use indexmap::IndexMap;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystem {
    pub metadata: DesignSystemMetadata,
    pub color_palettes: Vec<ColorPalette>,
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
pub struct ColorPalette {
    pub palette_name: String,
    pub palette_path: Option<PathBuf>,
    pub shades: Vec<Shade>,
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
