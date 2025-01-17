// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use pickledb::{PickleDb, PickleDbDumpPolicy, SerializationMethod};
use exposition::home_exposition::{find_all_recent_files, insert_recent_file, remove_recent_file};

mod application;
mod repository;
mod exposition;

struct AppState {
    db: Mutex<PickleDb>,
}

fn main() {
    let db = PickleDb::new(
        "user-settings.db",           // Nom du fichier
        PickleDbDumpPolicy::AutoDump, // Sauvegarde automatique
        SerializationMethod::Json,    // Paramètres par défaut
    );

    tauri::Builder::default()
        .manage(AppState { db: Mutex::new(db) })
        .invoke_handler(tauri::generate_handler![
            insert_recent_file,
            find_all_recent_files,
            remove_recent_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
