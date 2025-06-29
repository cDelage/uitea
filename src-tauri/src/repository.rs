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

use crate::domain::fonts_domain::FONTS_EXTENSIONS;
use crate::domain::image_domain::ImageLocal;
use crate::domain::{FileInfos, FileMetadata};
use chrono::{DateTime, Local};
use base64::engine::general_purpose::STANDARD as B64;
use resvg::{
    tiny_skia::{Pixmap, Transform},
    usvg::{Options, Tree},
};

pub mod color_picker_repository;
pub mod design_system_repository;
pub mod fonts_repository;
pub mod home_repository;
pub mod palette_builder_repository;
pub mod undo_repository;

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

fn fetch_image_folder(path: &PathBuf) -> Result<Vec<String>> {
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

pub fn open_folder<P: AsRef<Path>>(path: P) -> Result<()> {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer").arg(path.as_ref()).spawn()?;
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open").arg(path.as_ref()).spawn()?;
    }

    // Sur la plupart des desktops Linux / *BSD
    #[cfg(all(unix, not(target_os = "macos")))]
    {
        Command::new("xdg-open").arg(path.as_ref()).spawn()?;
    }

    Ok(())
}

/// Convertit un SVG (chaîne UTF‑8) en un PNG encodé en Base64 (data‑URI)
///
/// * `svg` : code source SVG complet
/// * `dpi` : résolution cible pour le rendu (96 dpi par défaut)
///
/// Retourne une chaîne « data:image/png;base64,… » prête à être insérée dans du HTML/CSS.
pub fn svg_to_png_b64(svg: &str, dpi: f32, fonts_repository: Option<PathBuf>) -> Result<String> {
    /*─── 1. Préparation des options + bases de polices ────────────────*/
    let mut opt = Options::default();
    opt.dpi = dpi;

    // Chargement des polices système par défaut
    opt.fontdb_mut().load_system_fonts();
    opt.font_family = String::from("Arial");

    // Si un dépôt de polices personnalisées est fourni et existe, on charge ces polices
    if let Some(ref repo_path) = fonts_repository {
        println!("try to read repo fonts {:?}", repo_path);
        if repo_path.is_dir() {
            // On récupère les informations de fichiers dans le répertoire, en filtrant par extensions autorisées
            let font_files = list_file_info_in_dir(repo_path, Some(FONTS_EXTENSIONS))
                .with_context(|| {
                    format!(
                        "Échec lors de la lecture du répertoire de polices personnalisées : {:?}",
                        repo_path
                    )
                })?;

            // Pour chaque fichier de police trouvé, on tente de le charger
            for file_info in font_files {
                println!("try to load font {:?}", &file_info.filepath);
                let font_path = Path::new(&file_info.filepath);
                opt.fontdb_mut().load_font_file(font_path)?;
                println!("success");
            }
        }
    }

    /*─── 2. Parsing du SVG ───────────────────────────────────────────*/
    let tree = Tree::from_str(svg, &opt).context("SVG invalide")?;

    let size = tree.size().to_int_size(); // u32 × u32
    let mut pixmap =
        Pixmap::new(size.width(), size.height()).context("Échec d’allocation du buffer")?;

    /*─── 3. Rendu ───────────────────────────────────────────────────*/
    // L’API `render` n’a plus d’argument FitTo, on passe simplement
    // l’identité en transformée racine.
    resvg::render(&tree, Transform::identity(), &mut pixmap.as_mut());

    /*─── 4. PNG → Base64 ────────────────────────────────────────────*/
    let png = pixmap.encode_png().context("Échec d’encodage PNG")?;
    Ok(format!("data:image/png;base64,{}", B64.encode(png)))
}

pub fn list_file_info_in_dir(
    dir: &PathBuf,
    allowed_extensions: Option<&[&str]>,
) -> Result<Vec<FileInfos>> {
    let mut results = Vec::new();

    if dir.is_dir() {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();

            if path.is_file() {
                if let (Some(stem), Some(ext)) = (
                    path.file_stem().and_then(|s| s.to_str()),
                    path.extension().and_then(|e| e.to_str()),
                ) {
                    let ext_lower = ext.to_ascii_lowercase();
                    let is_allowed = match allowed_extensions {
                        Some(allowed) => {
                            allowed.iter().any(|allowed_ext| allowed_ext == &ext_lower)
                        }
                        None => true,
                    };

                    if is_allowed {
                        let filename_with_ext = path
                            .file_name()
                            .and_then(|f| f.to_str())
                            .unwrap_or_default()
                            .to_string();

                        results.push(FileInfos {
                            filename: stem.to_string(),
                            filename_with_extension: filename_with_ext,
                            extension: ext_lower,
                            filepath: path.to_string_lossy().to_string(),
                        });
                    }
                }
            }
        }
    }

    Ok(results)
}

/// Tente de lire les métadonnées du fichier à `path`.  
/// - Si le fichier existe, renvoie `Some(FileMetadata)` contenant  
///   - `filename` : le nom du fichier  
///   - `update_date` : date de dernière modification (RFC 3339)  
/// - Sinon, renvoie `None`.
pub fn get_file_metadata<P: AsRef<Path>>(path: P) -> Option<FileMetadata> {
    let path = path.as_ref();

    // 1) Récupère les métadonnées du fichier ou None si erreur (fichier introuvable, etc.)
    let meta = fs::metadata(path).ok()?;

    // 2) Date de dernière modification (SystemTime) ou None si impossible
    let modified = meta.modified().ok()?;

    // 3) Conversion en chrono::DateTime<Local> et format RFC3339
    let datetime: DateTime<Local> = modified.into();
    let update_date = datetime.to_rfc3339();

    // 4) Extraction du nom de fichier
    let filename = path.file_name()?
                        .to_string_lossy()
                        .into_owned();

    Some(FileMetadata { filename, update_date })
}

pub fn get_file_date<P: AsRef<Path>>(path: P) -> Result<String> {
    let path = path.as_ref();

    // 1) Récupère les métadonnées du fichier ou None si erreur (fichier introuvable, etc.)
    let meta = fs::metadata(path)?;

    // 2) Date de dernière modification (SystemTime) ou None si impossible
    let modified = meta.modified()?;

    // 3) Conversion en chrono::DateTime<Local> et format RFC3339
    let datetime: DateTime<Local> = modified.into();
    Ok(datetime.to_rfc3339())
}