use std::path::PathBuf;

use anyhow::{anyhow, Result};
use tauri::{AppHandle, State};

use crate::{
    application::home_application::fetch_presets_dressing,
    domain::{
        design_system_domain::{
            DesignSystem, DesignSystemCreationPayload, DesignSystemMetadata, ExportPayload,
            ExportsMetadata, Fonts, IndependantColors, Palette, Radius, SemanticColorTokens,
            Shadows, Space, Typographies,
        },
        home_domain::PresetDressing,
    },
    repository::{
        self, assert_file_in_directory, compute_path,
        design_system_repository::{self},
        fonts_repository::{self, load_design_system_fonts},
        undo_repository::{self, UndoRedoActions},
    },
    utils::generate_uuid,
    AppState,
};

pub fn create_design_system(payload: DesignSystemCreationPayload) -> Result<DesignSystemMetadata> {
    let DesignSystemCreationPayload {
        name,
        folder_path,
        banner,
        logo,
        ..
    } = payload;
    let folder_pathbuf: PathBuf = PathBuf::from(folder_path);

    let design_system_path: PathBuf = compute_path(&folder_pathbuf, &name);
    let mut design_system: DesignSystemMetadata = DesignSystemMetadata {
        design_system_id: generate_uuid(),
        design_system_name: name,
        design_system_path,
        is_tmp: false,
        can_redo: false,
        can_undo: false,
        banner,
        logo,
        readme: None,
        preview_images: vec![],
        fonts: vec![],
        exports: ExportsMetadata {
            css: None,
            figma_token_studio: None,
            readme: None,
        },
        update_date: String::new(),
    };

    design_system_repository::create_design_system(&mut design_system)?;
    Ok(design_system)
}

pub fn find_design_system(
    app: AppHandle,
    state: &State<AppState>,
    design_system_path: &String,
) -> Result<DesignSystem> {
    println!("find design system");
    let design_system_pathbuf: PathBuf = PathBuf::from(design_system_path);
    let fetch_path = repository::compute_fetch_pathbuf(&design_system_pathbuf);
    let mut metadata: DesignSystemMetadata =
        design_system_repository::find_design_system_metadata(&design_system_pathbuf)?;

    //Verify banner & logo
    let images_pathbuf: PathBuf = design_system_repository::get_images_path(&design_system_pathbuf);
    match assert_file_in_directory(&metadata.banner, &images_pathbuf) {
        Err(_) => {
            if !PathBuf::from(&metadata.banner).is_file() {
                let images: PresetDressing = fetch_presets_dressing(app.clone())?;
                metadata.banner = images.banners[0].clone();
                design_system_repository::save_metadata(&fetch_path.fetch_pathbuf, &metadata)?;
            }
        }
        Ok(_) => {
            //Do nothing
        }
    };
    match assert_file_in_directory(&metadata.logo, &images_pathbuf) {
        Err(_) => {
            if !PathBuf::from(&metadata.logo).is_file() {
                let images: PresetDressing = fetch_presets_dressing(app)?;
                metadata.logo = images.logos[0].clone();
                design_system_repository::save_metadata(&fetch_path.fetch_pathbuf, &metadata)?;
            }
        }
        Ok(_) => {
            //Do nothing
        }
    };

    let UndoRedoActions { can_redo, can_undo } =
        undo_repository::can_undo_redo::<DesignSystem>(&state, design_system_path)?;
    metadata.can_redo = can_redo;
    metadata.can_undo = can_undo;

    let fonts = load_design_system_fonts(&design_system_pathbuf)?;
    metadata.fonts = fonts;

    let palettes: Vec<Palette> =
        match design_system_repository::fetch_palettes(&design_system_pathbuf) {
            Err(_) => {
                design_system_repository::init_palettes(&design_system_pathbuf)?;
                design_system_repository::fetch_palettes(&design_system_pathbuf)
            }
            Ok(colors) => Ok(colors),
        }?;

    let themes = design_system_repository::fetch_themes(&design_system_pathbuf);

    let semantic_color_tokens: SemanticColorTokens =
        match design_system_repository::fetch_semantic_color_tokens(&design_system_pathbuf) {
            Err(_) => {
                design_system_repository::init_semantic_color_tokens(&design_system_pathbuf)?;
                design_system_repository::fetch_semantic_color_tokens(&design_system_pathbuf)
            }
            Ok(tokens) => Ok(tokens),
        }?;

    let independant_colors: IndependantColors =
        match design_system_repository::fetch_independant_colors(&design_system_pathbuf) {
            Err(_) => {
                design_system_repository::init_independant_colors(&design_system_pathbuf)?;
                design_system_repository::fetch_independant_colors(&design_system_pathbuf)
            }
            Ok(independant_colors) => Ok(independant_colors),
        }?;

    let fonts: Fonts = match design_system_repository::fetch_fonts(&design_system_pathbuf) {
        Err(_) => {
            design_system_repository::init_fonts(&design_system_pathbuf)?;
            design_system_repository::fetch_fonts(&design_system_pathbuf)
        }
        Ok(font) => Ok(font),
    }?;

    let typography: Typographies =
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

    let effects: Vec<Shadows> =
        match design_system_repository::fetch_effects(&design_system_pathbuf) {
            Err(_) => {
                design_system_repository::init_effects(&design_system_pathbuf)?;
                design_system_repository::fetch_effects(&design_system_pathbuf)
            }
            Ok(radius) => Ok(radius),
        }?;

    Ok(DesignSystem {
        metadata,
        palettes,
        fonts,
        typography,
        spaces,
        radius,
        shadows: effects,
        themes,
        semantic_color_tokens,
        independant_colors,
    })
}

pub fn save_design_system(
    app: AppHandle,
    state: &State<AppState>,
    design_system: &mut DesignSystem,
    is_tmp: bool,
    new_historic_entry: bool,
) -> Result<DesignSystem> {
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
                find_design_system(app, &state, &String::from(design_system_string_path))?;
            undo_repository::set_new::<DesignSystem>(
                &state,
                design_system_string_path,
                &initial_design_system,
            )?;
        }
    };
    let mut design_system = design_system.clone();
    design_system_repository::save_design_system(&mut design_system, is_tmp)?;
    if new_historic_entry && is_tmp {
        undo_repository::set_new::<DesignSystem>(
            &state,
            design_system_string_path,
            &design_system,
        )?;
    }

    if !is_tmp {
        fonts_repository::manage_font_export(&design_system)?;
        let fonts = load_design_system_fonts(&design_system.metadata.design_system_path)?;
        design_system.metadata.fonts = fonts;
    }

    let can_undo_redo: UndoRedoActions =
        undo_repository::can_undo_redo::<DesignSystem>(&state, &design_system_string_path)?;
    design_system.metadata.can_redo = can_undo_redo.can_redo;
    design_system.metadata.can_undo = can_undo_redo.can_undo;
    let update_date: String =
        design_system_repository::get_design_system_update_date(&design_system_path)?;
    design_system.metadata.update_date = update_date;
    Ok(design_system)
}

pub fn undo_design_system(
    app: AppHandle,
    state: &State<AppState>,
    design_system_path: &String,
) -> Result<()> {
    println!("undo design system");
    let mut design_system: DesignSystem =
        undo_repository::undo::<DesignSystem>(state, design_system_path)?;
    println!("undo : {:?}", design_system);
    save_design_system(app, &state, &mut design_system, true, false)?;
    println!("undo success");
    Ok(())
}

pub fn redo_design_system(
    app: AppHandle,
    state: &State<AppState>,
    design_system_path: &String,
) -> Result<()> {
    println!("redo design system");
    let mut design_system: DesignSystem =
        undo_repository::redo::<DesignSystem>(state, design_system_path)?;
    println!("redo : {:?}", design_system);
    save_design_system(app, &state, &mut design_system, true, false)?;
    println!("redo success");
    Ok(())
}

pub fn register_export(payload: ExportPayload) -> Result<()> {
    design_system_repository::register_export(payload)
}

pub fn save_readme(metadata: DesignSystemMetadata) -> Result<()> {
    design_system_repository::save_readme(metadata)
}

pub fn load_font_as_base64(path: PathBuf) -> Result<String> {
    fonts_repository::load_font_as_base64(path)
}

pub fn upload_typography(original_path: PathBuf, design_system_path: PathBuf) -> Result<String> {
    fonts_repository::upload_typography(original_path, design_system_path)
}

pub fn open_export_folder(design_system_path: PathBuf) -> Result<()> {
    design_system_repository::open_export_folder(design_system_path)
}
