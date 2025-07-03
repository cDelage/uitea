use serde::{Deserialize, Serialize};

/// Un échantillonnage nommé de couleurs (codes Hexa)
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ColorSample {
    pub name: String,
    pub colors: Vec<String>,
}

/// Conteneur utilisé par PickleDB.
/// Permet de stocker la liste et de savoir quelle entrée est courante.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ColorPickerStore {
    pub colors: Vec<String>,
    pub samples: Vec<ColorSample>,
}

impl Default for ColorPickerStore {
    fn default() -> Self {
        ColorPickerStore {
            colors: vec![String::from("#bfdbfe"), String::from("#1e3a8a")],
            samples: vec![ColorSample {
                name: String::from("sample-1"),
                colors: vec![],
            }],
        }
    }
}
