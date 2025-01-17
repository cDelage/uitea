use anyhow::Result;
use tauri::State;
use crate::{repository::home_repository, AppState};

pub fn insert_recent_file(state: State<AppState>, file_path: String) -> Result<String>  {
    home_repository::insert_recent_file(state, file_path)
}

/// Récupère tous les chemins de fichiers
pub fn find_all_recent_files(state: State<AppState>) -> Result<String>  {
    home_repository::find_all_recent_files(state)
}

/// Supprime un chemin de fichier spécifique
pub fn remove_recent_file(state: State<AppState>, file_path: String) -> Result<String>  {
    home_repository::remove_recent_file(state, file_path)
}