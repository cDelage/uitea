use std::path::PathBuf;

use anyhow_tauri::{IntoTAResult, TAResult};
use tauri::{AppHandle, State};

use crate::{
    application::design_system_application,
    domain::design_system_domain::{
        DesignSystem, DesignSystemCreationPayload, DesignSystemMetadata, ExportPayload,
    },
    AppState,
};

#[tauri::command]
pub fn create_design_system(
    payload: DesignSystemCreationPayload,
) -> TAResult<DesignSystemMetadata> {
    design_system_application::create_design_system(payload).into_ta_result()
}

#[tauri::command]
pub fn find_design_system(
    app: AppHandle,
    state: State<AppState>,
    design_system_path: String,
) -> TAResult<DesignSystem> {
    design_system_application::find_design_system(app, &state, &design_system_path).into_ta_result()
}

#[tauri::command]
pub fn save_design_system(
    app: AppHandle,
    state: State<AppState>,
    mut design_system: DesignSystem,
    is_tmp: bool,
) -> TAResult<DesignSystem> {
    design_system_application::save_design_system(app, &state, &mut design_system, is_tmp, true)
        .into_ta_result()
}

#[tauri::command]
pub fn undo_design_system(app: AppHandle, state: State<AppState>, design_system_path: String) -> TAResult<()> {
    design_system_application::undo_design_system(app, &state, &design_system_path).into_ta_result()
}

#[tauri::command]
pub fn redo_design_system(app: AppHandle, state: State<AppState>, design_system_path: String) -> TAResult<()> {
    design_system_application::redo_design_system(app, &state, &design_system_path).into_ta_result()
}

#[tauri::command]
pub fn register_export(payload: ExportPayload) -> TAResult<()> {
    design_system_application::register_export(payload).into_ta_result()
}

#[tauri::command]
pub fn save_readme(metadata: DesignSystemMetadata) -> TAResult<()> {
    design_system_application::save_readme(metadata).into_ta_result()
}

#[tauri::command]
pub fn load_font_as_base64(path: PathBuf) -> TAResult<String> {
    design_system_application::load_font_as_base64(path).into_ta_result()
}

#[tauri::command]
pub fn upload_typography(original_path: PathBuf, design_system_path: PathBuf) -> TAResult<String> {
    design_system_application::upload_typography(original_path, design_system_path).into_ta_result()
}

#[tauri::command]
pub fn open_export_folder(design_system_path: PathBuf) -> TAResult<()> {
    design_system_application::open_export_folder(design_system_path).into_ta_result()
}