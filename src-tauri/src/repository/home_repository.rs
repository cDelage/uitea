use std::path::{Path, PathBuf};

use anyhow::{anyhow, Result};
use tauri::State;

use crate::{repository::DESIGN_SYSTEM_METADATA_PATH, AppState};

pub fn insert_recent_file(state: State<AppState>, file_path: String) -> Result<String> {
    let folder_path = Path::new(&file_path);
    let design_system_metadata_path = PathBuf::from(&folder_path).join(DESIGN_SYSTEM_METADATA_PATH);

    if !folder_path.exists() || !folder_path.is_dir() || !design_system_metadata_path.is_file() {
        return Err(anyhow!("Folder loaded do not include a pathframe design-system"));
    }

    let mut db = state.db.lock().unwrap();
    println!("try to insert a recent file");
    // Récupérer la liste existante ou en créer une nouvelle
    let mut file_paths: Vec<String> = db.get("recentFiles").unwrap_or_default();

    // Ajouter le nouveau chemin si pas déjà présent
    if !file_paths.contains(&file_path) {
        file_paths.push(file_path.clone());
        db.set("recentFiles", &file_paths)
            .map_err(|e| anyhow!(e.to_string()))?;
        db.dump().map_err(|e| anyhow!(e.to_string()))?;
    }

    Ok(file_path)
}

pub fn find_all_recent_files(state: State<AppState>) -> Result<String> {
    let db = state.db.lock().unwrap();
    // Récupérer la liste ou retourner une liste vide
    Ok(db.get("recentFiles").unwrap_or_default())
}

pub fn remove_recent_file(state: State<AppState>, file_path: String) -> Result<String> {
    let mut db = state.db.lock().unwrap();

    // Récupérer la liste existante
    let mut file_paths: Vec<String> = db.get("recentFiles").unwrap_or_default();

    // Vérifier et supprimer le chemin
    if let Some(index) = file_paths.iter().position(|fp| *fp == file_path) {
        file_paths.remove(index);
        db.set("recentFiles", &file_paths)
            .map_err(|e| anyhow!(e.to_string()))?;
        db.dump().map_err(|e| anyhow!(e.to_string()))?;
        Ok(format!("File path '{}' supprimé avec succès.", file_path))
    } else {
        Err(anyhow!("File path '{}' n'existe pas.", file_path))
    }
}
