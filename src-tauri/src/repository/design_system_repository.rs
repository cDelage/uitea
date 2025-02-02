use std::{collections::HashMap, fs, path::PathBuf};

use anyhow::{anyhow, Result};

use crate::{
    domain::design_system_domain::{
        ColorPalette, DesignSystem, DesignSystemMetadata, DesignSystemMetadataFile, Shade,
        ShadesFile,
    },
    repository::{
        compute_fetch_pathbuf, compute_path_with_extension, filename_equals, FetchPath, TMP_PATH,
    },
};

use super::{load_yaml_from_pathbuf, save_to_yaml_file, DESIGN_SYSTEM_METADATA_PATH};

const PALETTES_PATH: &str = "palettes";
const PRIMARY_COLOR_PATH: &str = "primary.yaml";
const PALETTE_ORDER_PATH: &str = "palette-order.yaml";

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

    println!(
        "Fetch design_system_metadata start: {:?}",
        design_system_metadata_pathbuf
    );

    if !design_system_metadata_pathbuf.is_file() {
        println!(
            "Design system not found : {:?} (to remove)",
            design_system_metadata_pathbuf
        );
    }
    let file: DesignSystemMetadataFile =
        load_yaml_from_pathbuf::<DesignSystemMetadataFile>(&design_system_metadata_pathbuf)?;
    println!("Succeed to read file : {:?}", file);
    Ok(DesignSystemMetadata::from(
        &file,
        &original_pathbuf,
        design_system_path.join(TMP_PATH).is_dir(),
    ))
}

pub fn fetch_color_palettes(design_system_path: &PathBuf) -> Result<Vec<ColorPalette>> {
    let FetchPath { fetch_pathbuf, .. } = compute_fetch_pathbuf(&design_system_path);
    let palettes_path: PathBuf = fetch_pathbuf.join(PALETTES_PATH);
    if !&palettes_path.is_dir() {
        println!("Fail to fetch color palettes");
        return Err(anyhow!("Fail to fetch color palettes"));
    }

    let read_dir = fs::read_dir(&palettes_path)?;

    let mut color_palettes: Vec<ColorPalette> = read_dir
        .into_iter()
        .filter_map(|dir_entry| {
            let dir: fs::DirEntry = dir_entry.ok()?;
            let path: &PathBuf = &dir.path();
            if filename_equals(path, PALETTE_ORDER_PATH) {
                return None;
            }
            println!("Try to read color palettes {:?}", path);
            let extension: &str = path
                .extension()
                .and_then(|ext: &std::ffi::OsStr| ext.to_str())?;
            if extension != "yaml" && extension != "yml" {
                return None;
            }

            let file_name: &str = path.file_stem().and_then(|name| name.to_str())?;
            let shades_file: ShadesFile = load_yaml_from_pathbuf::<ShadesFile>(path).ok()?;
            Some(ColorPalette {
                palette_name: String::from(file_name),
                palette_path: Some(path.into()),
                shades: ShadesFile::to(&shades_file),
            })
        })
        .collect::<Vec<ColorPalette>>();

    let order: PathBuf = palettes_path.join(PALETTE_ORDER_PATH);

    if order.is_file() {
        let palette_order: Vec<String> = load_yaml_from_pathbuf::<Vec<String>>(&order)?;
        let order_map: HashMap<_, _> = palette_order
            .iter()
            .enumerate()
            .map(|(i, name)| (name.clone(), i))
            .collect();
        println!("{:?}", order_map);
        color_palettes
            .sort_by_key(|item| *order_map.get(&item.palette_name).unwrap_or(&usize::MAX));
    }

    Ok(color_palettes)
}

pub fn init_color_palette(design_system_path: &PathBuf) -> Result<()> {
    let palettes_path: PathBuf = design_system_path.join(PALETTES_PATH);
    fs::create_dir_all(&palettes_path)?;
    let primary_palette_path: PathBuf = palettes_path.join(PRIMARY_COLOR_PATH);

    let blue_palette: Vec<Shade> = vec![
        Shade {
            label: "50".to_string(),
            color: "#EFF6FF".to_string(),
        },
        Shade {
            label: "100".to_string(),
            color: "#DBEAFE".to_string(),
        },
        Shade {
            label: "200".to_string(),
            color: "#BFDBFE".to_string(),
        },
        Shade {
            label: "300".to_string(),
            color: "#93C5FD".to_string(),
        },
        Shade {
            label: "400".to_string(),
            color: "#60A5FA".to_string(),
        },
        Shade {
            label: "500".to_string(),
            color: "#3B82F6".to_string(),
        },
        Shade {
            label: "600".to_string(),
            color: "#2563EB".to_string(),
        },
        Shade {
            label: "700".to_string(),
            color: "#1D4ED8".to_string(),
        },
        Shade {
            label: "800".to_string(),
            color: "#1E40AF".to_string(),
        },
        Shade {
            label: "900".to_string(),
            color: "#1E3A8A".to_string(),
        },
        Shade {
            label: "950".to_string(),
            color: "#172554".to_string(),
        },
    ];

    let shade_file = ShadesFile::from(&blue_palette);
    save_to_yaml_file(primary_palette_path, &shade_file)
}

pub fn save_design_system(design_system: DesignSystem, is_tmp: bool) -> Result<()> {
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

    //Save colors
    let palettes_path: PathBuf = design_system_path.join(PALETTES_PATH);
    if palettes_path.is_dir() {
        fs::remove_dir_all(&palettes_path)?;
    }
    fs::create_dir_all(&palettes_path)?;

    //Palettes
    for color_palette in &design_system.color_palettes {
        let color_palette_pathbuf: PathBuf =
            compute_path_with_extension(&palettes_path, &color_palette.palette_name, &"yaml");
        println!("save color palette {:?}", &color_palette.palette_name);
        let shades_file: ShadesFile = ShadesFile::from(&color_palette.shades);
        save_to_yaml_file(color_palette_pathbuf, &shades_file)?;
    }

    let palette_order: Vec<String> = design_system
        .color_palettes
        .into_iter()
        .map(|palette| return palette.palette_name)
        .collect::<Vec<String>>();
    save_to_yaml_file(palettes_path.join(PALETTE_ORDER_PATH), &palette_order)?;

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
