use std::path::PathBuf;

use serde::{Deserialize, Serialize, Serializer};

pub mod color_picker_domain;
pub mod design_system_domain;
pub mod fonts_domain;
pub mod home_domain;
pub mod image_domain;
pub mod palette_builder_domain;

pub fn serialize_pathbuf_as_string<S>(path: &PathBuf, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    let path_string = path.to_string_lossy();
    serializer.serialize_str(&path_string)
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FileInfos {
    pub filename: String,
    pub filename_with_extension: String,
    pub extension: String,
    pub filepath: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FileMetadata {
    pub filename: String,
    pub update_date: String,
}
