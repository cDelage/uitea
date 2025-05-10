// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use application::undo_application::remove_undo_repository;
use exposition::design_system_exposition::{
    create_design_system, find_design_system, redo_design_system, save_design_system,
    undo_design_system,
};
use exposition::home_exposition::{
    encode_image_base64, fetch_presets_dressing, fetch_user_settings, find_all_recent_files,
    insert_recent_file, remove_recent_file, update_recent_file, update_user_settings,
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

    let color_picker_db: PickleDb = match PickleDb::load(
        "../db/color-picker.db",
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
                "../db/color-picker.db",
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
            user_settings_db: Mutex::new(db),
            undo_db: Mutex::new(undo_db),
            color_picker_db: Mutex::new(color_picker_db),
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
            update_user_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
