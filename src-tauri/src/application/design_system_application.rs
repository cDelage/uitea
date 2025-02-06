use std::path::PathBuf;

use anyhow::Result;

use crate::{
    domain::design_system_domain::{
        BaseDarkable, Palette, DesignSystem, DesignSystemCreationPayload, DesignSystemMetadata,
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
        match design_system_repository::fetch_color_palettes(&design_system_pathbuf) {
            Err(_) => {
                design_system_repository::init_color_palette(&design_system_pathbuf)?;
                design_system_repository::fetch_color_palettes(&design_system_pathbuf)
            }
            Ok(colors) => Ok(colors),
        }?;

    let base: BaseDarkable =
        match design_system_repository::fetch_base_colors(&design_system_pathbuf) {
            Err(_) => {
                design_system_repository::init_base_colors(
                    &design_system_pathbuf,
                    &metadata.dark_mode,
                )?;
                design_system_repository::fetch_base_colors(&design_system_pathbuf)
            }
            Ok(base) => Ok(base),
        }?;

    Ok(DesignSystem {
        metadata,
        palettes,
        base
    })
}

pub fn save_design_system(design_system: DesignSystem, is_tmp: bool) -> Result<()> {
    design_system_repository::save_design_system(design_system, is_tmp)
}
