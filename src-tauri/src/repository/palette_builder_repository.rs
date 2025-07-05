use std::{
    fs::{self, create_dir, DirEntry},
    path::PathBuf,
};

use anyhow::{Context, Result};

use crate::domain::palette_builder_domain::{
    PaletteBuilder, PaletteBuilderFile, PaletteBuilderMetadata, PaletteBuilderRenamePayload,
    TintBuild,
};

use super::{compute_path_with_extension_overwrite, load_yaml_from_pathbuf, save_to_yaml_file};

const PALETTE_BUILDER_PATH: &str = "palette_builder";

pub fn save_palette_builder(palette_builder: &PaletteBuilder) -> Result<()> {
    let palette_builder_file: PaletteBuilderFile = PaletteBuilderFile::from(&palette_builder);
    save_to_yaml_file(palette_builder.metadata.path.clone(), &palette_builder_file)?;
    Ok(())
}

pub fn save_palette_builder_into_design_system(
    design_system_path: &PathBuf,
    palette_builder: &PaletteBuilder,
) -> Result<()> {
    let folder_path: PathBuf = design_system_path.join(PALETTE_BUILDER_PATH);
    if !folder_path.is_dir() {
        create_dir(&folder_path)?;
    }
    let save_path: PathBuf = compute_path_with_extension_overwrite(
        &folder_path,
        &palette_builder.metadata.palette_builder_name,
        &"yaml",
    );
    save_to_yaml_file(save_path, &palette_builder)?;
    Ok(())
}

pub fn fetch_design_system_palette_builders(
    design_system_path: &PathBuf,
) -> Result<Vec<PaletteBuilderMetadata>> {
    let palette_builder_path = &design_system_path.join(PALETTE_BUILDER_PATH);
    let read_dir = fs::read_dir(&palette_builder_path)?;

    let palette_builders: Vec<PaletteBuilderMetadata> = read_dir
        .into_iter()
        .filter_map(|dir_entry| {
            let dir: DirEntry = dir_entry.ok()?;
            let path: &PathBuf = &dir.path();
            let extension: &str = path
                .extension()
                .and_then(|ext: &std::ffi::OsStr| ext.to_str())?;
            if extension != "yaml" && extension != "yml" {
                return None;
            }
            let file_name: &str = path.file_stem().and_then(|name| name.to_str())?;
            let palette_builder: PaletteBuilder =
                load_yaml_from_pathbuf::<PaletteBuilder>(path).ok()?;
            let main_colors: Vec<String> = palette_builder
                .palettes
                .into_iter()
                .filter_map(|palette| {
                    let color: Option<TintBuild> = palette
                        .tints
                        .into_iter()
                        .find(|color| color.is_center.unwrap_or(false));
                    return match color {
                        Some(tint) => Some(tint.color),
                        None => None,
                    };
                })
                .collect::<Vec<String>>();
            return Some(PaletteBuilderMetadata {
                palette_builder_name: String::from(file_name),
                path: path.clone(),
                main_colors,
            });
        })
        .collect::<Vec<PaletteBuilderMetadata>>();
    Ok(palette_builders)
}

pub fn load_palette_builder(path: &PathBuf) -> Result<PaletteBuilderFile> {
    let palette_builder_file: PaletteBuilderFile =
        load_yaml_from_pathbuf::<PaletteBuilderFile>(&path)?;
    Ok(palette_builder_file)
}

pub fn remove_palette_builder_from_design_system(path: &PathBuf) -> Result<()> {
    fs::remove_file(path)?;
    Ok(())
}

pub fn rename_palette_builder(payload: PaletteBuilderRenamePayload) -> Result<()> {
    let palette_builder_repo: PathBuf = payload.design_system_path.join(PALETTE_BUILDER_PATH);
    let new_path: PathBuf =
        compute_path_with_extension_overwrite(&palette_builder_repo, &payload.new_name, &"yaml");
    fs::rename(&payload.metadata.path, new_path)?;
    Ok(())
}

pub fn find_palette_builder_metadata(path: &PathBuf) -> Result<PaletteBuilderMetadata> {
    println!("try to find palette_builder_metadata {:?}", path);
    // Vérifie que l'extension du fichier est présente et correspond à "yaml" ou "yml"
    let extension = path
        .extension()
        .and_then(|ext| ext.to_str())
        .context("Impossible de récupérer l'extension du fichier")?;
    if extension != "yaml" && extension != "yml" {
        anyhow::bail!(
            "L'extension doit être 'yaml' ou 'yml', trouvée: {}",
            extension
        );
    }

    // Récupère le nom du fichier sans extension
    let file_name = path
        .file_stem()
        .and_then(|name| name.to_str())
        .context("Impossible de récupérer le nom du fichier sans extension")?;
    // Charge le contenu du fichier YAML dans une instance de `PaletteBuilder`
    let palette_builder: PaletteBuilderFile =
        load_yaml_from_pathbuf::<PaletteBuilderFile>(&path)
            .context("Erreur lors du chargement du fichier YAML")?;

    // Extrait pour chaque palette la couleur associée à la teinte centrale
    let main_colors: Vec<String> = palette_builder
        .palettes
        .into_iter()
        .filter_map(|palette| {
            palette
                .tints
                .into_iter()
                .find(|tint| tint.is_center.unwrap_or(false))
                .map(|tint| tint.color)
        })
        .collect();

    // Construit et retourne la structure `PaletteBuilderMetadata`
    Ok(PaletteBuilderMetadata {
        palette_builder_name: file_name.to_string(),
        path: path.clone(),
        main_colors,
    })
}
