use anyhow::Result;

use crate::repository::undo_repository;


pub fn remove_undo_repository() -> Result<()> {
    undo_repository::remove_undo_repository()
}
