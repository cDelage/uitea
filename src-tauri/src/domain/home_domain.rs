use std::path::PathBuf;

use super::{
    design_system_domain::DesignSystemMetadataHome, palette_builder_domain::PaletteBuilderMetadata,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum RecentFilesMetadata {
    DesignSystem(DesignSystemMetadataHome),
    PaletteBuilder(PaletteBuilderMetadata),
    Unknown(PathBuf),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum RecentFileCategory {
    DesignSystemCategory,
    PaletteBuilderCategory,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]

pub struct RemoveRecentFilesPayload {
    pub file_path: PathBuf,
    pub is_delete_from_computer: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RecentFile {
    pub file_path: PathBuf,
    pub edit_mode: Option<bool>,
    pub category: RecentFileCategory,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PresetDressing {
    pub banners: Vec<String>,
    pub logos: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UserSettings {
    pub plugin_display_mode: PluginDisplayMode,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum PluginDisplayMode {
    #[serde(rename = "fullscreen")]
    FullScreen,
    #[serde(rename = "modal")]
    Modal,
}

impl Default for UserSettings {
    fn default() -> Self {
        UserSettings {
            plugin_display_mode: PluginDisplayMode::FullScreen,
        }
    }
}
