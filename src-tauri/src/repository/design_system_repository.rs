use std::{fs, path::PathBuf};

use anyhow::{anyhow, Result};

use crate::domain::design_system_domain::{DesignSystemMetadata, DesignSystemMetadataFile};

use super::{load_yaml_from_pathbuf, save_to_yaml_file, DESIGN_SYSTEM_METADATA_PATH};

pub fn create_design_system(design_system_metadata: &DesignSystemMetadata) -> Result<()> {
    println!(
        "Create new design system : {:?}",
        &design_system_metadata.design_system_name
    );
    fs::create_dir(&design_system_metadata.design_system_path)?;
    let design_system_metadata_path = &design_system_metadata
        .design_system_path
        .join(DESIGN_SYSTEM_METADATA_PATH);
    let design_system_file = DesignSystemMetadataFile::from(design_system_metadata);
    save_to_yaml_file(design_system_metadata_path, &design_system_file)
}

pub fn find_design_system_metadata(design_system_path: &str) -> Result<DesignSystemMetadata> {
    let design_system_pathbuf: PathBuf =
        PathBuf::from(design_system_path).join(DESIGN_SYSTEM_METADATA_PATH);

    println!(
        "Fetch design_system_metadata start: {:?}",
        design_system_pathbuf
    );

    if !design_system_pathbuf.is_file() {
        println!(
            "Design system not found : {:?} (to remove)",
            design_system_pathbuf
        );
        return Err(anyhow!("Design system not found"));
    }
    let file: DesignSystemMetadataFile =
        load_yaml_from_pathbuf::<DesignSystemMetadataFile>(&design_system_pathbuf)?;
    println!("Succeed to read file : {:?}", file);
    Ok(DesignSystemMetadata::from(&file, &design_system_pathbuf))
}
