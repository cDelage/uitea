use super::design_system_domain::DesignSystemMetadata;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum RecentFiles {
    DesignSystem(DesignSystemMetadata),
    Unknown(String),
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]

pub struct RemoveRecentFilesPayload {
    pub file_path: String,
    pub is_delete_from_computer: bool,
}
