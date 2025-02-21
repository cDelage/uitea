use std::path::PathBuf;

use anyhow::{anyhow, Result};
use tauri::State;

use crate::{
    domain::design_system_domain::{
        Base, DesignSystem, DesignSystemCreationPayload, DesignSystemMetadata, Effect, Fonts, Palette, Radius, Space, ThemeColor, Typography
    },
    repository::{
        compute_path, design_system_repository,
        undo_repository::{self, UndoRedoActions},
    },
    utils::generate_uuid,
    AppState,
};

pub fn create_design_system(payload: DesignSystemCreationPayload) -> Result<DesignSystemMetadata> {
    let DesignSystemCreationPayload {
        name,
        folder_path,
        dark_mode,
    } = payload;
    let folder_pathbuf: PathBuf = PathBuf::from(folder_path);
    let design_system_path: PathBuf = compute_path(&folder_pathbuf, &name);
    let design_system: DesignSystemMetadata = DesignSystemMetadata {
        dark_mode: dark_mode,
        design_system_id: generate_uuid(),
        design_system_name: name,
        design_system_path,
        is_tmp: false,
        can_redo: false,
        can_undo: false,
    };

    design_system_repository::create_design_system(&design_system)?;
    Ok(design_system)
}

pub fn find_design_system(
    state: &State<AppState>,
    design_system_path: &String,
) -> Result<DesignSystem> {
    println!("find design system");
    let design_system_pathbuf: PathBuf = PathBuf::from(design_system_path);

    let mut metadata: DesignSystemMetadata =
        design_system_repository::find_design_system_metadata(&design_system_pathbuf)?;

    let UndoRedoActions { can_redo, can_undo } =
        undo_repository::can_undo_redo::<DesignSystem>(&state, design_system_path)?;
    metadata.can_redo = can_redo;
    metadata.can_undo = can_undo;

    let palettes: Vec<Palette> =
        match design_system_repository::fetch_palettes(&design_system_pathbuf) {
            Err(_) => {
                design_system_repository::init_palettes(&design_system_pathbuf)?;
                design_system_repository::fetch_palettes(&design_system_pathbuf)
            }
            Ok(colors) => Ok(colors),
        }?;

    let base: Base = match design_system_repository::fetch_base_colors(&design_system_pathbuf) {
        Err(_) => {
            design_system_repository::init_base_colors(&design_system_pathbuf)?;
            design_system_repository::fetch_base_colors(&design_system_pathbuf)
        }
        Ok(base) => Ok(base),
    }?;

    let themes: Vec<ThemeColor> =
        match design_system_repository::fetch_themes(&design_system_pathbuf) {
            Err(_) => {
                design_system_repository::init_themes(&design_system_pathbuf)?;
                design_system_repository::fetch_themes(&design_system_pathbuf)
            }
            Ok(theme) => Ok(theme),
        }?;

    let fonts: Fonts = match design_system_repository::fetch_fonts(&design_system_pathbuf) {
        Err(_) => {
            design_system_repository::init_fonts(&design_system_pathbuf)?;
            design_system_repository::fetch_fonts(&design_system_pathbuf)
        }
        Ok(font) => Ok(font),
    }?;

    let typography: Typography =
        match design_system_repository::fetch_typography(&design_system_pathbuf) {
            Err(_) => {
                design_system_repository::init_typography(&design_system_pathbuf)?;
                design_system_repository::fetch_typography(&design_system_pathbuf)
            }
            Ok(typo) => Ok(typo),
        }?;

    let spaces: Vec<Space> = match design_system_repository::fetch_spaces(&design_system_pathbuf) {
        Err(_) => {
            design_system_repository::init_spaces(&design_system_pathbuf)?;
            design_system_repository::fetch_spaces(&design_system_pathbuf)
        }
        Ok(space) => Ok(space),
    }?;

    let radius: Radius = match design_system_repository::fetch_radius(&design_system_pathbuf) {
        Err(_) => {
            design_system_repository::init_radius(&design_system_pathbuf)?;
            design_system_repository::fetch_radius(&design_system_pathbuf)
        }
        Ok(radius) => Ok(radius),
    }?;

    let effects: Vec<Effect> = match design_system_repository::fetch_effects(&design_system_pathbuf) {
        Err(_) => {
            design_system_repository::init_effects(&design_system_pathbuf)?;
            design_system_repository::fetch_effects(&design_system_pathbuf)
        }
        Ok(radius) => Ok(radius),
    }?;

    Ok(DesignSystem {
        metadata,
        palettes,
        base,
        themes,
        fonts,
        typography,
        spaces,
        radius,
        effects
    })
}

pub fn save_design_system(
    state: &State<AppState>,
    design_system: &DesignSystem,
    is_tmp: bool,
    new_historic_entry: bool,
) -> Result<()> {
    println!("save design system");
    let design_system_path: PathBuf = design_system.metadata.design_system_path.clone();
    let design_system_string_path = design_system_path
        .to_str()
        .ok_or_else(|| anyhow!("fail to find db path"))?;
    match undo_repository::get_present::<DesignSystem>(&state, design_system_string_path) {
        Ok(_) => {}
        Err(_) => {
            println!("Fail to load present_state, try to write it.");
            let initial_design_system: DesignSystem =
                find_design_system(&state, &String::from(design_system_string_path))?;
            undo_repository::set_new::<DesignSystem>(
                &state,
                design_system_string_path,
                &initial_design_system,
            )?;
        }
    };

    design_system_repository::save_design_system(design_system, is_tmp)?;
    if new_historic_entry && is_tmp {
        undo_repository::set_new::<DesignSystem>(&state, design_system_string_path, design_system)?;
    }

    Ok(())
}

pub fn undo_design_system(state: &State<AppState>, design_system_path: &String) -> Result<()> {
    println!("undo design system");
    let design_system: DesignSystem =
        undo_repository::undo::<DesignSystem>(state, design_system_path)?;
    save_design_system(&state, &design_system, true, false)
}

pub fn redo_design_system(state: &State<AppState>, design_system_path: &String) -> Result<()> {
    println!("redo design system");
    let design_system: DesignSystem =
        undo_repository::redo::<DesignSystem>(state, design_system_path)?;
    save_design_system(&state, &design_system, true, false)
}
