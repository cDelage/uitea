use std::path::PathBuf;

use serde::Serializer;

pub mod design_system_domain;
pub mod home_domain;
pub mod image_domain;
pub mod palette_builder_domain;
pub mod color_picker_domain;

pub fn serialize_pathbuf_as_string<S>(path: &PathBuf, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    let path_string = path.to_string_lossy();
    serializer.serialize_str(&path_string)
}