use std::path::PathBuf;

use crate::{
    domain::{
        home_domain::{RecentFile, RecentFileCategory},
        palette_builder_domain::{
            PaletteBuilder, PaletteBuilderFile, PaletteBuilderMetadata, PaletteBuilderRenamePayload, PaletteBuilderUndoRedo,
        },
    },
    repository::{
        design_system_repository, home_repository, palette_builder_repository, undo_repository::{self, UndoRedoActions},
    },
    AppState,
};
use anyhow::Result;
use tauri::State;

pub fn save_palette_builder(state: State<AppState>, palette_builder: PaletteBuilder) -> Result<()> {
    palette_builder_repository::save_palette_builder(&palette_builder)?;
    if !design_system_repository::is_under_design_system(&palette_builder.metadata.path) {
        home_repository::insert_recent_file(
            state,
            RecentFile {
                file_path: palette_builder.metadata.path.clone(),
                category: RecentFileCategory::PaletteBuilderCategory,
                edit_mode: None,
            },
        )?;
    }
    Ok(())
}

pub fn load_palette_builder(state: State<AppState>, path: &PathBuf) -> Result<PaletteBuilderFile> {
    let palette_builder: PaletteBuilderFile =
        palette_builder_repository::load_palette_builder(path)?;
    if !design_system_repository::is_under_design_system(&path) {
        home_repository::insert_recent_file(
            state,
            RecentFile {
                file_path: path.clone(),
                category: RecentFileCategory::PaletteBuilderCategory,
                edit_mode: None,
            },
        )?;
    }
    Ok(palette_builder)
}

pub fn save_palette_builder_into_design_system(
    design_system_path: &PathBuf,
    palette_builder: &PaletteBuilder,
) -> Result<()> {
    palette_builder_repository::save_palette_builder_into_design_system(
        &design_system_path,
        &palette_builder,
    )
}

pub fn fetch_design_system_palette_builders(
    design_system_path: &PathBuf,
) -> Result<Vec<PaletteBuilderMetadata>> {
    palette_builder_repository::fetch_design_system_palette_builders(design_system_path)
}

pub fn remove_palette_builder_from_design_system(path: &PathBuf) -> Result<()> {
    palette_builder_repository::remove_palette_builder_from_design_system(path)
}

pub fn rename_palette_builder(payload: PaletteBuilderRenamePayload) -> Result<()> {
    palette_builder_repository::rename_palette_builder(payload)
}

pub fn do_palette_builder(state: State<AppState>, palette_builder: PaletteBuilderUndoRedo) -> Result<()> {
    undo_repository::set_new::<PaletteBuilderUndoRedo>(
        &state,
        &"palette-builder",
        &palette_builder,
    )?;
    Ok(())
}

pub fn undo_palette_builder(state: State<AppState>) -> Result<PaletteBuilderUndoRedo> {
    undo_repository::undo::<PaletteBuilderUndoRedo>(
        &state,
        &"palette-builder",
    )
}

pub fn redo_palette_builder(state: State<AppState>) -> Result<PaletteBuilderUndoRedo> {
    undo_repository::redo::<PaletteBuilderUndoRedo>(
        &state,
        &"palette-builder",
    )
}

pub fn can_undo_redo_palette_builder(state: State<AppState>) -> Result<UndoRedoActions>{
    undo_repository::can_undo_redo::<PaletteBuilderUndoRedo>(&state, &"palette-builder")
}