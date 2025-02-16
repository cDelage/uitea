use std::{collections::HashMap, fs, path::PathBuf};

use anyhow::{anyhow, Result};

use crate::{
    domain::design_system_domain::{
        Base, DesignSystem, DesignSystemMetadata, DesignSystemMetadataFile, Fonts, Palette,
        PalettesMetadataFile, ShadesFile, ThemeColor, ThemeColorFile, ThemesMetadataFile,
        Typography,
    },
    repository::{
        compute_fetch_pathbuf, compute_path_with_extension, filename_equals, FetchPath, TMP_PATH,
    },
};

use super::{load_yaml_from_pathbuf, save_to_yaml_file, DESIGN_SYSTEM_METADATA_PATH};

const PALETTES_PATH: &str = "palettes";
const NEUTRAL_PALETTE_PATH: &str = "neutral.yaml";
const PALETTES_METADATA_PATH: &str = "palettes_metadata.yaml";
const BASE_PATH: &str = "base_colors.yaml";
const FONTS_PATH: &str = "fonts.yaml";
const TYPOGRAPHY_PATH: &str = "typography.yaml";
const THEMES_PATH: &str = "themes";
const THEMES_METADATA_PATH: &str = "themes_metadata.yaml";
const NEUTRAL_THEME_PATH: &str = "neutral.yaml";

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
        design_system_path.join(TMP_PATH).is_dir(),
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
            let shades_file: ShadesFile = load_yaml_from_pathbuf::<ShadesFile>(path).ok()?;
            Some(Palette {
                palette_name: String::from(file_name),
                palette_path: Some(path.into()),
                shades: ShadesFile::to(&shades_file),
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
    let primary_palette_path: PathBuf = palettes_path.join(NEUTRAL_PALETTE_PATH);
    let shade_file: ShadesFile = ShadesFile::new();
    save_to_yaml_file(primary_palette_path, &shade_file)
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

    if !design_system_path.is_dir() {
        return Err(anyhow!(
            "Fail to find design system path : {:?}",
            design_system_path
        ));
    }

    //Save metadata
    let design_system_metadata_path: PathBuf = design_system_path.join(DESIGN_SYSTEM_METADATA_PATH);
    let design_system_file = DesignSystemMetadataFile::from(&design_system.metadata);
    save_to_yaml_file(design_system_metadata_path, &design_system_file)?;

    save_palettes(&design_system, &design_system_path)?;

    let base_pathbuf: PathBuf = design_system_path.join(BASE_PATH);
    save_to_yaml_file(base_pathbuf, &design_system.base)?;

    save_themes(&design_system, &design_system_path)?;

    let fonts_pathbuf: PathBuf = design_system_path.join(FONTS_PATH);
    save_to_yaml_file(fonts_pathbuf, &design_system.fonts)?;

    let typography_pathbuf: PathBuf = design_system_path.join(TYPOGRAPHY_PATH);
    save_to_yaml_file(typography_pathbuf, &design_system.typography)?;

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
        let shades_file: ShadesFile = ShadesFile::from(&color_palette.shades);
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

pub fn save_themes(design_system: &DesignSystem, design_system_path: &PathBuf) -> Result<()> {
    let themes_path: PathBuf = design_system_path.join(THEMES_PATH);
    if themes_path.is_dir() {
        fs::remove_dir_all(&themes_path)?;
    }
    fs::create_dir_all(&themes_path)?;

    for theme in &design_system.themes {
        let theme_pathbuf: PathBuf =
            compute_path_with_extension(&themes_path, &theme.theme_name, &"yaml");
        let theme_file: ThemeColorFile = ThemeColorFile::from(&theme);
        save_to_yaml_file(&theme_pathbuf, &theme_file)?;
    }

    let themes_order: Vec<String> = design_system
        .themes
        .clone()
        .into_iter()
        .map(|theme| return theme.theme_name)
        .collect::<Vec<String>>();
    let themes_metadata_file: ThemesMetadataFile = ThemesMetadataFile { themes_order };
    save_to_yaml_file(
        themes_path.join(THEMES_METADATA_PATH),
        &themes_metadata_file,
    )?;
    Ok(())
}

pub fn fetch_base_colors(design_system_path: &PathBuf) -> Result<Base> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let base_pathbuf: PathBuf = fetch_pathbuf.join(BASE_PATH);
    load_yaml_from_pathbuf::<Base>(&base_pathbuf)
}

pub fn init_base_colors(design_system_path: &PathBuf) -> Result<()> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let base_pathbuf: PathBuf = fetch_pathbuf.join(BASE_PATH);
    let base_file = Base::new();
    save_to_yaml_file(base_pathbuf, &base_file)
}

pub fn fetch_themes(design_system_path: &PathBuf) -> Result<Vec<ThemeColor>> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let themes_pathbuf: PathBuf = fetch_pathbuf.join(THEMES_PATH);

    let read_dir = fs::read_dir(&themes_pathbuf)?;

    let mut themes: Vec<ThemeColor> = read_dir
        .into_iter()
        .filter_map(|dir_entry| {
            let dir: fs::DirEntry = dir_entry.ok()?;
            let path: &PathBuf = &dir.path();
            if filename_equals(path, THEMES_METADATA_PATH) {
                return None;
            }
            let extension: &str = path
                .extension()
                .and_then(|ext: &std::ffi::OsStr| ext.to_str())?;
            if extension != "yaml" && extension != "yml" {
                return None;
            }

            let file_name: &str = path.file_stem().and_then(|name| name.to_str())?;
            let theme_file: ThemeColorFile = load_yaml_from_pathbuf::<ThemeColorFile>(path).ok()?;
            Some(ThemeColorFile::to(&theme_file, file_name))
        })
        .collect::<Vec<ThemeColor>>();

    let order: PathBuf = themes_pathbuf.join(THEMES_METADATA_PATH);

    if order.is_file() {
        let themes_metadata: ThemesMetadataFile =
            load_yaml_from_pathbuf::<ThemesMetadataFile>(&order)?;
        let order_map: HashMap<_, _> = themes_metadata
            .themes_order
            .iter()
            .enumerate()
            .map(|(i, name)| (name.clone(), i))
            .collect();
        themes.sort_by_key(|item| *order_map.get(&item.theme_name).unwrap_or(&usize::MAX));
    }

    Ok(themes)
}

pub fn init_themes(design_system_path: &PathBuf) -> Result<()> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);

    let themes_pathbuf: PathBuf = fetch_pathbuf.join(THEMES_PATH);
    fs::create_dir_all(&themes_pathbuf)?;
    let theme_neutral_path: PathBuf = themes_pathbuf.join(NEUTRAL_THEME_PATH);

    let theme_neutral: ThemeColor = ThemeColor::new();

    let theme_file = ThemeColorFile::from(&theme_neutral);
    save_to_yaml_file(theme_neutral_path, &theme_file)
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

pub fn fetch_typography(design_system_path: &PathBuf) -> Result<Typography> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let typo_pathbuf: PathBuf = fetch_pathbuf.join(TYPOGRAPHY_PATH);
    load_yaml_from_pathbuf::<Typography>(&typo_pathbuf)
}

pub fn init_typography(design_system_path: &PathBuf) -> Result<()> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let typo_pathbuf: PathBuf = fetch_pathbuf.join(TYPOGRAPHY_PATH);
    let typo_file = Typography::new();
    save_to_yaml_file(typo_pathbuf, &typo_file)
}
