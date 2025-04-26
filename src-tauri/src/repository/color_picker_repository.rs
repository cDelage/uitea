use std::sync::MutexGuard;

use anyhow::{anyhow, Result};
use pickledb::PickleDb;
use tauri::State;

use crate::{domain::color_picker_domain::ColorPickerStore, AppState};

pub fn init_color_sampling(db: &mut MutexGuard<'_, PickleDb>) -> Result<()> {
    db.set("color_picker_store", &ColorPickerStore::default())
        .map_err(|e| anyhow!(e.to_string()))?;
    Ok(())
}

pub fn fetch_color_picker_store(state: &State<AppState>) -> Result<ColorPickerStore> {
    let mut db = state.color_picker_db.lock().unwrap();
    if !db.exists("color_picker_store") {
        init_color_sampling(&mut db)?;
    }
    let color_picker_store: ColorPickerStore = db
        .get::<ColorPickerStore>("color_picker_store")
        .unwrap_or_default();

    Ok(color_picker_store)
}

pub fn save_color_picker_store(
    state: &State<AppState>,
    color_store: &ColorPickerStore,
) -> Result<()> {
    let mut db = state.color_picker_db.lock().unwrap();
    db.set("color_picker_store", &color_store)
        .map_err(|e| anyhow!(e.to_string()))?;
    Ok(())
}
