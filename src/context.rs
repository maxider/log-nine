#![allow(dead_code)]

use axum::Extension;
use sqlx::{Pool, Postgres};
use crate::repositories::board_repository::BoardRepository;
use crate::repositories::user_repository::UserRepository;

pub type Context = Extension<AppContext>;

#[derive(Clone)]
pub struct AppContext {
    pub pool: Pool<Postgres>,
    pub user_repository: UserRepository,
    pub board_repository: BoardRepository,
}