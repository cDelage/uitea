use anyhow::{anyhow, Result};
use base64::engine::general_purpose;
use regex::Regex;
use reqwest::blocking::Client;
use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};
use base64::Engine;

use crate::domain::design_system_domain::DesignSystem;
use crate::domain::fonts_domain::{FONTS_EXTENSIONS, GOOGLE_FONTS};
use crate::domain::FileInfos;

use super::design_system_repository::EXPORTS_PATH;
use super::{copy_file, list_file_info_in_dir};

pub const FONTS_PATH: &str = "fonts";

pub fn manage_font_export(design_system: &DesignSystem) -> Result<()> {
    let export_pathbuf: PathBuf = design_system.metadata.design_system_path.join(EXPORTS_PATH);
    if !&export_pathbuf.is_dir() {
        fs::create_dir(&export_pathbuf)?;
    };
    let fonts_pathbuf: PathBuf = export_pathbuf.join(FONTS_PATH);
    if !&fonts_pathbuf.is_dir() {
        fs::create_dir(&fonts_pathbuf)?;
    };

    let font_files: Vec<FileInfos> = list_file_info_in_dir(&fonts_pathbuf, Some(FONTS_EXTENSIONS))?;
    let font_filenames: Vec<String> = font_files
        .clone()
        .into_iter()
        .map(|file| file.filename)
        .collect::<Vec<String>>();

    let mut design_system_fonts: Vec<String> = design_system
        .fonts
        .additionals
        .clone()
        .into_iter()
        .map(|font| font.value)
        .collect::<Vec<String>>();
    design_system_fonts.push(design_system.fonts.default.clone());
    design_system_fonts.iter().for_each(|font| {
        if !font_filenames.contains(font) {
            if GOOGLE_FONTS.contains(&font.as_str()) {
                download_google_font(&font, &fonts_pathbuf)
            }
        }
    });
    for font_file in font_files {
        if !design_system_fonts.contains(&font_file.filename) {
            fs::remove_file(font_file.filepath)?;
        }
    }

    Ok(())
}

pub fn download_google_font(font_name: &str, dest_path: &PathBuf) {
    let client = Client::new();
    let font_css_url = format!(
        "https://fonts.googleapis.com/css2?family={}&display=swap",
        font_name.replace(' ', "+")
    );

    let css_response = client.get(&font_css_url).send();
    if let Ok(response) = css_response {
        if let Ok(css) = response.text() {
            let re = Regex::new(r#"url\((https://fonts\.gstatic\.com/[^)]+\.(woff2|woff|ttf))\)"#)
                .unwrap();
            if let Some(capture) = re.captures(&css) {
                let font_url = &capture[1];
                if let Ok(font_data) = client.get(font_url).send().and_then(|r| r.bytes()) {
                    let extension = Path::new(font_url)
                        .extension()
                        .and_then(|ext| ext.to_str())
                        .unwrap_or("font");

                    let filename = format!("{}.{}", font_name, extension);
                    let font_path = dest_path.join(filename);

                    if let Ok(mut file) = File::create(&font_path) {
                        let _ = file.write_all(&font_data);
                    }
                }
            } else {
                println!("No font URL match found in CSS.");
            }
        }
    }
}

pub fn load_design_system_fonts(design_system_path: &PathBuf) -> Result<Vec<FileInfos>> {
    list_file_info_in_dir(
        &design_system_path.join(EXPORTS_PATH).join(FONTS_PATH),
        Some(FONTS_EXTENSIONS),
    )
}

pub fn load_font_as_base64(path: PathBuf) -> Result<String> {
    match fs::read(path) {
        Ok(data) => {
            let b64 = general_purpose::STANDARD.encode(data);
            Ok(b64)
        },
        Err(e) => Err(anyhow!(format!("Failed to read font: {}", e))),
    }
}


pub fn upload_typography(original_path: PathBuf, design_system_path: PathBuf) -> Result<String> {
    copy_file(&original_path, &design_system_path.join(EXPORTS_PATH).join(FONTS_PATH))
}