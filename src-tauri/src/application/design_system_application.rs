use std::path::PathBuf;

use anyhow::Result;

use crate::{
    domain::design_system_domain::{
        Base, DesignSystem, DesignSystemCreationPayload, DesignSystemMetadata, Palette, ThemeColor,
    },
    repository::{compute_path, design_system_repository},
    utils::generate_uuid,
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
    };

    design_system_repository::create_design_system(&design_system)?;
    Ok(design_system)
}

pub fn find_design_system(design_system_path: &String) -> Result<DesignSystem> {
    let design_system_pathbuf: PathBuf = PathBuf::from(design_system_path);

    let metadata: DesignSystemMetadata =
        design_system_repository::find_design_system_metadata(&design_system_pathbuf)?;

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

    println!("theme : {:?}", themes);

    Ok(DesignSystem {
        metadata,
        palettes,
        base,
        themes,
    })
}

pub fn save_design_system(design_system: DesignSystem, is_tmp: bool) -> Result<()> {
    design_system_repository::save_design_system(design_system, is_tmp)
}
