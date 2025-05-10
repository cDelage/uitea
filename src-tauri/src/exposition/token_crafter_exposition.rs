use anyhow_tauri::{IntoTAResult, TAResult};
use tauri::State;

use crate::{
    application::token_crafter_application, domain::design_system_domain::ColorCombinationCollection, repository::undo_repository::UndoRedoActions, AppState
};

#[tauri::command]
pub fn do_token_crafter(
    state: State<AppState>,
    token_crafter: ColorCombinationCollection,
) -> TAResult<()> {
    token_crafter_application::do_token_crafter(&state, &token_crafter).into_ta_result()
}

#[tauri::command]
pub fn undo_token_crafter(state: State<AppState>) -> TAResult<ColorCombinationCollection> {
    token_crafter_application::undo_token_crafter(state).into_ta_result()
}

#[tauri::command]
pub fn redo_token_crafter(state: State<AppState>) -> TAResult<ColorCombinationCollection> {
    token_crafter_application::redo_token_crafter(state).into_ta_result()
}

#[tauri::command]
pub fn can_undo_redo_token_crafter(state: State<AppState>) -> TAResult<UndoRedoActions> {
    token_crafter_application::can_undo_redo_token_crafter(state).into_ta_result()
}
