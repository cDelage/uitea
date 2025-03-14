use anyhow::{anyhow, Result};
use std::{
    fs,
    path::{Path, PathBuf},
};
use tauri::State;

use crate::{
    domain::home_domain::{PresetDressing, RecentFile, RemoveRecentFilesPayload},
    repository::DESIGN_SYSTEM_METADATA_PATH,
    AppState,
};

use super::fetch_image_folder;

const BANNERS_PATH: &str = "./assets/banners";
const LOGOS_PATH: &str = "./assets/logos";

pub fn insert_recent_file(
    state: State<AppState>,
    file_path: String,
    edit_mode: Option<bool>,
) -> Result<String> {
    let folder_path = Path::new(&file_path);
    let design_system_metadata_path = PathBuf::from(&folder_path).join(DESIGN_SYSTEM_METADATA_PATH);

    if !folder_path.exists() || !folder_path.is_dir() || !design_system_metadata_path.is_file() {
        return Err(anyhow!(
            "Folder loaded do not include a pathframe design-system"
        ));
    }

    let mut db = state.db.lock().unwrap();
    // Récupérer la liste existante ou en créer une nouvelle
    let mut recent_files: Vec<RecentFile> = db.get("recentFiles").unwrap_or_default();

    // Vérifier si le fichier est déjà dans la liste
    if !recent_files.iter().any(|rf| rf.file_path == file_path) {
        recent_files.push(RecentFile {
            file_path: file_path.clone(),
            edit_mode,
        });
        db.set("recentFiles", &recent_files)
            .map_err(|e| anyhow!(e.to_string()))?;
    }

    Ok(file_path)
}

pub fn find_all_recent_files(state: State<AppState>) -> Vec<RecentFile> {
    println!("Fetch all recent files");
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
    let recent_files: Vec<RecentFile> = db.get("recentFiles").unwrap_or_default();

    let recent_files_filtered: Vec<RecentFile> = recent_files
        .into_iter()
        .filter(|rf| rf.file_path != remove_payload.file_path)
        .collect();

    db.set("recentFiles", &recent_files_filtered)
        .or(Err(anyhow!("Impossible to remove recent files from list")))?;

    if remove_payload.is_delete_from_computer {
        println!("Try to remove file from computer");
        fs::remove_dir_all(&remove_payload.file_path).or(Err(anyhow!(
            "Recent file successfully removed, but failed to remove from computer"
        )))?;
    }

    println!("Succeed remove operation");
    Ok(String::new())
}

pub fn update_recent_file(state: State<AppState>, updated_file: RecentFile) -> Result<()> {
    let mut db = state.db.lock().unwrap();
    println!("update_recent_file : {:?}", updated_file);

    let mut recent_files: Vec<RecentFile> = db.get("recentFiles").unwrap_or_default();

    if let Some(existing_file) = recent_files
        .iter_mut()
        .find(|rf| rf.file_path == updated_file.file_path)
    {
        existing_file.edit_mode = updated_file.edit_mode;
        db.set("recentFiles", &recent_files)
            .map_err(|e| anyhow!(e.to_string()))?;
        println!("Recent file updated successfully");
        Ok(())
    } else {
        Err(anyhow!("File not found in recent files"))
    }
}

pub fn fetch_presets_dressing() -> Result<PresetDressing> {
    let banners: Vec<String> = fetch_image_folder(BANNERS_PATH)?;
    let logos: Vec<String> = fetch_image_folder(LOGOS_PATH)?;
    Ok(PresetDressing { banners, logos })
}
