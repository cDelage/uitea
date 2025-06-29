use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]

pub struct ImageLocal {
    pub path: String,
    pub binary: String,
}
