use anyhow::{anyhow, Result};
use std::{fs, path::PathBuf};
use tauri::{AppHandle, State};

use crate::{
    domain::{
        home_domain::{
            PresetDressing, RecentFile,
            RecentFileCategory::{DesignSystemCategory, PaletteBuilderCategory},
            RemoveRecentFilesPayload, UserSettings,
        },
        palette_builder_domain::PaletteBuilderFile,
    },
    repository::DESIGN_SYSTEM_METADATA_PATH,
    AppState,
};

use super::{
    design_system_repository::EXPORTS_PATH, fetch_image_folder, fonts_repository::FONTS_PATH,
    load_yaml_from_pathbuf, svg_to_png_b64,
};

const BANNERS_PATH: &str = "assets/banners";
const LOGOS_PATH: &str = "assets/logos";

pub fn fetch_presets_dressing(app: AppHandle) -> Result<PresetDressing> {
    let resource_dir = app
        .path_resolver()
        .resource_dir()
        .ok_or_else(|| anyhow::anyhow!("Impossible de trouver le resource_dir"))?;

    let banners: Vec<String> = fetch_image_folder(&resource_dir.join(BANNERS_PATH))?;
    let logos: Vec<String> = fetch_image_folder(&resource_dir.join(LOGOS_PATH))?;
    Ok(PresetDressing { banners, logos })
}

pub fn insert_recent_file(state: State<AppState>, recent_file: RecentFile) -> Result<PathBuf> {
    validate_recent_file(&recent_file)?;

    let mut db = state.user_settings_db.lock().unwrap();
    // Récupérer la liste existante ou en créer une nouvelle
    let mut recent_files: Vec<RecentFile> = db.get("recentFiles").unwrap_or_default();

    // Vérifier si le fichier est déjà dans la liste
    if !recent_files
        .iter()
        .any(|rf| &rf.file_path == &recent_file.file_path)
    {
        recent_files.push(recent_file.clone());
        db.set("recentFiles", &recent_files)
            .map_err(|e| anyhow!(e.to_string()))?;
    }
    Ok(recent_file.file_path)
}

pub fn validate_recent_file(recent_file: &RecentFile) -> Result<PathBuf> {
    let validated_path: PathBuf = match recent_file.category {
        DesignSystemCategory => {
            let design_system_metadata_path =
                recent_file.file_path.join(DESIGN_SYSTEM_METADATA_PATH);
            if !recent_file.file_path.exists()
                || !recent_file.file_path.is_dir()
                || !design_system_metadata_path.is_file()
            {
                return Err(anyhow!(
                    "Le dossier chargé n'inclut pas un design-system uitea"
                ));
            }
            recent_file.file_path.to_path_buf()
        }
        PaletteBuilderCategory => {
            load_yaml_from_pathbuf::<PaletteBuilderFile>(&recent_file.file_path)?;
            recent_file.file_path.to_path_buf()
        }
    };

    Ok(validated_path)
}

pub fn find_all_recent_files(state: State<AppState>) -> Vec<RecentFile> {
    println!("Fetch all recent files");
    let db = state.user_settings_db.lock().unwrap();
    db.get("recentFiles").unwrap_or_default()
}

pub fn remove_recent_file(
    state: State<AppState>,
    remove_payload: &RemoveRecentFilesPayload,
) -> Result<String> {
    println!("Try to remove recent file {:?}", &remove_payload.file_path);
    let mut db = state.user_settings_db.lock().unwrap();

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
        if remove_payload.file_path.is_dir() {
            fs::remove_dir_all(&remove_payload.file_path).or(Err(anyhow!(
                "Recent file successfully removed, but failed to remove from computer"
            )))?;
        } else if remove_payload.file_path.is_file() {
            fs::remove_file(&remove_payload.file_path).or(Err(anyhow!(
                "Recent file successfully removed, but failed to remove from computer"
            )))?;
        }
    }

    println!("Succeed remove operation");
    Ok(String::new())
}

pub fn update_recent_file(state: State<AppState>, updated_file: RecentFile) -> Result<()> {
    let mut db = state.user_settings_db.lock().unwrap();
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

pub fn update_user_settings(state: State<AppState>, user_settings: UserSettings) -> Result<()> {
    let mut db = state.user_settings_db.lock().unwrap();
    db.set("userSettings", &user_settings)
        .map_err(|e| anyhow!(e.to_string()))?;
    Ok(())
}

pub fn fetch_user_settings(state: State<AppState>) -> Result<UserSettings> {
    let db = state.user_settings_db.lock().unwrap();
    let user_settings: UserSettings = db.get("userSettings").unwrap_or_default();
    Ok(user_settings)
}

pub fn svg_to_png(svg: &str, design_system_path: Option<PathBuf>) -> Result<String> {
    let compute_pathbuf: Option<PathBuf> = match design_system_path {
        Some(path) => Some(path.join(EXPORTS_PATH).join(FONTS_PATH)),
        None => None,
    };
    svg_to_png_b64(&svg, 96.0, compute_pathbuf)
}
