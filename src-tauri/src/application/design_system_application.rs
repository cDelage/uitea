use std::path::PathBuf;

use anyhow::Result;

use crate::{
    domain::design_system_domain::{DesignSystemCreationPayload, DesignSystemMetadata},
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
    };

    design_system_repository::create_design_system(&design_system)?;
    Ok(design_system)
}
