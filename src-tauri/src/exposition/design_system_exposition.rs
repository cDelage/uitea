use anyhow_tauri::IntoTAResult;

use crate::{
    application::design_system_application,
    domain::design_system_domain::{
        DesignSystem, DesignSystemCreationPayload, DesignSystemMetadata,
    },
};

#[tauri::command]
pub fn create_design_system(
    payload: DesignSystemCreationPayload,
) -> anyhow_tauri::TAResult<DesignSystemMetadata> {
    design_system_application::create_design_system(payload).into_ta_result()
}

#[tauri::command]
pub fn find_design_system(design_system_path: String) -> anyhow_tauri::TAResult<DesignSystem> {
    design_system_application::find_design_system(&design_system_path).into_ta_result()
}

#[tauri::command]
pub fn save_design_system(design_system: DesignSystem, is_tmp: bool) -> anyhow_tauri::TAResult<()> {
    design_system_application::save_design_system(design_system, is_tmp).into_ta_result()
}
