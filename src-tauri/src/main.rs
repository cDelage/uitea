// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use application::undo_application::remove_undo_repository;
use exposition::design_system_exposition::{
    create_design_system, find_design_system, redo_design_system, save_design_system,
    undo_design_system,
};
use exposition::home_exposition::{
    fetch_presets_dressing, find_all_recent_files, insert_recent_file, remove_recent_file,
    update_recent_file,encode_image_base64
};
use pickledb::{PickleDb, PickleDbDumpPolicy, SerializationMethod};

mod application;
mod domain;
mod exposition;
mod repository;
mod utils;

struct AppState {
    db: Mutex<PickleDb>,
    undo_db: Mutex<PickleDb>,
}

fn main() {
    let db: PickleDb = match PickleDb::load(
        "../db/user-settings.db",
        PickleDbDumpPolicy::AutoDump,
        SerializationMethod::Json,
    ) {
        Ok(db) => {
            println!("DB user_settings successfully loaded (already exist)");
            db
        }
        Err(_) => {
            println!("DB user_settings not found, create a new");
            PickleDb::new(
                "../db/user-settings.db",
                PickleDbDumpPolicy::AutoDump,
                SerializationMethod::Json,
            )
        }
    };

    remove_undo_repository().ok();

    let undo_db: PickleDb = PickleDb::new(
        "../db/undo-redo.db",
        PickleDbDumpPolicy::AutoDump,
        SerializationMethod::Json,
    );

    tauri::Builder::default()
        .manage(AppState {
            db: Mutex::new(db),
            undo_db: Mutex::new(undo_db),
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
            encode_image_base64
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
