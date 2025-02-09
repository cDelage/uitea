// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use exposition::design_system_exposition::{create_design_system, find_design_system, save_design_system};
use exposition::home_exposition::{find_all_recent_files, insert_recent_file, remove_recent_file, update_recent_file};
use pickledb::{PickleDb, PickleDbDumpPolicy, SerializationMethod};

mod application;
mod domain;
mod exposition;
mod repository;
mod utils;

struct AppState {
    db: Mutex<PickleDb>,
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

    tauri::Builder::default()
        .manage(AppState { db: Mutex::new(db) })
        .invoke_handler(tauri::generate_handler![
            insert_recent_file,
            find_all_recent_files,
            remove_recent_file,
            find_design_system,
            create_design_system,
            save_design_system,
            update_recent_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
