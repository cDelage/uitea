use anyhow_tauri::{IntoTAResult, TAResult};
use tauri::State;

use crate::{
    application::design_system_application,
    domain::design_system_domain::{
        DesignSystem, DesignSystemCreationPayload, DesignSystemMetadata
    }, AppState,
};

#[tauri::command]
pub fn create_design_system(
    payload: DesignSystemCreationPayload,
) -> TAResult<DesignSystemMetadata> {
    design_system_application::create_design_system(payload).into_ta_result()
}

#[tauri::command]
pub fn find_design_system(state: State<AppState>, design_system_path: String) -> TAResult<DesignSystem> {
    design_system_application::find_design_system(&state, &design_system_path).into_ta_result()
}

#[tauri::command]
pub fn save_design_system(
    state: State<AppState>, 
    design_system: DesignSystem,
    is_tmp: bool,
) -> TAResult<()> {
    design_system_application::save_design_system(&state, &design_system, is_tmp, true).into_ta_result()
}

#[tauri::command]
pub fn undo_design_system(state: State<AppState>,design_system_path: String ) -> TAResult<()>{
    design_system_application::undo_design_system(&state, &design_system_path).into_ta_result()
}

#[tauri::command]
pub fn redo_design_system(state: State<AppState>,design_system_path: String ) -> TAResult<()>{
    design_system_application::redo_design_system(&state, &design_system_path).into_ta_result()
}