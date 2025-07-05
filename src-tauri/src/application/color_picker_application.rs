use anyhow::Result;
use tauri::State;

use crate::{
    domain::color_picker_domain::ColorPickerStore,
    repository::{
        color_picker_repository,
        undo_repository::{self, UndoRedoActions},
    },
    AppState,
};

pub fn fetch_color_picker_store(state: &State<AppState>) -> Result<ColorPickerStore> {
    color_picker_repository::fetch_color_picker_store(state)
}

pub fn save_color_picker_store(
    state: &State<AppState>,
    color_store: &ColorPickerStore,
) -> Result<()> {
    color_picker_repository::save_color_picker_store(&state, color_store)?;
    do_color_picker(state, color_store)
}

pub fn do_color_picker(state: &State<AppState>, color_picker: &ColorPickerStore) -> Result<()> {
    undo_repository::set_new::<ColorPickerStore>(&state, &"color-picker-undoredo", &color_picker)?;
    Ok(())
}

pub fn undo_color_picker(state: State<AppState>) -> Result<ColorPickerStore> {
    undo_repository::undo::<ColorPickerStore>(&state, &"color-picker-undoredo")
}

pub fn redo_color_picker(state: State<AppState>) -> Result<ColorPickerStore> {
    undo_repository::redo::<ColorPickerStore>(&state, &"color-picker-undoredo")
}

pub fn can_undo_redo_color_picker(state: State<AppState>) -> Result<UndoRedoActions> {
    undo_repository::can_undo_redo::<ColorPickerStore>(&state, &"color-picker-undoredo")
}
