use std::path::PathBuf;

use crate::{
    domain::{
        design_system_domain::DesignSystemMetadataHome,
        home_domain::{
            PresetDressing, RecentFile,
            RecentFileCategory::{DesignSystemCategory, PaletteBuilderCategory},
            RecentFilesMetadata, RemoveRecentFilesPayload, UserSettings,
        },
        image_domain::ImageLocal,
    },
    repository::{
        self, design_system_repository::{self}, home_repository,
        palette_builder_repository::find_palette_builder_metadata,
    },
    AppState,
};
use anyhow::Result;
use tauri::{AppHandle, State};

pub fn insert_recent_file(state: State<AppState>, recent_file: RecentFile) -> Result<PathBuf> {
    home_repository::insert_recent_file(state, recent_file)
}

/// Récupère tous les chemins de fichiers
pub fn find_all_recent_files(state: State<AppState>) -> Result<Vec<RecentFilesMetadata>> {
    let paths: Vec<RecentFile> = home_repository::find_all_recent_files(state);
    Ok(paths
        .into_iter()
        .map(|recent_file: RecentFile| match recent_file.category {
            DesignSystemCategory => {
                let design_system_pathbuf: PathBuf = PathBuf::from(&recent_file.file_path);
                match design_system_repository::find_design_system_metadata(&design_system_pathbuf)
                {
                    Ok(design_system) => RecentFilesMetadata::DesignSystem(
                        DesignSystemMetadataHome::from(design_system, recent_file.edit_mode),
                    ),
                    Err(_) => RecentFilesMetadata::Unknown(recent_file.file_path.clone()),
                }
            }
            PaletteBuilderCategory => {
                match find_palette_builder_metadata(&recent_file.file_path) {
                    Ok(metadata) => RecentFilesMetadata::PaletteBuilder(metadata),
                    Err(_) => RecentFilesMetadata::Unknown(recent_file.file_path.clone()),
                }
            }
        })
        .collect::<Vec<RecentFilesMetadata>>())
}

/// Supprime un chemin de fichier spécifique
pub fn remove_recent_file(
    state: State<AppState>,
    remove_payload: RemoveRecentFilesPayload,
) -> Result<String> {
    home_repository::remove_recent_file(state, &remove_payload)
}

pub fn update_recent_file(state: State<AppState>, updated_file: RecentFile) -> Result<()> {
    home_repository::update_recent_file(state, updated_file)
}

pub fn fetch_presets_dressing(app: AppHandle) -> Result<PresetDressing> {
    home_repository::fetch_presets_dressing(app)
}

pub fn encode_image_base64(path: String) -> Result<ImageLocal> {
    repository::encode_image_base64(path)
}

pub fn svg_to_png(svg: &str, design_system_path: Option<PathBuf>) -> Result<String> {
    home_repository::svg_to_png(&svg, design_system_path)
}


pub fn update_user_settings(state: State<AppState>, user_settings: UserSettings) -> Result<()> {
    home_repository::update_user_settings(state, user_settings)
}

pub fn fetch_user_settings(state: State<AppState>) -> Result<UserSettings> {
    home_repository::fetch_user_settings(state)
}

pub fn open_folder(path: PathBuf) -> Result<()> {
    repository::open_folder(path)
}