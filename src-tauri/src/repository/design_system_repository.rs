use std::{
    collections::HashMap,
    fs,
    path::{Path, PathBuf},
};

use anyhow::{anyhow, Result, Context};

use crate::{
    domain::design_system_domain::{
        DesignSystem, DesignSystemMetadata, DesignSystemMetadataFile, Effect, ExportPayload, Fonts, Palette, PalettesMetadataFile, Radius, SemanticColorTokens, Space, SpacesFile, Themes, TintsFile, Typographies
    },
    repository::{
        compute_fetch_pathbuf, compute_path_with_extension, filename_equals, FetchPath, TMP_PATH,
    },
};

use super::{
    assert_file_in_directory, copy_file, load_yaml_from_pathbuf, open_folder, save_to_yaml_file, DESIGN_SYSTEM_METADATA_PATH
};

const PALETTES_PATH: &str = "palettes";
const PALETTES_METADATA_PATH: &str = "palettes_metadata.yaml";
const FONTS_PATH: &str = "fonts.yaml";
const TYPOGRAPHY_PATH: &str = "typography.yaml";
const SPACES_PATH: &str = "spaces.yaml";
const RADIUS_PATH: &str = "radius.yaml";
const EFFECTS_PATH: &str = "effects.yaml";
const EXPORTS_PATH: &str = "exports";
const IMAGES_PATH: &str = "images";
const THEMELIST_PATH: &str = "themes.yaml";
const SEMANTIC_COLOR_TOKENS_PATH: &str = "semantic_color_tokens.yaml";

pub fn create_design_system(design_system_metadata: &mut DesignSystemMetadata) -> Result<()> {
    println!(
        "Create new design system : {:?}",
        &design_system_metadata.design_system_name
    );
    fs::create_dir(&design_system_metadata.design_system_path)?;
    let design_system_metadata_path = &design_system_metadata
        .design_system_path
        .join(DESIGN_SYSTEM_METADATA_PATH);

    let banner: String = insert_image(
        &design_system_metadata.banner,
        &design_system_metadata.design_system_path,
    )?;
    let logo: String = insert_image(
        &design_system_metadata.logo,
        &design_system_metadata.design_system_path,
    )?;

    design_system_metadata.banner = banner;
    design_system_metadata.logo = logo;
    let design_system_file: DesignSystemMetadataFile =
        DesignSystemMetadataFile::from(design_system_metadata);
    save_to_yaml_file(design_system_metadata_path, &design_system_file)?;

    Ok(())
}

pub fn get_images_path(design_system_path: &PathBuf) -> PathBuf {
    design_system_path.join(IMAGES_PATH)
}

pub fn find_design_system_metadata(design_system_path: &PathBuf) -> Result<DesignSystemMetadata> {
    let FetchPath {
        fetch_pathbuf,
        original_pathbuf,
    } = compute_fetch_pathbuf(&design_system_path);

    let design_system_metadata_pathbuf: PathBuf = fetch_pathbuf.join(DESIGN_SYSTEM_METADATA_PATH);

    if !design_system_metadata_pathbuf.is_file() {
        println!(
            "Design system not found : {:?} (to remove)",
            design_system_metadata_pathbuf
        );
    }
    let file: DesignSystemMetadataFile =
        load_yaml_from_pathbuf::<DesignSystemMetadataFile>(&design_system_metadata_pathbuf)?;
    Ok(DesignSystemMetadata::from(
        &file,
        &original_pathbuf,
        design_system_path.join(TMP_PATH).join(DESIGN_SYSTEM_METADATA_PATH).is_file(),
        &get_images_path(&fetch_pathbuf),
    ))
}

pub fn fetch_palettes(design_system_path: &PathBuf) -> Result<Vec<Palette>> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let palettes_path: PathBuf = fetch_pathbuf.join(PALETTES_PATH);
    if !&palettes_path.is_dir() {
        println!("Fail to fetch color palettes");
        return Err(anyhow!("Fail to fetch color palettes"));
    }

    let read_dir = fs::read_dir(&palettes_path)?;

    let mut color_palettes: Vec<Palette> = read_dir
        .into_iter()
        .filter_map(|dir_entry| {
            let dir: fs::DirEntry = dir_entry.ok()?;
            let path: &PathBuf = &dir.path();
            if filename_equals(path, PALETTES_METADATA_PATH) {
                return None;
            }
            let extension: &str = path
                .extension()
                .and_then(|ext: &std::ffi::OsStr| ext.to_str())?;
            if extension != "yaml" && extension != "yml" {
                return None;
            }

            let file_name: &str = path.file_stem().and_then(|name| name.to_str())?;
            let shades_file: TintsFile = load_yaml_from_pathbuf::<TintsFile>(path).ok()?;
            Some(Palette {
                palette_name: String::from(file_name),
                palette_path: Some(path.into()),
                tints: TintsFile::to(&shades_file),
            })
        })
        .collect::<Vec<Palette>>();

    let order: PathBuf = palettes_path.join(PALETTES_METADATA_PATH);

    if order.is_file() {
        let palettes_metadata: PalettesMetadataFile =
            load_yaml_from_pathbuf::<PalettesMetadataFile>(&order)?;
        let order_map: HashMap<_, _> = palettes_metadata
            .palettes_order
            .iter()
            .enumerate()
            .map(|(i, name)| (name.clone(), i))
            .collect();
        color_palettes
            .sort_by_key(|item| *order_map.get(&item.palette_name).unwrap_or(&usize::MAX));
    }

    Ok(color_palettes)
}

pub fn init_palettes(design_system_path: &PathBuf) -> Result<()> {
    let palettes_path: PathBuf = design_system_path.join(PALETTES_PATH);
    fs::create_dir_all(&palettes_path)?;
    Ok(())
}

pub fn save_palettes(design_system: &DesignSystem, design_system_path: &PathBuf) -> Result<()> {
    //Save colors
    let palettes_path: PathBuf = design_system_path.join(PALETTES_PATH);
    if palettes_path.is_dir() {
        fs::remove_dir_all(&palettes_path)?;
    }
    fs::create_dir_all(&palettes_path)?;

    //Palettes
    for color_palette in &design_system.palettes {
        let color_palette_pathbuf: PathBuf =
            compute_path_with_extension(&palettes_path, &color_palette.palette_name, &"yaml");
        let shades_file: TintsFile = TintsFile::from(&color_palette.tints);
        save_to_yaml_file(color_palette_pathbuf, &shades_file)?;
    }

    let palettes_order: Vec<String> = design_system
        .palettes
        .clone()
        .into_iter()
        .map(|palette| return palette.palette_name)
        .collect::<Vec<String>>();

    let palettes_metadata_file: PalettesMetadataFile = PalettesMetadataFile { palettes_order };
    save_to_yaml_file(
        palettes_path.join(PALETTES_METADATA_PATH),
        &palettes_metadata_file,
    )?;
    Ok(())
}

pub fn save_design_system(design_system: &DesignSystem, is_tmp: bool) -> Result<()> {
    //Define the path (if the save is tmp or not)
    let design_system_path: PathBuf = if is_tmp {
        let tmp_pathbuf: PathBuf = design_system
            .metadata
            .clone()
            .design_system_path
            .join(TMP_PATH);
        if !tmp_pathbuf.is_dir() {
            fs::create_dir(&tmp_pathbuf)?;
        }
        tmp_pathbuf
    } else {
        design_system.metadata.clone().design_system_path
    };

    println!("save is tmp: {:?}, path: {:?}", is_tmp, design_system_path);

    if !design_system_path.is_dir() {
        return Err(anyhow!(
            "Fail to find design system path : {:?}",
            design_system_path
        ));
    }

    //Save metadata
    save_metadata(&design_system_path, &design_system.metadata)?;

    save_palettes(&design_system, &design_system_path)?;

    let fonts_pathbuf: PathBuf = design_system_path.join(FONTS_PATH);
    save_to_yaml_file(fonts_pathbuf, &design_system.fonts)?;

    let typography_pathbuf: PathBuf = design_system_path.join(TYPOGRAPHY_PATH);
    save_to_yaml_file(typography_pathbuf, &design_system.typography)?;

    save_spaces(&design_system.spaces, &design_system_path)?;

    let radius_pathbuf: PathBuf = design_system_path.join(RADIUS_PATH);
    save_to_yaml_file(radius_pathbuf, &design_system.radius)?;

    let effect_pathbuf: PathBuf = design_system_path.join(EFFECTS_PATH);
    save_to_yaml_file(effect_pathbuf, &design_system.effects)?;

    let themes_pathbuf: PathBuf = design_system_path.join(THEMELIST_PATH);
    save_to_yaml_file(themes_pathbuf, &design_system.themes)?;

    let semantic_color_tokens_pathbuf: PathBuf =
        design_system_path.join(SEMANTIC_COLOR_TOKENS_PATH);
    save_to_yaml_file(
        semantic_color_tokens_pathbuf,
        &design_system.semantic_color_tokens,
    )?;

    //Once the save is complete (when is not a tmp save) -> remove the tmp copy
    if !is_tmp {
        let tmp_pathbuf: PathBuf = design_system
            .metadata
            .clone()
            .design_system_path
            .join(TMP_PATH);
        if tmp_pathbuf.is_dir() {
            fs::remove_dir_all(tmp_pathbuf)?;
        }
    }

    Ok(())
}

pub fn save_metadata(design_system_path: &PathBuf, metadata: &DesignSystemMetadata) -> Result<()> {
    let images_path: PathBuf = get_images_path(&design_system_path);
    let banner = match assert_file_in_directory(&metadata.banner, &images_path) {
        Ok(path) => path,
        Err(_) => {
            let banner_pathbuf = PathBuf::from(&metadata.banner);
            if banner_pathbuf.is_file() {
                let image = insert_image(&metadata.banner, &design_system_path)?;
                image
            } else {
                String::new()
            }
        }
    };

    let logo = match assert_file_in_directory(&metadata.logo, &images_path) {
        Ok(path) => path,
        Err(_) => {
            let logo_pathbuf = PathBuf::from(&metadata.logo);
            if logo_pathbuf.is_file() {
                let image = insert_image(&metadata.logo, &design_system_path)?;
                image
            } else {
                String::new()
            }
        }
    };

    println!("banner: {:?} , logo: {:?}", &banner, &logo);

    //Save metadata
    let design_system_metadata_path: PathBuf = design_system_path.join(DESIGN_SYSTEM_METADATA_PATH);
    let mut design_system_file = DesignSystemMetadataFile::from(metadata);
    let banner_filename = Path::new(&banner)
        .file_name()
        .context("Fail to read banner")?
        .to_str()
        .context("Fail to read banner")?
        .to_owned();

    let logo_filename = Path::new(&logo)
        .file_name()
        .context("Fail to read logo")?
        .to_str()
        .context("Fail to read logo")?
        .to_owned();
    design_system_file.banner = String::from(banner_filename);
    design_system_file.logo = String::from(logo_filename);
    save_to_yaml_file(design_system_metadata_path, &design_system_file)
}

pub fn fetch_fonts(design_system_path: &PathBuf) -> Result<Fonts> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let typo_pathbuf: PathBuf = fetch_pathbuf.join(FONTS_PATH);
    load_yaml_from_pathbuf::<Fonts>(&typo_pathbuf)
}

pub fn init_fonts(design_system_path: &PathBuf) -> Result<()> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let typo_pathbuf: PathBuf = fetch_pathbuf.join(FONTS_PATH);
    let typo_file = Fonts::new();
    save_to_yaml_file(typo_pathbuf, &typo_file)
}

pub fn fetch_typography(design_system_path: &PathBuf) -> Result<Typographies> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let typo_pathbuf: PathBuf = fetch_pathbuf.join(TYPOGRAPHY_PATH);
    load_yaml_from_pathbuf::<Typographies>(&typo_pathbuf)
}

pub fn init_typography(design_system_path: &PathBuf) -> Result<()> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let typo_pathbuf: PathBuf = fetch_pathbuf.join(TYPOGRAPHY_PATH);
    let typo_file = Typographies::new();
    save_to_yaml_file(typo_pathbuf, &typo_file)
}

pub fn fetch_spaces(design_system_path: &PathBuf) -> Result<Vec<Space>> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let spaces_path = fetch_pathbuf.join(SPACES_PATH);
    if !spaces_path.is_file() {
        println!("Fail to fetch spaces file");
        return Err(anyhow!("spaces.yaml is missing"));
    }

    let spaces_file: SpacesFile = load_yaml_from_pathbuf::<SpacesFile>(&spaces_path)?;

    let spaces = SpacesFile::to(&spaces_file);
    Ok(spaces)
}

pub fn init_spaces(design_system_path: &PathBuf) -> Result<()> {
    fs::create_dir_all(&design_system_path)?;

    let spaces_path: PathBuf = design_system_path.join(SPACES_PATH);
    let spaces_file: SpacesFile = SpacesFile::new();

    save_to_yaml_file(spaces_path, &spaces_file)?;

    Ok(())
}

pub fn save_spaces(spaces: &Vec<Space>, design_system_path: &PathBuf) -> Result<()> {
    let spaces_path: PathBuf = design_system_path.join(SPACES_PATH);
    let spaces_file: SpacesFile = SpacesFile::from(spaces);
    save_to_yaml_file(spaces_path, &spaces_file)?;
    Ok(())
}

pub fn fetch_radius(design_system_path: &PathBuf) -> Result<Radius> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let radius_pathbuf: PathBuf = fetch_pathbuf.join(RADIUS_PATH);
    load_yaml_from_pathbuf::<Radius>(&radius_pathbuf)
}

pub fn init_radius(design_system_path: &PathBuf) -> Result<()> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let radius_pathbuf: PathBuf = fetch_pathbuf.join(RADIUS_PATH);
    let radius_file = Radius::new();
    save_to_yaml_file(radius_pathbuf, &radius_file)
}

pub fn fetch_effects(design_system_path: &PathBuf) -> Result<Vec<Effect>> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let effects_pathbuf: PathBuf = fetch_pathbuf.join(EFFECTS_PATH);
    load_yaml_from_pathbuf::<Vec<Effect>>(&effects_pathbuf)
}

pub fn init_effects(design_system_path: &PathBuf) -> Result<()> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let effect_pathbuf: PathBuf = fetch_pathbuf.join(EFFECTS_PATH);
    let effect = Effect::new();
    save_to_yaml_file(effect_pathbuf, &vec![effect])
}

pub fn init_images(design_system_path: &PathBuf) -> Result<()> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let images_pathbuf: PathBuf = fetch_pathbuf.join(IMAGES_PATH);
    fs::create_dir(images_pathbuf)?;
    Ok(())
}

pub fn insert_image(image_path: &String, design_system_path: &PathBuf) -> Result<String> {
    println!("insert image {}", image_path);
    let images_folder: PathBuf = PathBuf::from(design_system_path).join(IMAGES_PATH);
    let image_path: PathBuf = PathBuf::from(image_path);
    if !images_folder.is_dir() {
        init_images(&design_system_path)?;
    }
    copy_file(&image_path, &images_folder)
}

pub fn is_under_design_system(path: &PathBuf) -> bool {
    // Remonte d'un dossier
    if let Some(parent) = path.parent() {
        // Crée le chemin complet du fichier design_system_metadata.yaml
        let metadata_path = parent.join(DESIGN_SYSTEM_METADATA_PATH);

        // Vérifie si le fichier existe
        return metadata_path.exists();
    }

    false
}

pub fn fetch_themes(design_system_path: &PathBuf) -> Themes {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let theme_path = fetch_pathbuf.join(THEMELIST_PATH);
    if theme_path.is_file() {
        if let Result::Ok(themes) = load_yaml_from_pathbuf::<Themes>(&theme_path) {
            return themes;
        }
    }
    return Themes {
        main_theme: None,
        other_themes: vec![],
    };
}

pub fn init_semantic_color_tokens(design_system_path: &PathBuf) -> Result<()> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let semantic_color_tokens_path: PathBuf = fetch_pathbuf.join(SEMANTIC_COLOR_TOKENS_PATH);
    save_to_yaml_file(semantic_color_tokens_path, &SemanticColorTokens::new())
}

pub fn fetch_semantic_color_tokens(design_system_path: &PathBuf) -> Result<SemanticColorTokens> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let semantic_color_tokens_path: PathBuf = fetch_pathbuf.join(SEMANTIC_COLOR_TOKENS_PATH);
    load_yaml_from_pathbuf::<SemanticColorTokens>(&semantic_color_tokens_path)
}

pub fn register_export(payload: ExportPayload) -> Result<()> {
    let ExportPayload {design_system_path, export_name, value, extension} = payload;
    let export_pathbuf = design_system_path.join(EXPORTS_PATH);
    if !&export_pathbuf.is_dir(){
        fs::create_dir(&export_pathbuf)?;
    };
    let file_path = compute_path_with_extension(&export_pathbuf, &export_name, &extension);
    fs::write(file_path, value)?;
    open_folder(export_pathbuf)?;
    Ok(())
}