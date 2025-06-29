// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;

use exposition::design_system_exposition::{
    create_design_system, find_design_system, load_font_as_base64, open_export_folder,
    redo_design_system, register_export, save_design_system, save_readme, undo_design_system,
    upload_typography,
};
use exposition::home_exposition::{
    encode_image_base64, fetch_presets_dressing, fetch_user_settings, find_all_recent_files,
    insert_recent_file, open_folder, remove_recent_file, svg_to_png_b64, update_recent_file,
    update_user_settings,
};
use exposition::palette_builder_exposition::{
    can_undo_redo_palette_builder, do_palette_builder, fetch_design_system_palette_builders,
    load_palette_builder, redo_palette_builder, remove_palette_builder_from_design_system,
    rename_palette_builder, save_palette_builder, save_palette_builder_into_design_system,
    undo_palette_builder,
};
use pickledb::{PickleDb, PickleDbDumpPolicy, SerializationMethod};

use exposition::color_picker_exposition::{
    can_undo_redo_color_picker, fetch_color_picker_store, redo_color_picker,
    save_color_picker_store, undo_color_picker,
};
use exposition::token_crafter_exposition::{
    can_undo_redo_token_crafter, do_token_crafter, redo_token_crafter, undo_token_crafter,
};
use tauri::Manager;
mod application;
mod domain;
mod exposition;
mod repository;
mod utils;

struct AppState {
    user_settings_db: Mutex<PickleDb>,
    undo_db: Mutex<PickleDb>,
    color_picker_db: Mutex<PickleDb>,
}

fn make_db(path: PathBuf) -> PickleDb {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).expect("Impossible de créer le dossier DB");
    }
    match PickleDb::load(
        &path,
        PickleDbDumpPolicy::AutoDump,
        SerializationMethod::Json,
    ) {
        Ok(db) => db,
        Err(_) => PickleDb::new(
            &path,
            PickleDbDumpPolicy::AutoDump,
            SerializationMethod::Json,
        ),
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // 1) récupérer le répertoire de données de l’app
            let data_dir = app
                .handle()
                .path_resolver()
                .app_data_dir()
                .expect("Impossible de trouver app_data_dir");
            // on peut organiser sous un sous­dossier à ton nom
            let base = data_dir.join("MonSuperApp").join("db");
            // 2) préparer les chemins
            let user_settings_path = base.join("user-settings.db");
            let color_picker_path = base.join("color-picker.db");
            let undo_redo_path = base.join("undo-redo.db");
            if undo_redo_path.is_file() {
                fs::remove_file(&undo_redo_path)?;
            }

            // 3) créer/ouvrir les DB
            let user_settings_db = make_db(user_settings_path);
            let color_picker_db = make_db(color_picker_path);
            let undo_db = make_db(undo_redo_path);
            // 4) stocker dans le state
            app.manage(AppState {
                user_settings_db: Mutex::new(user_settings_db),
                color_picker_db: Mutex::new(color_picker_db),
                undo_db: Mutex::new(undo_db),
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            insert_recent_file,
            find_all_recent_files,
            remove_recent_file,
            find_design_system,
            create_design_system,
            save_design_system,
            update_recent_file,
            undo_design_system,
            redo_design_system,
            fetch_presets_dressing,
            encode_image_base64,
            save_palette_builder,
            load_palette_builder,
            save_palette_builder_into_design_system,
            fetch_design_system_palette_builders,
            remove_palette_builder_from_design_system,
            rename_palette_builder,
            undo_palette_builder,
            redo_palette_builder,
            can_undo_redo_palette_builder,
            do_palette_builder,
            fetch_color_picker_store,
            save_color_picker_store,
            undo_color_picker,
            redo_color_picker,
            can_undo_redo_color_picker,
            can_undo_redo_token_crafter,
            do_token_crafter,
            redo_token_crafter,
            undo_token_crafter,
            fetch_user_settings,
            update_user_settings,
            register_export,
            svg_to_png_b64,
            save_readme,
            open_folder,
            load_font_as_base64,
            upload_typography,
            open_export_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
