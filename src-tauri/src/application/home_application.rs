use crate::{
    domain::home_domain::{RecentFiles, RemoveRecentFilesPayload},
    repository::{design_system_repository, home_repository},
    AppState,
};
use anyhow::Result;
use tauri::State;

pub fn insert_recent_file(state: State<AppState>, file_path: String) -> Result<String> {
    home_repository::insert_recent_file(state, file_path)
}

/// Récupère tous les chemins de fichiers
pub fn find_all_recent_files(state: State<AppState>) -> Result<Vec<RecentFiles>> {
    let paths: Vec<String> = home_repository::find_all_recent_files(state);
    Ok(paths
        .into_iter()
        .map(
            |path: String| match design_system_repository::find_design_system_metadata(&path) {
                Ok(design_system) => RecentFiles::DesignSystem(design_system),
                Err(_) => RecentFiles::Unknown(path),
            },
        )
        .collect::<Vec<RecentFiles>>())
}

/// Supprime un chemin de fichier spécifique
pub fn remove_recent_file(state: State<AppState>, remove_payload: RemoveRecentFilesPayload) -> Result<String> {
    home_repository::remove_recent_file(state, &remove_payload)
}
