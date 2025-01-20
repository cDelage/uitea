use std::path::PathBuf;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystemCreationPayload {
    pub name: String,
    pub folder_path: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DesignSystemMetadata {
    pub design_system_id: String,
    pub design_system_name: String,
    pub dark_mode: bool,
    pub design_system_path: PathBuf,
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
    pub fn from(design_system_file: &DesignSystemMetadataFile, path: &PathBuf) -> DesignSystemMetadata {
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
        }
    }
}
