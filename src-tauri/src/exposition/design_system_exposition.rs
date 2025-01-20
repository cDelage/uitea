use anyhow_tauri::IntoTAResult;

use crate::{application::design_system_application, domain::design_system_domain::{DesignSystemCreationPayload, DesignSystemMetadata}};

#[tauri::command]
pub fn create_design_system(payload : DesignSystemCreationPayload) -> anyhow_tauri::TAResult<DesignSystemMetadata> {
    design_system_application::create_design_system(payload).into_ta_result()
}
