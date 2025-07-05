use anyhow::Result;
use tauri::State;

use crate::{
    domain::design_system_domain::ColorCombinationCollection,
    repository::undo_repository::{self, UndoRedoActions},
    AppState,
};

pub fn do_token_crafter(
    state: &State<AppState>,
    token_crafter: &ColorCombinationCollection,
) -> Result<()> {
    undo_repository::set_new::<ColorCombinationCollection>(
        &state,
        &"token-crafter-undoredo",
        &token_crafter,
    )?;
    Ok(())
}

pub fn undo_token_crafter(state: State<AppState>) -> Result<ColorCombinationCollection> {
    undo_repository::undo::<ColorCombinationCollection>(&state, &"token-crafter-undoredo")
}

pub fn redo_token_crafter(state: State<AppState>) -> Result<ColorCombinationCollection> {
    undo_repository::redo::<ColorCombinationCollection>(&state, &"token-crafter-undoredo")
}

pub fn can_undo_redo_token_crafter(state: State<AppState>) -> Result<UndoRedoActions> {
    undo_repository::can_undo_redo::<ColorCombinationCollection>(&state, &"token-crafter-undoredo")
}
