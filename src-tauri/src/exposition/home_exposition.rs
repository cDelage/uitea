use anyhow_tauri::{self, IntoTAResult};
use tauri::State;

use crate::{application::home_application, domain::home_domain::{RecentFiles, RemoveRecentFilesPayload}, AppState};

#[tauri::command]
pub fn insert_recent_file(
    state: State<AppState>,
    file_path: String,
) -> anyhow_tauri::TAResult<String> {
    home_application::insert_recent_file(state, file_path).into_ta_result()
}

/// Récupère tous les chemins de fichiers
#[tauri::command]
pub fn find_all_recent_files(state: State<AppState>) -> anyhow_tauri::TAResult<Vec<RecentFiles>> {
    home_application::find_all_recent_files(state).into_ta_result()
}

/// Supprime un chemin de fichier spécifique
#[tauri::command]
pub fn remove_recent_file(
    state: State<AppState>,
    remove_payload: RemoveRecentFilesPayload,
) -> anyhow_tauri::TAResult<String> {
    home_application::remove_recent_file(state, remove_payload).into_ta_result()
}
