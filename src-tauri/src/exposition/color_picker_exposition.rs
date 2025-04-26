use anyhow_tauri::{IntoTAResult, TAResult};
use tauri::State;

use crate::{
    application::color_picker_application, domain::color_picker_domain::ColorPickerStore,
    repository::undo_repository::UndoRedoActions, AppState,
};

#[tauri::command]
pub fn fetch_color_picker_store(state: State<AppState>) -> TAResult<ColorPickerStore> {
    color_picker_application::fetch_color_picker_store(&state).into_ta_result()
}

#[tauri::command]
pub fn save_color_picker_store(
    state: State<AppState>,
    color_store: ColorPickerStore,
) -> TAResult<()> {
    color_picker_application::save_color_picker_store(&state, &color_store).into_ta_result()
}

#[tauri::command]
pub fn undo_color_picker(state: State<AppState>) -> TAResult<ColorPickerStore> {
    color_picker_application::undo_color_picker(state).into_ta_result()
}

#[tauri::command]
pub fn redo_color_picker(state: State<AppState>) -> TAResult<ColorPickerStore> {
    color_picker_application::redo_color_picker(state).into_ta_result()
}

#[tauri::command]
pub fn can_undo_redo_color_picker(state: State<AppState>) -> TAResult<UndoRedoActions> {
    color_picker_application::can_undo_redo_color_picker(state).into_ta_result()
}
