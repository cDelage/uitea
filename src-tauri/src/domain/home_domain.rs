use super::design_system_domain::DesignSystemMetadataHome;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum RecentFiles {
    DesignSystem(DesignSystemMetadataHome),
    Unknown(String),
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]

pub struct RemoveRecentFilesPayload {
    pub file_path: String,
    pub is_delete_from_computer: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RecentFile {
    pub file_path: String,
    pub edit_mode: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PresetDressing {
    pub banners: Vec<String>,
    pub logos: Vec<String>,
}
