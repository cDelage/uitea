use std::{fmt::Debug};

use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};
use tauri::State;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UndoRedoActions {
    pub can_undo: bool,
    pub can_redo: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Historic<T> {
    past: Vec<T>,
    present: Option<T>,
    future: Vec<T>,
}

impl<T> Default for Historic<T> {
    fn default() -> Self {
        Self {
            past: Vec::new(),
            present: None,
            future: Vec::new(),
        }
    }
}

pub fn can_undo_redo<T: for<'de> Deserialize<'de>>(
    state: &State<AppState>,
    object_id: &str,
) -> Result<UndoRedoActions> {
    let undo_db: std::sync::MutexGuard<'_, pickledb::PickleDb> = state.undo_db.lock().unwrap();
    let historic: Historic<T> = undo_db.get(object_id).unwrap_or_default();

    Ok(UndoRedoActions {
        can_redo: historic.future.len() > 0,
        can_undo: historic.past.len() > 0,
    })
}

pub fn set_new<T: Serialize + for<'de> Deserialize<'de> + Clone>(
    state: &State<AppState>,
    object_id: &str,
    new_value: &T,
) -> Result<()> {
    let mut undo_db = state.undo_db.lock().unwrap();
    let mut historic: Historic<T> = undo_db.get(object_id).unwrap_or_default();

    if let Some(current) = historic.present.take() {
        historic.past.push(current);
    }
    historic.present = Some(new_value.clone());
    historic.future.clear();

    undo_db.set(object_id, &historic)?;
    Ok(())
}

pub fn undo<T: Serialize + for<'de> Deserialize<'de> + Clone + Debug>(
    state: &State<AppState>,
    object_id: &str,
) -> Result<T> {
    let mut undo_db = state.undo_db.lock().unwrap();
    let mut historic: Historic<T> = undo_db.get(object_id).unwrap_or_default();
    if let Some(prev) = historic.past.pop() {
        if let Some(current) = historic.present.take() {
            historic.future.push(current);
        }
        historic.present = Some(prev.clone());
        // Limite à 15 entrées dans le passé
        if historic.past.len() > 25 {
            historic.past.drain(0..historic.past.len() - 15);
        }
        undo_db.set(object_id, &historic).or(Err(anyhow!("Impossible to undo")))?;
        undo_db.dump()?;
        return Ok(prev);
    }

    Err(anyhow!("fail to undo design system"))
}

pub fn redo<T: Serialize + for<'de> Deserialize<'de> + Clone + Debug>(
    state: &State<AppState>,
    object_id: &str,
) -> Result<T> {
    let mut undo_db = state.undo_db.lock().unwrap();
    let mut historic: Historic<T> = undo_db.get(object_id).unwrap_or_default();

    if let Some(next) = historic.future.pop() {
        if let Some(current) = historic.present.take() {
            historic.past.push(current);
        }
        historic.present = Some(next.clone());
        undo_db.set(object_id, &historic)?;
        match undo_db.get::<Historic<T>>(object_id){
            None => {println!("fail to get")}
            Some(_) => {}
        };
        
        return Ok(next);
    }

    Err(anyhow!("fail to redo design system"))
}

pub fn get_present<T: Serialize + for<'de> Deserialize<'de> + Clone + Debug>(
    state: &State<AppState>,
    object_id: &str,
) -> Result<T> {
    let undo_db = state.undo_db.lock().unwrap();
    let historic: Historic<T> = undo_db.get(object_id).unwrap_or_default();
    let present_historic: T = historic.present.ok_or(anyhow!("fail to find present"))?;
    Ok(present_historic)
}