use std::path::PathBuf;

use anyhow_tauri::{self, IntoTAResult, TAResult};
use tauri::{AppHandle, State};

use crate::{
    application::home_application,
    domain::{
        home_domain::{PresetDressing, RecentFile, RecentFilesMetadata, RemoveRecentFilesPayload, UserSettings},
        image_domain::ImageLocal,
    },
    AppState,
};

#[tauri::command]
pub fn insert_recent_file(
    state: State<AppState>,
    recent_file: RecentFile,
) -> anyhow_tauri::TAResult<PathBuf> {
    home_application::insert_recent_file(state, recent_file).into_ta_result()
}

/// Récupère tous les chemins de fichiers
#[tauri::command]
pub fn find_all_recent_files(
    state: State<AppState>,
) -> anyhow_tauri::TAResult<Vec<RecentFilesMetadata>> {
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

/// Supprime un chemin de fichier spécifique
#[tauri::command]
pub fn update_recent_file(
    state: State<AppState>,
    updated_file: RecentFile,
) -> anyhow_tauri::TAResult<()> {
    home_application::update_recent_file(state, updated_file).into_ta_result()
}

#[tauri::command]
pub fn fetch_presets_dressing(app: AppHandle) -> TAResult<PresetDressing> {
    home_application::fetch_presets_dressing(app).into_ta_result()
}

#[tauri::command]
pub fn encode_image_base64(path: String) -> TAResult<ImageLocal> {
    home_application::encode_image_base64(path).into_ta_result()
}

#[tauri::command]
pub fn svg_to_png_b64(svg: String, design_system_path: Option<PathBuf>) -> TAResult<String> {
    home_application::svg_to_png(&svg, design_system_path).into_ta_result()
}

#[tauri::command]
pub fn update_user_settings(state: State<AppState>, user_settings: UserSettings) -> TAResult<()> {
    home_application::update_user_settings(state, user_settings).into_ta_result()
}

#[tauri::command]
pub fn fetch_user_settings(state: State<AppState>) -> TAResult<UserSettings> {
    home_application::fetch_user_settings(state).into_ta_result()
}

#[tauri::command]
pub fn open_folder(path: PathBuf) -> TAResult<()>{
    home_application::open_folder(path).into_ta_result()
}