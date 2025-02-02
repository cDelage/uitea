use std::path::PathBuf;

use anyhow::Result;

use crate::{
    domain::design_system_domain::{
        ColorPalette, DesignSystem, DesignSystemCreationPayload, DesignSystemMetadata,
    },
    repository::{compute_path, design_system_repository},
    utils::generate_uuid,
};


pub fn create_design_system(payload: DesignSystemCreationPayload) -> Result<DesignSystemMetadata> {
    let DesignSystemCreationPayload { name, folder_path } = payload;
    let folder_pathbuf: PathBuf = PathBuf::from(folder_path);
    let design_system_path: PathBuf = compute_path(&folder_pathbuf, &name);
    let design_system: DesignSystemMetadata = DesignSystemMetadata {
        dark_mode: false,
        design_system_id: generate_uuid(),
        design_system_name: name,
        design_system_path,
        is_tmp: false
    };

    design_system_repository::create_design_system(&design_system)?;
    Ok(design_system)
}

pub fn find_design_system(design_system_path: &String) -> Result<DesignSystem> {
    let design_system_pathbuf: PathBuf = PathBuf::from(design_system_path);

    let metadata: DesignSystemMetadata =
        design_system_repository::find_design_system_metadata(&design_system_pathbuf)?;

    let color_palettes: Vec<ColorPalette> =
        match design_system_repository::fetch_color_palettes(&design_system_pathbuf) {
            Err(_) => {
                design_system_repository::init_color_palette(&design_system_pathbuf)?;
                design_system_repository::fetch_color_palettes(&design_system_pathbuf)
            }
            Ok(colors) => Ok(colors),
        }?;

    Ok(DesignSystem {
        metadata,
        color_palettes,
    })
}

pub fn save_design_system(design_system: DesignSystem, is_tmp: bool) -> Result<()> {
    design_system_repository::save_design_system(design_system, is_tmp)
}
