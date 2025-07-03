use std::path::PathBuf;

use anyhow_tauri::{IntoTAResult, TAResult};
use tauri::State;

use crate::{
    application::palette_builder_application,
    domain::palette_builder_domain::{
        PaletteBuilder, PaletteBuilderFile, PaletteBuilderMetadata, PaletteBuilderRenamePayload,
        PaletteBuilderUndoRedo,
    },
    repository::undo_repository::UndoRedoActions,
    AppState,
};

#[tauri::command]
pub fn save_palette_builder(
    state: State<AppState>,
    palette_builder: PaletteBuilder,
) -> TAResult<()> {
    palette_builder_application::save_palette_builder(state, palette_builder).into_ta_result()
}

#[tauri::command]
pub fn load_palette_builder(state: State<AppState>, path: PathBuf) -> TAResult<PaletteBuilderFile> {
    palette_builder_application::load_palette_builder(state, &path).into_ta_result()
}

#[tauri::command]
pub fn save_palette_builder_into_design_system(
    design_system_path: PathBuf,
    palette_builder: PaletteBuilder,
) -> TAResult<()> {
    palette_builder_application::save_palette_builder_into_design_system(
        &design_system_path,
        &palette_builder,
    )
    .into_ta_result()
}

#[tauri::command]
pub fn fetch_design_system_palette_builders(
    design_system_path: PathBuf,
) -> TAResult<Vec<PaletteBuilderMetadata>> {
    palette_builder_application::fetch_design_system_palette_builders(&design_system_path)
        .into_ta_result()
}

#[tauri::command]
pub fn remove_palette_builder_from_design_system(path: PathBuf) -> TAResult<()> {
    palette_builder_application::remove_palette_builder_from_design_system(&path).into_ta_result()
}

#[tauri::command]
pub fn rename_palette_builder(payload: PaletteBuilderRenamePayload) -> TAResult<()> {
    palette_builder_application::rename_palette_builder(payload).into_ta_result()
}

#[tauri::command]
pub fn do_palette_builder(
    state: State<AppState>,
    palette_builder: PaletteBuilderUndoRedo,
) -> TAResult<()> {
    palette_builder_application::do_palette_builder(state, palette_builder).into_ta_result()
}

#[tauri::command]
pub fn undo_palette_builder(state: State<AppState>) -> TAResult<PaletteBuilderUndoRedo> {
    palette_builder_application::undo_palette_builder(state).into_ta_result()
}

#[tauri::command]
pub fn redo_palette_builder(state: State<AppState>) -> TAResult<PaletteBuilderUndoRedo> {
    palette_builder_application::redo_palette_builder(state).into_ta_result()
}

#[tauri::command]
pub fn can_undo_redo_palette_builder(state: State<AppState>) -> TAResult<UndoRedoActions> {
    palette_builder_application::can_undo_redo_palette_builder(state).into_ta_result()
}
