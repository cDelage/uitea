use anyhow::{Context, Result};
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_yaml;
use std::fs::File;
use std::io::Read;
use std::path::Path;
use std::path::PathBuf;
use std::io::Write;

pub mod home_repository;
pub mod design_system_repository;
pub mod undo_repository;

const DESIGN_SYSTEM_METADATA_PATH: &str = "design_system_metadata.yaml";
const TMP_PATH : &str = "tmp";

struct FetchPath {
    original_pathbuf: PathBuf,
    //Used for tmp save (when fetch, if there is a tmp folder)
    fetch_pathbuf: PathBuf
}

fn filename_equals(path: &PathBuf, filename: &str) -> bool {
    // `file_name()` renvoie un `Option<&OsStr>`
    // On utilise `and_then` pour convertir en `Option<&str>`
    path.file_name()
        .and_then(|name| name.to_str())
        .map(|name_str| name_str == filename)
        .unwrap_or(false)
}

fn compute_fetch_pathbuf(original_pathbuf: &PathBuf) -> FetchPath {
    let tmp_path: PathBuf = original_pathbuf.clone().join(TMP_PATH);
    let fetch_pathbuf: PathBuf = if tmp_path.is_dir() {
        tmp_path
    } else{
        original_pathbuf.clone()
    };

    FetchPath {
        fetch_pathbuf,
        original_pathbuf: original_pathbuf.clone()
    }
}

pub fn compute_path(directory: &PathBuf, filename: &str) -> PathBuf {
    let mut file_path = directory.join(filename.replace(" ", "-"));

    if file_path.exists() {
        let mut i = 1;
        while Path::new(&format!("{} ({})", file_path.display(), i)).exists() {
            i += 1;
        }
        file_path = PathBuf::from(format!("{} ({})", file_path.display(), i));
    }

    file_path
}

pub fn compute_path_with_extension(directory: &PathBuf, filename: &str, extension: &str) -> PathBuf {
    let mut file_path = directory.join(filename.replace(" ", "-"));

    // Ajouter l'extension
    let file_path_with_extension = file_path.with_extension(extension);

    if file_path_with_extension.exists() {
        let mut i = 1;
        // Trouver un nom unique en ajoutant "(i)" avant l'extension
        while Path::new(&format!("{}-{}{}", file_path.display(), i, extension)).exists() {
            i += 1;
        }
        file_path = PathBuf::from(format!("{}-{}{}", file_path.display(), i, extension));
    } else {
        file_path = file_path_with_extension;
    }

    file_path
}

fn save_to_yaml_file<P, T>(path: P, data: &T) -> Result<()>
where
    P: AsRef<Path>,
    T: Serialize,
{
    let yaml_data = serde_yaml::to_string(data)
        .expect("Échec de la sérialisation en YAML");

    let mut file = File::create(path)?;
    file.write_all(yaml_data.as_bytes())?;
    Ok(())
}

/// Loads a YAML file from a given directory iterator and deserializes it into a generic type `T`.
///
/// # Arguments
///
/// * `read_dir_result` - A `Result<ReadDir, std::io::Error>` containing the directory iterator or an error.
/// * `filename` - The name of the YAML file to load.
///
/// # Returns
///
/// Returns an instance of type `T` if the file is found and deserialized successfully,
/// or an error if the file is not found or deserialization fails.
///
/// # Errors
///
/// This function will return an error in the following cases:
/// - If the directory cannot be read.
/// - If the file with the specified name is not found in the directory.
/// - If the file cannot be opened, read, or deserialized.
fn load_yaml_from_pathbuf<T>(pathbuf: &PathBuf) -> Result<T>
where
    T: DeserializeOwned,
{
    let mut file = File::open(&pathbuf)
        .context(format!("Failed to open file '{}'", pathbuf.display()))?;

    let mut contents = String::new();
    file.read_to_string(&mut contents).context(format!(
        "Failed to read file '{}'",
        pathbuf.display()
    ))?;

    let data: T = serde_yaml::from_str(&contents).context("Failed to deserialize YAML")?;

    Ok(data)
}