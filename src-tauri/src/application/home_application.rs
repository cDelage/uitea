use std::path::PathBuf;

use crate::{
    domain::{
        design_system_domain::DesignSystemMetadataHome,
        home_domain::{PresetDressing, RecentFile, RecentFiles, RemoveRecentFilesPayload}, image_domain::ImageLocal,
    },
    repository::{self, design_system_repository, home_repository},
    AppState,
};
use anyhow::Result;
use tauri::State;

pub fn insert_recent_file(state: State<AppState>, file_path: String) -> Result<String> {
    home_repository::insert_recent_file(state, file_path, Some(true))
}

/// Récupère tous les chemins de fichiers
pub fn find_all_recent_files(state: State<AppState>) -> Result<Vec<RecentFiles>> {
    let paths: Vec<RecentFile> = home_repository::find_all_recent_files(state);
    Ok(paths
        .into_iter()
        .map(|recent_file: RecentFile| {
            let design_system_pathbuf: PathBuf = PathBuf::from(&recent_file.file_path);
            match design_system_repository::find_design_system_metadata(&design_system_pathbuf) {
                Ok(design_system) => RecentFiles::DesignSystem(DesignSystemMetadataHome::from(
                    design_system,
                    recent_file.edit_mode,
                )),
                Err(_) => RecentFiles::Unknown(recent_file.file_path.clone()),
            }
        })
        .collect::<Vec<RecentFiles>>())
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

pub fn fetch_presets_dressing() -> Result<PresetDressing> {
    home_repository::fetch_presets_dressing()
}

pub fn encode_image_base64(path: String) -> Result<ImageLocal> {
    repository::encode_image_base64(path)
}
