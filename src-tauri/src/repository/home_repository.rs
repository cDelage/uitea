use anyhow::{anyhow, Result};
use std::{
    fs,
    path::{Path, PathBuf},
};
use tauri::State;

use crate::{
    domain::home_domain::RemoveRecentFilesPayload, repository::DESIGN_SYSTEM_METADATA_PATH,
    AppState,
};

pub fn insert_recent_file(state: State<AppState>, file_path: String) -> Result<String> {
    let folder_path = Path::new(&file_path);
    let design_system_metadata_path = PathBuf::from(&folder_path).join(DESIGN_SYSTEM_METADATA_PATH);

    if !folder_path.exists() || !folder_path.is_dir() || !design_system_metadata_path.is_file() {
        return Err(anyhow!(
            "Folder loaded do not include a pathframe design-system"
        ));
    }

    let mut db = state.db.lock().unwrap();
    // Récupérer la liste existante ou en créer une nouvelle
    let mut file_paths: Vec<String> = db.get("recentFiles").unwrap_or_default();

    // Ajouter le nouveau chemin si pas déjà présent
    if !file_paths.contains(&file_path) {
        file_paths.push(file_path.clone());
        db.set("recentFiles", &file_paths)
            .map_err(|e| anyhow!(e.to_string()))?;
    }

    Ok(file_path)
}

pub fn find_all_recent_files(state: State<AppState>) -> Vec<String> {
    println!("Fetch all recents files");
    let db = state.db.lock().unwrap();

    db.get("recentFiles").unwrap_or_default()
}

pub fn remove_recent_file(
    state: State<AppState>,
    remove_payload: &RemoveRecentFilesPayload,
) -> Result<String> {
    println!("Try to remove recent file {}", &remove_payload.file_path);
    let mut db = state.db.lock().unwrap();

    // Récupérer la liste existante
    let file_paths: Vec<String> = db.get("recentFiles").unwrap_or_default();

    let file_paths_filtered: Vec<String> = file_paths
        .into_iter()
        .filter(|path| path != &remove_payload.file_path)
        .collect::<Vec<String>>();

    println!("new recents files : {:?}", &file_paths_filtered);
    db.set("recentFiles", &file_paths_filtered)
        .or(Err(anyhow!("Impossible to remove recent files from list")))?;

    if remove_payload.is_delete_from_computer {
        println!("Try to remove file from computer");
        fs::remove_dir_all(&remove_payload.file_path).or(Err(anyhow!(
            "Recent file successfuly removed, but fail to remove from computer"
        )))?;
    }

    println!("Succeed remove operation");
    Ok(String::new())
}
