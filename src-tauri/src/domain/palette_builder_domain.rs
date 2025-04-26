use crate::domain::serialize_pathbuf_as_string;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PaletteBuild {
    pub id: String,
    pub name: String,
    pub tints: Vec<TintBuild>,
    pub settings: PaletteSettings,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TintBuild {
    pub name: String,
    pub is_anchor: Option<bool>,
    pub is_center: Option<bool>,
    pub color: String,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PaletteSettings {
    pub lightness_max: f64,
    pub lightness_min: f64,
    pub sat_chroma_gap_left: f64,
    pub sat_chroma_gap_right: f64,
    pub hue_gap_left: f64,
    pub hue_gap_right: f64,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PalettesStoreSettings {
    pub steps: i32,
    pub tint_naming_mode: String,
    pub interpolation_color_space: String,
    pub palette_settings: PaletteSettings,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PaletteBuilderFile {
    pub palettes: Vec<PaletteBuild>,
    pub settings: PalettesStoreSettings,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PaletteBuilder {
    pub metadata: PaletteBuilderMetadata,
    pub palettes: Vec<PaletteBuild>,
    pub settings: PalettesStoreSettings,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PaletteBuilderUndoRedo {
    pub palettes: Vec<PaletteBuild>,
    pub settings: PalettesStoreSettings,
}

impl PaletteBuilderFile {
    pub fn from(palette_builder: &PaletteBuilder) -> PaletteBuilderFile {
        let PaletteBuilder {
            palettes, settings, ..
        } = palette_builder;
        PaletteBuilderFile {
            palettes: palettes.clone(),
            settings: settings.clone(),
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PaletteBuilderMetadata {
    pub palette_builder_name: String,
    #[serde(serialize_with = "serialize_pathbuf_as_string")]
    pub path: PathBuf,
    pub main_colors: Vec<String>
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PaletteBuilderRenamePayload {
    pub metadata: PaletteBuilderMetadata,
    pub new_name: String,
    pub design_system_path: PathBuf
}