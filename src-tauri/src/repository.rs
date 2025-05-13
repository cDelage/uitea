use anyhow::anyhow;
use anyhow::{Context, Result};
use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_yaml;
use std::fs;
use std::fs::File;
use std::io::Read;
use std::io::Write;
use std::path::Path;
use std::path::PathBuf;
use std::process::Command;

use crate::domain::image_domain::ImageLocal;

pub mod design_system_repository;
pub mod home_repository;
pub mod palette_builder_repository;
pub mod undo_repository;
pub mod color_picker_repository;

const DESIGN_SYSTEM_METADATA_PATH: &str = "design_system_metadata.yaml";
const TMP_PATH: &str = "tmp";

pub struct FetchPath {
    pub original_pathbuf: PathBuf,
    //Used for tmp save (when fetch, if there is a tmp folder)
    pub fetch_pathbuf: PathBuf,
}

fn filename_equals(path: &PathBuf, filename: &str) -> bool {
    // `file_name()` renvoie un `Option<&OsStr>`
    // On utilise `and_then` pour convertir en `Option<&str>`
    path.file_name()
        .and_then(|name| name.to_str())
        .map(|name_str| name_str == filename)
        .unwrap_or(false)
}

pub fn compute_fetch_pathbuf(original_pathbuf: &PathBuf) -> FetchPath {
    let tmp_path: PathBuf = original_pathbuf.clone().join(TMP_PATH);
    let metadata_path: PathBuf = tmp_path.join(DESIGN_SYSTEM_METADATA_PATH);
    let fetch_pathbuf: PathBuf = if tmp_path.is_dir() && metadata_path.is_file() {
        tmp_path
    } else {
        original_pathbuf.clone()
    };

    FetchPath {
        fetch_pathbuf,
        original_pathbuf: original_pathbuf.clone(),
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

pub fn compute_path_with_extension(
    directory: &PathBuf,
    filename: &str,
    extension: &str,
) -> PathBuf {
    let mut file_path = directory.join(filename.replace(" ", "-"));

    // Ajouter l'extension
    let file_path_with_extension = file_path.with_extension(extension);

    if file_path_with_extension.exists() {
        let mut i = 1;
        // Trouver un nom unique en ajoutant "(i)" avant l'extension
        while Path::new(&format!("{}-{}.{}", file_path.display(), i, extension)).exists() {
            i += 1;
        }
        file_path = PathBuf::from(format!("{}-{}.{}", file_path.display(), i, extension));
    } else {
        file_path = file_path_with_extension;
    }

    file_path
}

pub fn compute_path_with_extension_overwrite(
    directory: &PathBuf,
    filename: &str,
    extension: &str,
) -> PathBuf {
    let file_path: PathBuf = directory.join(filename.replace(" ", "-"));
    file_path.with_extension(extension)
}

fn save_to_yaml_file<P, T>(path: P, data: &T) -> Result<()>
where
    P: AsRef<Path>,
    T: Serialize,
{
    let yaml_data = serde_yaml::to_string(data).expect("Échec de la sérialisation en YAML");

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
    let mut file =
        File::open(&pathbuf).context(format!("Failed to open file '{}'", pathbuf.display()))?;

    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .context(format!("Failed to read file '{}'", pathbuf.display()))?;

    let data: T = serde_yaml::from_str(&contents).context("Failed to deserialize YAML")?;

    Ok(data)
}

fn fetch_image_folder(path: &str) -> Result<Vec<String>> {
    let mut images = Vec::new();
    let entries = std::fs::read_dir(path)?;
    for entry in entries {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() {
            if let Some(ext) = path.extension() {
                if let Some(ext_str) = ext.to_str() {
                    let ext_lower = ext_str.to_lowercase();
                    if ["png", "jpg", "jpeg", "gif"].contains(&ext_lower.as_str()) {
                        let canonical_path: String =
                            std::fs::canonicalize(&path)?.to_string_lossy().to_string();
                        let normalized_path: &str = if canonical_path.starts_with(r"\\?\") {
                            &canonical_path[4..]
                        } else {
                            &canonical_path
                        };
                        images.push(normalized_path.to_string());
                    }
                }
            }
        }
    }
    Ok(images)
}

pub fn encode_image_base64(path: String) -> Result<ImageLocal> {
    let pathbuf = Path::new(&path);
    match fs::read(pathbuf) {
        Ok(bytes) => Ok(ImageLocal {
            path: path,
            binary: format!("data:image/png;base64,{}", STANDARD.encode(&bytes)),
        }),
        Err(err) => Err(anyhow!("Erreur lors du chargement de l'image : {}", err)),
    }
}

pub fn copy_file(original_file: &PathBuf, destination_folder: &PathBuf) -> Result<String> {
    // Vérifie si le fichier d'origine existe
    if !original_file.exists() {
        return Err(anyhow!("original file not found"));
    }

    // Vérifie si le dossier de destination existe, sinon le créer
    if !destination_folder.exists() {
        fs::create_dir_all(&destination_folder)?;
    }

    // Récupère le nom du fichier d'origine
    let file_name = original_file
        .file_name()
        .ok_or_else(|| anyhow!("Fail to read original filename"))?;

    // Construit le chemin complet du fichier de destination
    let destination_path: PathBuf = destination_folder.join(file_name);

    // Copie le fichier vers le dossier de destination
    fs::copy(&original_file, &destination_path)?;

    let string_path = destination_path.to_str().ok_or_else(|| anyhow!("fail"))?;
    Ok(String::from(string_path))
}

pub fn assert_file_in_directory(filepath: &String, folder: &PathBuf) -> Result<String> {
    let file_path = PathBuf::from(filepath);

    let metadata = fs::metadata(&file_path)
        .map_err(|e| anyhow::anyhow!("Impossible de lire le fichier '{}': {}", filepath, e))?;
    if !metadata.is_file() {
        return Err(anyhow!("'{}' is not a file.", filepath));
    }

    let abs_folder = folder
        .canonicalize()
        .map_err(|e| anyhow::anyhow!("Impossible to read dir '{:?}': {}", folder, e))?;
    let abs_file_path = file_path
        .canonicalize()
        .map_err(|e| anyhow::anyhow!("Impossible to canonicalize file '{}': {}", filepath, e))?;

    if !abs_file_path.starts_with(&abs_folder) {
        return Err(anyhow!(
            "Le fichier '{}' ne se trouve pas dans le dossier '{:?}'.",
            filepath,
            abs_folder
        ));
    }

    Ok(filepath.to_string())
}

pub fn open_folder<P: AsRef<Path>>(path: P) -> std::io::Result<()> {
    #[cfg(target_os = "windows")]
    { Command::new("explorer").arg(path.as_ref()).spawn()?; }

    #[cfg(target_os = "macos")]
    { Command::new("open").arg(path.as_ref()).spawn()?; }

    // Sur la plupart des desktops Linux / *BSD
    #[cfg(all(unix, not(target_os = "macos")))]
    { Command::new("xdg-open").arg(path.as_ref()).spawn()?; }

    Ok(())
}
